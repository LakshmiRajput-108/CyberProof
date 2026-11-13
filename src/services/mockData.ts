import { Scan } from '../types/scan';
import { WatchlistItem } from '../types/watchlist';

export const INITIAL_DEMO_SCANS: Scan[] = [
  // 1. example.com - Current Scan (Low Risk)
  {
    id: 'scan-demo-ex-3',
    target: 'https://example.com',
    domain: 'example.com',
    analysis_type: 'url',
    risk_level: 'LOW',
    summary: 'No major security or deceptive indicators were identified in the available signals. The domain demonstrates an established operational history with standard security configurations.',
    why_flagged: {
      overview: 'Evaluated across 10 security, identity, and behavior signals. The domain is historically stable, verified under standard IANA management, and shows zero anomalous redirects or deceptive patterns.',
      checked: [
        'Domain registration age and historical stability',
        'TLS/HTTPS certificate validity and cipher suite',
        'HTTP security headers (HSTS, Content-Security-Policy)',
        'Known security issue and malware association databases',
        'Behavioral redirect path and target URL consistency',
        'Form input inspection for hidden credential fields'
      ],
      found: [
        'Domain active for over 25 years under authorized stewardship',
        'Valid TLS certificate issued by DigiCert with forward secrecy',
        'No malicious redirection chains detected',
        'Zero matches in public threat telemetry databases'
      ],
      unverified: [
        'Internal web application firewall (WAF) posture',
        'Real-time server-side database integrity'
      ],
      assessment_rationale: 'Because all core public identity, transport, and behavioral signals conform to established standards without anomalies, this interaction is assessed as Low Risk.'
    },
    evidence: [
      {
        id: 'ev-1',
        category: 'Identity',
        label: 'Domain Age & Stewardship',
        value: 'Established (> 25 years)',
        status: 'Verified',
        explanation: 'Domain was originally registered in 1995 and is managed for illustrative standard documentation.',
        importance: 'high'
      },
      {
        id: 'ev-2',
        category: 'Security',
        label: 'Transport Layer Security (TLS)',
        value: 'Valid TLS 1.3 / DigiCert',
        status: 'Verified',
        explanation: 'Strong cryptographic protocol in place. Certificate matches the exact hostname.',
        importance: 'high'
      },
      {
        id: 'ev-3',
        category: 'Security',
        label: 'Security Headers',
        value: 'HSTS Present',
        status: 'Verified',
        explanation: 'Strict-Transport-Security header forces encrypted connections and mitigates downgrade attacks.',
        importance: 'medium'
      },
      {
        id: 'ev-4',
        category: 'Behavior',
        label: 'Navigation & Redirects',
        value: 'Direct / 0 Redirects',
        status: 'Verified',
        explanation: 'The request landed directly on the requested origin with no intermediate routing jumps.',
        importance: 'medium'
      },
      {
        id: 'ev-5',
        category: 'Behavior',
        label: 'Form & Input Fields',
        value: 'Informational Only (No Forms)',
        status: 'Verified',
        explanation: 'The page contains no credential inputs, payment gateways, or executable script downloads.',
        importance: 'high'
      },
      {
        id: 'ev-6',
        category: 'Context',
        label: 'Public Incident Telemetry',
        value: 'Clean Reputation',
        status: 'Verified',
        explanation: 'No open security advisories, malicious blocklists, or phishing reports on record.',
        importance: 'high'
      },
      {
        id: 'ev-7',
        category: 'Context',
        label: 'Nameserver Configuration',
        value: 'Authoritative Root DNS',
        status: 'Verified',
        explanation: 'DNS infrastructure is hosted by redundant authoritative servers.',
        importance: 'low'
      }
    ],
    recommended_actions: [
      'Normal browsing is acceptable based on available signals.',
      'Always confirm you remain on the expected domain if following outbound links.',
      'Keep your browser updated to ensure latest TLS protocol compatibility.'
    ],
    created_at: '2026-09-21T10:30:00Z',
    is_demo: true
  },

  // 2. example.com - Second Scan (Historical - 02 Sep)
  {
    id: 'scan-demo-ex-2',
    target: 'https://example.com',
    domain: 'example.com',
    analysis_type: 'url',
    risk_level: 'MEDIUM',
    summary: 'Previous check identified a temporarily missing HTTP Strict Transport Security header and pending certificate rotation.',
    why_flagged: {
      overview: 'During this scan on 02 September, the transport layer was functional but lacked modern hardening headers.',
      checked: [
        'Domain registration history',
        'TLS certificate chain',
        'HTTP security headers'
      ],
      found: [
        'Certificate was nearing expiration (11 days remaining)',
        'HSTS header not served in response'
      ],
      unverified: [
        'DNSSEC status'
      ],
      assessment_rationale: 'Absence of mandatory HSTS during certificate renewal raised transport-level concerns.'
    },
    evidence: [
      {
        id: 'ev-old-1',
        category: 'Identity',
        label: 'Domain Age',
        value: 'Established (> 25 years)',
        status: 'Verified',
        explanation: 'Domain registered in 1995.',
        importance: 'high'
      },
      {
        id: 'ev-old-2',
        category: 'Security',
        label: 'TLS Expiration Warning',
        value: 'Expiring in 11 days',
        status: 'Observed',
        explanation: 'Certificate had not yet been renewed.',
        importance: 'medium'
      },
      {
        id: 'ev-old-3',
        category: 'Security',
        label: 'Security Headers',
        value: 'HSTS Missing',
        status: 'Observed',
        explanation: 'Strict-Transport-Security header was not detected.',
        importance: 'medium'
      },
      {
        id: 'ev-old-4',
        category: 'Behavior',
        label: 'Redirects',
        value: 'Direct',
        status: 'Verified',
        explanation: 'No unexpected redirects.',
        importance: 'low'
      }
    ],
    recommended_actions: [
      'Check if website updates its security certificates before entering credentials.'
    ],
    created_at: '2026-09-02T14:15:00Z',
    is_demo: true
  },

  // 3. example.com - First Scan (Historical - 12 Aug)
  {
    id: 'scan-demo-ex-1',
    target: 'https://example.com',
    domain: 'example.com',
    analysis_type: 'url',
    risk_level: 'MEDIUM',
    summary: 'First scan recorded for example.com. Baseline established with standard attributes.',
    why_flagged: {
      overview: 'First recorded scan in user security history.',
      checked: ['Domain history', 'Basic TLS', 'Content inspection'],
      found: ['Initial baseline recorded', 'Minor header flags'],
      unverified: ['Extended reputation data'],
      assessment_rationale: 'Initial scan baseline with missing headers warranted cautious Medium Risk.'
    },
    evidence: [
      {
        id: 'ev-first-1',
        category: 'Identity',
        label: 'Domain Registry',
        value: 'Verified IANA',
        status: 'Verified',
        explanation: 'Registered domain.',
        importance: 'high'
      },
      {
        id: 'ev-first-2',
        category: 'Security',
        label: 'HTTPS',
        value: 'Basic Encrypted',
        status: 'Observed',
        explanation: 'Standard encryption detected.',
        importance: 'medium'
      }
    ],
    recommended_actions: [
      'Re-scan periodically to track security improvements.'
    ],
    created_at: '2026-08-12T09:00:00Z',
    is_demo: true
  },

  // 4. secure-banking-portal-update.xyz - High Risk Phishing Simulation
  {
    id: 'scan-demo-phish-1',
    target: 'https://secure-banking-portal-update.xyz/login/verify',
    domain: 'secure-banking-portal-update.xyz',
    analysis_type: 'url',
    risk_level: 'HIGH',
    summary: 'Several available signals require caution. The domain was registered 3 days ago, mimics institutional banking terminology, and requests sensitive account credentials via an obfuscated form.',
    why_flagged: {
      overview: 'High risk indicators detected across Identity, Behavior, and Context signals. High probability of deceptive credential harvesting.',
      checked: [
        'Domain registration age and registrar details',
        'TLS certificate type and organization validation',
        'Form inputs and destination action URLs',
        'Domain brand similarity heuristics (Typosquatting/Homoglyph)',
        'Public phishing community telemetry'
      ],
      found: [
        'Domain registered only 3 days ago via privacy proxy',
        'Generic short-lived DV SSL certificate without organization identity',
        'Login form sends POST data to third-party unsecured script',
        'High similarity score with major international financial portal',
        'Domain uses urgent keywords ("secure", "banking", "portal", "update") to mislead'
      ],
      unverified: [
        'Underlying server geographic host ownership'
      ],
      assessment_rationale: 'Extreme divergence between claimed banking function and actual technical identity (3-day-old .xyz domain, credential exfiltration script). Evaluated as High Risk.'
    },
    evidence: [
      {
        id: 'ev-p1',
        category: 'Identity',
        label: 'Domain Registration Age',
        value: '3 Days Old (Registered Sep 18, 2026)',
        status: 'Observed',
        explanation: 'Newly registered domains carry significantly higher correlation with transient phishing campaigns.',
        importance: 'critical'
      },
      {
        id: 'ev-p2',
        category: 'Identity',
        label: 'Brand Mimicry Heuristic',
        value: 'Deceptive Keywords Detected',
        status: 'Observed',
        explanation: 'The domain combines keywords "secure", "banking", and "portal" without authentic institutional affiliation.',
        importance: 'critical'
      },
      {
        id: 'ev-p3',
        category: 'Security',
        label: 'Certificate Type',
        value: 'Automated DV (No Org Validation)',
        status: 'Observed',
        explanation: 'Free Domain-Validated certificate. Legitimate financial institutions utilize EV or OV organizational certificates.',
        importance: 'high'
      },
      {
        id: 'ev-p4',
        category: 'Behavior',
        label: 'Credential Submission Endpoint',
        value: 'Exfiltration Script Detected',
        status: 'Observed',
        explanation: 'The form action directs passwords to an off-domain server script rather than an authentic banking backend.',
        importance: 'critical'
      },
      {
        id: 'ev-p5',
        category: 'Context',
        label: 'Domain Reputation Telemetry',
        value: 'Flagged on 3 Community Feeds',
        status: 'Verified',
        explanation: 'Recent community submissions flag this exact link in SMS phishing waves.',
        importance: 'high'
      }
    ],
    recommended_actions: [
      'DO NOT enter any passwords, PINs, OTPs, or card numbers on this page.',
      'Close this tab immediately and avoid downloading any suggested files or updates.',
      'If you already entered information on this site, immediately contact your actual bank using the official phone number on the back of your card.',
      'Report the message or link to your telecom provider or email anti-spam filter.'
    ],
    created_at: '2026-09-20T16:45:00Z',
    is_demo: true
  },

  // 5. artisan-coffee-roasters.shop - Unknown / Insufficient Data
  {
    id: 'scan-demo-shop-1',
    target: 'https://artisan-coffee-roasters.shop',
    domain: 'artisan-coffee-roasters.shop',
    analysis_type: 'url',
    risk_level: 'UNKNOWN',
    summary: "CyberProof couldn't verify enough signals to provide a stronger assessment. While standard encryption is present, the domain has limited historical footprint.",
    why_flagged: {
      overview: 'Insufficient historical footprint and ambiguous identity signals. Neither malicious nor conclusively verified.',
      checked: [
        'Domain registration details',
        'TLS certificate validity',
        'Known threat intelligence databases',
        'Merchant identity and public business registrations'
      ],
      found: [
        'Domain registered 4 months ago',
        'Standard valid SSL certificate',
        'No malicious reports in threat databases',
        'E-commerce cart present'
      ],
      unverified: [
        'Merchant legal business registration',
        'Independent consumer review authenticity',
        'Return policy and physical address verification'
      ],
      assessment_rationale: 'Without sufficient reputation history or verified merchant credentials, an honest assessment cannot guarantee safety nor declare high threat. Marked as Unknown.'
    },
    evidence: [
      {
        id: 'ev-u1',
        category: 'Identity',
        label: 'Domain Age',
        value: '4 Months Old',
        status: 'Observed',
        explanation: 'Moderate age. Too new for mature reputation history, but not an immediate disposable domain.',
        importance: 'medium'
      },
      {
        id: 'ev-u2',
        category: 'Identity',
        label: 'Business Registration',
        value: 'Not Publicly Linked',
        status: 'Unable to Verify',
        explanation: 'Could not automatically cross-reference the site owner with public company registers.',
        importance: 'high'
      },
      {
        id: 'ev-u3',
        category: 'Security',
        label: 'SSL / TLS Encryption',
        value: 'Valid (Let\'s Encrypt)',
        status: 'Verified',
        explanation: 'Traffic between your browser and the server is encrypted.',
        importance: 'medium'
      },
      {
        id: 'ev-u4',
        category: 'Behavior',
        label: 'Payment Gateway Integration',
        value: 'Third-party Redirect (Stripe)',
        status: 'Observed',
        explanation: 'Payments appear routed through an external processor rather than captured locally.',
        importance: 'medium'
      },
      {
        id: 'ev-u5',
        category: 'Context',
        label: 'Reputation Telemetry',
        value: 'Insufficient Traffic Data',
        status: 'Unknown',
        explanation: 'The site receives modest traffic, leaving insufficient data for positive reputation scoring.',
        importance: 'medium'
      }
    ],
    recommended_actions: [
      'Exercise reasonable caution before making high-value purchases.',
      'Verify that the merchant provides a valid physical address and customer service phone number.',
      'Use protected payment methods (such as credit cards or buyer-protection services) rather than direct wire transfers.',
      'Check external consumer reviews on independent platforms.'
    ],
    created_at: '2026-09-19T11:20:00Z',
    is_demo: true
  }
];

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    domain: 'example.com',
    target: 'https://example.com',
    added_at: '2026-08-15T12:00:00Z',
    last_checked: '2026-09-21T10:30:00Z',
    current_risk: 'LOW',
    scan_count: 3,
    notes: 'Reference test domain for baseline documentation checks.',
    is_demo: true
  },
  {
    id: 'watch-2',
    domain: 'secure-banking-portal-update.xyz',
    target: 'https://secure-banking-portal-update.xyz/login/verify',
    added_at: '2026-09-20T17:00:00Z',
    last_checked: '2026-09-20T16:45:00Z',
    current_risk: 'HIGH',
    scan_count: 1,
    notes: 'Suspicious SMS link reported by family member.',
    is_demo: true
  },
  {
    id: 'watch-3',
    domain: 'artisan-coffee-roasters.shop',
    target: 'https://artisan-coffee-roasters.shop',
    added_at: '2026-09-19T14:00:00Z',
    last_checked: '2026-09-19T11:20:00Z',
    current_risk: 'UNKNOWN',
    scan_count: 1,
    notes: 'New boutique merchant checked before buying gifts.',
    is_demo: true
  }
];

