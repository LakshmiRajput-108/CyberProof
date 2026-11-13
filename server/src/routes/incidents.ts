import { Router } from 'express';
import { prisma } from '../prisma/client';
import { containsForbiddenKeys } from '../schemas/scan';

const router = Router();

router.post('/', async (req, res) => {
  if (containsForbiddenKeys(req.body)) return res.status(400).json({ error: "Prohibited fields" });
  
  const { category, senderChannel, hasFinancialDemand, hasUrgencyDeadline, hasLinkOrPhone, brandMimicked, situationText, riskLevel, recommendations } = req.body;

  try {
    const incident = await prisma.incident.create({
      data: {
        category: category || 'unknown',
        senderChannel: senderChannel || 'unknown',
        hasFinancialDemand: !!hasFinancialDemand,
        hasUrgencyDeadline: !!hasUrgencyDeadline,
        hasLinkOrPhone: !!hasLinkOrPhone,
        brandMimicked,
        situationText,
        riskLevel: riskLevel || 'UNKNOWN',
        recommendations: JSON.stringify(recommendations || [])
      }
    });

    res.json({
      ...incident,
      recommendations: JSON.parse(incident.recommendations)
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({ orderBy: { created_at: 'desc' } });
    res.json(incidents.map((inc: any) => ({
      ...inc,
      recommendations: JSON.parse(inc.recommendations)
    })));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
