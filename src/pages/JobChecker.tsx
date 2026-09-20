import { useState, useCallback } from 'react';
import { Briefcase, Eraser } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import AnalysisResultView from '@/components/AnalysisResultView';
import { analyzeJob, type AnalyzeJobInput } from '@/services/analysis';
import { saveAnalysis } from '@/storage/history';
import type { AnalysisResult } from '@/types';

interface FormState extends AnalyzeJobInput {}

const EMPTY_FORM: FormState = {
  company: '',
  recruiterName: '',
  recruiterEmail: '',
  description: '',
  website: '',
  paymentRequested: false,
  sensitiveInfoRequested: false,
  communicationChannel: '',
};

export default function JobChecker() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = useCallback(() => {
    setError(null);
    setResult(null);

    const filled = Object.values(form).some((v) =>
      typeof v === 'string' ? v.trim().length > 0 : v === true
    );
    if (!filled) {
      setError('Please fill in at least one field before analyzing.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const res = analyzeJob(form);
        setResult(res);
        saveAnalysis(res);
      } catch {
        setError('Something went wrong during analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 600);
  }, [form]);

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setError(null);
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
  };

  const textClass =
    'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="Job / Internship Checker"
        subtitle="Enter the details of a job or internship offer. ScamShield checks for upfront fees, impersonation, unrealistic compensation, and other red flags. This tool does not accuse any company or individual of fraud — it highlights risk indicators."
      />

      {!result && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company / Organization</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="e.g. GlobalTech Solutions"
                className={textClass}
              />
            </div>
            <div>
              <label className={labelClass}>Recruiter Name</label>
              <input
                type="text"
                value={form.recruiterName}
                onChange={(e) => update('recruiterName', e.target.value)}
                placeholder="e.g. John Smith"
                className={textClass}
              />
            </div>
            <div>
              <label className={labelClass}>Recruiter Email</label>
              <input
                type="email"
                value={form.recruiterEmail}
                onChange={(e) => update('recruiterEmail', e.target.value)}
                placeholder="e.g. recruiter@example.com"
                className={textClass}
              />
            </div>
            <div>
              <label className={labelClass}>Company Website</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="e.g. https://example.com"
                className={textClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Job / Internship Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={5}
              placeholder="Paste the job description, offer letter, or conversation details…"
              className={`${textClass} resize-y`}
            />
          </div>

          <div>
            <label className={labelClass}>Communication Channel</label>
            <select
              value={form.communicationChannel}
              onChange={(e) => update('communicationChannel', e.target.value)}
              className={textClass}
            >
              <option value="">Select a channel…</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone Call</option>
              <option value="linkedin">LinkedIn</option>
              <option value="sms">SMS</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Payment Requested?</label>
              <div className="flex gap-3">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('paymentRequested', opt === 'Yes')}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      (form.paymentRequested ? 'Yes' : 'No') === opt
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Sensitive Information Requested?</label>
              <div className="flex gap-3">
                {['Yes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('sensitiveInfoRequested', opt === 'Yes')}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      (form.sensitiveInfoRequested ? 'Yes' : 'No') === opt
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              <Briefcase className="w-4 h-4" />
              Analyze Job Offer
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

      {loading && <LoadingState message="Analyzing the job offer…" />}

      {error && !loading && <ErrorState message={error} onRetry={handleAnalyze} />}

      {result && !loading && (
        <AnalysisResultView result={result} onAnalyzeAnother={handleAnalyzeAnother} />
      )}
    </div>
  );
}
