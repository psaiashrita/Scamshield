import { ListChecks } from 'lucide-react';

interface SafetyChecklistProps {
  items: string[];
}

export default function SafetyChecklist({ items }: SafetyChecklistProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-blue-900" />
        <h3 className="text-lg font-bold text-slate-900">What Should I Do?</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
            <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
