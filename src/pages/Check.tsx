import { Link } from 'react-router-dom';
import { Mail, Briefcase, Link as LinkIcon, Image as ImageIcon, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const OPTIONS = [
  { to: '/check/message', title: 'Message / Email', description: 'Analyze suspicious SMS, emails, or social-media messages.', icon: Mail },
  { to: '/check/job', title: 'Job / Internship', description: 'Check job or internship offers for red flags and upfront fees.', icon: Briefcase },
  { to: '/check/url', title: 'URL / Website', description: 'Inspect a URL for structural risk indicators before clicking.', icon: LinkIcon },
  { to: '/check/screenshot', title: 'Screenshot', description: 'Upload a screenshot of a suspicious message for guided review.', icon: ImageIcon },
];

export default function Check() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="What do you want to check?"
        subtitle="Choose the type of content you'd like to analyze. Each checker examines different scam indicators and provides tailored advice."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((o) => (
          <Link
            key={o.to}
            to={o.to}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
          >
            <div className="rounded-xl bg-blue-50 p-3 text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white shrink-0">
              <o.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900">{o.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{o.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-900 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
