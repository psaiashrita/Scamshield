import type { RiskLevel, WarningSign } from '@/types';

export interface RuleMatch {
  id: string;
  title: string;
  evidence: string;
  whyItMatters: string;
  weight: number;
}

interface RulePattern {
  id: string;
  patterns: RegExp[];
  title: string;
  whyItMatters: string;
  weight: number;
  extractEvidence?: (text: string, match: RegExp) => string;
}

function evidenceSnippet(text: string, match: RegExp, padding = 40): string {
  const idx = text.search(match);
  if (idx === -1) return '';
  const start = Math.max(0, idx - padding);
  const end = Math.min(text.length, idx + padding + 80);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < text.length) snippet = `${snippet}…`;
  return snippet.replace(/\s+/g, ' ');
}

const URGENCY_PATTERNS: RegExp[] = [
  /urgent/i,
  /act (now|immediately|fast|quickly)/i,
  /within \d+ (minute|hour|day)s?/i,
  /last chance/i,
  /account (will be|is being) (closed|suspended|locked|terminated)/i,
  /immediately/i,
  /expires? (today|soon|now|in \d)/i,
  /final (notice|warning|reminder)/i,
  /don'?t (wait|delay|hesitate)/i,
  /limited[- ]time/i,
  /hurry/i,
  /deadline/i,
];

const PAYMENT_PATTERNS: RegExp[] = [
  /\bpay\b/i,
  /\bfee\b/i,
  /registration fee/i,
  /processing fee/i,
  /security deposit/i,
  /\bdeposit\b/i,
  /send (money|payment|funds)/i,
  /wire (transfer|money)/i,
  /gift card/i,
  /bitcoin|crypto|btc|eth/i,
  /wire?transfer/i,
  /bank transfer/i,
  /upfront payment/i,
  /advance payment/i,
  /clearance fee/i,
  /release fee/i,
];

const SENSITIVE_INFO_PATTERNS: RegExp[] = [
  /\bOTP\b/i,
  /one[- ]time (password|code)/i,
  /\bpassword\b/i,
  /\bPIN\b/i,
  /\bCVV\b/i,
  /card (number|details)/i,
  /\b\d{3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{3,4}\b/,
  /\b\d{16}\b/,
  /bank (details|account)/i,
  /verification code/i,
  /social security/i,
  /\bSSN\b/i,
  / Aadhaar/i,
  / PAN card/i,
  /national ID/i,
  /date of birth/i,
  /passport (number|details)/i,
];

const CREDENTIAL_PATTERNS: RegExp[] = [
  /login (credentials|details)/i,
  /sign[- ]in (credentials|details)/i,
  /your (username|email) and password/i,
  /confirm your (password|identity)/i,
  /verify your (account|login)/i,
  /re[- ]enter your password/i,
  /account (verification|recovery) code/i,
  /2FA code|two[- ]factor/i,
  /authentication code/i,
];

const IMPERSONATION_PATTERNS: RegExp[] = [
  /\b(bank|nigeria|zenith|gtb|first bank|access bank|UBA|sterling)\b/i,
  /\b(IRS|HMRC|FBI|police|government|ministry|department of)\b/i,
  /\b(amazon|apple|google|microsoft|facebook|netflix|paypal|stripe|coinbase|binance)\b/i,
  /\b(whatsapp|telegram|instagram|linkedin|tiktok|snapchat)\b/i,
  /\b(fedex|dhl|ups|usps|royal mail)\b/i,
  /we are (from|representing|contacting you from)/i,
  /this is (your|the) (bank|company|provider|carrier)/i,
  /on behalf of/i,
  /\b(recruiter|HR manager|hiring manager|talent acquisition)\b/i,
  /official (notification|alert|message|notice)/i,
];

const UNREALISTIC_OFFER_PATTERNS: RegExp[] = [
  /guaranteed (money|income|returns|profit|payment)/i,
  /easy money/i,
  /make \$?\d[\d,]* (a |per |\/ )?(day|week|month|hour)/i,
  /work from home.*\$\d/i,
  /unlimited (earnings|income|income potential)/i,
  /no experience (needed|required|necessary)/i,
  /get rich/i,
  /double your (money|investment|crypto)/i,
  /risk[- ]free/i,
  /100% (guaranteed|safe|profit|return)/i,
  /salary.*\$\d{2,3},?\d{3}/i,
  /stipend.*\$\d{2,3},?\d{3}/i,
  /earn \$?\d{2,3},?\d{3}/i,
];

const THREAT_PATTERNS: RegExp[] = [
  /legal (action|consequences|proceedings)/i,
  /arrest(ed)?/i,
  /lawsuit/i,
  /fine of \$?\d/i,
  /prosecut/i,
  /suspend(ed)? your/i,
  /block(ed)? your/i,
  /terminate(d)? your/i,
  /deport/i,
  /freeze your/i,
  /your account (will be|is) (closed|deleted|terminated)/i,
  /police will/i,
  /criminal record/i,
];

const SUSPICIOUS_LINK_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s]+/gi,
  /bit\.ly\/[^\s]+/i,
  /tinyurl\.com\/[^\s]+/i,
  /t\.me\/[^\s]+/i,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
  /-?(login|verify|account|secure|update|confirm)-?/i,
];

