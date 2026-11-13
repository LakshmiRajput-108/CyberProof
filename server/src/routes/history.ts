import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

// GET /api/history – aggregated list per domain
router.get("/", async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({ orderBy: { created_at: "desc" } });
    const grouped: Record<string, any> = {};
    for (const s of scans) {
      if (!grouped[s.domain]) {
        grouped[s.domain] = { domain: s.domain, scans: [], currentRisk: s.risk_level, scanCount: 0 };
      }
      const responseScan = {
        ...s,
        why_flagged: JSON.parse(s.why_flagged),
        evidence: JSON.parse(s.evidence),
        recommended_actions: JSON.parse(s.recommended_actions),
      };
      grouped[s.domain].scans.push(responseScan);
      grouped[s.domain].scanCount++;
      // It assumes the first seen in desc order is the current risk
    }
    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/history/:domain – detailed scans for a domain
router.get("/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;
    const scans = await prisma.scan.findMany({ where: { domain }, orderBy: { created_at: "desc" } });
    const responseScans = scans.map((s: any) => ({
      ...s,
      why_flagged: JSON.parse(s.why_flagged),
      evidence: JSON.parse(s.evidence),
      recommended_actions: JSON.parse(s.recommended_actions),
    }));
    res.json(responseScans);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
