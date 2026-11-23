import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as scanRouter } from "./routes/scan";
import { router as historyRouter } from "./routes/history";
import { router as watchlistRouter } from "./routes/watchlist";
import { router as callerRouter } from "./routes/caller";
import { router as analyzeRouter } from "./routes/analyze";
import { router as incidentsRouter } from "./routes/incidents";
import { router as authRouter } from "./routes/auth";
import { learnRouter, threatPulseRouter } from "./routes/content";
import { prisma } from "./prisma/client";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { requireAuth, AuthenticatedRequest } from "./middleware/authMiddleware";
import { router as guestRouter } from "./routes/guest";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/guest", guestRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/scan", scanRouter);
app.use("/api/history", historyRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/caller", callerRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/learn", learnRouter);
app.use("/api/threat-pulse", threatPulseRouter);

app.post("/api/data/clear", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Promise.all([
      prisma.scan.deleteMany({ where: { userId } }),
      prisma.watchlistItem.deleteMany({ where: { userId } }),
      prisma.incident.deleteMany({ where: { userId } }),
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.error("User data clear error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/data/reset", (_req, res) => {
  return res.status(403).json({
    error: "Global data reset is disabled."
  });
});
// Centralized Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke internally!" });
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
