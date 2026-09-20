import { useState } from 'react';
import {
  Fish,
  Briefcase,
  DollarSign,
  UserCircle,
  ShoppingCart,
  GraduationCap,
  Link as LinkIcon,
  Bot,
  ChevronDown,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import type { LucideIcon } from 'lucide-react';

interface LearnCard {
  id: string;
  title: string;
  icon: LucideIcon;
  whatItIs: string;
  warningSigns: string[];
  safePractices: string[];
}

const CARDS: LearnCard[] = [
  {
    id: 'phishing',
    title: 'Phishing',
    icon: Fish,
    whatItIs:
      'Phishing is when scammers send fraudulent messages pretending to be from a legitimate organization to steal your passwords, OTPs, card details, or other sensitive information.',
    warningSigns: [
      'Urgent language pressuring you to act immediately',
      'Links to fake login pages that look like the real site',
      'Requests for passwords, OTPs, or card details',
      'Sender email or phone number that does not match the organization',
    ],
    safePractices: [
      'Never click links in unsolicited emails or SMS — type the official URL yourself',
      'Log in to your account directly to check for real alerts',
      'Enable two-factor authentication on important accounts',
      'Report phishing emails as spam and delete them',
    ],
  },
  {
    id: 'fake-jobs',
    title: 'Fake Jobs & Internships',
    icon: Briefcase,
    whatItIs:
      'Scammers post fake job or internship listings to collect personal information, charge upfront fees, or trick victims into money laundering schemes.',
    warningSigns: [
      'Upfront registration, training, or equipment fees',
      'Guaranteed high pay with no experience required',
      'Recruiter uses a personal email (Gmail, Yahoo) instead of a company domain',
      'Vague job description with no interview process',
    ],
    safePractices: [
      'Verify the company and recruiter on official job boards and LinkedIn',
      'Never pay money to get a job or internship',
      'Check that the recruiter email domain matches the company website',
      'Research the company name online with the word "scam" or "fraud"',
    ],
  },
  {
    id: 'payment-scams',
    title: 'Payment Scams',
    icon: DollarSign,
    whatItIs:
      'Payment scams trick victims into sending money through wire transfers, gift cards, crypto, or mobile payments, often under the guise of fees, prizes, or emergencies.',
    warningSigns: [
      'Requests for gift cards, crypto, or wire transfers',
      'Fees to "release" a prize, loan, or payment',
      'Pressure to send money quickly before verification',
      'Requests to send money to a stranger or intermediary',
    ],
    safePractices: [
      'Never send money to someone you have not met in person or verified independently',
      'Be suspicious of any payment via gift cards or crypto',
      'Verify the request through a separate, trusted channel',
      'Talk to someone you trust before sending money',
    ],
  },
  {
    id: 'impersonation',
    title: 'Impersonation',
    icon: UserCircle,
    whatItIs:
      'Impersonation scams involve fraudsters pretending to be someone you trust — a bank, government agency, company, friend, or family member — to manipulate you into acting.',
    warningSigns: [
      'Messages claiming to be from your bank, the government, or a tech company',
      'Requests to verify your identity or account',
      'Threats of legal action, arrest, or account closure',
      'Contact from a new or unfamiliar number claiming to be someone you know',
    ],
    safePractices: [
      'Hang up and call back using a number from the official website or your account statement',
      'Do not trust caller ID — it can be spoofed',
      'Set up a safe word with family members for emergencies',
      'Verify urgent requests through a different channel before acting',
    ],
  },
  {
    id: 'fake-shopping',
    title: 'Fake Shopping Sites',
    icon: ShoppingCart,
    whatItIs:
      'Fake e-commerce sites mimic legitimate online stores to steal payment details or sell counterfeit goods that never arrive.',
    warningSigns: [
      'Prices dramatically lower than legitimate retailers',
      'Domain names that mimic a brand but are not the official store',
      'No return policy, physical address, or customer service contact',
      'Payment only via wire transfer, crypto, or gift cards',
    ],
    safePractices: [
      'Check the domain carefully — look for misspellings or extra words',
      'Read reviews on independent sites before buying',
      'Use a credit card or trusted payment service for buyer protection',
      'Look for HTTPS and a valid privacy policy (but remember HTTPS alone is not enough)',
    ],
  },
  {
    id: 'scholarship-scams',
    title: 'Scholarship Scams',
    icon: GraduationCap,
    whatItIs:
      'Scholarship scams target students with fake scholarship offers, charging processing fees or collecting personal information under the guise of awarding financial aid.',
    warningSigns: [
      'Processing fees to claim a scholarship',
      'Guaranteed approval with no application',
      'Requests for bank details, SSN, or passport information',
      'Pressure to act before a short deadline',
    ],
    safePractices: [
      'Use official scholarship databases and your school financial aid office',
      'Never pay a fee to apply for or receive a scholarship',
      'Verify the organization through official sources',
      'Do not share sensitive documents unless you have verified the scholarship is legitimate',
    ],
  },
  {
    id: 'suspicious-links',
    title: 'Suspicious Links',
    icon: LinkIcon,
    whatItIs:
      'Suspicious links direct you to phishing pages, malware downloads, or scam sites. They are often disguised using URL shorteners, look-alike domains, or misleading text.',
    warningSigns: [
      'URL shorteners (bit.ly, tinyurl) that hide the real destination',
      'Domains that mimic a brand but include extra words or misspellings',
      'IP addresses instead of domain names',
      'Links in unsolicited messages with no context',
    ],
    safePractices: [
      'Hover over links to preview the real URL before clicking',
      'Use a URL expander tool to reveal shortened links',
      'Type official website addresses directly into your browser',
      'Check the URL with Google Safe Browsing or a reputation checker',
    ],
  },
  {
    id: 'ai-scams',
    title: 'AI-Generated Scams',
    icon: Bot,
    whatItIs:
      'Scammers use AI to generate convincing phishing emails, fake voices, deepfake videos, and chatbot conversations that are harder to detect than traditional scams.',
    warningSigns: [
      'Messages that are unusually well-written but request sensitive actions',
      'Voice calls from a "loved one" in distress asking for money',
      'Video or audio that feels slightly "off" or robotic',
      'Unusual requests from someone you know delivered through an unexpected channel',
    ],
    safePractices: [
      'Verify urgent or unusual requests through a separate channel you already trust',
      'Agree on a safe word with family for emergencies',
      'Be skeptical of unexpected voice or video messages asking for money',
      'Slow down — AI scams are designed to trigger immediate emotional reactions',
    ],
  },
];

export default function Learn() {
  const [openId, setOpenId] = useState<string | null>(CARDS[0].id);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="Learn"
        subtitle="Understand common scam types, their warning signs, and how to protect yourself. Knowledge is your first line of defense."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setOpenId(card.id === openId ? null : card.id)}
            className={`flex items-center gap-3 rounded-2xl border p-5 text-left transition-all ${
              openId === card.id
                ? 'border-blue-300 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm'
            }`}
          >
            <div className={`rounded-xl p-2.5 ${openId === card.id ? 'bg-blue-900 text-white' : 'bg-blue-50 text-blue-900'}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">{card.title}</span>
            <ChevronDown className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${openId === card.id ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>

      {openId && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
          {CARDS.filter((c) => c.id === openId).map((card) => (
            <div key={card.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-blue-900 p-2.5 text-white">
                  <card.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">What it is</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{card.whatItIs}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wide mb-2">Common warning signs</h3>
                  <ul className="space-y-2">
                    {card.warningSigns.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-2">Safe practices</h3>
                  <ul className="space-y-2">
                    {card.safePractices.map((practice, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
