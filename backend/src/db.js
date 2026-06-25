import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseDir = join(__dirname, '..', '..', 'database');
const dbFilePath = join(databaseDir, 'resume_template.db');

// 确保目录存在
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

// 初始化 sql.js
const SQL = await initSqlJs();

// 尝试读取已有数据库文件
let db;
if (fs.existsSync(dbFilePath)) {
  try {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
    console.log('[db] 从磁盘加载已有数据库');
  } catch (e) {
    console.warn('[db] 加载已有数据库失败，将创建新数据库:', e.message);
    db = new SQL.Database();
  }
} else {
  db = new SQL.Database();
  console.log('[db] 创建新数据库');
}

// 每次写操作后自动保存到磁盘
function saveDb() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  } catch (e) {
    console.error('[db] 保存数据库失败:', e.message);
  }
}

// ---------- 建表（sql.js 使用 exec 执行多条语句） ----------
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_pro INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    thumbnail TEXT,
    style_data TEXT,
    is_pro INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    template_id INTEGER,
    title TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    template_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, template_id)
  );
`);

// ---------- 种子数据（120+模板） ----------
const result = db.exec('SELECT COUNT(*) as c FROM templates');
const count = result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : 0;
if (count === 0) {
  console.log('[db] 插入模板种子数据（120+个）...');
  
  // 定义生成器函数参数
  const layouts = [
    { id: 'right', hasPhoto: true, position: 'right' },
    { id: 'center', hasPhoto: true, position: 'center' },
    { id: 'left', hasPhoto: true, position: 'left' },
    { id: 'sidebar', hasPhoto: true, position: 'left' },
    { id: 'two_column', hasPhoto: true, position: 'right' },
    { id: 'simple', hasPhoto: false, position: null },
  ]
  
  const styles = [
    { id: 'simple', category: 'simple' },
    { id: 'pro', category: 'professional' },
    { id: 'creative', category: 'creative' },
    { id: 'tech', category: 'tech' },
    { id: 'management', category: 'management' },
    { id: 'academic', category: 'academic' },
    { id: 'minimalist', category: 'minimalist' },
    { id: 'fresh', category: 'fresh' },
  ]
  
  const industries = ['internet', 'finance', 'education', 'design', 'marketing', 'consulting', 'manufacturing', 'healthcare', 'legal', 'realestate']
  const purposes = ['entry', 'junior', 'mid', 'senior', 'freelancer', 'designer', 'developer', 'teacher', 'sales', 'operations', 'finance_legal']
  
  const chineseNames = ['张伟', '李娜', '王强', '刘芳', '陈明', '杨洋', '赵雪', '黄磊', '周杰', '吴敏',
    '徐丽', '孙刚', '马超', '朱琳', '胡涛', '郭芳', '林峰', '何静', '高建', '罗辉']
  const chineseTitles = ['高级软件工程师', '产品经理', 'UI设计师', '前端开发工程师', '后端开发工程师',
    '数据分析师', '运营专员', '市场经理', '项目经理', '财务主管', '人力资源经理', '销售总监',
    '品牌经理', '内容运营', '新媒体运营', '商务拓展经理', '质量管理工程师', '测试工程师',
    'DevOps工程师', '架构师', '算法工程师', '机器学习工程师', '游戏策划', '编剧', '文案策划']
  
  const englishNames = ['Wei Zhang', 'Na Li', 'Qiang Wang', 'Fang Liu', 'Ming Chen', 'Yang Yang', 'Xue Zhao', 'Lei Huang', 'Jie Zhou', 'Min Wu',
    'Li Wang', 'Hao Chen', 'Yan Liu', 'Xin Li', 'Bo Zhang']
  const englishTitles = ['Senior Software Engineer', 'Product Manager', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer',
    'Data Analyst', 'Operations Specialist', 'Marketing Manager', 'Project Manager', 'Finance Director', 'HR Manager',
    'Sales Director', 'Brand Manager', 'Content Creator', 'New Media Manager']
  
  const templates = []
  let templateId = 1
  
  // 生成中文模板（80个）
  // 按用途分类
  for (const purpose of purposes) {
    const count = purpose === 'senior' ? 6 : purpose === 'junior' ? 5 : 4
    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length]
      const layout = layouts[i % layouts.length]
      const industry = industries[Math.floor(i / 3) % industries.length]
      const nameIdx = (templateId - 1) % chineseNames.length
      const titleIdx = (templateId - 1) % chineseTitles.length
      const isPro = templateId % 5 === 0 ? 1 : 0
      const isFeatured = templateId <= 15 ? 1 : 0
      
      templates.push([
        `${style.id}_${layout.id}_${purpose}_${templateId}`,
        `${chineseNames[nameIdx]}`,
        style.category,
        'chinese',
        null,
        JSON.stringify({ variantId: `${style.id}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry, experience: purpose }),
        isPro,
        isFeatured
      ])
      templateId++
    }
  }
  
  // 生成更多中文变体（补足到80个）
  for (let i = 0; i < 36; i++) {
    const style = styles[i % styles.length]
    const layout = layouts[(i + 1) % layouts.length]
    const industry = industries[(i + 2) % industries.length]
    const nameIdx = i % chineseNames.length
    const titleIdx = i % chineseTitles.length
    const isPro = i % 4 === 0 ? 1 : 0
    const isFeatured = 0
    
    templates.push([
      `${style.id}_${layout.id}_v2_${i + 1}`,
      `${chineseNames[nameIdx]} - ${chineseTitles[titleIdx]}`,
      style.category,
      'chinese',
      null,
      JSON.stringify({ variantId: `${style.id}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry, experience: ['entry', 'junior', 'mid'][i % 3] }),
      isPro,
      isFeatured
    ])
    templateId++
  }
  
  // 生成英文模板（40个）
  for (let i = 0; i < 40; i++) {
    const style = styles[i % styles.length]
    const layout = layouts[i % layouts.length]
    const industry = industries[i % industries.length]
    const nameIdx = i % englishNames.length
    const titleIdx = i % englishTitles.length
    const isPro = i % 5 === 0 ? 1 : 0
    const isFeatured = i < 8 ? 1 : 0
    
    templates.push([
      `${style.id}_${layout.id}_en_${i + 1}`,
      `${englishNames[nameIdx]} - ${englishTitles[titleIdx]}`,
      style.category,
      'english',
      null,
      JSON.stringify({ variantId: `${style.id}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry, experience: ['entry', 'junior', 'mid', 'senior'][i % 4] }),
      isPro,
      isFeatured
    ])
  }

  const stmt = db.prepare(
    'INSERT INTO templates (name, name_en, category, language, thumbnail, style_data, is_pro, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (const row of templates) {
    stmt.run(row);
  }
  stmt.free();
  saveDb();
  console.log(`[db] 种子数据插入完成，共 ${templates.length} 条`);
}

