import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'resume-template-secret-key-2024';
export const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录或缺少 token', data: null });
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ code: 401, message: 'token 不能为空', data: null });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: 'token 已过期', data: null });
    }
    return res.status(401).json({ code: 401, message: 'token 无效', data: null });
  }
};

export default auth;
