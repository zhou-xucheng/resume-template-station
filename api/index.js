// Vercel Serverless API 入口
// 处理所有 /api/* 请求

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { store } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vercel-resume-template-secret-key-2024';
const TOKEN_EXPIRES_IN = '7d';

// ---------- 工具函数 ----------
function ok(res, data, meta) {
  const payload = { code: 0, message: 'ok', data };
  if (meta && typeof meta === 'object') payload.meta = meta;
  return res.status(200).json(payload);
}

function created(res, data) {
  return res.status(201).json({ code: 0, message: 'created', data });
}

function err(res, statusCode, message, details) {
  const payload = { code: statusCode, message, data: null };
  if (details !== undefined) payload.details = details;
  return res.status(statusCode).json(payload);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    err(res, 401, '未授权，请先登录');
    return null;
  }
  const token = auth.slice(7);
  const user = verifyToken(token);
  if (!user) {
    err(res, 401, 'token 无效或已过期');
    return null;
  }
  req.user = user;
  return user;
}

function normalize(s) {
  return s == null ? '' : String(s);
}

function buildUserPayload(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    is_pro: user.is_pro || 0,
    created_at: user.created_at,
  };
}

// ---------- 请求处理 ----------
async function handler(req, res) {
  const { url, method } = req;
  const pathname = url.split('?')[0];

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 健康检查
    if (pathname === '/api/health' && method === 'GET') {
      return ok(res, {
        service: 'resume-template-api',
        env: 'vercel',
        timestamp: new Date().toISOString(),
        status: 'ok',
      });
    }

    // ---------- 用户路由 ----------
    if (pathname === '/api/users/register' && method === 'POST') {
      const { username, email, password } = req.body || {};
      const u = normalize(username).trim();
      const e = normalize(email).trim().toLowerCase();
      const p = normalize(password);

      if (!u || !e || !p) return err(res, 400, '用户名、邮箱、密码均为必填');
      if (u.length < 2) return err(res, 400, '用户名长度至少为 2 位');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return err(res, 400, '邮箱格式不正确');
      if (p.length < 6) return err(res, 400, '密码长度至少为 6 位');

      const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(u, e);
      if (existing) return err(res, 409, '用户名或邮箱已被注册');

      const password_hash = await bcrypt.hash(p, 10);
      const info = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(u, e, password_hash);

      const user = {
        id: info.lastInsertRowid,
        username: u,
        email: e,
        is_pro: 0,
        created_at: new Date().toISOString(),
      };
      return created(res, { token: signToken({ id: user.id, username: u, is_pro: 0 }), user: buildUserPayload(user) });
    }

    if (pathname === '/api/users/login' && method === 'POST') {
      const { username, email, password } = req.body || {};
      const loginKey = normalize(username || email).trim();
      const p = normalize(password);

      if (!loginKey || !p) return err(res, 400, '请输入账号与密码');

      const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(loginKey, loginKey.toLowerCase());
      if (!user) return err(res, 401, '账号或密码错误');

      const ok_ = await bcrypt.compare(p, user.password_hash);
      if (!ok_) return err(res, 401, '账号或密码错误');

      return ok(res, {
        token: signToken({ id: user.id, username: user.username, is_pro: user.is_pro }),
        user: buildUserPayload(user),
      });
    }

    if (pathname === '/api/users/me' && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const found = db.prepare('SELECT id, username, email, is_pro, created_at FROM users WHERE id = ?').get(user.id);
      if (!found) return err(res, 404, '用户不存在');
      return ok(res, buildUserPayload(found));
    }

    if (pathname === '/api/users/me/pro' && method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;

      db.prepare('UPDATE users SET is_pro = 1 WHERE id = ?').run(user.id);
      const found = db.prepare('SELECT id, username, email, is_pro, created_at FROM users WHERE id = ?').get(user.id);
      if (!found) return err(res, 404, '用户不存在');
      return ok(res, buildUserPayload(found), { message: '已升级为 Pro 会员' });
    }

    // ---------- 模板路由 ----------
    if (pathname === '/api/templates' && method === 'GET') {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const { category, language, is_pro, search, page = 1, limit = 20, style, type } = Object.fromEntries(searchParams);

      let result = [...store.templates];
      const styleMap = { '简约': 'simple', '专业': 'professional', '创意': 'creative', '技术岗': 'tech', '管理岗': 'management' };
      const langMap = { '中文': 'chinese', '英文': 'english' };

      // 过滤
      if (style && style !== 'all') {
        const styles = style.split(',').map(s => styleMap[s.trim()] || s.trim());
        result = result.filter(t => styles.includes(t.category));
      } else if (category && category !== 'all') {
        result = result.filter(t => t.category === category);
      }

      if (language && language !== 'all') {
        result = result.filter(t => t.language === (langMap[language] || language));
      }

      if (type && type !== 'all') {
        result = result.filter(t => (type === 'pro' ? t.is_pro === 1 : t.is_pro === 0));
      } else if (is_pro !== undefined && is_pro !== '' && is_pro !== 'all') {
        result = result.filter(t => t.is_pro === (is_pro === 'true' || is_pro === '1' || is_pro === 1 ? 1 : 0));
      }

      if (search) {
        const lower = search.toLowerCase();
        result = result.filter(t =>
          (t.name && t.name.toLowerCase().includes(lower)) ||
          (t.name_en && t.name_en.toLowerCase().includes(lower))
        );
      }

      const total = result.length;
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const safePage = Math.max(Number(page) || 1, 1);
      const offset = (safePage - 1) * safeLimit;

      result.sort((a, b) => b.is_featured - a.is_featured || b.download_count - a.download_count || b.id - a.id);
      const paged = result.slice(offset, offset + safeLimit);

      return ok(res, {
        templates: paged,
        pagination: { page: safePage, limit: safeLimit, total, hasMore: offset + paged.length < total },
      });
    }

    if (pathname === '/api/templates/featured' && method === 'GET') {
      const featured = store.templates
        .filter(t => t.is_featured === 1)
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 6);
      return ok(res, { templates: featured });
    }

    if (pathname.match(/^\/api\/templates\/(\d+)$/) && method === 'GET') {
      const id = Number(pathname.match(/^\/api\/templates\/(\d+)$/)[1]);
      const template = store.templates.find(t => t.id === id);
      if (!template) return err(res, 404, '模板不存在');
      return ok(res, { template });
    }

    if (pathname.match(/^\/api\/templates\/(\d+)\/download$/) && method === 'POST') {
      const id = Number(pathname.match(/^\/api\/templates\/(\d+)\/download$/)[1]);
      const info = db.prepare('UPDATE templates SET download_count = download_count + 1 WHERE id = ?').run(id);
      if (info.changes === 0) return err(res, 404, '模板不存在');
      const row = db.prepare('SELECT download_count FROM templates WHERE id = ?').get(id);
      return ok(res, { download_count: row.download_count });
    }

    // ---------- 简历路由 ----------
    if (pathname === '/api/resumes' && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const rows = db.prepare(
        `SELECT r.id, r.user_id, r.template_id, r.title, r.content, r.created_at, r.updated_at,
                t.name AS template_name, t.thumbnail
         FROM resumes r
         LEFT JOIN templates t ON r.template_id = t.id
         WHERE r.user_id = ?
         ORDER BY r.updated_at DESC`
      ).all(user.id);

      return ok(res, { resumes: rows });
    }

    if (pathname === '/api/resumes' && method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const { template_id, title, content } = req.body || {};
      if (!content) return err(res, 400, '简历内容不能为空');

      const templateIdNum = template_id ? Number(template_id) : null;
      const safeTemplateId = Number.isInteger(templateIdNum) && templateIdNum > 0 ? templateIdNum : null;
      const info = db.prepare('INSERT INTO resumes (user_id, template_id, title, content) VALUES (?, ?, ?, ?)').run(
        user.id, safeTemplateId, title || '未命名简历', typeof content === 'string' ? content : JSON.stringify(content)
      );
      const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(info.lastInsertRowid);
      return created(res, { id: resume.id, resume });
    }

    if (pathname.match(/^\/api\/resumes\/(\d+)$/) && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const id = Number(pathname.match(/^\/api\/resumes\/(\d+)$/)[1]);
      const resume = db.prepare(
        `SELECT r.*, t.name AS template_name
         FROM resumes r
         LEFT JOIN templates t ON r.template_id = t.id
         WHERE r.id = ? AND r.user_id = ?`
      ).get(id, user.id);

      if (!resume) return err(res, 404, '简历不存在');
      return ok(res, { resume });
    }

    if (pathname.match(/^\/api\/resumes\/(\d+)$/) && method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;

      const id = Number(pathname.match(/^\/api\/resumes\/(\d+)$/)[1]);
      const { template_id, title, content } = req.body || {};

      const existing = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(id, user.id);
      if (!existing) return err(res, 404, '简历不存在');

      const finalContent = content !== undefined ? (typeof content === 'string' ? content : JSON.stringify(content)) : existing.content;
      const finalTitle = title !== undefined ? title : existing.title;
      const templateIdNum = template_id !== undefined ? Number(template_id) : existing.template_id;
      const safeTemplateId = Number.isInteger(templateIdNum) && templateIdNum > 0 ? templateIdNum : existing.template_id;

      db.prepare(
        'UPDATE resumes SET title = ?, template_id = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
      ).run(finalTitle, safeTemplateId, finalContent, id, user.id);

      const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id);
      return ok(res, { resume });
    }

    if (pathname.match(/^\/api\/resumes\/(\d+)$/) && method === 'DELETE') {
      const user = requireAuth(req, res);
      if (!user) return;

      const id = Number(pathname.match(/^\/api\/resumes\/(\d+)$/)[1]);
      const info = db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(id, user.id);
      if (info.changes === 0) return err(res, 404, '简历不存在');
      return ok(res, { message: '简历已删除' });
    }

    // ---------- 收藏路由 ----------
    if (pathname === '/api/favorites' && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const rows = db.prepare(
        `SELECT f.id, f.created_at, t.*
         FROM favorites f
         JOIN templates t ON f.template_id = t.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`
      ).all(user.id);

      return ok(res, { favorites: rows });
    }

    if (pathname === '/api/favorites' && method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const { template_id, templateId } = req.body || {};
      const rawTid = template_id || templateId;
      const tplId = Number(rawTid);
      if (!Number.isInteger(tplId) || tplId <= 0) return err(res, 400, '模板 ID 无效');

      const tpl = db.prepare('SELECT id FROM templates WHERE id = ?').get(tplId);
      if (!tpl) return err(res, 404, '模板不存在');

      const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND template_id = ?').get(user.id, tplId);
      if (existing) return err(res, 409, '已收藏该模板', { is_favorite: true });

      const info = db.prepare('INSERT INTO favorites (user_id, template_id) VALUES (?, ?)').run(user.id, tplId);
      return created(res, { id: info.lastInsertRowid, is_favorite: true });
    }

    if (pathname.match(/^\/api\/favorites\/(\d+)$/) && method === 'DELETE') {
      const user = requireAuth(req, res);
      if (!user) return;

      const tplId = Number(pathname.match(/^\/api\/favorites\/(\d+)$/)[1]);
      const info = db.prepare('DELETE FROM favorites WHERE user_id = ? AND template_id = ?').run(user.id, tplId);
      if (info.changes === 0) return err(res, 404, '未找到该收藏');
      return ok(res, { is_favorite: false });
    }

    if (pathname.match(/^\/api\/favorites\/check\/(\d+)$/) && method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const tplId = Number(pathname.match(/^\/api\/favorites\/check\/(\d+)$/)[1]);
      const row = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND template_id = ?').get(user.id, tplId);
      return ok(res, { is_favorite: !!row });
    }

    // 404
    return err(res, 404, 'API 路由不存在', { method, url: pathname });

  } catch (e) {
    console.error('[api error]', e);
    return err(res, 500, '服务器内部错误');
  }
}

export default handler;
