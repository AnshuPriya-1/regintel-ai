// Centralized mock data for RegIntel-AI.
// In production this file is replaced by API calls into the backend service.

export type Status = "Processed" | "Processing" | "Queued" | "Failed";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type RiskLevel = "High" | "Medium" | "Low";
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";

export const departments = [
  { id: "d1", name: "IT Security", compliance: 89, pending: 12, completed: 36, risk: "Medium" as RiskLevel, obligations: 32, head: "Rohan Verma" },
  { id: "d2", name: "Compliance", compliance: 95, pending: 3, completed: 25, risk: "Low" as RiskLevel, obligations: 28, head: "Neha Sharma" },
  { id: "d3", name: "Risk Management", compliance: 86, pending: 5, completed: 19, risk: "Medium" as RiskLevel, obligations: 24, head: "Arjun Malhotra" },
  { id: "d4", name: "Operations", compliance: 93, pending: 5, completed: 15, risk: "Low" as RiskLevel, obligations: 20, head: "Priya Nair" },
  { id: "d5", name: "Internal Audit", compliance: 90, pending: 2, completed: 12, risk: "Low" as RiskLevel, obligations: 14, head: "Karan Mehta" },
  { id: "d6", name: "Legal", compliance: 94, pending: 2, completed: 8, risk: "Low" as RiskLevel, obligations: 10, head: "Ishaan Kapoor" },
  { id: "d7", name: "Client Servicing", compliance: 81, pending: 8, completed: 14, risk: "Medium" as RiskLevel, obligations: 22, head: "Meera Iyer" },
  { id: "d8", name: "Finance & Accounts", compliance: 97, pending: 1, completed: 11, risk: "Low" as RiskLevel, obligations: 12, head: "Devansh Rao" },
];

export const documents = [
  { id: "doc1", name: "Master Circular - Investment Advisers", category: "Master Circular", uploadedOn: "2024-05-12", pages: 120, sizeMb: 2.4, status: "Processed" as Status, obligations: 48, departments: 4, summary: "Consolidates all SEBI directions applicable to registered Investment Advisers, covering registration, conduct, cybersecurity and risk management norms, and record-keeping obligations issued since 2013." },
  { id: "doc2", name: "Cybersecurity Framework", category: "Framework", uploadedOn: "2024-05-10", pages: 64, sizeMb: 1.8, status: "Processed" as Status, obligations: 32, departments: 3, summary: "Sets out the cybersecurity and cyber-resilience framework for SEBI-regulated entities, including VAPT cadence, incident reporting timelines and board-level oversight requirements." },
  { id: "doc3", name: "Audit Clarification on IA Regulations", category: "Clarification", uploadedOn: "2024-05-08", pages: 18, sizeMb: 1.2, status: "Processed" as Status, obligations: 24, departments: 2, summary: "Clarifies ambiguous provisions in the Investment Adviser Regulations relating to fee structures, client segregation and annual compliance audit scope." },
  { id: "doc4", name: "SEBI Circular - KYC Norms", category: "Circular", uploadedOn: "2024-05-05", pages: 22, sizeMb: 0.9, status: "Processed" as Status, obligations: 14, departments: 3, summary: "Updates KYC verification requirements for client onboarding, including Aadhaar-based e-KYC acceptance and periodic re-verification cycles." },
  { id: "doc5", name: "Investor Protection Guidelines", category: "Guideline", uploadedOn: "2024-05-01", pages: 30, sizeMb: 1.4, status: "Processed" as Status, obligations: 18, departments: 2, summary: "Lays out grievance redressal timelines, mandatory disclosures at onboarding, and suitability assessment requirements for retail clients." },
  { id: "doc6", name: "Algorithmic Trading Risk Controls", category: "Framework", uploadedOn: "2024-04-27", pages: 40, sizeMb: 1.6, status: "Processed" as Status, obligations: 21, departments: 3, summary: "Mandates pre-trade risk checks, kill-switch mechanisms and audit trails for algorithmic order flow originating from broker terminals." },
  { id: "doc7", name: "Related Party Transactions Circular", category: "Circular", uploadedOn: "2024-04-22", pages: 16, sizeMb: 0.7, status: "Processed" as Status, obligations: 11, departments: 2, summary: "Tightens disclosure and board-approval thresholds for related party transactions above prescribed materiality limits." },
  { id: "doc8", name: "Business Continuity & Disaster Recovery Norms", category: "Framework", uploadedOn: "2024-04-18", pages: 28, sizeMb: 1.1, status: "Processing" as Status, obligations: 9, departments: 2, summary: "Draft obligations on RTO/RPO benchmarks, DR site testing frequency and annual BCP attestation to the board." },
  { id: "doc9", name: "Outsourcing of Activities Guidelines", category: "Guideline", uploadedOn: "2024-04-14", pages: 24, sizeMb: 1.0, status: "Processed" as Status, obligations: 13, departments: 3, summary: "Governs due-diligence, monitoring and exit provisions for material outsourcing arrangements with third-party vendors." },
  { id: "doc10", name: "Advertisement Code for Intermediaries", category: "Circular", uploadedOn: "2024-04-09", pages: 12, sizeMb: 0.5, status: "Processed" as Status, obligations: 8, departments: 1, summary: "Restricts performance claims and mandates standard risk disclaimers across print, digital and social media advertising." },
  { id: "doc11", name: "Data Localization & Storage Norms", category: "Framework", uploadedOn: "2024-04-03", pages: 20, sizeMb: 0.9, status: "Queued" as Status, obligations: 0, departments: 0, summary: "Pending AI extraction. Establishes data residency requirements for client financial records and audit logs." },
  { id: "doc12", name: "Annual System Audit Requirements", category: "Master Circular", uploadedOn: "2024-03-28", pages: 34, sizeMb: 1.3, status: "Processed" as Status, obligations: 15, departments: 2, summary: "Specifies scope, empanelled-auditor criteria and submission timelines for the mandatory annual system audit." },
];

