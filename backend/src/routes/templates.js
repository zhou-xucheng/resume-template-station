import express from 'express';
import db from '../db.js';

const router = express.Router();

function ok(res, data, meta) {
  const payload = { code: 0, message: 'ok', data };
  if (meta && typeof meta === 'object') payload.meta = meta;
  return res.status(200).json(payload);
}
function err(res, statusCode, message, details) {
  const payload = { code: statusCode, message, data: null };
  if (details !== undefined) payload.details = details;
  return res.status(statusCode).json(payload);
}

function escapeLike(value) {
  return String(value).replace(/[%_\\]/g, '\\$&');
}

// ---------- list with filter + pagination ----------
router.get('/', (req, res) => {
  try {
    const { category, language, is_pro, search, page = 1, limit = 20, style, type } = req.query;

    // 风格名映射：中文 -> 英文
    const styleMap = {
      '简约': 'simple',
      '专业': 'professional',
      '创意': 'creative',
      '技术岗': 'tech',
      '管理岗': 'management',
    };

    const clauses = [];
    const params = [];

    // 支持 style 参数（前端发送的，支持逗号分隔多个）和 category 参数（后端原始的）
    if (style && style !== 'all') {
      const styles = style.split(',').filter(s => s.trim());
      if (styles.length > 0) {
        const mappedStyles = styles.map(s => styleMap[s.trim()] || s.trim());
        const placeholders = mappedStyles.map(() => '?').join(',');
        clauses.push(`category IN (${placeholders})`);
        params.push(...mappedStyles);
      }
    } else if (category && category !== 'all') {
      clauses.push('category = ?');
      params.push(category);
    }
    if (language && language !== 'all') {
      // 支持中文语言参数
      const langMap = { '中文': 'chinese', '英文': 'english' };
      const targetLang = langMap[language] || language;
      clauses.push('language = ?');
      params.push(targetLang);
    }
    // 支持 type 参数（前端发送的 free/pro）和 is_pro 参数（后端原始的）
    if (type && type !== 'all') {
      clauses.push('is_pro = ?');
      params.push(type === 'pro' ? 1 : 0);
    } else if (is_pro !== undefined && is_pro !== '' && is_pro !== 'all') {
      clauses.push('is_pro = ?');
      params.push(is_pro === 'true' || is_pro === '1' || is_pro === 1 ? 1 : 0);
    }
    if (search) {
      clauses.push('(name LIKE ? ESCAPE \'\\\' OR name_en LIKE ? ESCAPE \'\\\')');
      const like = `%${escapeLike(search)}%`;
      params.push(like, like);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const { total } = db.prepare(`SELECT COUNT(*) AS total FROM templates ${where}`).get(...params);

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const templates = db
      .prepare(
        `SELECT * FROM templates ${where} ORDER BY is_featured DESC, download_count DESC, id DESC LIMIT ? OFFSET ?`
      )
      .all(...params, safeLimit, offset);

    const hasMore = offset + templates.length < total;

    return ok(res, {
      templates,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        hasMore,
      },
    });
  } catch (e) {
    console.error('[templates.list]', e);
    return err(res, 500, '获取模板列表失败');
  }
});

// ---------- featured ----------
router.get('/featured', (req, res) => {
  try {
    const templates = db
      .prepare('SELECT * FROM templates WHERE is_featured = 1 ORDER BY download_count DESC LIMIT 6')
      .all();
    return ok(res, { templates });
  } catch (e) {
    console.error('[templates.featured]', e);
    return err(res, 500, '获取精选模板失败');
  }
});

// ---------- by id ----------
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return err(res, 400, '模板 ID 无效');
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(id);
    if (!template) return err(res, 404, '模板不存在');
    return ok(res, { template });
  } catch (e) {
    console.error('[templates.detail]', e);
    return err(res, 500, '获取模板详情失败');
  }
});

// ---------- record download ----------
router.post('/:id/download', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return err(res, 400, '模板 ID 无效');
    const info = db.prepare('UPDATE templates SET download_count = download_count + 1 WHERE id = ?').run(id);
    if (info.changes === 0) return err(res, 404, '模板不存在');
    const row = db.prepare('SELECT download_count FROM templates WHERE id = ?').get(id);
    return ok(res, { download_count: row.download_count });
  } catch (e) {
    console.error('[templates.download]', e);
    return err(res, 500, '下载计数失败');
  }
});

export default router;
