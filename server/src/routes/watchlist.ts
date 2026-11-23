
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client";
import {
  requireScanOwner,
  GuestRequest,
} from "../middleware/guestSessionMiddleware";

const router = Router();

const WatchlistCreate = z.object({
  domain: z.string().trim().min(1).max(255),
  target: z.string().default(""),
  current_risk: z.string().default("UNKNOWN"),
  scan_count: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

// Each request is scoped to exactly one member or guest session.
const getOwnerWhere = (req: GuestRequest) => {
  if (req.userId) {
    return {
      userId: req.userId,
      guestSessionId: null,
    };
  }

  return {
    userId: null,
    guestSessionId: req.guestSessionId!,
  };
};

router.get("/", requireScanOwner, async (req, res) => {
  try {
    const ownerWhere = getOwnerWhere(req as GuestRequest);

    const items = await prisma.watchlistItem.findMany({
      where: ownerWhere,
      orderBy: { added_at: "desc" },
    });

    return res.json(items);
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireScanOwner, async (req, res) => {
  try {
    const ownerWhere = getOwnerWhere(req as GuestRequest);
    const parsed = WatchlistCreate.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const domain = parsed.data.domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .split("/")[0];

    const scanCount = await prisma.scan.count({
      where: {
        ...ownerWhere,
        domain: { in: [domain, `www.${domain}`] },
      },
    });

    const existing = await prisma.watchlistItem.findFirst({
      where: {
        ...ownerWhere,
        domain,
      },
    });

    if (existing) {
      const updated = await prisma.watchlistItem.update({
        where: { id: existing.id },
        data: {
          target: parsed.data.target,
          current_risk: parsed.data.current_risk,
          scan_count: scanCount,
          last_checked: new Date(),
          notes: parsed.data.notes,
        },
      });

      return res.json(updated);
    }

    const item = await prisma.watchlistItem.create({
      data: {
        ...parsed.data,
        domain,
        scan_count: scanCount,
        ...ownerWhere,
      },
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("Watchlist create error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireScanOwner, async (req, res) => {
  try {
    const ownerWhere = getOwnerWhere(req as GuestRequest);

    const result = await prisma.watchlistItem.deleteMany({
      where: {
        id: String(req.params.id),
        ...ownerWhere,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "Watchlist item not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Watchlist delete error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