// ---------- sql.js 包装器（模拟 better-sqlite3 的同步 API） ----------
function betterSqlCompat(db) {
  const api = {};

  api.prepare = (sql) => {
    const stmt = db.prepare(sql);
    return {
      run(...params) {
        stmt.bind(params);
        stmt.step();
        stmt.free();
        // sql.js 的 run() 返回 { changes, lastInsertRowid }
        const info = db.getRowsModified();
        const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
        const lastId = lastIdResult.length > 0 && lastIdResult[0].values.length > 0
          ? lastIdResult[0].values[0][0]
          : 0;
        return { changes: info, lastInsertRowid: lastId };
      },
      get(...params) {
        stmt.bind(params);
        if (stmt.step()) {
          const columns = stmt.getColumnNames();
          const values = stmt.get();
          stmt.free();
          const row = {};
          columns.forEach((col, i) => { row[col] = values[i]; });
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        stmt.bind(params);
        while (stmt.step()) {
          const columns = stmt.getColumnNames();
          const values = stmt.get();
          const row = {};
          columns.forEach((col, i) => { row[col] = values[i]; });
          results.push(row);
        }
        stmt.free();
        return results;
      },
    };
  };

  api.exec = (sql) => db.exec(sql);

  api.close = () => {
    saveDb();
    db.close();
  };

  return api;
}

const dbCompat = betterSqlCompat(db);

// 立即保存一次
saveDb();
console.log(`[db] 数据库初始化完成，路径: ${dbFilePath}`);

export default dbCompat;
export { saveDb };
