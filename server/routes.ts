import { Router, Request, Response } from 'express';
import { db } from './db';
import { generateReportHTML } from './pdfReport';
import { GSTRecord, BankTransaction, UPITransaction, Invoice } from '../src/types';
import Papa from 'papaparse';
import jwt from 'jsonwebtoken';

export const apiRouter = Router();

function parseNum(val: any, fallback = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

// Health Check Endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    version: '1.0.0',
  });
});

// Auth Endpoints
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || password !== 'Demo@123') {
    return res.status(401).json({ error: 'Invalid email or password. Use demo password Demo@123' });
  }

  db.logActivity('User Login', `${user.name} (${user.role}) logged into platform`, user.name);

  const jwtSecret = process.env.JWT_SECRET || 'vyapaar_trust_secret_key_demo_2026';
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, msmeId: user.msmeId },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user,
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const jwtSecret = process.env.JWT_SECRET || 'vyapaar_trust_secret_key_demo_2026';

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User profile not found' });
    }
    res.json({ user });
  } catch (err) {
    // Backward compatibility for demo token format
    if (token.startsWith('demo_jwt_token_')) {
      const parts = token.split('_');
      const userId = parts[3];
      const user = db.users.find((u) => u.id === userId) || db.users[0];
      return res.json({ user });
    }
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// MSME Endpoints
apiRouter.get('/msmes', (req: Request, res: Response) => {
  const msmes = db.getAllMSMEs();
  res.json(msmes);
});

apiRouter.get('/msmes/:id', (req: Request, res: Response) => {
  const msme = db.getMSMEProfile(req.params.id);
  if (!msme) {
    return res.status(404).json({ error: 'MSME profile not found' });
  }
  res.json(msme);
});

// Data Upload & Sample CSV Downloads
apiRouter.get('/data/samples/:type', (req: Request, res: Response) => {
  const type = req.params.type;
  let csvContent = '';

  if (type === 'gst') {
    csvContent = `month,gst_filed,filing_date,tax_liability,tax_paid,turnover,late_days
2026-01,true,2026-01-18,120000,120000,1000000,0
2026-02,true,2026-02-18,135000,135000,1125000,0
2026-03,true,2026-03-22,110000,110000,920000,2
2026-04,true,2026-04-18,140000,140000,1160000,0
2026-05,true,2026-05-18,150000,150000,1250000,0`;
  } else if (type === 'bank') {
    csvContent = `date,transaction_id,type,amount,category,balance
2026-05-02,TXN88012,Credit,450000,Client Payment,580000
2026-05-10,TXN88015,Debit,120000,Vendor Payout,460000
2026-05-18,TXN88022,Credit,320000,NEFT Settlement,780000
2026-05-25,TXN88030,Debit,210000,Salary & Rent,570000`;
  } else if (type === 'upi') {
    csvContent = `date,transaction_id,type,amount,merchant_category,status
2026-05-01,UPI9901,Receive,25000,Retail Sales,SUCCESS
2026-05-04,UPI9904,Receive,18000,B2B QR Settlement,SUCCESS
2026-05-12,UPI9912,Receive,42000,Commercial Trade,SUCCESS`;
  } else if (type === 'invoices') {
    csvContent = `invoice_id,invoice_date,customer_id,customer_name,amount,due_date,payment_date,status
INV-2026-01,2026-04-01,CUST_01,Reliance Retail,450000,2026-04-30,2026-05-05,PAID
INV-2026-02,2026-04-10,CUST_02,Tata Logistics,280000,2026-05-10,2026-05-12,PAID
INV-2026-03,2026-05-01,CUST_03,Birla Enterprise,350000,2026-05-31,,OVERDUE`;
  } else {
    return res.status(400).json({ error: 'Invalid sample type requested' });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type}_sample.csv"`);
  res.send(csvContent);
});

apiRouter.post('/data/upload', (req: Request, res: Response) => {
  const { msmeId, dataType, csvString } = req.body;

  if (!msmeId || !dataType || !csvString) {
    return res.status(400).json({ error: 'Missing required parameters: msmeId, dataType, or csvString' });
  }

  const store = db.msmes.get(msmeId);
  if (!store) {
    return res.status(404).json({ error: 'MSME entity not found' });
  }

  if (typeof csvString !== 'string' || !csvString.trim()) {
    return res.status(400).json({ error: 'CSV dataset payload is empty or invalid' });
  }

  try {
    const parseResult = Papa.parse(csvString, { header: true, skipEmptyLines: true });
    if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
      return res.status(400).json({ error: 'Failed to parse CSV: ' + parseResult.errors[0].message });
    }

    const rows = parseResult.data as any[];
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Uploaded CSV contains no valid data rows.' });
    }

    const firstRowKeys = Object.keys(rows[0]).map((k) => k.toLowerCase().trim());

    if (dataType === 'gst') {
      const hasMonth = firstRowKeys.some((k) => k.includes('month'));
      const hasTurnover = firstRowKeys.some((k) => k.includes('turnover'));
      if (!hasMonth || !hasTurnover) {
        return res.status(400).json({
          error: "Invalid GST CSV header: Missing required columns 'month' and 'turnover'. Expected: month, gst_filed, filing_date, tax_liability, tax_paid, turnover, late_days",
        });
      }

      const newGST: GSTRecord[] = rows.map((r) => ({
        month: r.month || '2026-05',
        gstFiled: r.gst_filed === 'true' || r.gst_filed === true || r.gst_filed === '1',
        filingDate: r.filing_date || '2026-05-18',
        taxLiability: parseNum(r.tax_liability, 100000),
        taxPaid: parseNum(r.tax_paid, 100000),
        turnover: parseNum(r.turnover, 1000000),
        lateDays: parseNum(r.late_days, 0),
      }));
      store.gstRecords = newGST;
    } else if (dataType === 'bank') {
      const hasAmount = firstRowKeys.some((k) => k.includes('amount'));
      if (!hasAmount) {
        return res.status(400).json({
          error: "Invalid Bank CSV header: Missing required column 'amount'. Expected: date, transaction_id, type, amount, category, balance",
        });
      }

      const newBank: BankTransaction[] = rows.map((r, i) => ({
        id: r.transaction_id || `txn_up_${i}`,
        date: r.date || '2026-05-10',
        type: r.type === 'Debit' ? 'Debit' : 'Credit',
        amount: parseNum(r.amount, 50000),
        category: r.category || 'General',
        balance: parseNum(r.balance, 100000),
        description: r.description || 'Uploaded Bank Record',
      }));
      store.bankTxs = newBank;
    } else if (dataType === 'upi') {
      const hasAmount = firstRowKeys.some((k) => k.includes('amount'));
      if (!hasAmount) {
        return res.status(400).json({
          error: "Invalid UPI CSV header: Missing required column 'amount'. Expected: date, transaction_id, type, amount, merchant_category",
        });
      }

      const newUPI: UPITransaction[] = rows.map((r, i) => ({
        id: r.transaction_id || `upi_up_${i}`,
        date: r.date || '2026-05-10',
        type: r.type === 'Pay' ? 'Pay' : 'Receive',
        amount: parseNum(r.amount, 10000),
        merchantCategory: r.merchant_category || 'General',
        status: 'SUCCESS',
      }));
      store.upiTxs = newUPI;
    } else if (dataType === 'invoices') {
      const hasAmount = firstRowKeys.some((k) => k.includes('amount'));
      if (!hasAmount) {
        return res.status(400).json({
          error: "Invalid Invoices CSV header: Missing required column 'amount'. Expected: invoice_id, invoice_date, customer_id, customer_name, amount, due_date, status",
        });
      }

      const newInv: Invoice[] = rows.map((r) => ({
        id: r.invoice_id || 'INV-UP-001',
        invoiceDate: r.invoice_date || '2026-05-01',
        customerId: r.customer_id || 'CUST_1',
        customerName: r.customer_name || 'Client',
        amount: parseNum(r.amount, 100000),
        dueDate: r.due_date || '2026-05-30',
        paymentDate: r.payment_date || undefined,
        status: r.status === 'OVERDUE' ? 'OVERDUE' : 'PAID',
      }));
      store.invoices = newInv;
    }

    // Re-run intelligence analysis automatically
    const updatedAnalysis = db.runAnalysis(msmeId);

    db.logActivity('Data Uploaded', `Uploaded new ${dataType.toUpperCase()} records for ${store.profile.companyName}`, 'MSME Owner');

    res.json({
      message: `Successfully uploaded ${rows.length} ${dataType.toUpperCase()} records and recalculated Trust Score`,
      recordCount: rows.length,
      analysis: updatedAnalysis,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Data parsing error: ' + err.message });
  }
});

// Analysis Endpoints
apiRouter.post('/analysis/:msme_id', (req: Request, res: Response) => {
  const analysis = db.runAnalysis(req.params.msme_id);
  if (!analysis) {
    return res.status(404).json({ error: 'MSME not found' });
  }
  res.json(analysis);
});

apiRouter.get('/analysis/:msme_id', (req: Request, res: Response) => {
  const msme = db.getMSMEProfile(req.params.msme_id);
  if (!msme) {
    return res.status(404).json({ error: 'MSME not found' });
  }
  res.json(msme.analysis);
});

apiRouter.get('/analysis/:msme_id/explanation', (req: Request, res: Response) => {
  const msme = db.getMSMEProfile(req.params.msme_id);
  if (!msme) {
    return res.status(404).json({ error: 'MSME not found' });
  }
  res.json({
    positiveFactors: msme.analysis.positiveFactors,
    riskFactors: msme.analysis.riskFactors,
    aiInterpretation: msme.analysis.aiInterpretation,
  });
});

apiRouter.get('/analysis/:msme_id/recommendations', (req: Request, res: Response) => {
  const msme = db.getMSMEProfile(req.params.msme_id);
  if (!msme) {
    return res.status(404).json({ error: 'MSME not found' });
  }
  res.json(msme.analysis.recommendations);
});

// Lender Endpoints
apiRouter.get('/lender/portfolio', (req: Request, res: Response) => {
  const all = db.getAllMSMEs();
  const lowCount = all.filter((m) => m.analysis.riskLevel === 'Low Risk').length;
  const modCount = all.filter((m) => m.analysis.riskLevel === 'Moderate Risk').length;
  const medHighCount = all.filter((m) => m.analysis.riskLevel === 'Medium-High Risk').length;
  const highCount = all.filter((m) => m.analysis.riskLevel === 'High Risk').length;

  res.json({
    totalCount: all.length,
    lowRiskCount: lowCount,
    moderateRiskCount: modCount,
    mediumHighRiskCount: medHighCount,
    highRiskCount: highCount,
    msmes: all,
  });
});

apiRouter.get('/lender/compare', (req: Request, res: Response) => {
  const ids = (req.query.ids as string)?.split(',') || [];
  if (ids.length === 0) {
    return res.status(400).json({ error: 'Provide at least 1 MSME id in query parameter ids=id1,id2' });
  }

  const selected = ids
    .map((id) => db.getMSMEProfile(id.trim()))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  res.json(selected);
});

// Admin Endpoints
apiRouter.get('/admin/statistics', (req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json(stats);
});

// Printable / HTML Report Download
apiRouter.get('/reports/:msme_id/html', (req: Request, res: Response) => {
  const msme = db.getMSMEProfile(req.params.msme_id);
  if (!msme) {
    return res.status(404).send('MSME profile not found');
  }

  const html = generateReportHTML(msme);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});
