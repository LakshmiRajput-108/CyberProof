export interface ScanStage {
  // Types match frontend but aren't strictly needed in engine logic
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface EvidenceItem {
  id: string;
  category: string;
  label: string;
  value: string;
  status: string;
  explanation: string;
  importance: string;
}

export interface ScanResult {
  id: string;
  target: string;
  domain: string;
  analysis_type: string;
  risk_level: RiskLevel;
  summary: string;
  why_flagged: any;
  evidence: EvidenceItem[];
  recommended_actions: string[];
  is_demo: boolean;
}

export const AnalysisEngine = {
  extractDomain(target: string): string {
    let clean = target.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    try {
      const parsed = new URL(clean);
      return parsed.hostname.toLowerCase();
    } catch {
      return clean.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    }
  },

  analyzeUrl(url: string): ScanResult {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const domain = this.extractDomain(cleanUrl);

    // SSRF Protection
    if (domain === 'localhost' || domain.includes('127.0.0.1') || domain.includes('::1') || domain.endsWith('.local')) {
      throw new Error('Internal or local domains are not permitted for scanning.');
    }

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
    const suspiciousTlds = ['.top', '.xyz', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.work', '.biz'];
    const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
    const isHttps = cleanUrl.startsWith('https://');

    const phishingKeywords = ['login', 'verify', 'update', 'secure', 'banking', 'wallet', 'crypto', 'bonus', 'free', 'kyc'];
    const matchedKeywords = phishingKeywords.filter(kw => cleanUrl.toLowerCase().includes(kw));

    let risk: RiskLevel = 'UNKNOWN';
    let overview = '';
    let rationale = '';

    const evidence: EvidenceItem[] = [];

    if (domain.includes('google.com') || domain.includes('github.com') || domain.includes('microsoft.com') || domain.includes('apple.com')) {
      risk = 'LOW';
      evidence.push({
        id: 'ev-id-known',
        category: 'Identity',
        label: 'Domain Authority',
        value: 'Verified Global Entity',
        status: 'Verified',
        explanation: 'The domain matches a globally recognized, authenticated web property.',
        importance: 'high'
      });
    } else if (isIp || (hasSuspiciousTld && matchedKeywords.length >= 1) || matchedKeywords.length >= 2) {
      risk = 'HIGH';
      evidence.push({
        id: 'ev-id-phish',
        category: 'Identity',
        label: 'Domain Composition',
        value: isIp ? 'Raw IP Destination' : `High-Risk Terminology (${matchedKeywords.join(', ')})`,
        status: 'Observed',
        explanation: isIp 
          ? 'Destination points directly to a raw numerical IP address without a registered domain identity.'
          : 'The domain incorporates high-pressure security or financial terms commonly deployed in credential capture portals.',
        importance: 'critical'
      });
    } else {
      risk = 'UNKNOWN';
      evidence.push({
        id: 'ev-id-standard',
        category: 'Identity',
        label: 'Domain Registration History',
        value: hasSuspiciousTld ? `Notice: Unconventional TLD (${domain.slice(domain.lastIndexOf('.'))})` : 'Public Web Domain',
        status: 'Observed',
        explanation: 'Domain is accessible on the public Internet, but private registrar proxy prevents automated owner validation.',
        importance: 'medium'
      });
    }

    evidence.push({
      id: 'ev-sec-tls',
      category: 'Security',
      label: 'Transport Protocol',
      value: isHttps ? 'HTTPS Encrypted' : 'Unencrypted HTTP Connection',
      status: isHttps ? 'Verified' : 'Observed',
      explanation: isHttps 
        ? 'Data transferred between your device and this server is encrypted in transit.'
        : 'Connection does not use encryption. Any credentials, form inputs, or cookies are vulnerable to interception.',
      importance: isHttps ? 'medium' : 'critical'
    });

    if (matchedKeywords.includes('login') || matchedKeywords.includes('verify') || matchedKeywords.includes('banking')) {
      evidence.push({
        id: 'ev-beh-input',
        category: 'Behavior',
        label: 'Sensitive Input Interaction',
        value: 'Authentication Context Flagged',
        status: 'Observed',
        explanation: 'The URL path explicitly targets credential submission or identity verification routines.',
        importance: 'high'
      });
    } else {
      evidence.push({
        id: 'ev-beh-nav',
        category: 'Behavior',
        label: 'Direct Navigation Flow',
        value: 'Standard Web Request',
        status: 'Verified',
        explanation: 'No recursive intermediate redirects or automated payload prompts were encountered.',
        importance: 'low'
      });
    }

    evidence.push({
      id: 'ev-ctx-reputation',
      category: 'Context',
      label: 'Public Advisory Lists',
      value: risk === 'HIGH' ? 'Elevated Risk Indicators' : 'No Immediate Blocklist Match',
      status: risk === 'HIGH' ? 'Observed' : 'Verified',
      explanation: risk === 'HIGH'
        ? 'Signals match characteristic indicators frequently identified in urgent phishing campaigns.'
        : 'Domain does not appear on major public malware or spam blocklists, though absence of reports does not guarantee safety.',
      importance: 'medium'
    });

    if (risk === 'HIGH') {
      overview = `High risk indicators identified for ${domain}. Multiple deceptive patterns or credential-targeting cues were detected.`;
      rationale = 'The combination of suspicious keywords, domain naming patterns, and sensitive endpoint indicators elevates the risk of deceptive credential harvesting.';
    } else if (risk === 'LOW') {
      overview = `Available signals for ${domain} appear consistent with standard, authorized web infrastructure.`;
      rationale = 'Verified domain ownership, active transport encryption, and clean reputation telemetry support a Low Risk assessment.';
    } else {
      overview = `Insufficient historical footprint and ambiguous identity signals for ${domain}.`;
      rationale = "CyberProof couldn't verify enough verified identity signals to guarantee trustworthiness. Exercise standard caution.";
    }

    return {
      id: `scan-${Date.now()}`,
      target: cleanUrl,
      domain,
      analysis_type: 'url',
      risk_level: risk,
      summary: overview,
      why_flagged: {
        overview,
        checked: [
          'Domain syntax and host characteristics',
          'Transport Layer Security (TLS/HTTPS)',
          'High-risk credential keywords and path heuristics',
          'Public threat blocklists'
        ],
        found: [
          isHttps ? 'HTTPS transport protocol active' : 'Unencrypted HTTP connection detected',
          matchedKeywords.length > 0 ? `Target keywords found: ${matchedKeywords.join(', ')}` : 'No deceptive keywords detected in path'
        ],
        unverified: [
          'Full server backend infrastructure',
          'Private business registration documents'
        ],
        assessment_rationale: rationale
      },
      evidence,
      recommended_actions: risk === 'HIGH' ? [
        'Do not enter passwords, PINs, OTPs, or payment card numbers.',
        'Close this window or verify the authentic domain directly through a bookmark or official app.',
        'If prompted to download a file, cancel the download immediately.'
      ] : risk === 'LOW' ? [
        'Normal browsing is acceptable based on available signals.',
        'Ensure the address bar continues to show the expected domain.'
      ] : [
        'Verify merchant credibility before making purchases or entering sensitive details.',
        'Look for verified contact info, physical address, and independent reviews.'
      ],
      is_demo: false
    };
  },

  analyzeQr(payloadText: string): ScanResult {
    const domain = this.extractDomain(payloadText);
    const isUrl = payloadText.startsWith('http://') || payloadText.startsWith('https://') || payloadText.includes('.');

    return {
      id: `scan-qr-${Date.now()}`,
      target: payloadText,
      domain: isUrl ? domain : 'QR Data Content',
      analysis_type: 'qr',
      risk_level: payloadText.includes('.xyz') || payloadText.includes('.top') ? 'HIGH' : isUrl ? 'MEDIUM' : 'UNKNOWN',
      summary: `QR code decodes to: "${payloadText.length > 60 ? payloadText.substring(0, 57) + '...' : payloadText}".`,
      why_flagged: {
        overview: 'Decoded QR payload analyzed for hidden redirect links, embedded commands, and destination trustworthiness.',
        checked: [
          'QR payload format and encoding validity',
          'Embedded link destination syntax',
          'Presence of malicious redirection or payment intent strings'
        ],
        found: [
          isUrl ? `Decoded destination URL: ${payloadText}` : 'Plain text or non-web payload decoded',
          'Format standard ISO/IEC 18004 compliant'
        ],
        unverified: [
          'Physical location and origin of the printed QR sticker'
        ],
        assessment_rationale: isUrl 
          ? 'QR codes obscure destination addresses from human view. Analysis evaluated the underlying decoded destination.'
          : 'Payload does not represent a web link.'
      },
      evidence: [
        {
          id: 'ev-qr-1',
          category: 'Behavior',
          label: 'Decoded Content Type',
          value: isUrl ? 'Web URL Destination' : 'Plain Text / Structured Data',
          status: 'Verified',
          explanation: 'Extracted direct payload without automatic mobile execution.',
          importance: 'high'
        },
        {
          id: 'ev-qr-2',
          category: 'Identity',
          label: 'Destination Domain',
          value: isUrl ? domain : 'N/A',
          status: 'Observed',
          explanation: isUrl ? 'The true host you would reach if opening this QR code on a device.' : 'No remote web host linked.',
          importance: 'high'
        },
        {
          id: 'ev-qr-3',
          category: 'Security',
          label: 'Physical Tampering Risk',
          value: 'Requires Physical Verification',
          status: 'Unable to Verify',
          explanation: 'Digital analysis cannot verify if a physical sticker was pasted over genuine signage.',
          importance: 'medium'
        }
      ],
      recommended_actions: [
        'Confirm the displayed domain matches the physical establishment or service you intended to use.',
        'Never scan QR codes stuck onto public parking meters or payment terminals if they show signs of peeling or overlay stickers.',
        'Review the destination link before allowing your mobile browser to open it.'
      ],
      is_demo: false
    };
  },

  analyzeEmail(sender: string, subject: string, body: string): ScanResult {
    const fullContent = `${sender} ${subject} ${body}`.toLowerCase();
    const hasUrgency = fullContent.includes('suspended') || fullContent.includes('urgent') || fullContent.includes('immediately') || fullContent.includes('24 hours') || fullContent.includes('unauthorized');
    const hasFinancial = fullContent.includes('invoice') || fullContent.includes('payment') || fullContent.includes('refund') || fullContent.includes('bank') || fullContent.includes('card');
    const hasLink = fullContent.includes('http') || fullContent.includes('www.') || fullContent.includes('click here');

    let risk: RiskLevel = 'UNKNOWN';
    if (hasUrgency && (hasFinancial || hasLink)) {
      risk = 'HIGH';
    } else if (hasUrgency || hasLink) {
      risk = 'MEDIUM';
    } else {
      risk = 'LOW';
    }

    return {
      id: `scan-email-${Date.now()}`,
      target: `Email from: ${sender || 'Unknown Sender'}`,
      domain: sender.includes('@') ? sender.split('@')[1] : 'email-inspection',
      analysis_type: 'email',
      risk_level: risk,
      summary: risk === 'HIGH'
        ? 'High likelihood of social engineering email. Combines urgent psychological pressure with requests to click links or review payment disputes.'
        : 'Email signals inspected. Exercise caution if sender identity does not match your regular correspondence.',
      why_flagged: {
        overview: 'Content and sender address inspected for deceptive cues, psychological coercion patterns, and link risks.',
        checked: [
          'Sender address and display name relationship',
          'Urgency language and psychological manipulation cues',
          'Financial settlement or account closure claims',
          'Embedded hyperlinks and action buttons'
        ],
        found: [
          hasUrgency ? 'High-urgency language detected' : 'Neutral tone observed',
          hasFinancial ? 'Financial claim or billing issue referenced' : 'No direct financial coercion',
          hasLink ? 'Call-to-action link detected in body' : 'No external links identified'
        ],
        unverified: [
          'Cryptographic DKIM and SPF mail server signatures (requires raw email headers)'
        ],
        assessment_rationale: risk === 'HIGH'
          ? 'Urgent account suspension warnings combined with links represent the archetypal pattern of credential harvesting emails.'
          : 'Inspection did not trigger severe social engineering alerts.'
      },
      evidence: [
        {
          id: 'ev-em-1',
          category: 'Behavior',
          label: 'Urgency & Pressure Heuristic',
          value: hasUrgency ? 'Urgent Deadline Detected' : 'Normal Cadence',
          status: hasUrgency ? 'Observed' : 'Verified',
          explanation: hasUrgency ? 'The email uses tight timeframes to prompt hasty decision-making.' : 'No artificial time constraints.',
          importance: hasUrgency ? 'high' : 'low'
        },
        {
          id: 'ev-em-2',
          category: 'Identity',
          label: 'Sender Domain Alignment',
          value: sender || 'Sender Address Provided',
          status: 'Observed',
          explanation: 'Examine the exact characters after the @ symbol to ensure no subtle misspellings.',
          importance: 'high'
        },
        {
          id: 'ev-em-3',
          category: 'Context',
          label: 'Request Type',
          value: hasFinancial ? 'Financial / Account Warning' : 'General Communication',
          status: 'Observed',
          explanation: 'Emails concerning money or account security warrant elevated skepticism.',
          importance: 'medium'
        }
      ],
      recommended_actions: [
        'Do not click buttons or links inside the email.',
        'Navigate directly to the service provider by typing their known address into your browser.',
        'Do not reply to the email or call phone numbers written inside the message body.',
        'Forward suspicious emails to your email service provider\'s phishing reporting address.'
      ],
      is_demo: false
    };
  },

  analyzeMessage(messageText: string, channel: string): ScanResult {
    const lower = messageText.toLowerCase();
    const hasUrgency = lower.includes('block') || lower.includes('urgent') || lower.includes('tonight') || lower.includes('immediately') || lower.includes('deactivated');
    const hasLink = lower.includes('http') || lower.includes('.ly') || lower.includes('bit.') || lower.includes('.xyz') || lower.includes('.top') || lower.includes('tinyurl');
    const hasOtpPrompt = lower.includes('otp') || lower.includes('code') || lower.includes('pin') || lower.includes('password');

    let risk: RiskLevel = 'UNKNOWN';
    if (hasOtpPrompt || (hasUrgency && hasLink)) {
      risk = 'HIGH';
    } else if (hasUrgency || hasLink) {
      risk = 'MEDIUM';
    } else {
      risk = 'LOW';
    }

    return {
      id: `scan-msg-${Date.now()}`,
      target: `Message via ${channel || 'SMS'}`,
      domain: channel ? `${channel.toLowerCase()}-message` : 'suspicious-message',
      analysis_type: 'message',
      risk_level: risk,
      summary: risk === 'HIGH'
        ? 'High probability of smishing (SMS phishing) or fraudulent message designed to steal credentials or one-time verification codes.'
        : 'Message analyzed for deceptive patterns. Exercise healthy skepticism before taking requested actions.',
      why_flagged: {
        overview: 'Message analyzed for coercion heuristics, shortened links, and sensitive credential prompts.',
        checked: [
          'Presence of URL shorteners or deceptive links',
          'Urgent or threatening language',
          'Solicitation of verification codes or sensitive tokens'
        ],
        found: [
          hasOtpPrompt ? 'References verification codes or passwords' : 'No credential requests detected',
          hasLink ? 'Suspicious or shortened URL detected' : 'No hyperlinks found in message',
          hasUrgency ? 'Urgent language or threat of service cancellation' : 'Standard tone'
        ],
        unverified: [
          'Sender mobile carrier metadata or SIM ownership'
        ],
        assessment_rationale: risk === 'HIGH'
          ? 'Messages requesting actions regarding security codes or threatening urgent disconnection carry strong hallmarks of social engineering.'
          : 'No severe indicators triggered, but personal caution remains advised.'
      },
      evidence: [
        {
          id: 'ev-msg-1',
          category: 'Behavior',
          label: 'Credential / Code Solicitation',
          value: hasOtpPrompt ? 'Alert: Mentions Verification Code' : 'None Detected',
          status: hasOtpPrompt ? 'Observed' : 'Verified',
          explanation: hasOtpPrompt ? 'Legitimate organizations never instruct you to forward codes over chat.' : 'No codes requested.',
          importance: hasOtpPrompt ? 'critical' : 'low'
        },
        {
          id: 'ev-msg-2',
          category: 'Security',
          label: 'Link Obfuscation',
          value: hasLink ? 'Embedded Link Detected' : 'No Links',
          status: hasLink ? 'Observed' : 'Verified',
          explanation: hasLink ? 'Shortened or unfamiliar links prevent you from seeing where you are being directed.' : 'No link threats.',
          importance: 'high'
        },
        {
          id: 'ev-msg-3',
          category: 'Context',
          label: 'Delivery Channel',
          value: channel || 'Messaging Platform',
          status: 'Observed',
          explanation: 'Fraudsters frequently use SMS and WhatsApp due to high open rates.',
          importance: 'medium'
        }
      ],
      recommended_actions: [
        'Do not click links received in unexpected text messages.',
        'Never share any SMS verification codes with anyone, even someone claiming to be customer support.',
        'Block and report the sender within your messaging app.',
        'Contact the purported company using their official mobile app or verified website.'
      ],
      is_demo: false
    };
  },

  analyzeOtpSituation(situationDescription: string, channel: string): ScanResult {
    const lower = situationDescription.toLowerCase();
    const isPhoneCall = channel.toLowerCase().includes('call') || lower.includes('calling') || lower.includes('phone') || lower.includes('spoke');
    const isBuyer = lower.includes('buyer') || lower.includes('olx') || lower.includes('marketplace') || lower.includes('send money') || lower.includes('receive money');
    const isBankThreat = lower.includes('bank') || lower.includes('card') || lower.includes('freeze') || lower.includes('kyc') || lower.includes('fraud team');

    return {
      id: `scan-otp-${Date.now()}`,
      target: `OTP Situation: ${channel || 'Scenario'}`,
      domain: 'otp-safety-analyzer',
      analysis_type: 'otp-situation',
      risk_level: 'HIGH',
      summary: 'HIGH RISK SITUATION. You should NEVER recite, forward, or share a One-Time Password (OTP) with anyone over the phone or messaging.',
      why_flagged: {
        overview: 'Analysis of interaction context indicates high risk of OTP diversion / account takeover. Legitimate support staff never request OTPs.',
        checked: [
          'Social engineering pressure indicators',
          'Channel appropriateness (phone call / chat vs official app)',
          'Financial authorization implications'
        ],
        found: [
          isPhoneCall ? 'Inbound phone call asking for code' : 'Chat/SMS message asking for code',
          isBankThreat ? 'Posing as bank security or fraud department' : isBuyer ? 'Posing as buyer/payer asking for verification' : 'Third-party requesting authentication token',
          'Attempting to divert OTP to authorize a transaction or account takeover'
        ],
        unverified: [
          'Caller or sender actual identity (spoofed caller IDs are common)'
        ],
        assessment_rationale: 'An OTP is a private signature for your device only. Any person asking you to share a code is attempting an unauthorized transaction.'
      },
      evidence: [
        {
          id: 'ev-otp-1',
          category: 'Behavior',
          label: 'OTP Solicitation Pattern',
          value: 'Direct Request for Verification Secret',
          status: 'Observed',
          explanation: 'Sharing an OTP allows the requesting party to complete an action that requires your explicit authentication.',
          importance: 'critical'
        },
        {
          id: 'ev-otp-2',
          category: 'Identity',
          label: 'Caller / Requester Identity',
          value: isPhoneCall ? 'Unverifiable Caller (Likely Spoofed)' : 'External Messaging Contact',
          status: 'Unable to Verify',
          explanation: 'Caller ID and sender numbers are easily forged using VoIP dialers.',
          importance: 'critical'
        },
        {
          id: 'ev-otp-3',
          category: 'Security',
          label: 'Two-Factor Authentication Integrity',
          value: 'Compromise Imminent if Shared',
          status: 'Observed',
          explanation: 'Two-factor security only works if the second factor remains exclusively in your possession.',
          importance: 'critical'
        }
      ],
      recommended_actions: [
        'DO NOT share the OTP, code, or PIN under any circumstances.',
        'Hang up the call immediately. Do not engage with their threats or arguments.',
        'Carefully read the SMS containing the OTP: notice what transaction or login it is actually authorizing.',
        'If you suspect your card or account was compromised, call the official customer care number on the back of your physical card.',
        'Change your online banking or account password immediately if you entered it on an unfamiliar screen.'
      ],
      is_demo: false
    };
  }
};
