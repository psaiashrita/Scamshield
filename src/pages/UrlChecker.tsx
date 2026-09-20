import { useState, useCallback } from 'react';
import { Link as LinkIcon, Eraser, Globe } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import AnalysisResultView from '@/components/AnalysisResultView';
import { analyzeUrl } from '@/services/analysis';
import { saveAnalysis } from '@/storage/history';
import type { AnalysisResult } from '@/types';

const EXAMPLES = [
  'http://secure-bank-verify.com/login?account=update',
  'https://amazon-deals-shop.xyz/verify?token=abc123',
  'http://192.168.1.1/account/login',
  'https://login.paypa1-secure.com/signin',
];

export default function UrlChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(() => {
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (trimmed.length === 0) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const res = analyzeUrl(trimmed);
        setResult(res);
        saveAnalysis(res);
      } catch {
        setError('Something went wrong while analyzing the URL. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [url]);

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
    setUrl('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="URL / Website Checker"
        subtitle="Enter a URL to inspect it for structural risk indicators. This checker examines the URL itself — it does not visit the page or guarantee safety. HTTPS alone does not mean a site is safe."
      />

      {!result && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">URL to check</label>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g. https://example.com or example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setUrl(ex);
                    setResult(null);
                    setError(null);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 font-mono hover:bg-slate-100 transition-colors truncate max-w-full"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              <LinkIcon className="w-4 h-4" />
              Analyze URL
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eraser className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Inspecting the URL…" />}

      {error && !loading && <ErrorState message={error} onRetry={handleAnalyze} />}

      {result && !loading && (
        <AnalysisResultView result={result} onAnalyzeAnother={handleAnalyzeAnother} />
      )}
    </div>
  );
}
