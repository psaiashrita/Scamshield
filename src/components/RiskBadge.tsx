import type { RiskLevel } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  'LOW RISK': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Low Risk',
  },
  'MEDIUM RISK': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    label: 'Medium Risk',
  },
  'HIGH RISK': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    label: 'High Risk',
  },
  'UNABLE TO DETERMINE': {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    label: 'Unable to Determine',
  },
};

const SIZES = {
  sm: { pad: 'px-2.5 py-1', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  md: { pad: 'px-3 py-1.5', text: 'text-sm', dot: 'w-2 h-2' },
  lg: { pad: 'px-4 py-2', text: 'text-base', dot: 'w-2.5 h-2.5' },
};

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const s = STYLES[level];
  const sz = SIZES[size];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-semibold ${s.bg} ${s.text} ${s.border} ${sz.pad} ${sz.text}`}
    >
      <span className={`rounded-full ${s.dot} ${sz.dot} animate-pulse`} />
      {s.label}
    </span>
  );
}
