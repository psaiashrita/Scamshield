import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import RiskBadge from '@/components/RiskBadge';
import { loadHistory, clearHistory } from '@/storage/history';
import type { HistoryRecord } from '@/types';

const TYPE_LABELS: Record<string, string> = {
  message: 'Message',
  job: 'Job / Internship',
  url: 'URL',
  screenshot: 'Screenshot',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown date';
  }
}

export default function History() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HistoryRecord[]>(() => loadHistory());
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearHistory();
    setRecords([]);
    setConfirmClear(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <PageHeader
        title="History"
        subtitle="Your recent analyses are stored locally in your browser. No message content is saved — only the type, date, risk level, and indicators detected."
      />

      {records.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No analyses yet"
          message="Once you check a message, job offer, or URL, your results will appear here."
          actionLabel="Check Something"
          onAction={() => navigate('/check')}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{records.length} {records.length === 1 ? 'record' : 'records'}</p>
            <button
              onClick={handleClear}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                confirmClear
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmClear ? 'Click again to confirm' : 'Clear History'}
            </button>
          </div>

          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {TYPE_LABELS[rec.type] ?? rec.type}
                    </div>
                    <RiskBadge level={rec.riskLevel} size="sm" />
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(rec.analyzedAt)}</span>
                </div>
                {rec.indicators.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rec.indicators.map((ind, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1 text-xs text-slate-600"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">No specific indicators detected.</p>
                )}
                {rec.inputPreview && (
                  <p className="mt-3 text-xs text-slate-400 truncate italic">"{rec.inputPreview}"</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/check')}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Check something new
            </button>
          </div>
        </>
      )}
    </div>
  );
}
