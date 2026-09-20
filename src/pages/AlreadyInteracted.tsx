import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MousePointerClick,
  UserRound,
  KeyRound,
  CreditCard,
  Download,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import type { LucideIcon } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon: LucideIcon;
  checklist: string[];
}

const OPTIONS: Option[] = [
  {
    id: 'clicked-link',
    label: 'I clicked a suspicious link',
    icon: MousePointerClick,
    checklist: [
      'Close the browser tab immediately and clear your browser cache and cookies.',
      'Run a malware scan with your antivirus software if you downloaded anything.',
      'Change passwords for any accounts that might have been exposed, starting with email and banking.',
      'Monitor your accounts for unusual activity over the next few days.',
      'If you entered any information on the linked page, treat it as compromised and take the steps below as well.',
    ],
  },
  {
    id: 'shared-personal',
    label: 'I shared personal information',
    icon: UserRound,
    checklist: [
      'Contact the relevant organization (bank, government agency, employer) and inform them your information may be compromised.',
      'Change the passwords of any accounts associated with the information you shared.',
      'Place a fraud alert or credit freeze with your credit bureau if financial details were involved.',
      'Monitor your accounts and credit report for unusual activity.',
      'File a report with your local cybercrime or consumer protection authority.',
    ],
  },
  {
    id: 'shared-login',
    label: 'I shared login information',
    icon: KeyRound,
    checklist: [
      'Change the password for the affected account immediately.',
      'Change the password for any other account that uses the same or a similar password.',
      'Enable two-factor authentication (2FA) if it is available.',
      'Check the account settings for unauthorized changes (email forwarding, linked apps, recovery options).',
      'Log out all active sessions if the platform offers that feature.',
    ],
  },
  {
    id: 'made-payment',
    label: 'I made a payment',
    icon: CreditCard,
    checklist: [
      'Contact your bank or payment provider immediately and report the transaction as fraudulent.',
      'Request a chargeback or reversal if possible.',
      'If you used a gift card, contact the issuer — some can freeze unused balances.',
      'If you sent crypto, report it to the exchange and law enforcement (crypto is hard to recover, but reporting helps).',
      'File a police report and a complaint with your national cybercrime authority.',
      'Monitor your bank statements for further unauthorized charges.',
    ],
  },
  {
    id: 'downloaded',
    label: 'I downloaded something',
    icon: Download,
    checklist: [
      'Disconnect from the internet to prevent any malware from communicating or spreading.',
      'Run a full system scan with reputable antivirus or anti-malware software.',
      'Delete the downloaded file and anything associated with it.',
      'If the scan finds threats, follow the antivirus recommendations and consider seeking professional IT help.',
      'Change passwords for sensitive accounts after cleaning your device, in case credentials were stolen.',
      'Back up important files that you are sure are not infected.',
    ],
  },
  {
    id: 'not-sure',
    label: "I'm not sure",
    icon: HelpCircle,
    checklist: [
      'Take a breath — it is okay to be unsure. Start by assessing what you shared or clicked.',
      'If you shared any password, change it now. When in doubt, changing a password is always safe.',
      'If you clicked a link but did not enter any information, run a malware scan as a precaution.',
      'If you made a payment and something feels wrong, contact your bank and ask them to review the transaction.',
      'Save any messages, emails, or screenshots as evidence in case you need to report them.',
      'Use ScamShield to analyze the suspicious content so you can understand the risk.',
    ],
  },
];

export default function AlreadyInteracted() {
  const [selected, setSelected] = useState<Option | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="I already interacted with something suspicious."
        subtitle="Don't panic. Select what happened below and you'll get a clear, practical safety checklist to follow right now."
      />

      {!selected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-blue-200"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white shrink-0">
                <opt.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-900 text-sm flex-1">{opt.label}</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-900 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in duration-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-blue-900 p-2.5 text-white">
              <selected.icon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{selected.label}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Safety Checklist</h3>
            <ul className="space-y-4">
              {selected.checklist.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Select a different option
            </button>
            <Link
              to="/check"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              Analyze the suspicious content
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>In an emergency</strong> — if money was stolen, your identity may be compromised, or you
          feel unsafe — contact your local authorities and your bank immediately. This checklist is
          general guidance and does not replace professional or legal advice.
        </p>
      </div>
    </div>
  );
}
