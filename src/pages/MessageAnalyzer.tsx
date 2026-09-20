import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Eraser, FileText, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import AnalysisResultView from '@/components/AnalysisResultView';
import { analyzeMessage } from '@/services/analysis';
import { saveAnalysis } from '@/storage/history';
import { getDemoScenario } from '@/services/demoScenarios';
import type { AnalysisResult } from '@/types';

const MAX_LENGTH = 10000;

export default function MessageAnalyzer() {
  const [searchParams] = useSearchParams();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const scenario = getDemoScenario(demoId);
      if (scenario && scenario.type === 'message') {
        setText(scenario.content);
      }
    }
  }, [searchParams]);

  const handleAnalyze = useCallback(() => {
    setError(null);
    setResult(null);

    const trimmed = text.trim();
    if (trimmed.length === 0) {
      setError('Please paste a message to analyze. The input cannot be empty.');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`The message is too long. Please keep it under ${MAX_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const res = analyzeMessage({ text: trimmed });
        setResult(res);
        saveAnalysis(res);
      } catch {
        setError('Something went wrong during analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 600);
  }, [text]);

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const handleExample = () => {
    setText(
      'URGENT: Your account will be closed within 10 minutes. Click http://secure-verify-account.com/login to confirm your identity. Enter your OTP and password now. Do not ignore this final warning.'
    );
    setResult(null);
    setError(null);
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
    setText('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="Message Analyzer"
        subtitle="Paste a suspicious message, email, SMS or social-media message. ScamShield will analyze the text for scam indicators and explain the risks."
      />

      {!result && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Your message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a suspicious message, email, SMS or social-media message…"
            rows={8}
            maxLength={MAX_LENGTH + 100}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-y"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{text.trim().length} characters</span>
            <span>Max {MAX_LENGTH.toLocaleString()}</span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              Analyze Message
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eraser className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={handleExample}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Try Example
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Analyzing your message…" />}

      {error && !loading && <ErrorState message={error} onRetry={handleAnalyze} />}

      {result && !loading && (
        <>
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate">Analyzed: "{result.inputPreview}…"</span>
          </div>
          <AnalysisResultView result={result} onAnalyzeAnother={handleAnalyzeAnother} />
        </>
      )}
    </div>
  );
}