export const clauses = [
  { id: "c1", docId: "doc1", clause: "4.2", title: "Cybersecurity and Cyber Resilience", text: "Investment Advisers shall implement a robust cybersecurity framework to protect the confidentiality, integrity and availability of data and systems.", obligation: "Conduct annual Vulnerability Assessment and Penetration Testing (VAPT) by CERT-In empanelled agencies.", department: "IT Security", risk: "High" as RiskLevel, evidence: "VAPT Report, Certification", deadline: "Annually", frequency: "Annual", action: "Schedule VAPT with an empanelled CERT-In agency at least 60 days before the compliance deadline." },
  { id: "c2", docId: "doc1", clause: "4.2.1", title: "VAPT Scope", text: "Conduct annual Vulnerability Assessment and Penetration Testing (VAPT) by CERT-In empanelled agencies.", obligation: "Report all material cybersecurity incidents to SEBI within 6 hours of detection.", department: "IT Security", risk: "High" as RiskLevel, evidence: "Incident Log, SEBI Acknowledgement", deadline: "Within 6 hours", frequency: "Per incident", action: "Stand up an incident response runbook with a 6-hour SEBI notification SLA." },
  { id: "c3", docId: "doc1", clause: "4.2.2", title: "Incident Reporting", text: "Report all material cybersecurity incidents to SEBI within 6 hours of detection.", obligation: "Maintain an updated incident response and escalation matrix, reviewed quarterly.", department: "IT Security", risk: "Medium" as RiskLevel, evidence: "Escalation Matrix, Review Minutes", deadline: "Quarterly", frequency: "Quarterly", action: "Assign an owner to review and re-circulate the escalation matrix each quarter." },
  { id: "c4", docId: "doc1", clause: "4.2.3", title: "Board Oversight", text: "Prepare a cybersecurity policy document that is reviewed and approved by the board on an annual basis.", obligation: "Present the cybersecurity policy for board ratification annually.", department: "Compliance", risk: "Low" as RiskLevel, evidence: "Board Minutes, Approved Policy", deadline: "Annually", frequency: "Annual", action: "Add cybersecurity policy review to the Q1 board meeting agenda." },
  { id: "c5", docId: "doc2", clause: "3.1", title: "Data Backup Protocol", text: "Registered entities shall maintain encrypted backups of critical data with a defined recovery point objective.", obligation: "Perform encrypted data backups with RPO not exceeding 24 hours.", department: "IT Security", risk: "Medium" as RiskLevel, evidence: "Backup Logs, Encryption Certificate", deadline: "Daily", frequency: "Daily", action: "Automate backup verification and alerting for RPO breaches." },
];

export const obligationCategories = ["Cybersecurity", "KYC & Onboarding", "Reporting", "Risk Management", "Governance", "Disclosure", "Audit", "Data Protection"];

