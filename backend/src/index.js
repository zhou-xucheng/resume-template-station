import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import db from './db.js';
import usersRouter from './routes/users.js';
import templatesRouter from './routes/templates.js';
import resumesRouter from './routes/resumes.js';
import favoritesRouter from './routes/favorites.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const BODY_LIMIT = process.env.BODY_LIMIT || '2mb';

// ---------- 统一响应工具 ----------
export function success(res, data, meta) {
  const payload = { code: 0, message: 'ok', data };
  if (meta && typeof meta === 'object') payload.meta = meta;
  return res.status(200).json(payload);
}

export function fail(res, statusCode, message, details) {
  const payload = { code: statusCode, message, data: null };
  if (details !== undefined) payload.details = details;
  return res.status(statusCode).json(payload);
}

export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}

// ---------- 1. CORS ----------
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((s) => s.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

// ---------- 2. JSON body parser with size limit ----------
app.use(express.json({ limit: BODY_LIMIT }));

// ---------- 3. Request logger ----------
function formatTime(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  );
}

app.use((req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const time = formatTime(new Date());
    console.log(`[${time}] ${method} ${originalUrl} ${res.statusCode} ${elapsed}ms`);
  });
  next();
});

// ---------- 4. Health check ----------
app.get('/api/health', (req, res) => {
  try {
    const { c: templateCount } = db.prepare('SELECT COUNT(*) as c FROM templates').get();
    const { c: userCount } = db.prepare('SELECT COUNT(*) as c FROM users').get();
    success(res, {
      service: 'resume-template-backend',
      env: NODE_ENV,
      timestamp: new Date().toISOString(),
      db: { templateCount, userCount, status: 'ok' },
    });
  } catch (err) {
    console.error('[health] db unavailable', err);
    fail(res, 503, 'DB unavailable');
  }
});

// ---------- 5. Business routes ----------
app.use('/api/users', usersRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/favorites', favoritesRouter);

// ---------- 6. 404 handler ----------
app.use((req, res) => {
  fail(res, 404, 'API 路由不存在', { method: req.method, url: req.originalUrl });
});

// ---------- 7. Global error handler ----------
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof AppError) {
    console.error(`[AppError ${err.statusCode}] ${req.method} ${req.originalUrl}:`, err.message);
    return fail(res, err.statusCode, err.message, err.details);
  }
  if (err && err.type === 'entity.parse.failed') {
    return fail(res, 400, '请求体 JSON 解析失败');
  }
  console.error(`[UNCAUGHT ${req.method} ${req.originalUrl}]`, err);
  fail(res, 500, '服务器内部错误');
});

// ---------- 8. Graceful uncaught rejection / exception ----------
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

const server = app.listen(PORT, () => {
  const line = '═══════════════════════════════════════════════════════════';
  console.log(line);
  console.log(`  简历模板站后端服务已启动`);
  console.log(`  端口: ${PORT}    节点: ${NODE_ENV}`);
  console.log(`  健康检查: http://localhost:${PORT}/api/health`);
  console.log(line);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请更换端口后重试`);
  } else {
    console.error('[server.error]', err);
  }
  process.exit(1);
});

function graceful(signal) {
  console.log(`\n[${signal}] 正在关闭服务器...`);
  server.close(() => {
    try {
      db.close?.();
    } catch (_) {}
    console.log('服务器已安全退出');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('强制退出');
    process.exit(1);
  }, 5000).unref?.();
}
process.on('SIGINT', () => graceful('SIGINT'));
process.on('SIGTERM', () => graceful('SIGTERM'));
