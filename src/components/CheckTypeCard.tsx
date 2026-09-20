import type { AnalysisType } from '@/types';
import { Mail, Briefcase, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface CheckTypeCardProps {
  type: AnalysisType;
  title: string;
  description: string;
}

const ICONS: Record<AnalysisType, typeof Mail> = {
  message: Mail,
  job: Briefcase,
  url: LinkIcon,
  screenshot: ImageIcon,
};

const ROUTES: Record<AnalysisType, string> = {
  message: '/check/message',
  job: '/check/job',
  url: '/check/url',
  screenshot: '/check/screenshot',
};

export default function CheckTypeCard({ type, title, description }: CheckTypeCardProps) {
  const Icon = ICONS[type];
  const route = ROUTES[type];

  const Card = (
    <div className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 h-full">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <a href={route} className="block h-full">
      {Card}
    </a>
  );
}
