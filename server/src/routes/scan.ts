import { Router } from "express";
import { prisma } from "../prisma/client";
import { ScanPayloadSchema, containsForbiddenKeys } from "../schemas/scan";

const router = Router();

router.post("/:type", async (req, res) => {
  const { type } = req.params;

  // Reject any suspicious keys
  if (containsForbiddenKeys(req.body)) {
    return res.status(400).json({ error: "Payload contains prohibited fields" });
  }

  const parse = ScanPayloadSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid payload", details: parse.error });
  }

  const now = new Date();
  
  try {
    const scan = await prisma.scan.create({
      data: {
        target: parse.data.target,
        domain: parse.data.domain,
        analysis_type: type,
        risk_level: parse.data.risk_level,
        summary: parse.data.summary,
        why_flagged: parse.data.why_flagged ? JSON.stringify(parse.data.why_flagged) : "{}",
        evidence: parse.data.evidence ? JSON.stringify(parse.data.evidence) : "[]",
        recommended_actions: parse.data.recommended_actions ? JSON.stringify(parse.data.recommended_actions) : "[]",
        created_at: now,
        is_demo: parse.data.is_demo,
      },
    });

    // Parse the JSON strings back for the response to match frontend expectations
    const responseScan = {
      ...scan,
      why_flagged: JSON.parse(scan.why_flagged),
      evidence: JSON.parse(scan.evidence),
      recommended_actions: JSON.parse(scan.recommended_actions),
    };

    res.json(responseScan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const scan = await prisma.scan.findUnique({ where: { id: req.params.id } });
    if (!scan) return res.status(404).json({ error: "Not found" });
    
    const responseScan = {
      ...scan,
      why_flagged: JSON.parse(scan.why_flagged),
      evidence: JSON.parse(scan.evidence),
      recommended_actions: JSON.parse(scan.recommended_actions),
    };
    
    res.json(responseScan);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
