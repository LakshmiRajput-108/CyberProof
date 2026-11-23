
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createGuestToken, requireGuestSession, GuestRequest } from '../middleware/guestSessionMiddleware';
import { prisma } from '../prisma/client';

const router = Router();

const GuestSessionSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
});

// Create a guest session
router.post('/session', (req: Request, res: Response) => {
  try {
    const parsed = GuestSessionSchema.safeParse(req.body ?? {});

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Name must be between 1 and 80 characters.',
      });
    }

    const name = parsed.data.name;
    const session = createGuestToken(name);

    return res.status(201).json({
      token: session.token,
      guest: {
        sessionId: session.sessionId,
        name: name ?? null,
        type: 'GUEST',
      },
    });
  } catch (error) {
    console.error('Guest session creation error:', error);

    return res.status(500).json({
      error: 'Could not create guest session.',
    });
  }
});

router.get('/session', requireGuestSession, (req, res) => {
  const guestRequest = req as GuestRequest;

  if (!guestRequest.guestSessionId) {
    return res.status(401).json({ error: 'Guest session required' });
  }

  return res.json({
    guest: {
      sessionId: guestRequest.guestSessionId,
      name: guestRequest.guestName ?? null,
      type: 'GUEST',
    },
  });
});

// Get only the scans belonging to this guest session
router.get('/history', requireGuestSession, async (req, res) => {
  try {
    const guestSessionId = (req as GuestRequest).guestSessionId;

    if (!guestSessionId) {
      return res.status(401).json({ error: 'Guest session required' });
    }

    const scans = await prisma.scan.findMany({
      where: { guestSessionId },
      orderBy: { created_at: 'desc' },
    });

    const history = scans.map((scan) => ({
      ...scan,
      why_flagged: JSON.parse(scan.why_flagged),
      evidence: JSON.parse(scan.evidence),
      recommended_actions: JSON.parse(scan.recommended_actions),
    }));

    return res.json(history);
  } catch (error) {
    console.error('Guest history error:', error);
    return res.status(500).json({ error: 'Could not fetch guest history.' });
  }
});

export { router };