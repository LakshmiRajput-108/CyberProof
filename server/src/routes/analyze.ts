import { Router } from 'express';
import { AnalysisEngine } from '../services/analysisEngine';
import { prisma } from '../prisma/client';
import { containsForbiddenKeys } from '../schemas/scan';

const router = Router();

const saveResult = async (result: any) => {
  const scan = await prisma.scan.create({
    data: {
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

  return {
    ...scan,
    why_flagged: JSON.parse(scan.why_flagged),
    evidence: JSON.parse(scan.evidence),
    recommended_actions: JSON.parse(scan.recommended_actions),
  };
};

router.post('/url', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const result = AnalysisEngine.analyzeUrl(url);
    const saved = await saveResult(result);
    res.json(saved);
  } catch (e: any) {
    if (e.message && e.message.includes('permitted')) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Analysis failed" });
    }
  }
});

router.post('/qr', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  const { payloadText } = req.body;
  if (!payloadText) return res.status(400).json({ error: "payloadText is required" });

  try {
    const result = AnalysisEngine.analyzeQr(payloadText);
    const saved = await saveResult(result);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.post('/email', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  const { sender, subject, body } = req.body;
  
  try {
    const result = AnalysisEngine.analyzeEmail(sender || '', subject || '', body || '');
    const saved = await saveResult(result);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.post('/message', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  const { messageText, channel } = req.body;

  try {
    const result = AnalysisEngine.analyzeMessage(messageText || '', channel || '');
    const saved = await saveResult(result);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

router.post('/otp-situation', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  const { situationDescription, channel } = req.body;

  try {
    const result = AnalysisEngine.analyzeOtpSituation(situationDescription || '', channel || '');
    const saved = await saveResult(result);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

export { router };
