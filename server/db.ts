import {
  User,
  MSMEProfile,
  GSTRecord,
  BankTransaction,
  UPITransaction,
  Invoice,
  TrustScoreAnalysis,
  AdminStats,
} from '../src/types';
import { calculateFeatures } from './featureEngineering';
import { calculateComponentScores } from './scoringEngine';
import { generateExplainability } from './explainability';
import { generateRecommendations } from './recommendations';

// In-Memory Database Store
export interface MSMEDataStore {
  profile: Omit<MSMEProfile, 'analysis'>;
  gstRecords: GSTRecord[];
  bankTxs: BankTransaction[];
  upiTxs: UPITransaction[];
  invoices: Invoice[];
  lastAnalysis?: TrustScoreAnalysis;
}

class Database {
  public users: User[] = [];
  public msmes: Map<string, MSMEDataStore> = new Map();
  public activityLogs: Array<{
    id: string;
    timestamp: string;
    type: string;
    description: string;
    user: string;
  }> = [];

  constructor() {
    this.seedUsers();
    this.seedMSMEs();
  }

  private seedUsers() {
    this.users = [
      {
        id: 'u_owner_1',
        email: 'owner@vyapaartrust.demo',
        name: 'Rajesh Kumar (ABC Textiles)',
        role: 'msme_owner',
        msmeId: 'msme_abc_textiles',
        companyName: 'ABC Textiles',
      },
      {
        id: 'u_lender_1',
        email: 'lender@vyapaartrust.demo',
        name: 'Ananya Sharma (Risk Analyst)',
        role: 'lender',
      },
      {
        id: 'u_admin_1',
        email: 'admin@vyapaartrust.demo',
        name: 'System Administrator',
        role: 'admin',
      },
    ];
  }

  private seedMSMEs() {
    // 1. ABC Textiles (High score ~86, Low Risk)
    this.createMSME(
      'msme_abc_textiles',
      'ABC Textiles',
      'Rajesh Kumar',
      'Textiles & Garments',
      '33AABCU9603R1ZM',
      'Tirupur, Tamil Nadu',
      2014,
      45,
      18500000,
      this.generateGST('msme_abc_textiles', 12, 0, 0.02, 1400000),
      this.generateBank('msme_abc_textiles', 12, 1.25, 0, 250000),
      this.generateUPI('msme_abc_textiles', 12, 85000),
      this.generateInvoices('msme_abc_textiles', 15, 5, 0.25)
    );

    // 2. Sri Lakshmi Foods (Score ~78, Moderate Risk)
    this.createMSME(
      'msme_sri_lakshmi',
      'Sri Lakshmi Foods',
      'Lakshmi Narayanan',
      'Food Processing',
      '29AABCS1234F1Z8',
      'Bengaluru, Karnataka',
      2017,
      28,
      12000000,
      this.generateGST('msme_sri_lakshmi', 12, 1, 0.05, 950000),
      this.generateBank('msme_sri_lakshmi', 12, 1.12, 1, 140000),
      this.generateUPI('msme_sri_lakshmi', 12, 120000),
      this.generateInvoices('msme_sri_lakshmi', 12, 12, 0.35)
    );

    // 3. Kumar Engineering Works (Score ~74, High Concentration)
    this.createMSME(
      'msme_kumar_eng',
      'Kumar Engineering Works',
      'Suresh Kumar',
      'Precision Manufacturing',
      '27AABCK5678E1Z4',
      'Pune, Maharashtra',
      2011,
      62,
      32000000,
      this.generateGST('msme_kumar_eng', 12, 0, 0.03, 2400000),
      this.generateBank('msme_kumar_eng', 12, 1.18, 0, 380000),
      this.generateUPI('msme_kumar_eng', 12, 40000),
      this.generateInvoices('msme_kumar_eng', 10, 15, 0.65) // 65% concentration on top customer
    );

    // 4. GreenLeaf Agro Products (Score ~62, Medium-High Risk)
    this.createMSME(
      'msme_greenleaf_agro',
      'GreenLeaf Agro Products',
      'Vikram Singh',
      'Agri Commodities',
      '07AABCG9101A1Z2',
      'Ludhiana, Punjab',
      2019,
      18,
      8500000,
      this.generateGST('msme_greenleaf_agro', 12, 3, 0.15, 650000),
      this.generateBank('msme_greenleaf_agro', 12, 1.04, 2, 85000),
      this.generateUPI('msme_greenleaf_agro', 12, 25000),
      this.generateInvoices('msme_greenleaf_agro', 14, 38, 0.40) // 38 days average delay
    );

    // 5. Vetri Electricals (Score ~44, High Risk)
    this.createMSME(
      'msme_vetri_elec',
      'Vetri Electricals',
      'M. Vetrivel',
      'Electrical Equipment',
      '33AABCV4321E1Z9',
      'Coimbatore, Tamil Nadu',
      2021,
      12,
      4800000,
      this.generateGST('msme_vetri_elec', 12, 6, 0.35, 380000), // 6 late filings
      this.generateBank('msme_vetri_elec', 12, 0.98, 4, 32000), // 4 negative cashflow months
      this.generateUPI('msme_vetri_elec', 12, 15000),
      this.generateInvoices('msme_vetri_elec', 16, 45, 0.50)
    );

    this.logActivity('System Seeded', 'Seeded 5 synthetic MSME profiles with full ledger history', 'System');
  }

  private createMSME(
    id: string,
    companyName: string,
    ownerName: string,
    sector: string,
    gstin: string,
    location: string,
    incorporationYear: number,
    employeeCount: number,
    annualTurnover: number,
    gstRecords: GSTRecord[],
    bankTxs: BankTransaction[],
    upiTxs: UPITransaction[],
    invoices: Invoice[]
  ) {
    const profile = {
      id,
      companyName,
      ownerName,
      sector,
      gstin,
      location,
      incorporationYear,
      employeeCount,
      annualTurnover,
    };

    const store: MSMEDataStore = {
      profile,
      gstRecords,
      bankTxs,
      upiTxs,
      invoices,
    };

    this.msmes.set(id, store);
    // Run initial deterministic scoring analysis
    this.runAnalysis(id);
  }

  // Generators for deterministic realistic data
  private generateGST(
    msmeId: string,
    months: number,
    lateMonthCount: number,
    volatility: number,
    baseTurnover: number
  ): GSTRecord[] {
    const records: GSTRecord[] = [];
    const monthNames = [
      '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
      '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'
    ];

    for (let i = 0; i < months; i++) {
      const monthStr = monthNames[i] || `2025-${String(i + 1).padStart(2, '0')}`;
      const isLate = i < lateMonthCount;
      const lateDays = isLate ? (i + 1) * 4 : 0;
      const turnFactor = 1 + (Math.sin(i * 0.8) * volatility);
      const turnover = Math.round(baseTurnover * turnFactor);
      const taxLiability = Math.round(turnover * 0.12);
      const taxPaid = isLate ? Math.round(taxLiability * 0.95) : taxLiability;

      records.push({
        month: monthStr,
        gstFiled: true,
        filingDate: isLate ? `${monthStr}-28` : `${monthStr}-18`,
        taxLiability,
        taxPaid,
        turnover,
        lateDays,
      });
    }
    return records;
  }

  private generateBank(
    msmeId: string,
    months: number,
    inflowRatio: number,
    negativeMonths: number,
    baseBalance: number
  ): BankTransaction[] {
    const txs: BankTransaction[] = [];
    const monthNames = [
      '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
      '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'
    ];

    let currentBalance = baseBalance;

    monthNames.slice(0, months).forEach((m, idx) => {
      const isNegativeMonth = idx < negativeMonths;
      const monthInflow = Math.round(400000 + Math.cos(idx) * 50000);
      const monthOutflow = isNegativeMonth
        ? Math.round(monthInflow * 1.18)
        : Math.round(monthInflow / inflowRatio);

      // Add Credit Tx
      currentBalance += monthInflow;
      txs.push({
        id: `tx_${msmeId}_c_${idx}`,
        date: `${m}-10`,
        type: 'Credit',
        amount: monthInflow,
        category: 'Client Settlement NEFT/RTGS',
        balance: currentBalance,
        description: `Customer Trade Payment ${m}`,
      });

      // Add Debit Tx
      currentBalance -= monthOutflow;
      txs.push({
        id: `tx_${msmeId}_d_${idx}`,
        date: `${m}-22`,
        type: 'Debit',
        amount: monthOutflow,
        category: 'Vendor & Operational Payout',
        balance: Math.max(10000, currentBalance),
        description: `Vendor Bulk Clearing ${m}`,
      });
    });

    return txs;
  }

  private generateUPI(msmeId: string, months: number, avgMonthlyAmount: number): UPITransaction[] {
    const upis: UPITransaction[] = [];
    const monthNames = [
      '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
      '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'
    ];

    monthNames.slice(0, months).forEach((m, idx) => {
      upis.push({
        id: `upi_${msmeId}_${idx}_1`,
        date: `${m}-05`,
        type: 'Receive',
        amount: Math.round(avgMonthlyAmount * 0.6),
        merchantCategory: 'Retail Trade',
        status: 'SUCCESS',
      });
      upis.push({
        id: `upi_${msmeId}_${idx}_2`,
        date: `${m}-15`,
        type: 'Receive',
        amount: Math.round(avgMonthlyAmount * 0.4),
        merchantCategory: 'B2B QR Settlement',
        status: 'SUCCESS',
      });
    });

    return upis;
  }

  private generateInvoices(
    msmeId: string,
    count: number,
    avgDelayDays: number,
    topCustomerRatio: number
  ): Invoice[] {
    const invoices: Invoice[] = [];
    const customerList = [
      'Reliance Retail Logistics',
      'Tata Smart Solutions',
      'Birla Enterprise',
      'Mahindra Supply Chains',
      'Local Wholesale Distributors',
    ];

    const totalTarget = 2000000;
    const topCustomerAmount = Math.round(totalTarget * topCustomerRatio);
    const remainingAmount = totalTarget - topCustomerAmount;
    const remainingCount = Math.max(1, count - 1);

    // Top Customer Invoice
    invoices.push({
      id: `INV-${msmeId}-001`,
      invoiceDate: '2026-05-01',
      customerId: 'CUST_TOP_1',
      customerName: customerList[0],
      amount: topCustomerAmount,
      dueDate: '2026-05-31',
      paymentDate: avgDelayDays > 25 ? '2026-07-10' : '2026-06-05',
      status: avgDelayDays > 30 ? 'OVERDUE' : 'PAID',
    });

    // Other Invoices
    for (let i = 2; i <= count; i++) {
      const custIndex = (i % (customerList.length - 1)) + 1;
      const amt = Math.round(remainingAmount / remainingCount);
      const isOverdue = i % 4 === 0 && avgDelayDays > 20;

      invoices.push({
        id: `INV-${msmeId}-${String(i).padStart(3, '0')}`,
        invoiceDate: `2026-0${(i % 5) + 1}-05`,
        customerId: `CUST_${custIndex}`,
        customerName: customerList[custIndex] || 'General Buyer',
        amount: amt,
        dueDate: `2026-0${(i % 5) + 1}-25`,
        paymentDate: isOverdue ? undefined : `2026-0${(i % 5) + 1}-28`,
        status: isOverdue ? 'OVERDUE' : 'PAID',
      });
    }

    return invoices;
  }

