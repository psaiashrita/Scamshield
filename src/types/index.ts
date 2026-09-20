export type RiskLevel = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'UNABLE TO DETERMINE';

export interface WarningSign {
  id: string;
  title: string;
  evidence: string;
  whyItMatters: string;
  weight: number;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  warningSigns: WarningSign[];
  recommendations: string[];
  verificationSteps: string[];
  analyzedAt: string;
  inputType: AnalysisType;
  inputPreview: string;
}

export type AnalysisType = 'message' | 'job' | 'url' | 'screenshot';

export interface HistoryRecord {
  id: string;
  type: AnalysisType;
  analyzedAt: string;
  riskLevel: RiskLevel;
  indicators: string[];
  inputPreview: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  type: AnalysisType;
  content: string;
  description: string;
}