const URL_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s]+/gi,
];

const RULE_GROUPS: { id: string; title: string; why: string; weight: number; patterns: RegExp[] }[] = [
  { id: 'urgency', title: 'Urgency & Pressure', why: 'Scammers create false urgency to discourage you from verifying the claim independently or consulting someone you trust.', weight: 2, patterns: URGENCY_PATTERNS },
  { id: 'payment', title: 'Payment or Fee Request', why: 'Requests for upfront payments, fees, or transfers are a hallmark of scams — legitimate organizations rarely ask for money via informal channels.', weight: 3, patterns: PAYMENT_PATTERNS },
  { id: 'sensitive_info', title: 'Sensitive Information Request', why: 'Requests for OTPs, passwords, card details, or government IDs are dangerous. Legitimate institutions will never ask for these over text or email.', weight: 3, patterns: SENSITIVE_INFO_PATTERNS },
  { id: 'credential', title: 'Credential Request', why: 'Asking for login credentials or authentication codes is a strong indicator of phishing. Never share passwords or 2FA codes.', weight: 3, patterns: CREDENTIAL_PATTERNS },
  { id: 'impersonation', title: 'Impersonation of Authority', why: 'Scammers often impersonate banks, recruiters, government agencies, or well-known companies to gain trust. Verify through official channels.', weight: 2, patterns: IMPERSONATION_PATTERNS },
  { id: 'unrealistic_offer', title: 'Unrealistic Offer or Compensation', why: 'Guaranteed high earnings with little effort or experience are classic bait. If it sounds too good to be true, it usually is.', weight: 2, patterns: UNREALISTIC_OFFER_PATTERNS },
  { id: 'threat', title: 'Threats & Intimidation', why: 'Threats of legal action, arrest, or account closure are designed to scare you into acting without thinking. Real organizations follow formal procedures.', weight: 3, patterns: THREAT_PATTERNS },
  { id: 'suspicious_link', title: 'Suspicious Link', why: 'Links in unsolicited messages can lead to phishing sites or malware. Always verify the destination before clicking.', weight: 2, patterns: URL_PATTERNS },
];

export function findMatches(text: string): RuleMatch[] {
  const matches: RuleMatch[] = [];
  const seen = new Set<string>();

  for (const group of RULE_GROUPS) {
    for (const pattern of group.patterns) {
      const re = new RegExp(pattern.source, pattern.flags.replace('g', ''));
      const m = text.match(re);
      if (m && !seen.has(group.id)) {
        seen.add(group.id);
        const evidence = group.id === 'suspicious_link' ? m[0] : evidenceSnippet(text, re);
        matches.push({
          id: group.id,
          title: group.title,
          evidence: evidence || m[0],
          whyItMatters: group.why,
          weight: group.weight,
        });
        break;
      }
    }
  }
  return matches;
}