  public runAnalysis(msmeId: string): TrustScoreAnalysis | null {
    const store = this.msmes.get(msmeId);
    if (!store) return null;

    // 1. Feature Engineering
    const features = calculateFeatures(
      store.gstRecords,
      store.bankTxs,
      store.upiTxs,
      store.invoices
    );

    // 2. Trust Score & Component Evaluation
    const {
      financialStability,
      cashFlowHealth,
      gstCompliance,
      transactionConsistency,
      invoiceBehaviour,
      trustScore,
      riskLevel,
      creditReadinessPct,
    } = calculateComponentScores(features);

    const components = {
      financialStability,
      cashFlowHealth,
      gstCompliance,
      transactionConsistency,
      invoiceBehaviour,
    };

    // 3. Explainable AI SHAP Waterfall & AI Business Interpretation
    const { positiveFactors, riskFactors, aiInterpretation } = generateExplainability(
      store.profile.companyName,
      trustScore,
      riskLevel,
      features,
      components
    );

    // 4. Recommendation Engine
    const recommendations = generateRecommendations(features, components);

    // 5. Monthly Charts Data Preparation
    const monthlyRevenueTrend = store.gstRecords.map((r) => {
      const bankIn = store.bankTxs
        .filter((b) => b.date.startsWith(r.month) && b.type === 'Credit')
        .reduce((sum, b) => sum + b.amount, 0);
      const bankOut = store.bankTxs
        .filter((b) => b.date.startsWith(r.month) && b.type === 'Debit')
        .reduce((sum, b) => sum + b.amount, 0);
      return {
        month: r.month,
        turnover: r.turnover,
        netCashFlow: bankIn - bankOut,
      };
    });

    const monthlyCashFlow = store.gstRecords.map((r) => {
      const bankIn = store.bankTxs
        .filter((b) => b.date.startsWith(r.month) && b.type === 'Credit')
        .reduce((sum, b) => sum + b.amount, 0);
      const bankOut = store.bankTxs
        .filter((b) => b.date.startsWith(r.month) && b.type === 'Debit')
        .reduce((sum, b) => sum + b.amount, 0);
      return {
        month: r.month,
        inflow: bankIn || Math.round(r.turnover * 0.9),
        outflow: bankOut || Math.round(r.turnover * 0.75),
        net: (bankIn || Math.round(r.turnover * 0.9)) - (bankOut || Math.round(r.turnover * 0.75)),
      };
    });

    const digitalTxTrend = store.gstRecords.map((r) => {
      const upiSum = store.upiTxs
        .filter((u) => u.date.startsWith(r.month))
        .reduce((s, u) => s + u.amount, 0);
      const bankSum = store.bankTxs
        .filter((b) => b.date.startsWith(r.month) && b.type === 'Credit')
        .reduce((s, b) => s + b.amount, 0);
      return {
        month: r.month,
        upiVolume: upiSum || 50000,
        bankVolume: bankSum || Math.round(r.turnover * 0.8),
      };
    });

    const gstComplianceHistory = store.gstRecords.map((r) => ({
      month: r.month,
      filedOnTime: r.lateDays <= 0,
      lateDays: r.lateDays,
      turnover: r.turnover,
    }));

    const analysis: TrustScoreAnalysis = {
      msmeId,
      companyName: store.profile.companyName,
      trustScore,
      riskLevel,
      creditReadinessPct,
      components,
      features,
      positiveFactors,
      riskFactors,
      aiInterpretation,
      recommendations,
      monthlyRevenueTrend,
      monthlyCashFlow,
      digitalTxTrend,
      gstComplianceHistory,
      lastAnalyzedAt: new Date().toISOString(),
    };

    store.lastAnalysis = analysis;

    this.logActivity(
      'Analysis Completed',
      `Calculated Trust Score ${trustScore}/100 (${riskLevel}) for ${store.profile.companyName}`,
      'Scoring Engine'
    );

    return analysis;
  }

  public getMSMEProfile(id: string): MSMEProfile | null {
    const store = this.msmes.get(id);
    if (!store) return null;
    const analysis = store.lastAnalysis || this.runAnalysis(id);
    if (!analysis) return null;

    return {
      ...store.profile,
      analysis,
    };
  }

  public getAllMSMEs(): MSMEProfile[] {
    const list: MSMEProfile[] = [];
    this.msmes.forEach((store, id) => {
      const prof = this.getMSMEProfile(id);
      if (prof) list.push(prof);
    });
    return list;
  }

  public getAdminStats(): AdminStats {
    const msmeList = this.getAllMSMEs();
    const low = msmeList.filter((m) => m.analysis.riskLevel === 'Low Risk').length;
    const moderate = msmeList.filter((m) => m.analysis.riskLevel === 'Moderate Risk').length;
    const mediumHigh = msmeList.filter((m) => m.analysis.riskLevel === 'Medium-High Risk').length;
    const high = msmeList.filter((m) => m.analysis.riskLevel === 'High Risk').length;

    const totalScoreSum = msmeList.reduce((acc, m) => acc + m.analysis.trustScore, 0);
    const avgTrustScore = msmeList.length > 0 ? Math.round(totalScoreSum / msmeList.length) : 0;

    return {
      registeredMsmes: msmeList.length,
      uploadedDatasets: msmeList.length * 4,
      analysesCompleted: msmeList.length + 14,
      demoUsersCount: this.users.length,
      avgTrustScore,
      riskDistribution: {
        low,
        moderate,
        mediumHigh,
        high,
      },
      recentActivities: this.activityLogs.slice(0, 10),
    };
  }

  public logActivity(type: string, description: string, user: string) {
    this.activityLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      description,
      user,
    });
    if (this.activityLogs.length > 50) {
      this.activityLogs.pop();
    }
  }
}

export const db = new Database();
