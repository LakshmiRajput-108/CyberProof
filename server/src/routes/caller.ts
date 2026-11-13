import { Router } from 'express';

const router = Router();

router.post('/analyze', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer premium') {
    return res.status(403).json({ error: "Premium membership required to access caller guard analysis." });
  }

  const { transcript } = req.body;
  // Prototype logic: returns mock detection
  res.json({
    status: 'detected',
    indicator: 'Request for OTP',
    suggestion: 'Never share verification codes over a phone call.'
  });
});

export { router };
