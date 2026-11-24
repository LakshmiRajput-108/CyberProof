import { Router } from 'express';
import { prisma } from '../prisma/client';
import { AuthenticatedRequest, requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze', requireAuth, async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        membershipTier: true,
        accountStatus: true,
      },
    });

    if (!user || user.accountStatus !== 'ACTIVE') {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    if (user.membershipTier !== 'PREMIUM') {
      return res.status(403).json({ error: 'Premium membership required' });
    }

    return res.status(503).json({
      error: 'Caller Guard is unavailable because membership expiry verification is not configured.',
    });
  } catch (error) {
    console.error('Caller Guard entitlement check failed:', error);
    return res.status(500).json({ error: 'Could not verify membership access' });
  }
});

export { router };
