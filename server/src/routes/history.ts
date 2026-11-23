import { Router } from "express";
import { prisma } from "../prisma/client";
import { requireAuth, AuthenticatedRequest } from "../middleware/authMiddleware";

const router = Router();

// GET /api/history - aggregated list per domain
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId!;

    const scans = await prisma.scan.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
    });

    const grouped: Record<string, any> = {};

    for (const s of scans) {
      if (!grouped[s.domain]) {
        grouped[s.domain] = {
          domain: s.domain,
          scans: [],
          currentRisk: s.risk_level,
          scanCount: 0,
        };
      }

      const responseScan = {
        ...s,
        why_flagged: JSON.parse(s.why_flagged),
        evidence: JSON.parse(s.evidence),
        recommended_actions: JSON.parse(s.recommended_actions),
      };

      grouped[s.domain].scans.push(responseScan);
      grouped[s.domain].scanCount++;
    }

    res.json(Object.values(grouped));
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/history/:domain - detailed scans for a domain
router.get("/:domain", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId!;
    const domain = String(req.params.domain);

    const scans = await prisma.scan.findMany({
      where: {
        domain,
        userId,
      },
      orderBy: { created_at: "desc" },
    });

    const responseScans = scans.map((s) => ({
      ...s,
      why_flagged: JSON.parse(s.why_flagged),
      evidence: JSON.parse(s.evidence),
      recommended_actions: JSON.parse(s.recommended_actions),
    }));

    res.json(responseScans);
  } catch (error) {
    console.error("Domain history fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };