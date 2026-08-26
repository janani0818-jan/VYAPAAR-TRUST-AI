import { GSTRecord, BankTransaction, UPITransaction, Invoice, FinancialFeatures } from '../src/types';

export function calculateFeatures(
  gstRecords: GSTRecord[],
  bankTxs: BankTransaction[],
  upiTxs: UPITransaction[],
  invoices: Invoice[]
): FinancialFeatures {
  // 1. Revenue Stability Metrics
  const turnovers = gstRecords.map((r) => r.turnover);
  const revenueMean = turnovers.length > 0 
    ? turnovers.reduce((a, b) => a + b, 0) / turnovers.length 
    : 500000;

  // Calculate MoM growth average
  let totalGrowth = 0;
  let growthCount = 0;
  for (let i = 1; i < turnovers.length; i++) {
    const prev = turnovers[i - 1];
    if (prev > 0) {
      totalGrowth += (turnovers[i] - prev) / prev;
      growthCount++;
    }
  }
  const revenueGrowthMoM = growthCount > 0 ? (totalGrowth / growthCount) * 100 : 2.5;

  // Coefficient of Variation (StdDev / Mean)
  const variance = turnovers.reduce((acc, val) => acc + Math.pow(val - revenueMean, 2), 0) / (turnovers.length || 1);
  const stdDev = Math.sqrt(variance);
  const revenueCV = revenueMean > 0 ? (stdDev / revenueMean) * 100 : 20;

  // 2. Cash Flow Health
  const totalInflow = bankTxs
    .filter((t) => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = bankTxs
    .filter((t) => t.type === 'Debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const inflowOutflowRatio = totalOutflow > 0 ? totalInflow / totalOutflow : 1.15;

  // Monthly net cash flow count of negative months
  const monthlyNet = new Map<string, { credit: number; debit: number }>();
  bankTxs.forEach((t) => {
    const monthKey = t.date.substring(0, 7); // YYYY-MM
    const curr = monthlyNet.get(monthKey) || { credit: 0, debit: 0 };
    if (t.type === 'Credit') curr.credit += t.amount;
    else curr.debit += t.amount;
    monthlyNet.set(monthKey, curr);
  });

  let negativeCashFlowMonths = 0;
  let cashFlowNets: number[] = [];
  monthlyNet.forEach((val) => {
    const net = val.credit - val.debit;
    cashFlowNets.push(net);
    if (net < 0) negativeCashFlowMonths++;
  });

  const avgDailyBalance = bankTxs.length > 0 
    ? bankTxs.reduce((sum, t) => sum + t.balance, 0) / bankTxs.length 
    : 150000;

  const avgNetCashFlow = cashFlowNets.length > 0
    ? cashFlowNets.reduce((a, b) => a + b, 0) / cashFlowNets.length
    : 50000;
  const cfVariance = cashFlowNets.reduce((acc, val) => acc + Math.pow(val - avgNetCashFlow, 2), 0) / (cashFlowNets.length || 1);
  const cashFlowVolatility = avgNetCashFlow !== 0 ? (Math.sqrt(cfVariance) / Math.abs(avgNetCashFlow)) * 100 : 25;

  // 3. GST Compliance
  const totalGstMonths = gstRecords.length || 1;
  const onTimeGstCount = gstRecords.filter((r) => r.gstFiled && r.lateDays <= 0).length;
  const gstFilingConsistencyPct = (onTimeGstCount / totalGstMonths) * 100;
  
  const avgGstLateDays = gstRecords.reduce((sum, r) => sum + r.lateDays, 0) / totalGstMonths;

  const totalLiability = gstRecords.reduce((sum, r) => sum + r.taxLiability, 0);
  const totalTaxPaid = gstRecords.reduce((sum, r) => sum + r.taxPaid, 0);
  const taxPaidRatio = totalLiability > 0 ? (totalTaxPaid / totalLiability) * 100 : 100;

  // 4. Transaction Consistency
  const monthlyTxCount = (bankTxs.length + upiTxs.length) / (monthlyNet.size || 1);
  const totalDigitalVolume = upiTxs.reduce((sum, u) => sum + u.amount, 0) + totalInflow;
  const digitalTxRatio = totalInflow > 0 ? (totalDigitalVolume / (totalInflow * 1.5)) * 100 : 85;

  // 5. Invoice Behaviour & Concentration
  let totalDelayDays = 0;
  let overdueCount = 0;
  const customerTotals = new Map<string, number>();
  let totalInvoiceValue = 0;

  invoices.forEach((inv) => {
    totalInvoiceValue += inv.amount;
    const custVal = (customerTotals.get(inv.customerName) || 0) + inv.amount;
    customerTotals.set(inv.customerName, custVal);

    if (inv.paymentDate && inv.dueDate) {
      const due = new Date(inv.dueDate).getTime();
      const pay = new Date(inv.paymentDate).getTime();
      const diffDays = Math.max(0, Math.floor((pay - due) / (1000 * 60 * 60 * 24)));
      totalDelayDays += diffDays;
    } else if (inv.status === 'OVERDUE') {
      overdueCount++;
      totalDelayDays += 30; // default overdue penalty days
    }
  });

  const avgPaymentDelayDays = invoices.length > 0 ? totalDelayDays / invoices.length : 12;
  const overdueInvoiceRatioPct = invoices.length > 0 ? (overdueCount / invoices.length) * 100 : 10;

  let maxCustomerValue = 0;
  customerTotals.forEach((val) => {
    if (val > maxCustomerValue) maxCustomerValue = val;
  });
  const topCustomerConcentrationPct = totalInvoiceValue > 0 ? (maxCustomerValue / totalInvoiceValue) * 100 : 30;

  return {
    revenueMean,
    revenueGrowthMoM,
    revenueCV,
    inflowOutflowRatio,
    negativeCashFlowMonths,
    avgDailyBalance,
    cashFlowVolatility,
    gstFilingConsistencyPct,
    avgGstLateDays,
    taxPaidRatio,
    monthlyTxCount,
    digitalTxRatio,
    avgPaymentDelayDays,
    overdueInvoiceRatioPct,
    topCustomerConcentrationPct,
  };
}
