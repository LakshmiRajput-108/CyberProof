
import { Router } from 'express';
import { AnalysisEngine } from '../services/analysisEngine';
import { prisma } from '../prisma/client';
import { containsForbiddenKeys } from '../schemas/scan';
import { requireScanOwner, GuestRequest } from '../middleware/guestSessionMiddleware';

const router = Router();

interface ScanOwner {
  userId?: string;
  guestSessionId?: string;
}

const saveResult = async (result: any, owner: ScanOwner) => {
  const watchlistDomain = String(result.domain).toLowerCase().replace(/^www\./, '');
  const scan = await prisma.$transaction(async (transaction) => {
    const savedScan = await transaction.scan.create({
      data: {
        userId: owner.userId ?? null,
        guestSessionId: owner.guestSessionId ?? null,
        target: result.target,
        domain: result.domain,
        analysis_type: result.analysis_type,
        risk_level: result.risk_level,
        summary: result.summary,
        why_flagged: JSON.stringify(result.why_flagged),
        evidence: JSON.stringify(result.evidence),
        recommended_actions: JSON.stringify(result.recommended_actions),
        created_at: new Date(),
        is_demo: result.is_demo,
      },
    });

    const scanCount = await transaction.scan.count({
      where: {
        userId: owner.userId ?? null,
        guestSessionId: owner.guestSessionId ?? null,
        domain: { in: [watchlistDomain, `www.${watchlistDomain}`] },
      },
    });

    await transaction.watchlistItem.updateMany({
      where: {
        domain: { in: [watchlistDomain, `www.${watchlistDomain}`] },
        userId: owner.userId ?? null,
        guestSessionId: owner.guestSessionId ?? null,
      },
      data: {
        scan_count: scanCount,
        current_risk: result.risk_level,
        last_checked: new Date(),
      },
    });

    return savedScan;
  });

  return {
    ...scan,
    why_flagged: JSON.parse(scan.why_flagged),
    evidence: JSON.parse(scan.evidence),
    recommended_actions: JSON.parse(scan.recommended_actions),
  };
};

// Public URL analysis: supports authenticated members and guest sessions
router.post('/url', requireScanOwner, async (req, res) => {
  if (containsForbiddenKeys(req.body)) {
    return res.status(400).json({ error: 'Prohibited fields' });
  }

  const { url } = req.body ?? {};

  if (typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'A valid URL is required' });
  }

  try {
    const ownerRequest = req as GuestRequest;

    if (!ownerRequest.userId && !ownerRequest.guestSessionId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = AnalysisEngine.analyzeUrl(url.trim());

    const saved = await saveResult(result, {
      userId: ownerRequest.userId,
      guestSessionId: ownerRequest.guestSessionId,
    });

    return res.json(saved);
  } catch (e: any) {
    if (e.message && e.message.includes('permitted')) {
      return res.status(400).json({ error: e.message });
    }

    return res.status(500).json({ error: 'Analysis failed' });
  }
});

// All analysis types are available to authenticated members and guest sessions.
router.post('/qr', requireScanOwner, async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: 'Prohibited fields' });
  const { payloadText } = req.body ?? {};
  if (typeof payloadText !== 'string' || !payloadText.trim()) {
    return res.status(400).json({ error: 'A non-empty payloadText is required' });
  }

  try {
    const result = AnalysisEngine.analyzeQr(payloadText);
    const saved = await saveResult(result, req as GuestRequest);
    return res.json(saved);
  } catch {
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

router.post('/email', requireScanOwner, async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: 'Prohibited fields' });
  const { sender, subject, body } = req.body ?? {};
  if (typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ error: 'Email body is required' });
  }

  try {
    const result = AnalysisEngine.analyzeEmail(sender || '', subject || '', body || '');
    const saved = await saveResult(result, req as GuestRequest);
    return res.json(saved);
  } catch {
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

router.post('/message', requireScanOwner, async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: 'Prohibited fields' });
  const { messageText, channel } = req.body ?? {};
  if (typeof messageText !== 'string' || !messageText.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  try {
    const result = AnalysisEngine.analyzeMessage(messageText || '', channel || '');
    const saved = await saveResult(result, req as GuestRequest);
    return res.json(saved);
  } catch {
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

router.post('/otp-situation', requireScanOwner, async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: 'Prohibited fields' });
  const { situationDescription, channel } = req.body ?? {};
  if (typeof situationDescription !== 'string' || !situationDescription.trim()) {
    return res.status(400).json({ error: 'Situation description is required' });
  }

  try {
    const result = AnalysisEngine.analyzeOtpSituation(situationDescription || '', channel || '');
    const saved = await saveResult(result, req as GuestRequest);
    return res.json(saved);
  } catch {
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

export { router };