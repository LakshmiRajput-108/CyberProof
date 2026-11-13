import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LEARN_ARTICLES = [
  {
    id: 'learn-phishing-101',
    title: 'How Phishing Works: Deception Behind Familiar Logos',
    category: 'Phishing',
    difficulty: 'Beginner',
    readTime: '4 min read',
    summary: 'Attackers do not hack into systems; they deceive people into handing over keys. Learn how psychological pressure and copycat designs are crafted.',
    content: [
      'Phishing relies on psychological urgency: a sudden warning about account closure, a frozen delivery package, or an unexpected tax refund.',
      'Attackers clone legitimate HTML templates and stylesheets to make pages look 1:1 identical to authentic portals.',
      'The critical vulnerability is always the domain: while the webpage looks authentic, the URL in your browser bar points to an unauthorized server.',
      'CyberProof analyzes identity and transport signals to expose the disconnect between a page\'s appearance and its true technical origin.'
    ],
    keyTakeaways: [
      'Visual appearance is easy to clone; domain ownership is not.',
      'Always inspect the actual domain, not the logo on the page.',
      'Urgency is the primary psychological trigger used to bypass critical thinking.'
    ]
  },
  {
    id: 'learn-qr-safety',
    title: 'QR Code Safety: Understanding "Quishing"',
    category: 'QR Safety',
    difficulty: 'Beginner',
    readTime: '3 min read',
    summary: 'QR codes are simply visual URLs. Learn how physical sticker replacements and masked redirects deceive mobile users.',
    content: [
      'Quick Response (QR) codes are convenient shortcuts that encode web links, contact cards, or payment requests.',
      'Because human eyes cannot decode the destination encoded in the black-and-white grid, malicious actors place physical stickers over legitimate restaurant or parking meter codes.',
      'When scanned on mobile phones with truncated address bars, users frequently miss subtle typos in the destination URL.',
      'Before scanning and immediately clicking "Open", inspect the destination domain with CyberProof.'
    ],
    keyTakeaways: [
      'Never scan QR codes placed as stickers over existing signage without inspecting the URL.',
      'Check the full preview URL before allowing your mobile browser to open it.',
      'Avoid entering payment information on unverified QR destinations.'
    ]
  },
  {
    id: 'learn-otp-safety',
    title: 'OTP Safety: The Golden Rule of One-Time Passwords',
    category: 'OTP Safety',
    difficulty: 'Beginner',
    readTime: '3 min read',
    summary: 'Why legitimate organizations will never call, text, or email asking you to recite or forward your OTP.',
    content: [
      'One-Time Passwords (OTPs) are dynamic two-factor verification codes meant exclusively for YOU to enter directly into the official service.',
      'Attackers often pose as customer support, fraud detection officers, or courier executives claiming they need the code to "cancel a fraudulent transaction".',
      'The moment you provide the OTP to someone else, they use it to finalize an account takeover or fund transfer on their end.',
      'CyberProof provides an OTP Situation Analyzer that evaluates high-pressure interaction scenarios without ever collecting your actual secret OTP.'
    ],
    keyTakeaways: [
      'Legitimate bank staff will NEVER ask you to tell them your OTP.',
      'Read the SMS text accompanying the code: it specifies what transaction is being authorized.',
      'If someone insists on getting an OTP over the phone, hang up immediately.'
    ]
  },
  {
    id: 'learn-url-anatomy',
    title: 'Anatomy of a URL: How to Spot Lookalike Domains',
    category: 'URLs',
    difficulty: 'Intermediate',
    readTime: '5 min read',
    summary: 'Subdomains, typosquatting, and top-level domain spoofing demystified for everyday browsing.',
    content: [
      'Understanding a URL begins from the right: the Root Domain and Top-Level Domain (TLD) dictate who actually controls the destination.',
      'For example, in "login.paypal.com.account-verify.xyz", the true host domain is "account-verify.xyz", NOT paypal.com.',
      'Attackers use hyphens, character swaps (such as "rn" instead of "m"), and obscure extensions (.top, .xyz, .click) to mislead hurried visitors.',
      'CyberProof evaluates domain structure, registrar reputation, and host age to separate real brand portals from clever imitations.'
    ],
    keyTakeaways: [
      'Find the first single slash "/" after "https://"; read backwards to identify the true domain.',
      'Beware of multiple subdomains chained together to hide the actual host.',
      'A green padlock simply means the connection is encrypted, not that the site owner is honest.'
    ]
  }
];

