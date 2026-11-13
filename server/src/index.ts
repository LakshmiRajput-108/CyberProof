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
app.use("/api/analyze", analyzeRouter);
app.use("/api/scan", scanRouter);
app.use("/api/history", historyRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/caller", callerRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/learn", learnRouter);
app.use("/api/threat-pulse", threatPulseRouter);

app.post("/api/data/clear", async (req, res) => {
  try {
    await prisma.scan.deleteMany();
    await prisma.watchlistItem.deleteMany();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/data/reset", async (req, res) => {
  try {
    await prisma.scan.deleteMany();
    await prisma.watchlistItem.deleteMany();
    await prisma.incident.deleteMany();
    
    // Seed Learn Articles and Threat Pulse
    await prisma.learnArticle.deleteMany();
    await prisma.threatPulse.deleteMany();

    await prisma.learnArticle.createMany({
      data: [
        {
          title: "The Anatomy of a Modern Phishing Link",
          slug: "anatomy-of-modern-phishing",
          summary: "Phishing links have evolved beyond obvious misspellings. Learn how to spot homograph attacks, abused trusted services, and hidden redirects.",
          content: "Modern phishing relies on sophisticated deception. Attackers often use Internationalized Domain Names (IDNs) to substitute characters like 'a' with identical-looking Cyrillic characters (homograph attacks).\n\nAdditionally, they abuse legitimate services. A link might start with a trusted URL like `https://google.com/url?q=` or use legitimate cloud hosting platforms to evade initial detection.\n\n### How to Protect Yourself\n1. **Expand Short Links:** Never click a `bit.ly` or `tinyurl.com` link without expanding it first.\n2. **Check the SSL Certificate:** Ensure it belongs to the actual organization.\n3. **Use CyberProof:** Our engine decodes these redirects for you safely.",
          category: "Link Safety",
          difficulty: "Beginner",
          readingTime: "4 min read",
          status: "published"
        },
        {
          title: "Why OTPs Should Never Be Shared",
          slug: "otp-safety-principles",
          summary: "Understand the technical architecture of One-Time Passwords, why support staff will never need them, and how attackers use them to bypass 2FA.",
          content: "A One-Time Password (OTP) is a cryptographic token designed to verify that the person attempting an action is currently in possession of the registered device.\n\n### The Attack Scenario\nWhen a scammer calls you claiming your account is blocked, they are simultaneously trying to log in or transfer money. The service generates an OTP and sends it to *your* phone. The scammer cannot proceed without it.\n\n### The Golden Rule\n**No legitimate employee, bank official, or support agent will ever ask you to read an OTP to them.** They have internal systems for verification. If someone asks for an OTP, they are an attacker.",
          category: "Account Security",
          difficulty: "Essential",
          readingTime: "3 min read",
          status: "published"
        }
      ]
    });

    await prisma.threatPulse.createMany({
      data: [
        {
          topic: "Utility Bill Suspension Scams",
          summary: "Mass SMS campaigns threatening immediate electricity or water disconnection tonight if a small payment is not made.",
          status: "CRITICAL ALERT",
          lastUpdated: "2 hours ago",
          preventiveAction: "Ignore urgent disconnection SMS messages. Verify directly through your official state electricity board app or website.",
          indicatorsToWatch: JSON.stringify([
            "SMS received from a standard 10-digit mobile number instead of an official shortcode.",
            "Contains a link to a secondary WhatsApp chat or unfamiliar payment portal.",
            "Demands a very small 'processing fee' (e.g., ₹10 or $1)."
          ])
        },
        {
          topic: "Fake Courier Delivery Fees",
          summary: "Fraudulent messages impersonating national postal services or major couriers claiming a package is held due to unpaid customs.",
          status: "ACTIVE TREND",
          lastUpdated: "5 hours ago",
          preventiveAction: "Track packages only using tracking numbers you received at the time of purchase, directly on the official courier website.",
          indicatorsToWatch: JSON.stringify([
            "Generic links like 'india-post-tracking.update-info.com'.",
            "Requests for credit card details to pay a minor clearance fee.",
            "Message sent via iMessage from an iCloud email address."
          ])
        }
      ]
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Centralized Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke internally!" });
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
