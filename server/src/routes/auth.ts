import { Router } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';

const router = Router();

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  try {
    const parse = AuthSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
    
    const existing = await prisma.user.findUnique({ where: { email: parse.data.email } });
    if (existing) return res.status(400).json({ error: "Email in use" });
    
    // In a real app we'd hash the password here, but this is a prototype
    const user = await prisma.user.create({
      data: {
        email: parse.data.email,
        passwordHash: 'hashed_' + parse.data.password,
        name: req.body.name || 'New User',
        membershipTier: 'FREE'
      }
    });

    res.json({ token: 'mock-jwt-token', user: { id: user.id, email: user.email, name: user.name, tier: user.membershipTier } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const parse = AuthSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
    
    const user = await prisma.user.findUnique({ where: { email: parse.data.email } });
    if (!user || user.passwordHash !== 'hashed_' + parse.data.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Mock token based on membership
    const token = user.membershipTier === 'PREMIUM' ? 'Bearer premium' : 'Bearer free';
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.membershipTier } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  // Mock current user response
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  
  res.json({ 
    user: { 
      id: 'usr_mock123',
      email: 'user@example.com',
      name: 'Test User',
      tier: auth.includes('premium') ? 'PREMIUM' : 'FREE'
    } 
  });
});

export { router };