const THREAT_AWARENESS_TOPICS = [
  {
    id: 'threat-1',
    topic: 'Package Delivery SMS Phishing (Smishing)',
    status: 'Active Advisory',
    severity: 'high',
    lastUpdated: 'Updated 2 days ago',
    summary: 'Widespread text messages falsely claiming a parcel cannot be delivered due to an incorrect postal code or small unpaid customs fee (e.g. ₹25 or $1.99).',
    indicatorsToWatch: [
      'Urgent SMS warning of return within 12 hours',
      'Link using URL shortener or generic .top / .online domain',
      'Page requests credit card information for a tiny transaction'
    ],
    preventiveAction: 'Track parcel tracking numbers directly on official courier portals (e.g., India Post, FedEx, DHL, UPS) instead of clicking SMS links.'
  },
  {
    id: 'threat-2',
    topic: 'Fake Banking KYC & Utility Disconnection Threats',
    status: 'Active Advisory',
    severity: 'high',
    lastUpdated: 'Updated 4 days ago',
    summary: 'Automated messages claiming your electricity, SIM card, or bank account will be suspended tonight unless you call an unauthorized WhatsApp number or install an APK file.',
    indicatorsToWatch: [
      'Immediate threat of power/account shutdown within hours',
      'Personal cell phone number provided as the official contact',
      'Requests to install remote support apps (AnyDesk, TeamViewer) or unknown APKs'
    ],
    preventiveAction: 'Utility providers and scheduled banks never send personal mobile phone numbers for emergency KYC updates.'
  },
  {
    id: 'threat-3',
    topic: 'Seasonal Festive E-Commerce Deep Discount Clones',
    status: 'Observed Pattern',
    severity: 'medium',
    lastUpdated: 'Updated 1 week ago',
    summary: 'Social media advertisements advertising high-value electronics, watches, or apparel at 80-90% discounts on newly minted single-page web stores.',
    indicatorsToWatch: [
      'Unrealistically low prices on premium brand electronics',
      'Domain registered less than 30 days ago with no physical merchant contact',
      'Checkout demands upfront UPI / direct bank wire with no cash-on-delivery option'
    ],
    preventiveAction: 'Check domain age and customer review channels before sending money to unfamiliar web retailers.'
  }
];

async function main() {
  console.log('Seeding Learn Articles...');
  for (const article of LEARN_ARTICLES) {
    await prisma.learnArticle.upsert({
      where: { slug: article.id },
      update: {
        title: article.title,
        summary: article.summary,
        content: JSON.stringify({
          content: article.content,
          keyTakeaways: article.keyTakeaways
        }),
        category: article.category,
        difficulty: article.difficulty,
        readingTime: article.readTime,
      },
      create: {
        slug: article.id,
        title: article.title,
        summary: article.summary,
        content: JSON.stringify({
          content: article.content,
          keyTakeaways: article.keyTakeaways
        }),
        category: article.category,
        difficulty: article.difficulty,
        readingTime: article.readTime,
      }
    });
  }

  console.log('Seeding Threat Pulse...');
  for (const topic of THREAT_AWARENESS_TOPICS) {
    await prisma.threatPulse.upsert({
      where: { id: topic.id },
      update: {
        topic: topic.topic,
        summary: topic.summary,
        status: topic.status.includes('Educational') ? topic.status : `Educational: ${topic.status}`,
        indicatorsToWatch: JSON.stringify(topic.indicatorsToWatch),
        preventiveAction: topic.preventiveAction,
        lastUpdated: topic.lastUpdated
      },
      create: {
        id: topic.id,
        topic: topic.topic,
        summary: topic.summary,
        status: topic.status.includes('Educational') ? topic.status : `Educational: ${topic.status}`,
        indicatorsToWatch: JSON.stringify(topic.indicatorsToWatch),
        preventiveAction: topic.preventiveAction,
        lastUpdated: topic.lastUpdated
      }
    });
  }

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