const obligationTemplates = [
  "Conduct annual VAPT by CERT-In empanelled agency",
  "Report material cybersecurity incidents within 6 hours",
  "Maintain updated client KYC records with periodic re-verification",
  "File quarterly compliance report with SEBI",
  "Perform daily encrypted data backups",
  "Conduct board review of risk management policy",
  "Disclose related party transactions above materiality threshold",
  "Complete annual system audit by empanelled auditor",
  "Maintain grievance redressal turnaround within 21 days",
  "Review and update Business Continuity Plan annually",
  "Conduct employee cybersecurity awareness training",
  "Maintain audit trail for all algorithmic order modifications",
  "Segregate client funds from proprietary accounts",
  "Submit half-yearly net worth certificate",
  "Review outsourcing vendor due-diligence annually",
  "Publish standard risk disclaimers in all advertisements",
  "Maintain data localization for client financial records",
  "Conduct internal audit of investment advisory practices",
  "File Suspicious Transaction Reports within prescribed timelines",
  "Review and refresh employee code of conduct annually",
];

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const obligations = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  const dept = departments[i % departments.length];
  const doc = documents[i % (documents.length - 1)];
  const risk: RiskLevel = seededRand(i * 3.1) > 0.66 ? "High" : seededRand(i * 3.1) > 0.33 ? "Medium" : "Low";
  const statusPool = ["Compliant", "In Progress", "Pending", "Overdue"];
  const status = statusPool[Math.floor(seededRand(i * 7.7) * statusPool.length)];
  const freqPool = ["Annual", "Quarterly", "Monthly", "Daily", "One-time", "Per incident"];
  const frequency = freqPool[i % freqPool.length];
  return {
    id: `ob${n}`,
    regNo: `REG-${String(1000 + n)}`,
    obligation: obligationTemplates[i % obligationTemplates.length],
    category: obligationCategories[i % obligationCategories.length],
    department: dept.name,
    docId: doc.id,
    docName: doc.name,
    risk,
    status,
    frequency,
    deadline: frequency === "Annual" ? "2024-12-31" : frequency === "Quarterly" ? "2024-09-30" : "2024-08-15",
    owner: ["Rohan Verma", "Neha Sharma", "Arjun Malhotra", "Priya Nair", "Karan Mehta", "Ishaan Kapoor", "Meera Iyer", "Devansh Rao"][i % 8],
  };
});

const taskTitles = [
  "Conduct Annual VAPT", "Update Compliance Manual", "Quarterly Risk Assessment", "Employee Training Program",
  "Review KYC Procedures", "Board Policy Ratification", "Incident Response Drill", "Vendor Due-Diligence Review",
  "Data Backup Audit", "Grievance Redressal Report", "Related Party Disclosure Filing", "Net Worth Certificate Submission",
  "BCP Annual Review", "Advertisement Compliance Check", "System Audit Coordination",
];

export const tasks = Array.from({ length: 25 }, (_, i) => {
  const n = i + 1;
  const dept = departments[i % departments.length];
  const statusPool: TaskStatus[] = ["To Do", "In Progress", "Review", "Completed"];
  const status = statusPool[i % statusPool.length];
  const priorityPool: Priority[] = ["Critical", "High", "Medium", "Low"];
  const priority = priorityPool[Math.floor(seededRand(i * 4.4) * 4)];
  const progress = status === "Completed" ? 100 : status === "Review" ? 85 : status === "In Progress" ? 45 : 5;
  return {
    id: `task${n}`,
    title: taskTitles[i % taskTitles.length],
    department: dept.name,
    owner: dept.head,
    priority,
    status,
    dueDate: (() => {
  // Spread due dates from 5 days overdue to ~25 days out, relative to
  // whenever the app is actually run — not a fixed 2024 date. Fixed
  // mock dates would make every DueDateBadge show "overdue by 800+ days".
  const offset = (i % 12) - 5;
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
})(),
    progress,
    evidence: status === "Completed",
  };
});

