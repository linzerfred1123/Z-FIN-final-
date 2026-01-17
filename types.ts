
export type Language = 'zh' | 'en' | 'ja' | 'de';
export type Theme = 'light' | 'dark';

export interface FinancialMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
  color: string;
  details?: string;
}

export interface ChartDataItem {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface ComparisonData {
  label: string;
  current: number;
  previous: number;
}

export interface ExpertInsight {
  category: string;
  title: string;
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  summary: string;
  metrics: FinancialMetric[];
  chartData: ChartDataItem[];
  expenseBreakdown: ExpenseCategory[];
  comparisonData: ComparisonData[];
  insights: ExpertInsight[];
  riskRating: number;
  currency: string;
}

export type AppState = 'idle' | 'analyzing' | 'completed' | 'error';
