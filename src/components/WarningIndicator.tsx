import { AlertTriangle } from 'lucide-react';
import type { WarningSign } from '@/types';

interface WarningIndicatorProps {
  sign: WarningSign;
}

const SEVERITY = {
  1: { icon: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  2: { icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  3: { icon: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function WarningIndicator({ sign }: WarningIndicatorProps) {
  const sev = SEVERITY[sign.weight as 1 | 2 | 3] ?? SEVERITY[2];
  return (
    <div className={`rounded-xl border ${sev.border} ${sev.bg} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${sev.icon}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{sign.title}</h4>
          {sign.evidence && (
            <div className="mt-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Evidence</p>
              <blockquote className="mt-1 rounded-lg bg-white/70 border border-slate-200 px-3 py-2 text-sm text-slate-700 italic break-words">
                {sign.evidence}
              </blockquote>
            </div>
          )}
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Why it matters</p>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{sign.whyItMatters}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