export const notifications = [
  { id: "n1", type: "Risk", title: "High risk obligation identified", detail: "Clause 4.2.1 requires urgent attention", time: "10m ago", read: false },
  { id: "n2", type: "Documents", title: "New regulation uploaded", detail: "Master Circular - July 2024", time: "25m ago", read: false },
  { id: "n3", type: "Tasks", title: "Task due tomorrow", detail: "Conduct Annual VAPT", time: "1h ago", read: false },
  { id: "n4", type: "AI", title: "Compliance score updated", detail: "Your score improved by 8%", time: "2h ago", read: true },
  { id: "n5", type: "AI", title: "AI analysis completed", detail: "Extracted 24 new obligations", time: "3h ago", read: true },
  { id: "n6", type: "Documents", title: "Document processing complete", detail: "Cybersecurity Framework", time: "5h ago", read: true },
  { id: "n7", type: "Tasks", title: "Task overdue", detail: "Update Compliance Manual is 2 days overdue", time: "6h ago", read: false },
  { id: "n8", type: "Risk", title: "Department risk elevated", detail: "Client Servicing moved to Medium risk", time: "8h ago", read: true },
  { id: "n9", type: "AI", title: "New obligations detected", detail: "6 obligations found in latest circular", time: "1d ago", read: true },
  { id: "n10", type: "Tasks", title: "Task assigned to you", detail: "Vendor Due-Diligence Review", time: "1d ago", read: true },
  { id: "n11", type: "Documents", title: "Document queued", detail: "Data Localization & Storage Norms", time: "2d ago", read: true },
  { id: "n12", type: "Risk", title: "Critical alert resolved", detail: "Incident response gap closed", time: "2d ago", read: true },
  { id: "n13", type: "AI", title: "Weekly digest ready", detail: "Your compliance summary for this week", time: "3d ago", read: true },
  { id: "n14", type: "Tasks", title: "Task status changed", detail: "Quarterly Risk Assessment moved to Review", time: "4d ago", read: true },
  { id: "n15", type: "Documents", title: "Annotation added", detail: "Legal added a note on Clause 6.1", time: "5d ago", read: true },
];

export const aiInsights = [
  { id: "i1", type: "detection", title: "6 new obligations detected", detail: "Extracted from the July 2024 Master Circular update across IT Security and Compliance.", severity: "Medium" as RiskLevel },
  { id: "i2", type: "alert", title: "2 regulations require immediate attention", detail: "Cybersecurity Framework changes conflict with your current incident response SLA.", severity: "High" as RiskLevel },
  { id: "i3", type: "gap", title: "Missing evidence on 4 obligations", detail: "VAPT certification not yet uploaded for two obligations due this quarter.", severity: "Medium" as RiskLevel },
  { id: "i4", type: "trend", title: "Compliance score improved by 8%", detail: "Driven by faster obligation closure in Risk Management and Operations.", severity: "Low" as RiskLevel },
  { id: "i5", type: "risk", title: "IT Security has the highest risk exposure", detail: "12 pending obligations with average age of 34 days.", severity: "High" as RiskLevel },
  { id: "i6", type: "recommendation", title: "Consolidate 3 overlapping KYC obligations", detail: "AI found duplicate obligations across two circulars that can be merged into one workflow.", severity: "Low" as RiskLevel },
  { id: "i7", type: "detection", title: "New reporting deadline identified", detail: "Half-yearly net worth certificate now due 15 days earlier than last cycle.", severity: "Medium" as RiskLevel },
  { id: "i8", type: "trend", title: "Audit readiness at 92%", detail: "Up from 84% last quarter across all departments.", severity: "Low" as RiskLevel },
  { id: "i9", type: "risk", title: "3 departments have overdue tasks", detail: "Client Servicing, IT Security and Risk Management have overdue items past 5 days.", severity: "High" as RiskLevel },
  { id: "i10", type: "recommendation", title: "Suggested next action", detail: "Prioritize closing the cybersecurity incident reporting gap before month-end.", severity: "Medium" as RiskLevel },
];

export const reports = [
  { id: "r1", name: "Compliance Report", description: "Complete compliance overview across departments", formats: ["PDF", "Excel"] },
  { id: "r2", name: "Executive Summary", description: "Board-ready generated executive summary", formats: ["PDF"] },
  { id: "r3", name: "Obligations Report", description: "All obligations with status and owners", formats: ["Excel", "CSV"] },
  { id: "r4", name: "Risk Report", description: "Risk analysis and mitigation summary", formats: ["PDF", "Excel"] },
  { id: "r5", name: "Audit Trail Export", description: "Full audit log for the selected period", formats: ["PDF", "CSV"] },
];

export const complianceTrend = [
  { month: "Jan", score: 78, risk: 30 }, { month: "Feb", score: 80, risk: 28 }, { month: "Mar", score: 83, risk: 26 },
  { month: "Apr", score: 85, risk: 24 }, { month: "May", score: 88, risk: 20 }, { month: "Jun", score: 90, risk: 18 },
  { month: "Jul", score: 92, risk: 14 },
];

