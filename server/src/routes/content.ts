import { Router } from 'express';
import { prisma } from '../prisma/client';

export const learnRouter = Router();
export const threatPulseRouter = Router();

learnRouter.get('/', async (req, res) => {
  try {
    const articles = await prisma.learnArticle.findMany({ orderBy: { publishedAt: 'desc' } });
    res.json(articles.map(a => {
      let parsed = { content: [a.content], keyTakeaways: [] as string[] };
      try {
        parsed = JSON.parse(a.content);
      } catch (e) {
        // Fallback if not JSON
      }
      return {
        id: a.slug,
        title: a.title,
        category: a.category,
        difficulty: a.difficulty,
        readTime: a.readingTime,
        summary: a.summary,
        content: parsed.content,
        keyTakeaways: parsed.keyTakeaways
      };
    }));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

learnRouter.get('/:slug', async (req, res) => {
  try {
    const article = await prisma.learnArticle.findUnique({ where: { slug: req.params.slug } });
    if (!article) return res.status(404).json({ error: "Not found" });
    
    let parsed = { content: [article.content], keyTakeaways: [] as string[] };
    try {
      parsed = JSON.parse(article.content);
    } catch (e) {}

    res.json({
      id: article.slug,
      title: article.title,
      category: article.category,
      difficulty: article.difficulty,
      readTime: article.readingTime,
      summary: article.summary,
      content: parsed.content,
      keyTakeaways: parsed.keyTakeaways
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

threatPulseRouter.get('/', async (req, res) => {
  try {
    const topics = await prisma.threatPulse.findMany({ orderBy: { lastUpdated: 'desc' } });
    res.json(topics.map((t: any) => ({
      id: t.id,
      topic: t.topic,
      summary: t.summary,
      status: t.status,
      preventiveAction: t.preventiveAction,
      lastUpdated: t.lastUpdated,
      indicatorsToWatch: JSON.parse(t.indicatorsToWatch)
    })));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
