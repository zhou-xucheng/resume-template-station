import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

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

function normalizeContent(content) {
  if (content == null) return null;
  if (typeof content === 'string') {
    // try parse to detect valid JSON string; if parseable as object, use as-is
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') return content; // already valid JSON string
      // plain string, stringify it
      return JSON.stringify(content);
    } catch {
      // not valid JSON, treat as plain string
      return JSON.stringify({ text: content });
    }
  }
  if (typeof content === 'object') {
    return JSON.stringify(content);
  }
  return JSON.stringify({ raw: String(content) });
}

// ---------- list ----------
router.get('/', auth, (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT r.id, r.user_id, r.template_id, r.title, r.content, r.created_at, r.updated_at,
                t.name AS template_name, t.thumbnail
         FROM resumes r
         LEFT JOIN templates t ON r.template_id = t.id
         WHERE r.user_id = ?
         ORDER BY r.updated_at DESC`
      )
      .all(req.user.id);
    return ok(res, { resumes: rows });
  } catch (e) {
    console.error('[resumes.list]', e);
    return err(res, 500, '获取简历列表失败');
  }
});

// ---------- detail ----------
router.get('/:id', auth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const resume = db
      .prepare(
        `SELECT r.*, t.name AS template_name
         FROM resumes r
         LEFT JOIN templates t ON r.template_id = t.id
         WHERE r.id = ? AND r.user_id = ?`
      )
      .get(id, req.user.id);
    if (!resume) return err(res, 404, '简历不存在');
    return ok(res, { resume });
  } catch (e) {
    console.error('[resumes.detail]', e);
    return err(res, 500, '获取简历详情失败');
  }
});

// ---------- create ----------
router.post('/', auth, (req, res) => {
  try {
    const { template_id, title, content } = req.body || {};
    const finalContent = normalizeContent(content);
    if (!finalContent) return err(res, 400, '简历内容不能为空');

    const templateIdNum = template_id ? Number(template_id) : null;
    const safeTemplateId = Number.isInteger(templateIdNum) && templateIdNum > 0 ? templateIdNum : null;
    const info = db
      .prepare('INSERT INTO resumes (user_id, template_id, title, content) VALUES (?, ?, ?, ?)')
      .run(req.user.id, safeTemplateId, title || '未命名简历', finalContent);
    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(info.lastInsertRowid);
    return res.status(201).json({ code: 0, message: '简历创建成功', data: { id: resume.id, resume } });
  } catch (e) {
    console.error('[resumes.create]', e);
    return err(res, 500, '创建简历失败');
  }
});

// ---------- update ----------
router.put('/:id', auth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { template_id, title, content } = req.body || {};

    const existing = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) return err(res, 404, '简历不存在');

    const finalContent = content !== undefined ? normalizeContent(content) : existing.content;
    const finalTitle = title !== undefined ? title : existing.title;
    const templateIdNum = template_id !== undefined ? Number(template_id) : existing.template_id;
    const safeTemplateId = Number.isInteger(templateIdNum) && templateIdNum > 0 ? templateIdNum : existing.template_id;

    db.prepare(
      'UPDATE resumes SET title = ?, template_id = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    ).run(finalTitle, safeTemplateId, finalContent, id, req.user.id);

    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id);
    return ok(res, { resume });
  } catch (e) {
    console.error('[resumes.update]', e);
    return err(res, 500, '更新简历失败');
  }
});

// ---------- delete ----------
router.delete('/:id', auth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(id, req.user.id);
    if (info.changes === 0) return err(res, 404, '简历不存在');
    return ok(res, { message: '简历已删除' });
  } catch (e) {
    console.error('[resumes.delete]', e);
    return err(res, 500, '删除简历失败');
  }
});

export default router;
