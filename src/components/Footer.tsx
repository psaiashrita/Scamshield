import { ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-900 p-1">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">ScamShield</span>
            <span className="text-slate-400 text-sm">— Before you click, check.</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link to="/learn" className="hover:text-slate-800 transition-colors">Learn</Link>
            <Link to="/history" className="hover:text-slate-800 transition-colors">History</Link>
            <Link to="/already-interacted" className="hover:text-slate-800 transition-colors">Already Interacted?</Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          ScamShield is an educational tool and does not provide legal or financial advice. Always verify
          independently and report scams to your local authorities.
        </p>
      </div>
    </footer>
  );
}