export const obligationsByDept = departments.map((d) => ({ name: d.name, value: d.obligations }));

export const riskDistribution = [
  { name: "High", value: 18, color: "#EF4444" },
  { name: "Medium", value: 42, color: "#F59E0B" },
  { name: "Low", value: 68, color: "#22C55E" },
];

export const auditTrail = [
  { id: "a1", clause: "4.2.1", action: "VAPT report uploaded", owner: "Aarohi Mehta", time: "2024-05-12T10:30:00", status: "Verified" },
  { id: "a2", clause: "4.2.1", action: "Task completed", owner: "Rohan Verma", time: "2024-05-12T11:15:00", status: "Verified" },
  { id: "a3", clause: "4.2.2", action: "Incident logging updated", owner: "Neha Sharma", time: "2024-05-11T09:45:00", status: "Pending Review" },
  { id: "a4", clause: "5.2.1", action: "Data retention policy verified", owner: "Neha Sharma", time: "2024-05-11T09:45:00", status: "Verified" },
  { id: "a5", clause: "6.1.2", action: "Access control review marked compliant", owner: "Karan Mehta", time: "2024-05-10T16:20:00", status: "Verified" },
  { id: "a6", clause: "3.1.4", action: "Backup encryption certificate reviewed", owner: "Rohan Verma", time: "2024-05-10T08:05:00", status: "Verified" },
  { id: "a7", clause: "2.4.1", action: "Board policy approval logged", owner: "Ishaan Kapoor", time: "2024-05-09T14:10:00", status: "Verified" },
  { id: "a8", clause: "4.2.3", action: "Escalation matrix flagged for update", owner: "Arjun Malhotra", time: "2024-05-08T12:00:00", status: "Pending Review" },
];

export const complianceTimeline = [
  { id: "t1", title: "Master Circular - Investment Advisers", date: "2024-05-12", obligations: 48, departments: 4, status: "Processed" as Status },
  { id: "t2", title: "Audit Clarification on IA Regulations", date: "2024-05-06", obligations: 24, departments: 2, status: "Processed" as Status },
  { id: "t3", title: "Cybersecurity Framework", date: "2024-05-10", obligations: 33, departments: 3, status: "Processed" as Status },
  { id: "t4", title: "SEBI Circular - KYC Norms", date: "2024-05-05", obligations: 14, departments: 3, status: "Processed" as Status },
  { id: "t5", title: "Data Localization & Storage Norms", date: "2024-04-03", obligations: 0, departments: 0, status: "Queued" as Status },
];

export const changeDetection = {
  oldTitle: "Master Circular - May 2024",
  newTitle: "Audit Clarification - July 2024",
  added: [
    { clause: "4.2.1", text: "Conduct annual VAPT by CERT-In empanelled agencies within 60 days of policy renewal." },
  ],
  modified: [
    { clause: "4.5.1", old: "Maintain cybersecurity review annually.", new: "Maintain cybersecurity review and policy audit annually, with board sign-off." },
  ],
  removed: [
    { clause: "2.1.4", text: "Manual KYC form submission accepted for legacy clients." },
  ],
};

export type Kpi = {
  id: string; label: string; value: number; suffix?: string; trend: number; trendLabel: string; type: "ring" | "sparkline" | "static";
};

export const kpis: Kpi[] = [
  { id: "k1", label: "Compliance Score", value: 92, suffix: "%", trend: 8, trendLabel: "vs last month", type: "ring" },
  { id: "k2", label: "Total Obligations", value: 128, trend: 12, trendLabel: "new this month", type: "sparkline" },
  { id: "k3", label: "Pending Tasks", value: 17, trend: 3, trendLabel: "due soon", type: "sparkline" },
  { id: "k4", label: "High Risk Issues", value: 5, trend: 2, trendLabel: "from last week", type: "sparkline" },
  { id: "k5", label: "Departments", value: 8, trend: 0, trendLabel: "active & monitored", type: "static" },
  { id: "k6", label: "Documents Processed", value: 12, trend: 3, trendLabel: "this month", type: "sparkline" },
  { id: "k7", label: "AI Accuracy", value: 96, suffix: "%", trend: 2, trendLabel: "vs last month", type: "ring" },
];

export const currentUser = {
  name: "Aarohi Mehta",
  role: "Compliance Officer",
  email: "aarohi.mehta@finsecure.com",
  workspace: "FinSecure Advisors",
  initials: "AM",
};