export function calculateRisk(matches: RuleMatch[], textLength: number): RiskLevel {
  if (textLength < 10) return 'UNABLE TO DETERMINE';
  if (matches.length === 0) return 'LOW RISK';

  const score = matches.reduce((sum, m) => sum + m.weight, 0);
  const highSeverity = matches.some((m) => m.weight >= 3);
  const multipleIndicators = matches.length >= 3;

  if (score >= 6 || (highSeverity && multipleIndicators)) return 'HIGH RISK';
  if (score >= 3 || highSeverity) return 'MEDIUM RISK';
  return 'LOW RISK';
}

export function riskSummary(level: RiskLevel, count: number): string {
  switch (level) {
    case 'HIGH RISK':
      return count >= 3
        ? 'Multiple potential scam indicators were detected. Treat this with high caution.'
        : 'High-severity scam indicators were detected. Treat this with high caution.';
    case 'MEDIUM RISK':
      return 'Some warning signs were detected. Verify independently before taking any action.';
    case 'LOW RISK':
      return count === 0
        ? 'No significant scam indicators were detected, but always stay cautious with unsolicited messages.'
        : 'A few minor indicators were detected. No major red flags, but remain cautious.';
    case 'UNABLE TO DETERMINE':
      return 'Not enough text was provided to perform a meaningful analysis. Please paste a longer message.';
  }
}

export function toWarningSigns(matches: RuleMatch[]): WarningSign[] {
  return matches.map((m) => ({
    id: m.id,
    title: m.title,
    evidence: m.evidence,
    whyItMatters: m.whyItMatters,
    weight: m.weight,
  }));
}

export function defaultRecommendations(level: RiskLevel, types: string[]): string[] {
  const recs: string[] = [];
  const has = (t: string) => types.includes(t);

  if (level === 'HIGH RISK') {
    recs.push('Do not respond, click any links, or share any information.');
    recs.push('Delete the message and report it as spam or phishing.');
  } else if (level === 'MEDIUM RISK') {
    recs.push('Do not click any links or share sensitive information yet.');
    recs.push('Verify the claim through an independent, trusted channel before acting.');
  } else if (level === 'LOW RISK') {
    recs.push('No major red flags detected, but stay cautious with unsolicited messages.');
    recs.push('If anything feels off, verify independently before responding.');
  } else {
    recs.push('Provide more content so a meaningful analysis can be performed.');
  }

  if (has('payment')) recs.push('Do not send money or pay any fees before independently verifying the request.');
  if (has('sensitive_info') || has('credential'))
    recs.push('Do not share OTPs, passwords, card details, or verification codes.');
  if (has('suspicious_link')) recs.push('Do not click suspicious links — type official URLs directly into your browser.');
  if (has('impersonation'))
    recs.push('Contact the organization using its official website or a phone number you already trust.');
  if (has('urgency') || has('threat'))
    recs.push('Take your time. Legitimate organizations will not punish you for verifying first.');

  const unique = [...new Set(recs)];
  return unique.length > 0 ? unique : ['Stay cautious and verify independently before acting.'];
}

export function defaultVerificationSteps(types: string[]): string[] {
  const steps: string[] = [];
  const has = (t: string) => types.includes(t);

  if (has('impersonation')) {
    steps.push('Find the official website of the organization yourself — do not use links from the message.');
    steps.push('Call the organization using a phone number from their official site or your account statement.');
  }
  if (has('payment')) {
    steps.push('Research the request independently — confirm fees with the organization directly.');
    steps.push('Talk to someone you trust before sending any money.');
  }
  if (has('unrealistic_offer')) {
    steps.push('Research the company and the offer on official job boards and the company website.');
    steps.push('Check reviews and news about the company from independent sources.');
  }
  if (has('suspicious_link')) {
    steps.push('Hover over or inspect the link to see its real destination before clicking.');
    steps.push('Use a URL reputation checker like Google Safe Browsing to check the domain.');
  }
  if (has('credential') || has('sensitive_info')) {
    steps.push('Log in to your account directly (not via any link in the message) to check for real alerts.');
    steps.push('Contact support through the official app or website to confirm the request.');
  }
  if (steps.length === 0) {
    steps.push('Search online for the exact wording of the message — many scams are documented publicly.');
    steps.push('Ask someone you trust to review it with you.');
    steps.push('If in doubt, do nothing and report it as spam.');
  }
  return steps;
}
