import { Router } from "express";
import { prisma } from "../prisma/client";
import { ScanPayloadSchema, containsForbiddenKeys } from "../schemas/scan";
import { requireAuth, AuthenticatedRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/:type", requireAuth, async (req, res) => {
  const { type } = req.params;
  const userId = (req as AuthenticatedRequest).userId!;

  if (containsForbiddenKeys(req.body)) {
    return res.status(400).json({ error: "Payload contains prohibited fields" });
  }

  const parse = ScanPayloadSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid payload", details: parse.error });
  }

  const now = new Date();

  try {
    const scan = await prisma.$transaction(async (transaction) => {
      const savedScan = await transaction.scan.create({
        data: {
          target: parse.data.target,
          domain: parse.data.domain,
          analysis_type: String(type),
          risk_level: parse.data.risk_level,
          summary: parse.data.summary,
          why_flagged: parse.data.why_flagged ? JSON.stringify(parse.data.why_flagged) : "{}",
          evidence: parse.data.evidence ? JSON.stringify(parse.data.evidence) : "[]",
          recommended_actions: parse.data.recommended_actions ? JSON.stringify(parse.data.recommended_actions) : "[]",
          created_at: now,
          is_demo: parse.data.is_demo,
          userId,
        },
      });

      const scanCount = await transaction.scan.count({
        where: {
          domain: { in: [
            parse.data.domain.toLowerCase().replace(/^www\./, ''),
            `www.${parse.data.domain.toLowerCase().replace(/^www\./, '')}`,
          ] },
          userId,
          guestSessionId: null,
        },
      });

      await transaction.watchlistItem.updateMany({
        where: {
          domain: parse.data.domain.toLowerCase().replace(/^www\./, ''),
          userId,
          guestSessionId: null,
        },
        data: {
          scan_count: scanCount,
          current_risk: parse.data.risk_level,
          last_checked: now,
        },
      });

      return savedScan;
    });

    const responseScan = {
      ...scan,
      why_flagged: JSON.parse(scan.why_flagged),
      evidence: JSON.parse(scan.evidence),
      recommended_actions: JSON.parse(scan.recommended_actions),
    };

    res.status(201).json(responseScan);
  } catch (error) {
    console.error("Scan create error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId!;
    const id = String(req.params.id);

    const scan = await prisma.scan.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!scan) {
      return res.status(404).json({ error: "Not found" });
    }

    const responseScan = {
      ...scan,
      why_flagged: JSON.parse(scan.why_flagged),
      evidence: JSON.parse(scan.evidence),
      recommended_actions: JSON.parse(scan.recommended_actions),
    };

    res.json(responseScan);
  } catch (error) {
    console.error("Scan fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };