
import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const AuthSchema = z.object({
  email: z.string().email().transform(value => value.toLowerCase().trim()),
  password: z.string().min(8).max(128),
});

const RegisterSchema = AuthSchema.extend({
  name: z.string().trim().min(1).max(80).optional(),
});

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is missing or too short');
  }
  return secret;
};

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parse = RegisterSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid registration details. Password must be at least 8 characters.' });
    }

    const { email, password, name } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || 'New User',
        membershipTier: 'FREE',
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      getJwtSecret(),
      { expiresIn: '1d', algorithm: 'HS256' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.membershipTier,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parse = AuthSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid email or password format' });
    }

    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash || user.accountStatus !== 'ACTIVE') {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id },
      getJwtSecret(),
      { expiresIn: '1d', algorithm: 'HS256' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.membershipTier,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// VERIFY CURRENT USER
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (typeof decoded.userId !== 'string') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        membershipTier: true,
        accountStatus: true,
      },
    });

    if (!user || user.accountStatus !== 'ACTIVE') {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.membershipTier,
      },
    });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// LOGOUT
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Logged out successfully. Remove the token from the client.',
  });
});

export { router };
