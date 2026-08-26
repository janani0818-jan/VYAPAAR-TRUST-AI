import { MSMEProfile } from '../src/types';

export function generateReportHTML(profile: MSMEProfile): string {
  const { analysis } = profile;
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VyapaarTrust AI - Financial Intelligence Report - ${profile.companyName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 40px;
      color: #1e293b;
      background-color: #f8fafc;
    }
    .report-container {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: #2563eb;
    }
    .sub-logo {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    .profile-card {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .profile-item {
      font-size: 13px;
    }
    .profile-item strong {
      color: #334155;
      display: block;
      margin-bottom: 2px;
    }
    .score-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .score-box {
      text-align: center;
    }
    .score-number {
      font-size: 48px;
      font-weight: 800;
      line-height: 1;
      color: #38bdf8;
    }
    .score-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #94a3b8;
      margin-top: 6px;
    }
    .risk-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      background: #22c55e;
      color: #ffffff;
      margin-top: 6px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .component-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .component-table th, .component-table td {
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      font-size: 13px;
      text-align: left;
    }
    .component-table th {
      background: #f8fafc;
      color: #475569;
      font-weight: 600;
    }
    .factor-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .factor-item {
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .factor-pos {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
    }
    .factor-risk {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
    }
    .interpretation-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 18px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.6;
      color: #1e3a8a;
      margin-bottom: 24px;
    }
    .disclaimer {
      margin-top: 40px;
      padding: 16px;
      background: #fffbebf8;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      font-size: 11px;
      color: #92400e;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div>
        <div class="logo">VYAPAAR<span>TRUST</span> AI</div>
        <div class="sub-logo">MSME Financial Intelligence Platform</div>
      </div>
      <div class="report-meta">
        <div><strong>Report Ref:</strong> VT-${profile.id.substring(0, 8).toUpperCase()}</div>
        <div><strong>Generated:</strong> ${nowStr}</div>
        <div><strong>Classification:</strong> Confidential Lender Intelligence</div>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-item"><strong>Company Name</strong>${profile.companyName}</div>
      <div class="profile-item"><strong>GSTIN / Tax ID</strong>${profile.gstin}</div>
      <div class="profile-item"><strong>Promoter / Owner</strong>${profile.ownerName}</div>
      <div class="profile-item"><strong>Industry Sector</strong>${profile.sector}</div>
      <div class="profile-item"><strong>Business Location</strong>${profile.location}</div>
      <div class="profile-item"><strong>Annual Turnover</strong>₹${(profile.annualTurnover / 100000).toFixed(2)} Lakhs</div>
    </div>

    <div class="score-banner">
      <div class="score-box">
        <div class="score-number">${analysis.trustScore} / 100</div>
        <div class="score-label">VyapaarTrust Score</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Assessed Risk Band</div>
        <div class="risk-badge">${analysis.riskLevel}</div>
      </div>
      <div class="score-box">
        <div style="font-size: 28px; font-weight: 700; color: #a7f3d0;">${analysis.creditReadinessPct}%</div>
        <div class="score-label">Credit Readiness Rating</div>
      </div>
    </div>

    <div class="section-title">Financial Health Pillar Analysis</div>
    <table class="component-table">
      <thead>
        <tr>
          <th>Pillar Name</th>
          <th>Weight</th>
          <th>Score</th>
          <th>Status</th>
          <th>Key Insight</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Financial Stability</td>
          <td>30%</td>
          <td><strong>${analysis.components.financialStability.score}/100</strong></td>
          <td>${analysis.components.financialStability.status}</td>
          <td>${analysis.components.financialStability.shortExplanation}</td>
        </tr>
        <tr>
          <td>Cash Flow Health</td>
          <td>25%</td>
          <td><strong>${analysis.components.cashFlowHealth.score}/100</strong></td>
          <td>${analysis.components.cashFlowHealth.status}</td>
          <td>${analysis.components.cashFlowHealth.shortExplanation}</td>
        </tr>
        <tr>
          <td>GST Compliance</td>
          <td>20%</td>
          <td><strong>${analysis.components.gstCompliance.score}/100</strong></td>
          <td>${analysis.components.gstCompliance.status}</td>
          <td>${analysis.components.gstCompliance.shortExplanation}</td>
        </tr>
        <tr>
          <td>Transaction Consistency</td>
          <td>15%</td>
          <td><strong>${analysis.components.transactionConsistency.score}/100</strong></td>
          <td>${analysis.components.transactionConsistency.status}</td>
          <td>${analysis.components.transactionConsistency.shortExplanation}</td>
        </tr>
        <tr>
          <td>Invoice Behaviour</td>
          <td>10%</td>
          <td><strong>${analysis.components.invoiceBehaviour.score}/100</strong></td>
          <td>${analysis.components.invoiceBehaviour.status}</td>
          <td>${analysis.components.invoiceBehaviour.shortExplanation}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Explainable AI - Primary Drivers</div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
      <div>
        <h4 style="color: #166534; font-size: 13px; margin-top: 0;">Positive Contributing Signals</h4>
        <ul class="factor-list">
          ${analysis.positiveFactors
            .map(
              (f) => `
            <li class="factor-item factor-pos">
              <strong>+${f.pointsImpact} pts: ${f.featureName}</strong>
              <div style="font-size: 11px; color: #374151; margin-top: 2px;">${f.description}</div>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
      <div>
        <h4 style="color: #991b1b; font-size: 13px; margin-top: 0;">Risk Contributing Signals</h4>
        <ul class="factor-list">
          ${analysis.riskFactors
            .map(
              (f) => `
            <li class="factor-item factor-risk">
              <strong>${f.pointsImpact} pts: ${f.featureName}</strong>
              <div style="font-size: 11px; color: #374151; margin-top: 2px;">${f.description}</div>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    </div>

    <div class="section-title">AI Business Interpretation</div>
    <div class="interpretation-box">
      ${analysis.aiInterpretation.replace(/\n/g, '<br/>')}
    </div>

    <div class="section-title">Credit Improvement Recommendations</div>
    <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
      ${analysis.recommendations
        .map(
          (r) => `
        <li style="margin-bottom: 10px;">
          <strong>[${r.priority} PRIORITY] ${r.title}</strong> (${r.expectedScoreImpact})
          <div>${r.actionableStep}</div>
        </li>
      `
        )
        .join('')}
    </ul>

    <div class="disclaimer">
      <strong>IMPORTANT DISCLAIMER:</strong> This report is generated by a prototype decision-support system using demonstration data. It does not constitute a loan approval, credit guarantee, or financial recommendation.
    </div>
  </div>
</body>
</html>`;
}
