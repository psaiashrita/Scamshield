import type { AnalysisResult, AnalysisType } from '@/types';
import {
  findMatches,
  calculateRisk,
  riskSummary,
  toWarningSigns,
  defaultRecommendations,
  defaultVerificationSteps,
} from './rules';

export interface AnalyzeMessageInput {
  text: string;
}

const MAX_LENGTH = 10000;

export function analyzeMessage(input: AnalyzeMessageInput): AnalysisResult {
  const text = (input.text ?? '').trim();

  if (text.length === 0) {
    return unableToDetermine('message', '');
  }

  if (text.length > MAX_LENGTH) {
    return unableToDetermine('message', text.slice(0, 100));
  }

  const matches = findMatches(text);
  const level = calculateRisk(matches, text.length);
  const types = matches.map((m) => m.id);

  return {
    riskLevel: level,
    summary: riskSummary(level, matches.length),
    warningSigns: toWarningSigns(matches),
    recommendations: defaultRecommendations(level, types),
    verificationSteps: defaultVerificationSteps(types),
    analyzedAt: new Date().toISOString(),
    inputType: 'message',
    inputPreview: text.slice(0, 120),
  };
}

export interface AnalyzeJobInput {
  company: string;
  recruiterName: string;
  recruiterEmail: string;
  description: string;
  website: string;
  paymentRequested: boolean;
  sensitiveInfoRequested: boolean;
  communicationChannel: string;
}

