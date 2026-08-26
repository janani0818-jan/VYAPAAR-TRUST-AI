import { FinancialFeatures, ComponentScore } from '../src/types';

export function calculateComponentScores(f: FinancialFeatures): {
  financialStability: ComponentScore;
  cashFlowHealth: ComponentScore;
  gstCompliance: ComponentScore;
  transactionConsistency: ComponentScore;
  invoiceBehaviour: ComponentScore;
  trustScore: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'Medium-High Risk' | 'High Risk';
  creditReadinessPct: number;
} {
  // 1. Financial Stability (30% weight)
  // Low CV is good (< 20%), positive growth MoM is good, stable mean
  let finScore = 75;
  if (f.revenueCV < 15) finScore += 15;
  else if (f.revenueCV < 30) finScore += 5;
  else finScore -= 15;

  if (f.revenueGrowthMoM > 3) finScore += 10;
  else if (f.revenueGrowthMoM < 0) finScore -= 10;

  finScore = Math.min(100, Math.max(0, Math.round(finScore)));

  const finStatus = finScore >= 85 ? 'EXCELLENT' : finScore >= 70 ? 'GOOD' : finScore >= 55 ? 'MODERATE' : 'WEAK';
  const financialStability: ComponentScore = {
    name: 'Financial Stability',
    key: 'financialStability',
    score: finScore,
    weightPct: 30,
    status: finStatus,
    shortExplanation: `Revenue CV at ${f.revenueCV.toFixed(1)}% with ${f.revenueGrowthMoM >= 0 ? '+' : ''}${f.revenueGrowthMoM.toFixed(1)}% MoM growth trend.`,
    detail: 'Evaluates turnover consistency, MoM growth trends, and business resilience against revenue volatility.',
  };

  // 2. Cash Flow Health (25% weight)
  // High inflow/outflow (> 1.1) is good, zero negative months is good, low volatility
  let cfScore = 70;
  if (f.inflowOutflowRatio >= 1.2) cfScore += 15;
  else if (f.inflowOutflowRatio >= 1.05) cfScore += 8;
  else cfScore -= 15;

  if (f.negativeCashFlowMonths === 0) cfScore += 15;
  else if (f.negativeCashFlowMonths <= 2) cfScore -= 5;
  else cfScore -= 20;

  if (f.avgDailyBalance > 200000) cfScore += 10;
  else if (f.avgDailyBalance < 50000) cfScore -= 10;

  cfScore = Math.min(100, Math.max(0, Math.round(cfScore)));

  const cfStatus = cfScore >= 85 ? 'EXCELLENT' : cfScore >= 70 ? 'GOOD' : cfScore >= 55 ? 'MODERATE' : 'WEAK';
  const cashFlowHealth: ComponentScore = {
    name: 'Cash Flow Health',
    key: 'cashFlowHealth',
    score: cfScore,
    weightPct: 25,
    status: cfStatus,
    shortExplanation: `Inflow/Outflow ratio ${f.inflowOutflowRatio.toFixed(2)}x with ${f.negativeCashFlowMonths} negative net cash flow months.`,
    detail: 'Measures liquidity adequacy, operating cash surplus, and frequency of cash flow shortfalls.',
  };

  // 3. GST Compliance (20% weight)
  // On-time filing consistency %, late days, tax paid ratio
  let gstScore = 70;
  if (f.gstFilingConsistencyPct >= 95) gstScore += 20;
  else if (f.gstFilingConsistencyPct >= 80) gstScore += 10;
  else gstScore -= 20;

  if (f.avgGstLateDays === 0) gstScore += 10;
  else if (f.avgGstLateDays > 5) gstScore -= 15;

  if (f.taxPaidRatio >= 98) gstScore += 5;

  gstScore = Math.min(100, Math.max(0, Math.round(gstScore)));

  const gstStatus = gstScore >= 85 ? 'EXCELLENT' : gstScore >= 70 ? 'GOOD' : gstScore >= 55 ? 'MODERATE' : 'WEAK';
  const gstCompliance: ComponentScore = {
    name: 'GST Compliance',
    key: 'gstCompliance',
    score: gstScore,
    weightPct: 20,
    status: gstStatus,
    shortExplanation: `${f.gstFilingConsistencyPct.toFixed(0)}% filing consistency with average ${f.avgGstLateDays.toFixed(1)} late days per period.`,
    detail: 'Assesses regulatory tax filing discipline, timely GSTR submissions, and tax payment completeness.',
  };

  // 4. Transaction Consistency (15% weight)
  let txScore = 75;
  if (f.monthlyTxCount >= 30) txScore += 15;
  else if (f.monthlyTxCount >= 15) txScore += 5;
  else txScore -= 10;

  if (f.digitalTxRatio >= 80) txScore += 10;
  else txScore -= 10;

  txScore = Math.min(100, Math.max(0, Math.round(txScore)));

  const txStatus = txScore >= 85 ? 'EXCELLENT' : txScore >= 70 ? 'GOOD' : txScore >= 55 ? 'MODERATE' : 'WEAK';
  const transactionConsistency: ComponentScore = {
    name: 'Transaction Consistency',
    key: 'transactionConsistency',
    score: txScore,
    weightPct: 15,
    status: txStatus,
    shortExplanation: `Averages ${Math.round(f.monthlyTxCount)} digital transactions/mo with ${f.digitalTxRatio.toFixed(0)}% banking/UPI adoption.`,
    detail: 'Monitors transaction velocity, digital payment footprint, and trade velocity patterns.',
  };

  // 5. Invoice Behaviour (10% weight)
  let invScore = 75;
  if (f.avgPaymentDelayDays <= 7) invScore += 15;
  else if (f.avgPaymentDelayDays <= 20) invScore += 5;
  else invScore -= 20;

  if (f.overdueInvoiceRatioPct <= 5) invScore += 10;
  else if (f.overdueInvoiceRatioPct > 20) invScore -= 15;

  if (f.topCustomerConcentrationPct > 50) invScore -= 10;

  invScore = Math.min(100, Math.max(0, Math.round(invScore)));

  const invStatus = invScore >= 85 ? 'EXCELLENT' : invScore >= 70 ? 'GOOD' : invScore >= 55 ? 'MODERATE' : 'WEAK';
  const invoiceBehaviour: ComponentScore = {
    name: 'Invoice Behaviour',
    key: 'invoiceBehaviour',
    score: invScore,
    weightPct: 10,
    status: invStatus,
    shortExplanation: `Average payment delay ${f.avgPaymentDelayDays.toFixed(0)} days with ${f.overdueInvoiceRatioPct.toFixed(0)}% overdue invoice ratio.`,
    detail: 'Tracks working capital efficiency, accounts receivable collections speed, and buyer concentration risk.',
  };

  // Weighted Trust Score Calculation
  const weightedSum =
    financialStability.score * 0.30 +
    cashFlowHealth.score * 0.25 +
    gstCompliance.score * 0.20 +
    transactionConsistency.score * 0.15 +
    invoiceBehaviour.score * 0.10;

  const trustScore = Math.min(100, Math.max(0, Math.round(weightedSum)));

  // Risk Classification
  let riskLevel: 'Low Risk' | 'Moderate Risk' | 'Medium-High Risk' | 'High Risk';
  if (trustScore >= 80) {
    riskLevel = 'Low Risk';
  } else if (trustScore >= 65) {
    riskLevel = 'Moderate Risk';
  } else if (trustScore >= 50) {
    riskLevel = 'Medium-High Risk';
  } else {
    riskLevel = 'High Risk';
  }

  // Credit Readiness %
  const creditReadinessPct = Math.round(trustScore * 0.98 + (gstCompliance.score > 85 ? 2 : 0));

  return {
    financialStability,
    cashFlowHealth,
    gstCompliance,
    transactionConsistency,
    invoiceBehaviour,
    trustScore,
    riskLevel,
    creditReadinessPct: Math.min(100, creditReadinessPct),
  };
}
