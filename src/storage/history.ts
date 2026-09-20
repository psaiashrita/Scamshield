import type { HistoryRecord, AnalysisResult } from '@/types';

const HISTORY_KEY = 'scamshield_history_v1';
const MAX_RECORDS = 50;

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecord);
  } catch {
    return [];
  }
}

export function saveAnalysis(result: AnalysisResult): HistoryRecord | null {
  try {
    const record: HistoryRecord = {
      id: generateId(),
      type: result.inputType,
      analyzedAt: result.analyzedAt,
      riskLevel: result.riskLevel,
      indicators: result.warningSigns.map((w) => w.title),
      inputPreview: result.inputPreview,
    };
    const history = loadHistory();
    history.unshift(record);
    const trimmed = history.slice(0, MAX_RECORDS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    return record;
  } catch {
    return null;
  }
}

export function clearHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch {
    return false;
  }
}

function isValidRecord(r: unknown): r is HistoryRecord {
  if (typeof r !== 'object' || r === null) return false;
  const rec = r as Record<string, unknown>;
  return (
    typeof rec.id === 'string' &&
    typeof rec.type === 'string' &&
    typeof rec.analyzedAt === 'string' &&
    typeof rec.riskLevel === 'string' &&
    Array.isArray(rec.indicators)
  );
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