export interface LearnArticle {
  id: string;
  title: string;
  category: 'Phishing' | 'QR Safety' | 'OTP Safety' | 'Shopping' | 'URLs' | 'Account Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export const LEARN_ARTICLES: LearnArticle[] = [
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
  ,{
    id: 'learn-digital-arrest',
    title: 'Digital Arrest Scams: When Fear Becomes the Weapon',
    category: 'Account Security',
    difficulty: 'Beginner',
    readTime: '4 min read',
    summary: 'Understand fake police, court or agency calls that use threats, video calls and isolation to pressure victims into paying money.',
    content: [
      'A digital arrest scam begins with impersonation: a caller may claim to be police, a court, a courier company or another authority.',
      'The scammer creates urgency and fear, then keeps the victim engaged so they do not independently verify the story.',
      'Requests for money, remote access, banking credentials or secrecy are major warning signs.',
      'If a caller claims you are under investigation, stop the conversation and verify the matter through an independently found official channel.'
    ],
    keyTakeaways: [
      'Real authorities do not make you pay money to cancel an arrest through a video call.',
      'Do not install remote-access software because an unexpected caller tells you to.',
      'End the call and verify independently before taking any action.'
    ]
  },
  {
    id: 'learn-upi-fraud',
    title: 'UPI & Payment Request Scams',
    category: 'Account Security',
    difficulty: 'Beginner',
    readTime: '4 min read',
    summary: 'Learn why receiving money and sending money are different actions—and how fake refund and collect requests exploit that confusion.',
    content: [
      'A payment scam may arrive as a fake refund, prize, buyer request, customer-care conversation or collect-payment request.',
      'A UPI PIN is used to authorize certain payments; it should never be entered just to receive money.',
      'Scammers may use screenshots or fake success messages to create pressure before a real transaction is completed.',
      'Always open your banking or payment app yourself and verify the transaction details before approving anything.'
    ],
    keyTakeaways: [
      'Never share your UPI PIN or OTP with another person.',
      'Do not approve an unexpected collect/payment request.',
      'Verify refunds and support contacts through official channels.'
    ]
  },
  {
    id: 'learn-job-scam',
    title: 'Fake Job & Work-from-Home Scams',
    category: 'Account Security',
    difficulty: 'Intermediate',
    readTime: '4 min read',
    summary: 'Spot recruitment scams that ask for registration fees, deposits, personal documents or payments before a real job exists.',
    content: [
      'Fake recruiters often promise unusually high income, instant selection or simple tasks with guaranteed returns.',
      'A request for an upfront fee, wallet top-up or payment to unlock earnings is a strong warning sign.',
      'Scammers can also copy real company names and logos, so the appearance of a recruitment message is not proof of authenticity.',
      'Verify the vacancy on the company’s official careers page and use independently obtained contact details.'
    ],
    keyTakeaways: [
      'Do not pay to get a job or to unlock supposed earnings.',
      'Check the vacancy on the employer’s official website.',
      'Treat pressure to act immediately as a reason to slow down.'
    ]
  },
  {
    id: 'learn-ai-deepfake',
    title: 'AI Voice & Deepfake Impersonation',
    category: 'Account Security',
    difficulty: 'Intermediate',
    readTime: '5 min read',
    summary: 'Learn how cloned voices, edited video and familiar identities can be used to make urgent requests appear believable.',
    content: [
      'AI-generated audio and video can imitate familiar voices or faces, making a message feel personally convincing.',
      'The strongest defense is not trying to detect every deepfake visually; it is independently verifying the request.',
      'For money or sensitive information, call the person back using a number you already know or another trusted channel.',
      'Create a family verification phrase or another simple process for unexpected emergency requests.'
    ],
    keyTakeaways: [
      'A familiar voice is not proof that the caller is genuine.',
      'Verify urgent financial requests through a second channel.',
      'Do not let emotional pressure replace verification.'
    ]
  }

];

