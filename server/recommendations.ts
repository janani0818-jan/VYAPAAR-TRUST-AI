import { FinancialFeatures, RecommendationItem } from '../src/types';

export function generateRecommendations(
  features: FinancialFeatures,
  components: Record<string, { score: number; name: string }>
): RecommendationItem[] {
  const recommendations: RecommendationItem[] = [];

  // GST Compliance Check
  if (components.gstCompliance && components.gstCompliance.score < 80) {
    recommendations.push({
      id: 'rec_gst_1',
      category: 'GST Compliance',
      priority: 'HIGH',
      title: 'Improve GST Filing Discipline & Reduce Delay Penalty Flags',
      description: 'Your GSTR-1 and GSTR-3B filings reflect occasional late days. Lenders treat GST compliance as a primary proxy for management rigor.',
      actionableStep: 'Automate tax filing calendars or opt for QRMP scheme to ensure GSTR filings are submitted prior to the 20th of each month.',
      expectedScoreImpact: '+6 to +10 Points',
    });
  }

  // Cash Flow Health Check
  if (components.cashFlowHealth && components.cashFlowHealth.score < 80) {
    recommendations.push({
      id: 'rec_cf_1',
      category: 'Cash Flow Management',
      priority: 'HIGH',
      title: 'Maintain Minimum Operating Cash Buffer & Smooth Outflows',
      description: 'Negative net cash flow months and sharp outflow spikes reduce liquidity health ratings in lender risk engines.',
      actionableStep: 'Establish a rolling cash reserve equal to 1.5x monthly fixed operating expenses and stagger vendor payout dates.',
      expectedScoreImpact: '+8 to +12 Points',
    });
  }

  // Invoice Payment Delay Check
  if (features.avgPaymentDelayDays > 15 || (components.invoiceBehaviour && components.invoiceBehaviour.score < 80)) {
    recommendations.push({
      id: 'rec_inv_1',
      category: 'Accounts Receivable',
      priority: 'MEDIUM',
      title: 'Tighten Credit Terms & Enforce Prompt Payment Discounts',
      description: `Your average receivable payment delay is ${features.avgPaymentDelayDays.toFixed(0)} days beyond due dates, trapping working capital in outstanding invoices.`,
      actionableStep: 'Introduce 2/10 Net 30 payment incentives (2% discount for payments within 10 days) and automated SMS payment reminders.',
      expectedScoreImpact: '+5 to +8 Points',
    });
  }

  // Customer Concentration Check
  if (features.topCustomerConcentrationPct > 40) {
    recommendations.push({
      id: 'rec_conc_1',
      category: 'Revenue Diversity',
      priority: 'MEDIUM',
      title: 'Diversify Customer Base to Reduce Concentration Risk',
      description: `Top buyer accounts for ${features.topCustomerConcentrationPct.toFixed(0)}% of turnover. Single-buyer dependency increases sudden revenue shock risk.`,
      actionableStep: 'Expand distribution channels to ensure no single client exceeds 25% of total annual billed turnover.',
      expectedScoreImpact: '+4 to +7 Points',
    });
  }

  // Digital Footprint Check
  if (features.digitalTxRatio < 75) {
    recommendations.push({
      id: 'rec_dig_1',
      category: 'Digital Banking',
      priority: 'LOW',
      title: 'Migrate Cash Settlements to Digital & UPI Channels',
      description: 'Under-reported cash settlements cannot be validated by automated banking verification models.',
      actionableStep: 'Route 100% of trade collections through current account UPI QR codes or NEFT/RTGS rails.',
      expectedScoreImpact: '+3 to +5 Points',
    });
  }

  // Always provide at least 2 structured recommendations
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'rec_gen_1',
      category: 'Financial Discipline',
      priority: 'LOW',
      title: 'Maintain Consistent Account Aggregator Data Sharing',
      description: 'Continuous 12-month data visibility improves confidence ratings among institutional lenders.',
      actionableStep: 'Keep bank account consent permissions active via the Account Aggregator framework.',
      expectedScoreImpact: '+3 Points',
    });
  }

  return recommendations;
}
