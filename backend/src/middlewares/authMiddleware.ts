import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendendo o tipo Request do Express para incluir o userId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ success: false, message: 'Token não fornecido.' });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    res.status(401).json({ success: false, message: 'Token com formato inválido.' });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ success: false, message: 'Token malformado.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'secret_fallback';

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
      return;
    }

    req.userId = decoded.id;
    return next();
  });
};
