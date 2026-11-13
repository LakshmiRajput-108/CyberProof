import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client";

const router = Router();

const WatchlistCreate = z.object({
  domain: z.string().min(1),
  target: z.string().default(''),
  current_risk: z.string().default('UNKNOWN'),
  notes: z.string().optional(),
});

router.get("/", async (req, res) => {
  try {
    const items = await prisma.watchlistItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parse = WatchlistCreate.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
    
    // Check if domain is already in watchlist
    const existing = await prisma.watchlistItem.findFirst({
        where: { domain: parse.data.domain }
    });
    
    if (existing) {
        return res.json(existing);
    }
    
    const item = await prisma.watchlistItem.create({ data: parse.data });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.watchlistItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
