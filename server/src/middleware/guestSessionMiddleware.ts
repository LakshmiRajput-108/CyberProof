
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { prisma } from '../prisma/client';

export interface GuestRequest extends Request {
  guestSessionId?: string;
  guestName?: string;
  userId?: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  return secret;
};

const verifyGuestToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  }) as JwtPayload;

  if (
    decoded.type !== 'guest' ||
    typeof decoded.sessionId !== 'string'
  ) {
    throw new Error('Invalid guest session');
  }

  return decoded;
};

export const requireGuestSession = (
  req: GuestRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header('X-Guest-Session');

    if (!token) {
      res.status(401).json({ error: 'Guest session required' });
      return;
    }

    const decoded = verifyGuestToken(token);

    req.guestSessionId = decoded.sessionId;

    if (typeof decoded.guestName === 'string') {
      req.guestName = decoded.guestName;
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired guest session' });
  }
};

export const requireScanOwner = async (
  req: GuestRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid authorization' });
        return;
      }

      const decoded = jwt.verify(
        authHeader.slice(7),
        getJwtSecret(),
        { algorithms: ['HS256'] }
      ) as JwtPayload;

      if (typeof decoded.userId !== 'string') {
        res.status(401).json({ error: 'Invalid member token' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, accountStatus: true },
      });

      if (!user || user.accountStatus !== 'ACTIVE') {
        res.status(401).json({ error: 'User not found or inactive' });
        return;
      }

      req.userId = user.id;
      next();
      return;
    }

    const guestToken = req.header('X-Guest-Session');

    if (!guestToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = verifyGuestToken(guestToken);

    req.guestSessionId = decoded.sessionId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};

export const createGuestToken = (guestName?: string) => {
  const sessionId = randomUUID();

  const token = jwt.sign(
    {
      type: 'guest',
      sessionId,
      ...(guestName ? { guestName } : {}),
    },
    getJwtSecret(),
    {
      algorithm: 'HS256',
      expiresIn: '30d',
    }
  );

  return { token, sessionId };
};