export interface ThreatAwarenessTopic {
  id: string;
  topic: string;
  status: 'Active Advisory' | 'Observed Pattern' | 'Seasonal Wave';
  severity: 'high' | 'medium' | 'low';
  lastUpdated: string;
  summary: string;
  indicatorsToWatch: string[];
  preventiveAction: string;
}

export const THREAT_AWARENESS_TOPICS: ThreatAwarenessTopic[] = [
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
    id: 'threat-4',
    topic: 'Digital Arrest & Fake Police Video Calls',
    status: 'Active Advisory',
    severity: 'high',
    lastUpdated: 'Current awareness briefing',
    summary: 'Impersonators may claim that a person is linked to a crime, courier case or investigation and use threats, video calls and isolation to demand money or sensitive information.',
    indicatorsToWatch: [
      'Caller claims you are under investigation and must stay on the call',
      'Demand for money, account details, OTPs or remote-access software',
      'Instructions to keep the conversation secret from family or colleagues'
    ],
    preventiveAction: 'End the call, contact the alleged organization through an independently verified official channel, and involve a trusted person before taking financial action.'
  },
  {
    id: 'threat-5',
    topic: 'AI Voice & Family Emergency Impersonation',
    status: 'Observed Pattern',
    severity: 'medium',
    lastUpdated: 'Current awareness briefing',
    summary: 'A scammer may imitate a family member or familiar person and create an urgent story involving an accident, police matter, travel problem or immediate payment.',
    indicatorsToWatch: [
      'Unexpected urgent request for money or secrecy',
      'Caller avoids normal verification or asks you not to call back',
      'Payment instructions change quickly during the conversation'
    ],
    preventiveAction: 'Verify the person through a known number or second trusted channel before sending money, even when the voice sounds familiar.'
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
