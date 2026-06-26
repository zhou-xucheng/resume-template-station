// Vercel Serverless 环境下的内存数据库
// 注意：Serverless 冷启动时数据会重置，这是过渡方案的限制

// ---------- 全局数据存储（模块级单例） ----------
const store = {
  users: [],
  templates: [],
  resumes: [],
  favorites: [],
  nextUserId: 1,
  nextResumeId: 1,
  nextFavoriteId: 1,
};

// ---------- 初始化种子数据 ----------
function seedTemplates() {
  if (store.templates.length > 0) return;

  const layouts = [
    { id: 'right', hasPhoto: true, position: 'right' },
    { id: 'center', hasPhoto: true, position: 'center' },
    { id: 'left', hasPhoto: true, position: 'left' },
    { id: 'sidebar', hasPhoto: true, position: 'left' },
    { id: 'two_column', hasPhoto: true, position: 'right' },
    { id: 'simple', hasPhoto: false, position: null },
  ];

  const styleCats = ['simple', 'professional', 'creative', 'tech', 'management', 'academic', 'minimalist', 'fresh'];
  const industries = ['internet', 'finance', 'education', 'design', 'marketing', 'consulting', 'manufacturing', 'healthcare', 'legal', 'realestate'];
  const purposes = ['entry', 'junior', 'mid', 'senior', 'freelancer', 'designer', 'developer', 'teacher', 'sales', 'operations', 'finance_legal'];

  const chineseNames = ['张伟', '李娜', '王强', '刘芳', '陈明', '杨洋', '赵雪', '黄磊', '周杰', '吴敏',
    '徐丽', '孙刚', '马超', '朱琳', '胡涛', '郭芳', '林峰', '何静', '高建', '罗辉'];
  const chineseTitles = ['高级软件工程师', '产品经理', 'UI设计师', '前端开发工程师', '后端开发工程师',
    '数据分析师', '运营专员', '市场经理', '项目经理', '财务主管', '人力资源经理', '销售总监',
    '品牌经理', '内容运营', '新媒体运营', '商务拓展经理', '质量管理工程师', '测试工程师',
    'DevOps工程师', '架构师', '算法工程师', '机器学习工程师', '游戏策划', '编剧', '文案策划'];

  const englishNames = ['Wei Zhang', 'Na Li', 'Qiang Wang', 'Fang Liu', 'Ming Chen', 'Yang Yang', 'Xue Zhao', 'Lei Huang', 'Jie Zhou', 'Min Wu',
    'Li Wang', 'Hao Chen', 'Yan Liu', 'Xin Li', 'Bo Zhang'];
  const englishTitles = ['Senior Software Engineer', 'Product Manager', 'UI/UX Designer', 'Frontend Developer', 'Backend Developer',
    'Data Analyst', 'Operations Specialist', 'Marketing Manager', 'Project Manager', 'Finance Director', 'HR Manager',
    'Sales Director', 'Brand Manager', 'Content Creator', 'New Media Manager'];

  let tid = 1;

  // 中文模板 80 个
  for (const purpose of purposes) {
    const cnt = purpose === 'senior' ? 6 : purpose === 'junior' ? 5 : 4;
    for (let i = 0; i < cnt; i++) {
      const style = styleCats[i % styleCats.length];
      const layout = layouts[i % layouts.length];
      const ind = industries[Math.floor(i / 3) % industries.length];
      const nIdx = (tid - 1) % chineseNames.length;
      const tIdx = (tid - 1) % chineseTitles.length;
      store.templates.push({
        id: tid,
        name: chineseNames[nIdx],
        name_en: null,
        category: style,
        language: 'chinese',
        thumbnail: null,
        style_data: JSON.stringify({ variantId: `${style}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry: ind, experience: purpose }),
        is_pro: tid % 5 === 0 ? 1 : 0,
        is_featured: tid <= 15 ? 1 : 0,
        download_count: 0,
        created_at: new Date().toISOString(),
      });
      tid++;
    }
  }

  // 更多中文变体 36 个
  for (let i = 0; i < 36; i++) {
    const style = styleCats[i % styleCats.length];
    const layout = layouts[(i + 1) % layouts.length];
    const ind = industries[(i + 2) % industries.length];
    const nIdx = i % chineseNames.length;
    const tIdx = i % chineseTitles.length;
    store.templates.push({
      id: tid,
      name: `${chineseNames[nIdx]} - ${chineseTitles[tIdx]}`,
      name_en: null,
      category: style,
      language: 'chinese',
      thumbnail: null,
      style_data: JSON.stringify({ variantId: `${style}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry: ind, experience: ['entry', 'junior', 'mid'][i % 3] }),
      is_pro: i % 4 === 0 ? 1 : 0,
      is_featured: 0,
      download_count: 0,
      created_at: new Date().toISOString(),
    });
    tid++;
  }

  // 英文模板 40 个
  for (let i = 0; i < 40; i++) {
    const style = styleCats[i % styleCats.length];
    const layout = layouts[i % layouts.length];
    const ind = industries[i % industries.length];
    const nIdx = i % englishNames.length;
    const tIdx = i % englishTitles.length;
    store.templates.push({
      id: tid,
      name: `${englishNames[nIdx]} - ${englishTitles[tIdx]}`,
      name_en: null,
      category: style,
      language: 'english',
      thumbnail: null,
      style_data: JSON.stringify({ variantId: `${style}_${layout.id}`, hasPhoto: layout.hasPhoto, photoPosition: layout.position, industry: ind, experience: ['entry', 'junior', 'mid', 'senior'][i % 4] }),
      is_pro: i % 5 === 0 ? 1 : 0,
      is_featured: i < 8 ? 1 : 0,
      download_count: 0,
      created_at: new Date().toISOString(),
    });
    tid++;
  }

  console.log(`[db] 内存数据库初始化完成，共 ${store.templates.length} 个模板`);
}

seedTemplates();

// ---------- 数据库 API ----------
const db = {
  prepare(sql) {
    const upper = sql.trim().toUpperCase();
    const isSelect = upper.startsWith('SELECT');
    const isInsert = upper.startsWith('INSERT');
    const isUpdate = upper.startsWith('UPDATE');
    const isDelete = upper.startsWith('DELETE');

    return {
      run(...params) {
        if (isInsert) return handleInsert(sql, params);
        if (isUpdate) return handleUpdate(sql, params);
        if (isDelete) return handleDelete(sql, params);
        return { changes: 0, lastInsertRowid: 0 };
      },
      get(...params) {
        return handleSelect(sql, params)[0] || undefined;
      },
      all(...params) {
        return handleSelect(sql, params);
      },
    };

    function handleInsert(sql, params) {
      const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
      if (!tableMatch) return { changes: 0, lastInsertRowid: 0 };

      const table = tableMatch[1].toLowerCase();
      let newId = 0;

      if (table === 'users') {
        newId = store.nextUserId++;
        store.users.push({
          id: newId,
          username: params[0],
          email: params[1],
          password_hash: params[2],
          is_pro: 0,
          created_at: new Date().toISOString(),
        });
      } else if (table === 'resumes') {
        newId = store.nextResumeId++;
        const now = new Date().toISOString();
        store.resumes.push({
          id: newId,
          user_id: params[0],
          template_id: params[1],
          title: params[2],
          content: params[3],
          created_at: now,
          updated_at: now,
        });
      } else if (table === 'favorites') {
        newId = store.nextFavoriteId++;
        store.favorites.push({
          id: newId,
          user_id: params[0],
          template_id: params[1],
          created_at: new Date().toISOString(),
        });
      }

      return { changes: 1, lastInsertRowid: newId };
    }

    function handleUpdate(sql, params) {
      const upper = sql.toUpperCase();
      let changes = 0;

      if (upper.includes('USERS') && upper.includes('SET IS_PRO')) {
        const uid = Number(params[1]);
        const user = store.users.find(u => u.id === uid);
        if (user) { user.is_pro = 1; changes = 1; }
      } else if (upper.includes('TEMPLATES') && upper.includes('DOWNLOAD_COUNT')) {
        const tid = Number(params[0]);
        const tpl = store.templates.find(t => t.id === tid);
        if (tpl) { tpl.download_count++; changes = 1; }
      } else if (upper.includes('RESUMES')) {
        const id = Number(params[3]);
        const uid = Number(params[4]);
        const idx = store.resumes.findIndex(r => r.id === id && r.user_id === uid);
        if (idx !== -1) {
          store.resumes[idx].title = params[0];
          store.resumes[idx].template_id = Number(params[1]) || store.resumes[idx].template_id;
          store.resumes[idx].content = params[2];
          store.resumes[idx].updated_at = new Date().toISOString();
          changes = 1;
        }
      }

      return { changes };
    }

    function handleDelete(sql, params) {
      const upper = sql.toUpperCase();
      let changes = 0;

      if (upper.includes('RESUMES')) {
        const id = Number(params[0]);
        const uid = Number(params[1]);
        const idx = store.resumes.findIndex(r => r.id === id && r.user_id === uid);
        if (idx !== -1) { store.resumes.splice(idx, 1); changes = 1; }
      } else if (upper.includes('FAVORITES')) {
        const uid = Number(params[0]);
        const tid = Number(params[1]);
        const idx = store.favorites.findIndex(f => f.user_id === uid && f.template_id === tid);
        if (idx !== -1) { store.favorites.splice(idx, 1); changes = 1; }
      }

      return { changes };
    }

    function handleSelect(sql, params) {
      const upper = sql.toUpperCase();

      // COUNT
      if (upper.includes('COUNT(*)')) {
        if (upper.includes('TEMPLATES')) return [{ c: store.templates.length }];
        if (upper.includes('USERS')) return [{ c: store.users.length }];
      }

      // last_insert_rowid
      if (upper.includes('LAST_INSERT_ROWID()')) {
        return [{ id: store.nextUserId - 1 }];
      }

      // templates
      if (upper.startsWith('SELECT * FROM TEMPLATES') || (upper.includes('FROM TEMPLATES') && isSelect)) {
        let result = [...store.templates];

        if (upper.includes('WHERE ID = ?')) {
          const id = Number(params[0]);
          const found = result.find(t => t.id === id);
          return found ? [found] : [];
        }
        if (upper.includes('IS_FEATURED = 1')) {
          result = result.filter(t => t.is_featured === 1);
        }
        if (upper.includes('ORDER BY IS_FEATURED DESC')) {
          result.sort((a, b) => b.is_featured - a.is_featured || b.download_count - a.download_count);
        }
        if (upper.includes('LIMIT ?')) {
          const limit = Number(params[params.length - 2]) || 20;
          const offset = Number(params[params.length - 1]) || 0;
          return result.slice(offset, offset + limit);
        }
        return result;
      }

      // SELECT id FROM templates WHERE id = ?
      if (upper.includes('SELECT ID FROM TEMPLATES WHERE ID = ?')) {
        const tpl = store.templates.find(t => t.id === Number(params[0]));
        return tpl ? [{ id: tpl.id }] : [];
      }

      // SELECT download_count FROM templates WHERE id = ?
      if (upper.includes('SELECT DOWNLOAD_COUNT FROM TEMPLATES')) {
        const tpl = store.templates.find(t => t.id === Number(params[0]));
        return tpl ? [{ download_count: tpl.download_count }] : [];
      }

      // users
      if (upper.startsWith('SELECT * FROM USERS')) {
        if (upper.includes('WHERE ID = ?')) {
          const u = store.users.find(u => u.id === Number(params[0]));
          return u ? [u] : [];
        }
        if (upper.includes('WHERE USERNAME = ? OR EMAIL = ?')) {
          const u = store.users.find(u => u.username === params[0] || u.email === params[1]);
          return u ? [u] : [];
        }
        return store.users;
      }
      if (upper.includes('SELECT ID FROM USERS')) {
        const u = store.users.find(u => u.username === params[0] || u.email === params[1]);
        return u ? [{ id: u.id }] : [];
      }

      // resumes
      if (upper.includes('FROM RESUMES')) {
        let result = store.resumes.map(r => {
          const tpl = store.templates.find(t => t.id === r.template_id);
          return {
            id: r.id, user_id: r.user_id, template_id: r.template_id,
            title: r.title, content: r.content,
            created_at: r.created_at, updated_at: r.updated_at,
            template_name: tpl?.name || null, thumbnail: tpl?.thumbnail || null,
          };
        });

        if (upper.includes('WHERE R.ID = ? AND R.USER_ID = ?')) {
          result = result.filter(r => r.id === Number(params[0]) && r.user_id === Number(params[1]));
        } else if (upper.includes('WHERE R.USER_ID = ?')) {
          result = result.filter(r => r.user_id === Number(params[0]));
        }
        if (upper.includes('ORDER BY R.UPDATED_AT DESC')) {
          result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        }
        return result;
      }

      // favorites
      if (upper.includes('FROM FAVORITES')) {
        if (upper.includes('WHERE F.USER_ID = ? AND F.TEMPLATE_ID = ?')) {
          const f = store.favorites.find(f => f.user_id === Number(params[0]) && f.template_id === Number(params[1]));
          return f ? [{ id: f.id }] : [];
        }
        if (upper.includes('WHERE F.USER_ID = ?')) {
          return store.favorites
            .filter(f => f.user_id === Number(params[0]))
            .map(f => {
              const tpl = store.templates.find(t => t.id === f.template_id);
              return tpl ? { id: f.id, created_at: f.created_at, ...tpl } : null;
            })
            .filter(Boolean);
        }
      }

      return [];
    }
  },

  exec() { return []; },
  close() {},
};

// 导出 store 和 db
export { store };
export default db;
