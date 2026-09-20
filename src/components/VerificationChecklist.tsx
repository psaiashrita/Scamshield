import { Search } from 'lucide-react';

interface VerificationChecklistProps {
  items: string[];
}

export default function VerificationChecklist({ items }: VerificationChecklistProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-teal-600" />
        <h3 className="text-lg font-bold text-slate-900">How Can I Verify This?</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-700 text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
