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

// ---------- list ----------
router.get('/', auth, (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT f.id, f.created_at, t.*
         FROM favorites f
         JOIN templates t ON f.template_id = t.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`
      )
      .all(req.user.id);
    return ok(res, { favorites: rows });
  } catch (e) {
    console.error('[favorites.list]', e);
    return err(res, 500, '获取收藏列表失败');
  }
});

// ---------- add ----------
router.post('/', auth, (req, res) => {
  try {
    const { template_id, templateId } = req.body || {};
    const rawTid = template_id || templateId;
    const tplId = Number(rawTid);
    if (!Number.isInteger(tplId) || tplId <= 0) return err(res, 400, '模板 ID 无效');
    const tpl = db.prepare('SELECT id FROM templates WHERE id = ?').get(tplId);
    if (!tpl) return err(res, 404, '模板不存在');

    const existing = db
      .prepare('SELECT id FROM favorites WHERE user_id = ? AND template_id = ?')
      .get(req.user.id, tplId);
    if (existing) return err(res, 409, '已收藏该模板', { is_favorite: true });

    const info = db.prepare('INSERT INTO favorites (user_id, template_id) VALUES (?, ?)').run(req.user.id, tplId);
    return res.status(201).json({ code: 0, message: '收藏成功', data: { id: info.lastInsertRowid, is_favorite: true } });
  } catch (e) {
    console.error('[favorites.add]', e);
    return err(res, 500, '收藏失败');
  }
});

// ---------- remove ----------
router.delete('/:template_id', auth, (req, res) => {
  try {
    const tplId = Number(req.params.template_id);
    const info = db.prepare('DELETE FROM favorites WHERE user_id = ? AND template_id = ?').run(req.user.id, tplId);
    if (info.changes === 0) return err(res, 404, '未找到该收藏');
    return ok(res, { is_favorite: false });
  } catch (e) {
    console.error('[favorites.delete]', e);
    return err(res, 500, '取消收藏失败');
  }
});

// ---------- check ----------
router.get('/check/:template_id', auth, (req, res) => {
  try {
    const tplId = Number(req.params.template_id);
    const row = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND template_id = ?').get(req.user.id, tplId);
    return ok(res, { is_favorite: !!row });
  } catch (e) {
    console.error('[favorites.check]', e);
    return err(res, 500, '检查收藏状态失败');
  }
});

export default router;
