export type UserRole = 'msme_owner' | 'lender' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  msmeId?: string;
  companyName?: string;
}

export interface GSTRecord {
  month: string;
  gstFiled: boolean;
  filingDate: string;
  taxLiability: number;
  taxPaid: number;
  turnover: number;
  lateDays: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: number;
  category: string;
  balance: number;
  description: string;
}

export interface UPITransaction {
  id: string;
  date: string;
  type: 'Pay' | 'Receive';
  amount: number;
  merchantCategory: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface Invoice {
  id: string;
  invoiceDate: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'PAID' | 'OVERDUE' | 'PENDING';
}

export interface FinancialFeatures {
  revenueMean: number;
  revenueGrowthMoM: number;
  revenueCV: number; // Coefficient of variation
  inflowOutflowRatio: number;
  negativeCashFlowMonths: number;
  avgDailyBalance: number;
  cashFlowVolatility: number;
  gstFilingConsistencyPct: number;
  avgGstLateDays: number;
  taxPaidRatio: number;
  monthlyTxCount: number;
  digitalTxRatio: number;
  avgPaymentDelayDays: number;
  overdueInvoiceRatioPct: number;
  topCustomerConcentrationPct: number;
}

export interface ComponentScore {
  name: string;
  key: string;
  score: number; // 0-100
  weightPct: number;
  status: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'WEAK' | 'CRITICAL';
  shortExplanation: string;
  detail: string;
}

export interface FeatureContribution {
  featureName: string;
  pointsImpact: number; // e.g. +12 or -6
  category: 'POSITIVE' | 'RISK';
  description: string;
}

export interface RecommendationItem {
  id: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  actionableStep: string;
  expectedScoreImpact: string;
}

export interface TrustScoreAnalysis {
  msmeId: string;
  companyName: string;
  trustScore: number; // 0-100
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'Medium-High Risk' | 'High Risk';
  creditReadinessPct: number;
  components: {
    financialStability: ComponentScore;
    cashFlowHealth: ComponentScore;
    gstCompliance: ComponentScore;
    transactionConsistency: ComponentScore;
    invoiceBehaviour: ComponentScore;
  };
  features: FinancialFeatures;
  positiveFactors: FeatureContribution[];
  riskFactors: FeatureContribution[];
  aiInterpretation: string;
  recommendations: RecommendationItem[];
  monthlyRevenueTrend: Array<{ month: string; turnover: number; netCashFlow: number }>;
  monthlyCashFlow: Array<{ month: string; inflow: number; outflow: number; net: number }>;
  digitalTxTrend: Array<{ month: string; upiVolume: number; bankVolume: number }>;
  gstComplianceHistory: Array<{ month: string; filedOnTime: boolean; lateDays: number; turnover: number }>;
  lastAnalyzedAt: string;
}

export interface MSMEProfile {
  id: string;
  companyName: string;
  ownerName: string;
  sector: string;
  gstin: string;
  location: string;
  incorporationYear: number;
  employeeCount: number;
  annualTurnover: number;
  analysis: TrustScoreAnalysis;
}

export interface AdminStats {
  registeredMsmes: number;
  uploadedDatasets: number;
  analysesCompleted: number;
  demoUsersCount: number;
  avgTrustScore: number;
  riskDistribution: {
    low: number;
    moderate: number;
    mediumHigh: number;
    high: number;
  };
  recentActivities: Array<{
    id: string;
    timestamp: string;
    type: string;
    description: string;
    user: string;
  }>;
}