export function analyzeJob(input: AnalyzeJobInput): AnalysisResult {
  const combined = [
    input.company,
    input.recruiterName,
    input.recruiterEmail,
    input.description,
    input.website,
    input.communicationChannel,
  ]
    .filter(Boolean)
    .join(' \n ');

  const trimmed = combined.trim();

  if (trimmed.length < 5) {
    return unableToDetermine('job', trimmed.slice(0, 120));
  }

  const matches = findMatches(trimmed);

  if (input.paymentRequested) {
    if (!matches.some((m) => m.id === 'payment')) {
      matches.push({
        id: 'payment',
        title: 'Payment or Fee Request',
        evidence: 'You indicated a payment or fee is being requested.',
        whyItMatters:
          'Requests for upfront payments for job applications, training, or equipment are a strong indicator of a job scam.',
        weight: 3,
      });
    }
  }

  if (input.sensitiveInfoRequested) {
    if (!matches.some((m) => m.id === 'sensitive_info')) {
      matches.push({
        id: 'sensitive_info',
        title: 'Sensitive Information Request',
        evidence: 'You indicated sensitive personal information is being requested.',
        whyItMatters:
          'Legitimate employers do not request bank details, government IDs, or passwords before a formal offer is made and accepted.',
        weight: 3,
      });
    }
  }

  if (input.recruiterEmail) {
    const email = input.recruiterEmail.toLowerCase();
    const company = (input.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (company && email.includes('@')) {
      const domain = email.split('@')[1] ?? '';
      const domainRoot = domain.split('.')[0] ?? '';
      if (domainRoot && company && !domainRoot.includes(company) && !company.includes(domainRoot)) {
        if (!matches.some((m) => m.id === 'impersonation')) {
          matches.push({
            id: 'impersonation',
            title: 'Domain / Email Mismatch',
            evidence: `Recruiter email "${input.recruiterEmail}" does not match the company "${input.company}".`,
            whyItMatters:
              'A recruiter claiming to represent a company but emailing from an unrelated domain is a common impersonation tactic.',
            weight: 3,
          });
        }
      }
    }
    if (/@(gmail|yahoo|hotmail|outlook)\.com$/.test(email) && input.company) {
      if (!matches.some((m) => m.id === 'impersonation')) {
        matches.push({
          id: 'impersonation',
          title: 'Recruiter Using Personal Email',
          evidence: `Recruiter is using a free email provider ("${input.recruiterEmail}") while claiming to represent a company.`,
          whyItMatters:
            'Professional recruiters typically use a company email domain. A personal email is a red flag for impersonation.',
          weight: 2,
        });
      }
    }
  }

  const level = calculateRisk(matches, trimmed.length);
  const types = matches.map((m) => m.id);

  return {
    riskLevel: level,
    summary: riskSummary(level, matches.length),
    warningSigns: toWarningSigns(matches),
    recommendations: defaultRecommendations(level, types),
    verificationSteps: defaultVerificationSteps(types),
    analyzedAt: new Date().toISOString(),
    inputType: 'job',
    inputPreview: trimmed.slice(0, 120),
  };
}

export function analyzeUrl(url: string): AnalysisResult {
  const trimmed = (url ?? '').trim();

  if (trimmed.length === 0) {
    return unableToDetermine('url', '');
  }

  let parsed: URL | null = null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return {
      riskLevel: 'UNABLE TO DETERMINE',
      summary: 'The provided URL could not be parsed. Please check the format and try again.',
      warningSigns: [],
      recommendations: ['Enter a valid URL including the domain name (e.g. https://example.com).'],
      verificationSteps: ['Verify the URL is correctly typed and includes a valid domain.'],
      analyzedAt: new Date().toISOString(),
      inputType: 'url',
      inputPreview: trimmed.slice(0, 120),
    };
  }

  const matches: { id: string; title: string; evidence: string; whyItMatters: string; weight: number }[] = [];
  const hostname = parsed.hostname;
  const protocol = parsed.protocol;
  const subdomains = hostname.split('.').length - 2;
  const path = parsed.pathname + parsed.search;

  if (protocol === 'http:') {
    matches.push({
      id: 'http',
      title: 'No HTTPS (Unencrypted Connection)',
      evidence: `The URL uses "http://" instead of "https://".`,
      whyItMatters:
        'HTTP connections are not encrypted, so data sent to this site can be intercepted. Note: HTTPS alone does not mean a site is safe — it only means the connection is encrypted.',
      weight: 2,
    });
  }

  if (/\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    matches.push({
      id: 'ip_address',
      title: 'URL Uses an IP Address',
      evidence: `The URL points directly to an IP address: "${hostname}".`,
      whyItMatters: 'Legitimate websites use domain names. An IP-address URL is a common phishing indicator.',
      weight: 3,
    });
  }

  if (subdomains >= 3) {
    matches.push({
      id: 'subdomains',
      title: 'Excessive Subdomains',
      evidence: `The domain has many subdomain levels: "${hostname}".`,
      whyItMatters: 'Phishing URLs often stack subdomains to hide the real domain and mimic a trusted brand.',
      weight: 2,
    });
  }

  if (/[#@\-_]{4,}/.test(hostname + path)) {
    matches.push({
      id: 'suspicious_chars',
      title: 'Suspicious Characters in URL',
      evidence: `The URL contains unusual character sequences: "${trimmed.slice(0, 80)}".`,
      whyItMatters: 'Excessive special characters can be used to obfuscate the real destination or trick URL preview tools.',
      weight: 2,
    });
  }

  const knownBrands = ['paypal', 'apple', 'google', 'microsoft', 'amazon', 'netflix', 'facebook', 'instagram', 'linkedin', 'whatsapp', 'binance', 'coinbase'];
  for (const brand of knownBrands) {
    if (hostname.includes(brand) && !hostname.startsWith(`${brand}.`) && !hostname.startsWith(`www.${brand}.`)) {
      matches.push({
        id: 'brand_mismatch',
        title: 'Possible Brand / Domain Mismatch',
        evidence: `The domain "${hostname}" contains the brand name "${brand}" but is not the official "${brand}.com" domain.`,
        whyItMatters: 'Scammers register look-alike domains that contain a brand name to impersonate trusted services.',
        weight: 3,
      });
      break;
    }
  }

  const tld = hostname.split('.').pop() ?? '';
  if (['zip', 'mov', 'xyz', 'top', 'click', 'link', 'country', 'kim', 'cn', 'ru'].includes(tld)) {
    matches.push({
      id: 'suspicious_tld',
      title: 'Unusual Top-Level Domain',
      evidence: `The URL ends in ".${tld}".`,
      whyItMatters: 'Certain top-level domains are frequently abused for scams and phishing. Proceed with caution.',
      weight: 1,
    });
  }

  if (/(login|signin|verify|account|update|confirm|secure|wallet|unlock)/i.test(path)) {
    matches.push({
      id: 'sensitive_path',
      title: 'Sensitive Path Keywords',
      evidence: `The URL path contains sensitive keywords: "${path}".`,
      whyItMatters: 'Phishing URLs often use words like "verify", "login", or "account" to create a false sense of legitimacy.',
      weight: 1,
    });
  }

  if (/bit\.ly|tinyurl|t\.me|shorte\.st|cutt\.ly/i.test(hostname)) {
    matches.push({
      id: 'shortener',
      title: 'URL Shortener Detected',
      evidence: `The URL uses a shortener service: "${hostname}".`,
      whyItMatters: 'Shorteners hide the real destination. Expand the link (e.g. with a URL expander tool) before clicking.',
      weight: 2,
    });
  }

  if (parsed.username || parsed.password) {
    matches.push({
      id: 'url_credentials',
      title: 'URL Contains Embedded Credentials',
      evidence: `The URL contains an embedded username/password segment.`,
      whyItMatters: 'This technique is used to disguise the true destination and is highly suspicious.',
      weight: 3,
    });
  }

  const level = calculateRisk(matches, trimmed.length);
  const types = matches.map((m) => m.id);

  return {
    riskLevel: level === 'UNABLE TO DETERMINE' && matches.length === 0 ? 'LOW RISK' : level,
    summary:
      matches.length === 0
        ? 'No major URL risk indicators were detected. Note: this does not guarantee the site is safe — always verify independently.'
        : riskSummary(level, matches.length),
    warningSigns: toWarningSigns(matches),
    recommendations: defaultRecommendations(level, types),
    verificationSteps: defaultVerificationSteps(types),
    analyzedAt: new Date().toISOString(),
    inputType: 'url',
    inputPreview: trimmed.slice(0, 120),
  };
}

export function analyzeScreenshot(
  _imageDataUrl: string,
  userNotes: string
): AnalysisResult {
  const notes = (userNotes ?? '').trim();
  const matches = notes.length > 0 ? findMatches(notes) : [];

  return {
    riskLevel: matches.length === 0 ? 'UNABLE TO DETERMINE' : calculateRisk(matches, notes.length),
    summary:
      'Screenshot visual analysis uses a manual review workflow in this prototype. The indicators below are based on the notes you provided about the screenshot, not automated image recognition.',
    warningSigns: toWarningSigns(matches),
    recommendations:
      matches.length === 0
        ? [
            'Carefully review the screenshot for urgent language, payment requests, or suspicious links.',
            'Cross-check any sender details, phone numbers, or URLs shown in the screenshot against official sources.',
            'Use the Message Analyzer to paste any text from the screenshot for a detailed rule-based analysis.',
          ]
        : defaultRecommendations(
            calculateRisk(matches, notes.length),
            matches.map((m) => m.id)
          ),
    verificationSteps:
      matches.length === 0
        ? [
            'Identify who the message claims to be from and verify through their official channels.',
            'Check any phone number or email shown by searching for it online alongside the word "scam".',
            'If the screenshot contains a link, use the URL Checker to inspect it.',
          ]
        : defaultVerificationSteps(matches.map((m) => m.id)),
    analyzedAt: new Date().toISOString(),
    inputType: 'screenshot',
    inputPreview: notes.slice(0, 120) || '(screenshot upload, no notes provided)',
  };
}

function unableToDetermine(type: AnalysisType, preview: string): AnalysisResult {
  return {
    riskLevel: 'UNABLE TO DETERMINE',
    summary: 'Not enough information was provided to perform a meaningful analysis.',
    warningSigns: [],
    recommendations: ['Please provide more details so a meaningful analysis can be performed.'],
    verificationSteps: ['Enter the full message, job details, or URL you want to check.'],
    analyzedAt: new Date().toISOString(),
    inputType: type,
    inputPreview: preview,
  };
}
