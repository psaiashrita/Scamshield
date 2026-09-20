import { ShieldAlert, CheckCircle2, Search, RotateCw } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import RiskBadge from './RiskBadge';
import WarningIndicator from './WarningIndicator';
import SafetyChecklist from './SafetyChecklist';
import VerificationChecklist from './VerificationChecklist';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
}

export default function AnalysisResultView({ result, onAnalyzeAnother }: AnalysisResultViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Risk Assessment</h3>
          </div>
          <RiskBadge level={result.riskLevel} size="lg" />
        </div>
        <p className="mt-4 text-slate-600 leading-relaxed">{result.summary}</p>
      </div>

      {result.warningSigns.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">Warning Signs Found</h3>
          <div className="space-y-3">
            {result.warningSigns.map((sign) => (
              <WarningIndicator key={sign.id} sign={sign} />
            ))}
          </div>
        </div>
      )}

      {result.warningSigns.length === 0 && result.riskLevel !== 'UNABLE TO DETERMINE' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-800">
            No specific scam indicators were detected in the provided input. This does not guarantee
            safety — always stay cautious with unsolicited communications.
          </p>
        </div>
      )}

      <SafetyChecklist items={result.recommendations} />

      <VerificationChecklist items={result.verificationSteps} />

      <div className="flex justify-center pt-2">
        <button
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Analyze Another
        </button>
      </div>
    </div>
  );
}
