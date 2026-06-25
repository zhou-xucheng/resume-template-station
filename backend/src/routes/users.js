import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../db.js';
import auth, { JWT_SECRET, TOKEN_EXPIRES_IN } from '../middleware/auth.js';

const router = express.Router();
const SALT_ROUNDS = 10;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- helpers ----------
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

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, is_pro: user.is_pro || 0 },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function normalize(s) {
  return s == null ? '' : String(s);
}

// ---------- register ----------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  const u = normalize(username).trim();
  const e = normalize(email).trim().toLowerCase();
  const p = normalize(password);

  if (!u || !e || !p) return err(res, 400, '用户名、邮箱、密码均为必填');
  if (u.length < 2) return err(res, 400, '用户名长度至少为 2 位');
  if (!emailRegex.test(e)) return err(res, 400, '邮箱格式不正确');
  if (p.length < 6) return err(res, 400, '密码长度至少为 6 位');

  try {
    const existing = db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .get(u, e);
    if (existing) return err(res, 409, '用户名或邮箱已被注册');

    const password_hash = await bcrypt.hash(p, SALT_ROUNDS);
    const info = db
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
      .run(u, e, password_hash);

    const user = {
      id: info.lastInsertRowid,
      username: u,
      email: e,
      is_pro: 0,
      created_at: new Date().toISOString(),
    };
    return created(res, { token: signToken(user), user: buildUserPayload(user) });
  } catch (error) {
    console.error('[users.register]', error);
    return err(res, 500, '注册失败，请稍后再试');
  }
});

// ---------- login ----------
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body || {};
  const loginKey = normalize(username || email).trim();
  const p = normalize(password);

  if (!loginKey || !p) return err(res, 400, '请输入账号与密码');

  try {
    const user = db
      .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
      .get(loginKey, loginKey.toLowerCase());
    if (!user) return err(res, 401, '账号或密码错误');

    const ok_ = await bcrypt.compare(p, user.password_hash);
    if (!ok_) return err(res, 401, '账号或密码错误');

    return ok(res, { token: signToken(user), user: buildUserPayload(user) });
  } catch (error) {
    console.error('[users.login]', error);
    return err(res, 500, '登录失败，请稍后再试');
  }
});

// ---------- current user ----------
router.get('/me', auth, (req, res) => {
  try {
    const uid = req.user?.id;
    if (uid == null) return err(res, 401, 'token 中缺少用户信息');
    const user = db
      .prepare('SELECT id, username, email, is_pro, created_at FROM users WHERE id = ?')
      .get(uid);
    if (!user) return err(res, 404, '用户不存在');
    return ok(res, buildUserPayload(user));
  } catch (error) {
    console.error('[users.me]', error);
    return err(res, 500, '查询失败');
  }
});

// ---------- upgrade to pro (simulated) ----------
router.put('/me/pro', auth, (req, res) => {
  try {
    const uid = req.user?.id;
    if (uid == null) return err(res, 401, 'token 中缺少用户信息');
    db.prepare('UPDATE users SET is_pro = 1 WHERE id = ?').run(uid);
    const user = db
      .prepare('SELECT id, username, email, is_pro, created_at FROM users WHERE id = ?')
      .get(uid);
    if (!user) return err(res, 404, '用户不存在');
    return ok(res, buildUserPayload(user), { message: '已升级为 Pro 会员' });
  } catch (error) {
    console.error('[users.me.pro]', error);
    return err(res, 500, '升级失败');
  }
});

export default router;
