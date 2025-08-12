import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Search } from "lucide-react"; // ⬅️ Add this at top if not already
import Settings from "./Settings";


const courseSubjects = {
  "CA Final": [
    "Financial Reporting",
    "Advanced Financial Management",
    "Advanced Auditing, Assurance and Professional Ethics",
    "Direct Tax Laws & International Taxation",
    "Indirect Tax Laws",
    "Integrated Business Solutions"
  ],
  "CA Inter": [
    "Advanced Accounting",
    "Corporate and Other Laws",
    "Taxation",
    "Cost and Management Accounting",
    "Auditing and Ethics",
    "Financial Management and Strategic Management"
  ],
  "CA Foundation": [
    "Accounting",
    "Business Laws",
    "Quantitative Aptitude",
    "Business Economics"
  ],
  "CMA Final": [
    "Corporate and Economic Laws",
    "Strategic Financial Management",
    "Direct Tax Laws and International Taxation",
    "Strategic Cost Management",
    "Cost and Management Audit",
    "Corporate Financial Reporting",
    "Indirect Tax Laws and practice",
    "Elective - Strategic performance management and business valuation (SPMBV)",
    "Elective - Risk Management in Banking and Insurance (RMBI)",
    "Elective - Entrepreneurship and startup (ENTS)"
  ],
  "CMA Inter": [
    "Business Laws and Ethics",
    "Financial Accounting",
    "Direct and Indirect Taxation",
    "Cost Accounting",
    "Operations Management and Strategic Management",
    "Corporate Accounting and Auditing",
    "Financial Management and Business Data Analytics",
    "Management Accounting"
  ],
  "CMA Foundation": [
    "Fundamentals of Business Laws and Business Communications",
    "Fundamentals of Financial and Cost Accounting",
    "Fundamentals of Business Mathematics and Statistics",
    "Fundamentals of Business Economics and Management"
  ],
  "CS Executive": [
    "Jurisprudence, Interpretation & General Laws",
    "Company Law & Practice",
    "Setting up of Business, Industrial & Labour Laws",
    "Corporate Accounting & Financial Management",
    "Capital Markets & Securities Laws",
    "Economic, Commercial & Intellectual Property Laws",
    "Tax Laws and Practice"
  ],
  "CS Foundation": [
    "Business Environment and Law",
    "Business Management, Ethics & Entrepreneurship",
    "Business Economics",
    "Fundamentals of Accounting and Auditing"
  ],
  "CS Professional": [
    "Environmental, Social and Governance (ESG) – Principles & Practice",
    "Drafting, Pleadings & Appearances",
    "Compliance Management, Audit & Due Diligence",
    "Elective 4.1 CSR & Social Governance",
    "Elective 4.2 Internal & Forensic Audit",
    "Elective 4.3 Intellectual Property Rights - Law & Practice",
    "Elective 4.4 Artificial Intelligence, Data Analytics and Cyber Security – Laws & Practice",
    "Elective 4.5 Advanced Direct Tax Laws & Practice – Laws & Practice",
    "Strategic Management & Corporate Finance",
    "Corporate Restructuring, Valuation & Insolvency",
    "Elective 7.1 Arbitration, Mediation & Conciliation",
    "Elective 7.2 Goods & Services Tax (GST) & Corporate Tax Planning",
    "Elective 7.3 Labour Laws & Practice",
    "Elective 7.4 Banking & Insurance – Laws & Practice",
    "Elective 7.5 Insolvency and Bankruptcy – Law & Practice"
  ]
};

const courseChapters = {
  "CA Final": {
    "Financial Reporting": [
      "Introduction to Indian Accounting Standards",
      "Conceptual Framework for Financial Reporting under Indian Accounting Standards",
      "Ind AS on Presentation of General purpose Financial Statements",
      "Ind As on Measurement based on Accounting Policies",
      "Ind AS on Assets of Financial Statements",
      "Ind AS on Liabilties of Financial Statements",
      "Ind AS on Items impacting the Finacial Statements",
      "Ind AS on Disclosures in the Financial Statements",
      "Ind AS 115 Revenue from Contract with Customers",
      "Other Indian Accounting Standards",
      "Acounting and Reporting of Financial Instruments",
      "Ind AS 103 Business Combinations",
      "Consolidated and Separate Financial Statements of Group Entities",
      "Ind AS 101 First Time Adoption of Ind AS",
      "Analysis of Financial Statements",
      "Professional and Ethical Duty of a Chartered Accountant",
      "Accounting and Technology"
    ],
    "Advanced Financial Management": [
      "Financial Policy and Corporate Strategy",
      "Risk Mangement",
      "Advanced Capital Budgeting Decisions",
      "Security Analysis",
      "Security Valuation",
      "Portfolio Management",
      "Securitization",
      "Mutual Funds",
      "Derivatives Analysis abd Valuation",
      "Foreign Exchange Exposure and Risk Management",
      "International Financial Management",
      "Interest Rate Risk Management",
      "Business Valuation",
      "Mergers, Acquisitions and Corporate Restructuring",
      "Start up Finance"
    ],
    "Advanced Auditing, Assurance and Professional Ethics": [
      "Quality Control",
      "General Auditing Principles and Audiotors Responsibilities",
      "Audit Planning, Strategy and Execution",
      "Materiality, Risk Assessment and Internal Control",
      "Audit Evidence",
      "Completion and Review",
      "Reporting",
      "Specialised Areas",
      "Related Services",
      "Review of Financial Information",
      "Prospective Financial Information and other Assurance Services",
      "Digital Auditing & Assurance",
      "Group Audits",
      "Special Feautures of Audit of Banks & Non Banking Financial Companies",
      "Overview of Audit of Public Sector Undertakings",
      "Internal Audit",
      "Due Diligence, Investigation, Forensic Accounting",
      "Substantial Development Goals & ESG Assurance",
      "Professional Ethics & Liabilities of Auditors"
    ],
    "Direct Tax Laws & International Taxation": [
      "Basic Concepts",
      "Income which do not form part of Total Income",
      "Profits and Gains of Business and Profession",
      "Capital Gains",
      "Income From Other Sources",
      "Income of Other Persons included in Assessees Total Income",
      "Aggregation of Income, Set off or Carry forward of losses",
      "Deductions from Gross Total Income",
      "Assessment of Various Entities",
      "Assessment of Trusts and Institutions, Political parties and other Special Entities",
      "Tax Planning, Tax Avoidance and Tax Evasion",
      "Taxation of Digital Transactions",
      "Deduction, Collection and Recovery of tax",
      "Income Tax Authorities",
      "Assessment Procedure",
      "Appeals and Revision",
      "Dispute Resolution",
      "Miscellaneous Provisions",
      "Provisions to Counteract Unethical Tax Practices",
      "Tax Audit and Ethical Compliances",
      "Non Resident Taxation",
      "Double Taxation Relief",
      "Advance Rulings",
      "Transfer Pricing",
      "Fundamentals of BEPS",
      "Application and Interpretation of Tax Treaties",
      "Overview of Model Tax Conventions",
      "Latest Developments in Internationl Taxation"
    ],
    "Indirect Tax Laws": [
      "Supply under GST",
      "Charge of GST",
      "Place of Supply",
      "Exemptions from GST",
      "Time of Supply",
      "Value of Supply",
      "Input Tax Credit",
      "Registration",
      "Tax Invoice, Credit and Debit Notes",
      "Accounts and Records, E-Way Bill",
      "Payment of Tax",
      "Electronic Commerce Transactions",
      "Returns",
      "Import and Export under GST",
      "Refunds",
      "Job Work",
      "Assessment and Audit",
      "Inspection Search, Seizure and Arrest",
      "Demands and Recovery",
      "Liability to pay in Certain cases",
      "Offences and penalities and Ethical Aspects under GST",
      "Appeals and Revision",
      "Advance Ruling",
      "Miscellaneous Provisions",
      "Levy of and Exemptions from Customs Duty",
      "Types of Duty",
      "Classification of Imported and Export Goods",
      "Valuation under Customs Act, 1962",
      "Importation and Exportation of Goods",
      "Warehousing",
      "Refunds",
      "Foreign Trade Policy"
    ]
  },
  "CMA Final": {
    "Corporate and Economic Laws": [
      "The Companies Act, 2013",
      "Insolvency and Bankruptcy Code, 2016",
      "Corporate Governance, Social Responsibility and Sustainability",
      "SEBI Laws and Regulations",
      "The Competition Act, 2002",
      "Foreign Exchange Management Act, 1999",
      "Laws and Regulations related to Banking Sector",
      "Laws and Regulations related to Insurance Sector",
      "Special Legal Provisions relating to MSME Sector",
      "Laws and Regulations related to Cyber security and Data privacy",
      "Laws and Regulations related to Anti-Money Laundering"
    ],
    "Strategic Financial Management": [
      "Investment Decisions, Project planning and control",
      "Evaluation of Risky Proposals for Investment Decisions",
      "Leasing Decisions",
      "Securitization",
      "Introduction",
      "Equity and Bond Valuation and Evaluation of Performance",
      "Mutual Funds",
      "Portfolio Theory and Practice",
      "Asset Pricing Theories",
      "Portfolio Performance Evaluation and Portfolio Revision",
      "Efficient Market Hypothesis",
      "Risks in Financial Markets",
      "Financial Derivatives - Instruments for Risk Management",
      "The International Financial Environment",
      "Foreign Exchange Market",
      "Foreign Exchange Risk Management",
      "Digital Finance"
    ],
    "Direct Tax Laws and International Taxation": [
      "Assessment of Income and Computation of Tax Liability of Various Entities",
      "Tax Management, Return, and Assessment Procedure",
      "Grievance Redressal",
      "Penalties and Prosecutions",
      "Business Restructuring",
      "Different Aspects of Tax Planning",
      "CBDT and Other Authorities",
      "E-commerce Transactions and Liability in Special Cases",
      "Income Computation and Disclosure Standards",
      "Black Money Act, 2015",
      "Case Study",
      "Double Taxation and Avoidance Agreements",
      "Transfer Pricing",
      "GAAR"
    ],
    "Strategic Cost Management": [
      "Introduction to Strategic Cost Management",
      "Quality Cost Management",
      "Decision Making Techniques",
      "Activity Based Management and Just in Time",
      "Evaluating Performance",
      "Linear Programming",
      "Transportation",
      "Assignment",
      "Simulation",
      "Network Analysis - PERT, CPM",
      "Learning Curve",
      "Business Application of Maxima and Minima",
      "Business Forecasting Models (Time Series and Regression Analysis)",
      "Introduction to Tools for Data Analytics"
    ],
    "Cost and Management Audit": [
      "Basics of Cost Audit",
      "Companies (Cost Record and Audit) Rules, 2014",
      "Cost Auditor",
      "Overview of Cost Accounting Standards and GACAP",
      "Cost Auditing and Assurance Standards",
      "Cost Audit Programme",
      "Cost Audit Documentation, Audit Process and Execution",
      "Preparation and Filing of Cost Audit Report",
      "Basics of Management Audit",
      "Management Reporting Issues and Analysis",
      "Management Audit in Different Functions",
      "Evaluation of Corporate Image",
      "Information Systems Security Audit",
      "Internal Control and Internal Audit",
      "Operational Audit and Internal Audit under Companies Act, 2013",
      "Audit of Different Service Organisations",
      "Forensic Audit",
      "Anti-Money Laundering"
    ],
    "Corporate Financial Reporting": [
      "Specific Accounting Standards",
      "Valuation of Shares",
      "Accounting of Financial Instruments",
      "NBFCs Provisioning Norms, Accounting and Reporting",
      "Accounting for Business Combination & Restructuring",
      "Consolidated Financial Statements and Separate Financial Statements",
      "Recent Developments in Financial Reporting",
      "Government Accounting in India"
    ],
    "Indirect Tax Laws and practice": [
      "Supply under GST - A Refresh",
      "Time of Supply (Advanced)",
      "Place of Supply",
      "Valuation (Advanced)",
      "Input Tax Credit (Advanced)",
      "Zero Rated Supplies and Deemed Exports",
      "TDS & TCS under GST",
      "E-way Bill",
      "GST Refunds - Inverted Duty Structure and Zero Rated Supplies",
      "GST Returns",
      "Accounts and Records",
      "GST Annual Return and GST Audit Return",
      "Transistion to GST",
      "Dispute Resolution Mechanism under GST",
      "Inspection, Search, Seizure, Arrest and Prosecution",
      "Anti-Profiteering",
      "Walkthrough of GSTN Portal",
      "Valuation and Related Party Transactions",
      "Customs Procedures - Baggage & Courier/Post",
      "Manufacture in Bond",
      "Duty Drawback",
      "Customs (Import of Goods at Concessional Rate of Duty) Rules, 2017",
      "Remission of Duties",
      "Refund",
      "Trade Facilitation Measures",
      "Export Promotion Schemes under Foreign Trade Policy",
      "Special Economic Zone Scheme"
    ],
    "Elective - Strategic performance management and business valuation (SPMBV)": [
      "Introduction to Performance Management",
      "Performance Measurement, Evaluation and Improvement Tools",
      "Economic Efficiency of the Firm – Performance Analysis",
      "Enterprise Risk Management",
      "Fundamentals of Business Valuation",
      "Laws and Compliance in Business Valuation",
      "Business Valuation Methods and Approaches",
      "Valuation of Assets and Liabilities",
      "Valuation in Mergers and Acquisitions"
    ],
    "Elective - Risk Management in Banking and Insurance (RMBI)": [
      "Introduction to Risk Management",
      "Interest Rate Risk and Market Risk",
      "Credit Risk and Liquidity Risk",
      "Sovereign Risk and Insolvency Risk",
      "Operational Risk and Off-Balance Sheet Risk",
      "Introduction to Insurance Business",
      "Insurance Intermediaries, General Insurance, Health Insurance and Life Insurance",
      "Managing Risk in Insurance Business"
    ],
    "Elective - Entrepreneurship and startup (ENTS)": [
      "Entrepreneurial Skill Sets",
      "The Entrepreneurial Eco-system",
      "Idea to Action",
      "Value Addition",
      "Scalability, Scaling up and Stabilisation of Sustainable Business",
      "Risk Management Strategies",
      "Leadership",
      "Types of New Age Business"
    ],
  },
  "CS Professional": {
   "Environmental, Social and Governance (ESG) – Principles & Practice": [
      "Conceptual Framework of Corporate Governance",
      "Legislative Framework of Corporate Governance in India",
      "Board Effectiveness/Building Better Boards",
      "Board Processes through Secretarial Standards",
      "Board Committees",
      "Building Better Boards",
      "Governance in Professionally Managed vs Promoter Driven Companies",
      "Board Disclosures and Website Disclosures",
      "Data Governance",
      "Stakeholders Rights",
      "Business Ethics, Code of Conduct and Anti-Bribery",
      "Board’s Accountability on ESG",
      "Environment",
      "Corporate Social Responsibility (CSR)",
      "Green Initiatives",
      "Governance Influencers",
      "Empowerment of the Company Secretary Profession",
      "Risk Management",
      "Sustainability Audit, ESG Rating, Govt. Mandates",
      "Integrated & Global Reporting, BRSR"
    ],
    "Drafting, Pleadings & Appearances": [
      "Types of Documents",
      "General Principles of Drafting",
      "Laws relating to Drafting and Conveyancing",
      "Drafting of Agreements, Deeds and Documents",
      "Drafting of Commercial Contracts",
      "Documents under Companies Act, 2013",
      "Art of Opinion Writing",
      "Commercial Contract Management",
      "Judicial & Administrative Framework",
      "Pleadings",
      "Art of Advocacy and Appearances",
      "Applications, Petitions and Appeals under Companies Act, 2013",
      "Adjudications and Appeals under SEBI Laws",
      "Appearances before other Regulatory Authorities"
    ],
    "Compliance Management, Audit & Due Diligence": [
      "Compliance Framework",
      "Documentation & Maintenance of Records",
      "Signing and Certification",
      "Legal Framework Governing Company Secretaries",
      "Values, Ethics and Professional Conduct",
      "Non-Compliances, Penalties and Adjudications",
      "Relief and Remedies",
      "Concepts of Various Audits",
      "Audit Engagement",
      "Audit Principles and Techniques",
      "Audit Process and Documentation",
      "Forming an Opinion & Reporting",
      "Secretarial Audit",
      "Internal Audit & Performance Audit",
      "Peer Review and Quality Review",
      "Due Diligence" 
    ],
    "Strategic Management & Corporate Finance": [
      "Introduction to Strategic Management",
      "Analyzing External and Internal Environment",
      "Business Policy and Functional Strategy",
      "Strategic Analysis and Planning",
      "Competitive Positioning",
      "Managing Multi-Business Firms & Strategic Edge",
      "Sources of Corporate Funding",
      "Equity Funding and Procedures",
      "Real Estate Investment Trusts",
      "Infrastructure Investment Trusts",
      "Private Funding",
      "Non-Fund Based Funding",
      "IFSC Securities Listing",
      "Debt Funding and Procedures",
      "Foreign Funding – Institutions",
      "Foreign Funding – Instruments and Laws",
      "Role of Intermediaries in Fund Raising",
      "Project Evaluation"
    ],
    "Corporate Restructuring, Valuation & Insolvency": [
      "Types of Corporate Restructuring",
      "Acquisition of Company/Business",
      "Planning & Strategy",
      "Process of M&A Transactions",
      "Documentation – Merger & Amalgamation",
      "Accounting for Restructuring",
      "Tax and Stamp Duty in Restructuring",
      "Regulation of Combinations",
      "Regulatory Approvals of Schemes",
      "Fast Track Mergers",
      "Cross Border Mergers",
      "Overview of Business Valuation",
      "Valuation for Restructuring",
      "Insolvency",
      "CIRP Application",
      "Role of IP/IRP/RP",
      "Resolution Strategies",
      "Committee of Creditors Meetings",
      "Resolution Plan Preparation & Approval",
      "Pre-Pack Insolvency",
      "Cross Border Insolvency",
      "Liquidation After Failure",
      "Voluntary Liquidation",
      "Debt Recovery & SARFAESI",
      "Winding-up by Tribunal",
      "Strike Off & Restoration"   
    ],
    "Elective 4.1 CSR & Social Governance": [
      "Corporate Social Responsibility",
      "CSR Policy",
      "CSR Projects & Implementation Agency",
      "Social Impact Assessment & CSR Audit",
      "CSR Guidelines",
      "CSR and SDGs",
      "CSR Impact",
      "Social Governance",
      "Social Stock Exchange",
      "NCEs in Social Governance",
      "Societies and Trusts",
      "Partnership Firms",
      "Model Code for NCE Meetings",
      "Financial Reporting of NCEs",
      "Foreign Funding to NCEs",
      "Local Self Governance"
    ],
    "Elective 4.2 Internal & Forensic Audit": [
      "Internal Audit: Overview",
      "Internal Audit Practices",
      "Internal Controls",
      "Audit Planning",
      "Audit Tools and Techniques",
      "Internal Audit of Functions",
      "Internal Audit in Entities",
      "Audit Reporting",
      "Emerging Issues in Audit",
      "Basics of Forensic Audit",
      "Audit and Investigations",
      "Forensic Audit Laws",
      "Forensic Audit & Evidence Law",
      "Cyber Forensics",
      "Fraud Detection"
    ],
    "Elective 4.3 Intellectual Property Rights - Law & Practice": [
      "Introduction to IPR",
      "Types of IPR",
      "Role of International Institutions",
      "Indian Patent Law",
      "Patent Databases & Info Systems",
      "Patent Documentation & Infringement",
      "Trademarks",
      "Copyrights",
      "Industrial Designs",
      "Geographical Indications",
      "Layout Designs of ICs",
      "Trade Secrets",
      "Biological Diversity",
      "Plant Variety Protection",
      "IPR Commercialization"
    ],
    "Elective 4.4 Artificial Intelligence, Data Analytics and Cyber Security – Laws & Practice": [
      "Intro to AI",
      "Cyber Security Basics",
      "Cyber Threats & Laws",
      "Cyber Crimes & Investigation",
      "AI & Cyber Regulatory Framework",
      "Data Analytics and Law",
      "Computer Hardware & Software",
      "Network & Software Security",
      "Software Security",
      "Database Management",
      "Data Analytics",
      "Information Systems",
      "MIS Overview",
      "ERP Overview",
      "Internet & Technologies"  
    ],
    "Elective 4.5 Advanced Direct Tax Laws – Law & Practice": [
      "Income & Tax for Non-Company Entities",
      "Company Tax Filing",
      "Tax on Special Transactions",
      "Tax Audit",
      "Assessment",
      "Appeals",
      "Transfer Pricing & GAAR",
      "DTAA"
    ],
    "Elective 7.1 Arbitration, Mediation & Conciliation": [
      "Arbitration Basics",
      "Commercial Transactions",
      "Arbitration Procedure",
      "Arbitral Proceedings",
      "Award Preparation",
      "Award Challenges",
      "Fast Track & Virtual Arbitration",
      "Stock Exchange Arbitration",
      "Intl Commercial Arbitration",
      "Intl Arbitration Law",
      "Intro to Conciliation",
      "Conciliation Procedures",
      "Mediation Process & Rules",
      "Negotiation & Communication",
      "Mediation Scope",
      "Emerging Global Mediation"
    ],
    "Elective 7.2 Goods & Services Tax (GST) & Corporate Tax Planning": [
      "GST Overview",
      "Supply under GST",
      "Time of Supply",
      "Value of Supply",
      "Input Tax Credit & GST Computation",
      "GST Procedural Compliance",
      "Assessment, Audit, Appeals",
      "Inspection, Penalties",
      "GST Rating & ARs",
      "Corporate Tax Planning Overview",
      "Tax Planning by Business Nature",
      "Tax Planning by Location",
      "Managerial Decisions & Tax",
      "Tax Planning in Restructuring"
    ],
    "Elective 7.3 Labour Laws & Practice": [
      "Constitution & Labour Laws",
      "ILO",
      "Welfare & Working Conditions",
      "Industrial Relations Law",
      "Law of Wages",
      "Social Security Laws",
      "Returns & Registers Act",
      "Labour Codes",
      "Labour Laws Audit"
    ],
    "Elective 7.4 Banking & Insurance – Laws & Practice": [
      "Indian Banking System Overview",
      "Bank Regulations",
      "Bank Organization Control",
      "Banking Operations",
      "Digital Banking",
      "Negotiable Instruments",
      "Govt Schemes",
      "Consumer Protection",
      "Advances & Securities",
      "Interest and Annuities",
      "NPA",
      "Bank Financial Analysis",
      "Risk Management & Basel",
      "Insurance Concepts",
      "Insurance Regulations",
      "Life Insurance",
      "General & Health Insurance",
      "Insurance Functions I-V",
      "Investigation & Appeals",
      "Opportunities in Insurance"
    ],  
    "Elective 7.5 Insolvency and Bankruptcy – Law & Practice": [
      "Intro to IBC",
      "CIRP",
      "Resolution Strategies",
      "Fast Track CIRP",
      "Corporate Liquidation",
      "Voluntary Liquidation",
      "Adjudication for Corporate Persons",
      "Pre-Pack Insolvency",
      "Debt Recovery & SARFAESI",
      "Winding-Up by Tribunal",
      "Insolvency of Individuals/Firms",
      "Bankruptcy Orders",
      "Bankruptcy Process",
      "Fresh Start Process",
      "Professional Ethics",
      "Group Insolvency",
      "Cross Border Insolvency"
    ],
  },
  "CA Inter": {
    "Advanced Accounting": [
      "Introduction to Accounting Standards",
      "Framework for Preparation and Presentation of Financial Statements",
      "Applicability of Accounting Standards",
      "Presentation and Disclosure based Accounting Standards",
      "Assets Based Accounting Standards",
      "Liabilities Based Accounting Standards",
      "Accounting Standards based on Items impacting Financial Statement",
      "Revenue based Accounting Standards",
      "Other Accounting Standards",
      "Accounting Standards for Consolidated Financial Statement",
      "Financial Statement of Companies",
      "Buy Back of Securities",
      "Internal Reconstruction",
      "Accounting for Branches including Foreign Branches"
    ],
    "Corporate and Other Laws": [
      "Preliminary",
      "Incorporation of Company and Matters Incidental thereto",
      "Prospectus and Allotment of Securities",
      "Share Capital and Debentures",
      "Acceptance of Deposits by Companies",
      "Registration of Charges",
      "Management and Administration",
      "Declaration and Payment of Dividend",
      "Accounts of Companies",
      "Audit and Auditors",
      "Companies Incorporated outside India",
      "Limited Liability Partnership Act, 2008",
      "The General Clause Act, 1897",
      "Interpretation of Statutes",
      "The Foreign Exchange Management Act, 1999"
    ],
    "Taxation": [
      "Basic Concepts",
      "Residence and Scope of Total Income",
      "Heads of Income",
      "Income of other Persons included in Assessee's Total Income",
      "Aggregation of Income, Set-Off and Carry Forward of Losses",
      "Deductions of Gross Total Income",
      "Advance Tax, Tax Deduction at Source and Tax Collection at Source",
      "Provisions for Filing Return of Income and Self Assessment",
      "Income Tax Liability - Computation and Optimisation",
      "GST in India - An Introduction",
      "Supply under GST",
      "Charge of GST",
      "Place of Supply",
      "Exemptions From GST",
      "Time of Supply",
      "Value of Supply",
      "Input Tax Credit",
      "Registration",
      "Tax Invoice, Credit and Debit Notes",
      "Accounts and Records",
      "E-Way Bill",
      "Payment of Tax",
      "Tax Deduction at Source and Collection at Source",
      "Returns"
    ],
    "Cost and Management Accounting": [
      "Introduction to Cost and Management Accounting",
      "Material Cost",
      "Employee Cost and Direct Expenses",
      "Overheads - Absorption Costing Method",
      "Activity Based Costing",
      "Cost Sheet",
      "Cost Accounting Systems",
      "Unit & Batch Costing",
      "Job Costing",
      "Process and Operation Costing",
      "Joint Products and By Products",
      "Service Costing",
      "Standard Costing",
      "Marginal Costing",
      "Budgets and Budgetary Control"
    ],
    "Auditing and Ethics": [
      "Nature, Objective and Scope of Audit",
      "Audit Strategy, Audit Planning and Audit Programme",
      "Risk Assessment and Internal Control",
      "Audit Evidence",
      "Audit of Items of Financial Statements",
      "Audit Documentation",
      "Completion and Review",
      "Audit Report",
      "Special Features of Audit of Different Types of Entities",
      "Audit of Banks",
      "Ethics and Terms of Audit Engagements"
    ],
    "Financial Management and Strategic Management": [
      "Scope and Objectives of Financial Management",
      "Types of Financing",
      "Financial Analysis and Planning - Ratio Analysis",
      "Cost of Capital",
      "Financing Decisions - Capital Structure",
      "Financing Decisions - Leverages",
      "Investment Decisions",
      "Dividend Decision",
      "Management of Working Capital",
      "Introduction to Strategic Management",
      "Strategic Analysis - External Environment",
      "Strategic Analysis - Internal Environment",
      "Strategic Choices",
      "Strategy Implementation and Evaluation"
    ],
  },
  "CMA Inter": {
    "Business Laws and Ethics": [
      "Introduction to Law and Legal System in India",
      "Indian Contract Act, 1872",
      "Sale of Goods Act, 1930",
      "Negotiable Instruments Act, 1881",
      "Indian Partnership Act, 1932",
      "Limited Liability Partnership Act, 2008",
      "Factories Act, 1948",
      "Payment of Gratuity Act, 1972",
      "Employees Provident Fund and Miscellaneous Provisions Act, 1952",
      "Employees State Insurance Act, 1948",
      "The Code on Wages, 2019",
      "Companies Act, 2013",
      "Business Ethics and Emotional Intelligence"
    ],
    "Financial Accounting": [
      "Accounting Fundamentals",
      "Bills of Exchange, Consignment, Joint Venture",
      "Preparation of Financial Accounts of Commercial Organisations, Not for profit Organisations and from Incomplete Records",
      "Partnership Accounting",
      "Lease Accounting",
      "Branch (Including Foreign Branch) and Departmental Accounts",
      "Insurance Claim for Loss of Stock and Loss of Profit",
      "Hire Purchase and Installment Sale Transactions",
      "Accounting Standards"
    ],
    "Direct and Indirect Taxation": [
      "Basic of Income Tax Act",
      "Heads of Income",
      "Total Income and Tax Liability of Individuals & HUF",
      "Concept of Indirect Taxes",
      "Goods and Service Tax Laws",
      "Customs Act & Rules"
    ],
    "Cost Accounting": [
      "Introduction to Cost Accounting",
      "Cost Ascertainment - Elements of Cost",
      "Cost Accounting Standards",
      "Cost Book Keeping",
      "Methods of Costing",
      "Cost Accounting Techniques"
    ],
    "Operations Management and Strategic Management": [
      "Introduction",
      "Operations Planning",
      "Designing of Operational Systems and Control",
      "Application of Operation Research - Production Planning and Control",
      "Productivity Management and Control Management",
      "Project Management, Monitoring and Control",
      "Economics of Maintenance and Spares Management",
      "Strategic Analysis and Strategic Planning",
      "Formulation and Implementation of Strategy",
      "Digital Strategy"
    ],
    "Corporate Accounting and Auditing": [
      "Accounting for Shares and Debentures",
      "Preparation of the Statement of Profit and Loss (As per Schedule III of Companies Act, 2013)",
      "Cash Flow Statement",
      "Accounts of Banking, Electricity and Insurance Companies",
      "Accounting Standards",
      "Basic Concepts of Auditing",
      "Provisions Relating to Audit under Companies Act, 2013",
      "Audit of Different Types of Undertakings"
    ],
    "Financial Management and Business Data Analytics": [
      "Fundamentals of Financial Management",
      "Institutions and Instruments in Financial Markets",
      "Tools for Financial Analysis",
      "Sources of Finance and Cost of Capital",
      "Capital Budgeting",
      "Working Capital Management",
      "Financing Decisions of a Firm",
      "Introduction to Data Science for Business Decision Making",
      "Data Processing, Organisation, Cleaning and Validation",
      "Data Presentation - Visualisation and Graphical Presentation",
      "Data Analysis and Modelling"
    ],
    "Management Accounting": [
      "Introduction to Management Accounting",
      "Activity Based Costing",
      "Marginal Costing",
      "Application of Marginal Costing in Short Term Decision Making",
      "Transfer Pricing",
      "Standard Costing and Variance Analysis",
      "Forecasting, Budgeting and Budgetary Control",
      "Divisional Performance Measurement",
      "Responsibility Accounting",
      "Decision Theory"
    ]
  },
  "CS Executive": {
    "Jurisprudence, Interpretation & General Laws": [
      "Sources of Law",
      "Constitution of India",
      "Interpretation of Statutes",
      "Administrative Laws",
      "Law of Torts",
      "Law relating to Civil Procedure",
      "Laws relating to Crime and its Procedure",
      "Law relating to Evidence",
      "Law relating to Specific Relief",
      "Law relating to Limitation",
      "Law relating to Arbitration, Mediation and Conciliation",
      "Indian Stamp Law",
      "Law relating to Registration of Documents",
      "Right to Information Law",
      "Law relating to Information Technology",
      "Contract Law",
      "Law relating to Sale of Goods",
      "Law relating to Negotiable Instruments"
    ],
    "Company Law & Practice": [
      "Introduction to Company Law",
      "Legal Status and Types of Registered Companies",
      "Memorandum and Articles of Associations and its Alteration",
      "Share and Share Capital - Concepts",
      "Members and Shareholders",
      "Debt Instruments - Concepts",
      "Charges",
      "Distribution of Profits",
      "Accounts and Auditors",
      "Compromise, Arrangement and Amalgamations - Concepts",
      "Dormant Company",
      "Inspection, Inquiry and Investigation",
      "General Meetings",
      "Directors",
      "Board Composition and Powers of the Board",
      "Meetings of Board and its Committees",
      "Corporate Social Responsibility - Concepts",
      "Annual Report - Concepts",
      "Key Managerial Personnel (KMP’s) and their Remuneration"
    ],
    "Setting up of Business, Industrial & Labour Laws": [
      "Selection of Business Organization",
      "Corporate Entities – Companies",
      "Limited Liability Partnership",
      "Startups and its Registration",
      "Micro, Small and Medium Enterprises",
      "Conversion of Business Entities",
      "Non-Corporate Entities",
      "Financial Services Organization",
      "Business Collaborations",
      "Setting up of Branch Office/ Liaison Office/ Wholly Owned Subsidiary by Foreign Company",
      "Setting up of Business outside India and Issue Relating thereto",
      "Identifying laws applicable to various Industries and their initial compliances",
      "Various Initial Registrations and Licenses",
      "Constitution and Labour Laws",
      "Evaluation of Labour Legislation and need of Labour Code",
      "Law of Welfare & Working Condition",
      "Law of Industrial Relations",
      "Law of Wages",
      "Social Security Legislations",
      "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013"
    ],
    "Corporate Accounting & Financial Management": [
      "Introduction to Accounting",
      "Introduction to Corporate Accounting",
      "Accounting Standards (AS)",
      "Accounting for Share Capital",
      "Accounting for Debentures",
      "Related Aspects of Company Accounts",
      "Consolidation of Accounts",
      "Financial Statement Analysis",
      "Cash Flows",
      "Forecasting Financial Statements",
      "Introduction (FM)",
      "Time Value of Money",
      "Capital Budgeting",
      "Cost of Capital",
      "Capital Structure",
      "Dividend Decisions",
      "Working Capital Management",
      "Security Analysis",
      "Operational Approach to Financial Decision"
    ],
    "Capital Markets & Securities Laws": [
      "Basics of Capital Market",
      "Secondary Market in India",
      "Securities Contracts (Regulation) Act, 1956",
      "Securities and Exchange Board of India",
      "Laws Governing Depositories and Depository Participants",
      "Securities Market Intermediaries",
      "International Financial Services Centres Authority (IFSCA)",
      "Issue of Capital & Disclosure Requirements",
      "Share Based Employee Benefits and Sweat Equity",
      "Issue and Listing of Non-Convertible Securities",
      "Listing Obligations and Disclosure Requirements",
      "Acquisition of Shares and Takeovers – Concepts",
      "Prohibition of Insider Trading",
      "Prohibition of Fraudulent and Unfair Trade Practices Relating to Securities Market",
      "Delisting of Equity Shares",
      "Buy-Back of Securities",
      "Mutual Funds",
      "Collective Investment Schemes"
    ],
    "Economic, Commercial & Intellectual Property Laws": [
      "Law relating to Foreign Exchange Management",
      "Foreign Direct Investments – Regulations & Policy",
      "Overseas Direct Investment",
      "External Commercial Borrowings (ECB)",
      "Foreign Trade Policy & Procedure",
      "Law relating to Special Economic Zones",
      "Law relating to Foreign Contribution Regulation",
      "Prevention of Money Laundering",
      "Law relating to Fugitive Economic Offenders",
      "Law relating to Benami Transactions & Prohibition",
      "Competition Law",
      "Law relating to Consumer Protection",
      "Legal Metrology",
      "Real Estate Regulation and Development Law",
      "Intellectual Property Rights",
      "Law relating to Patents",
      "Law relating to Trade Marks",
      "Law relating to Copyright",
      "Law relating to Geographical Indications of Goods",
      "Law relating to Designs"
    ],
    "Tax Laws and Practice": [
      "Direct Taxes – At a Glance",
      "Basic Concept of Income Tax",
      "Incomes which do not form part of Total Income",
      "Income under the head Salary",
      "Income under the head House Property",
      "Profits and Gains from Business and Profession",
      "Capital Gains",
      "Income from Other Sources",
      "Clubbing provisions and Set off and / or Carry forward of Losses",
      "Deductions",
      "Computation of Total Income and Tax Liability of various Entities",
      "Classification and Tax incidence on Companies",
      "Procedural Compliance",
      "Concept of Indirect Taxes at a Glance",
      "Basics of Goods and Services Tax ‘GST’",
      "Levy and Collection of GST",
      "Time, Value & Place of Supply",
      "Input Tax Credit & Computation of GST Liability",
      "Procedural Compliance under GST",
      "Overview of Customs Act"
    ]
  },
  "CA Foundation": {
    "Accounting": [
      "Theoritical Framework",
      "Accounting Process",
      "Bank Reconciliation Statement",
      "Inventories",
      "Depreciation and Amortisation",
      "Bills of Exchange and Promissory Notes",
      "Preparation of Final Accounts of Sole Proprietors",
      "Financial Statements of Non profit Organisations",
      "Accounts from Incomplete Records",
      "Partnership and LLP Accounts",
      "Company Accounts"
    ],
    "Business Laws": [
      "Indian Regulatory Framework",
      "The Indian Contract Act, 1872",
      "The Sale of Goods Act, 1930",
      "The Indian Partnership Act, 1932",
      "The Limited Liability Partnership Act, 2008",
      "The Companies Act, 2013",
      "The Negotiable Instruments Act, 1881"
    ],
    "Quantitative Aptitude": [
      "Ratio and Proportion, Indices, Logarithms",
      "Equations",
      "Linear Inequalities",
      "Mathematics of Finance",
      "Basic Concepts of Permutations and Combinations",
      "Sequence and Series - Arithmetic and Geometric Progressions",
      "Sets, Relations and Functions",
      "Basics of Limits and Continuity functions",
      "Basic Applications of Differential and Integral Calculus in Business and Economics",
      "Number Series, Coding Decoding, and Odd man out",
      "Direction Sense Test",
      "Seating Arrangements",
      "Blood Relations",
      "Measures of Central Tendency and Dispersion",
      "Probability",
      "Theoretical Distributions",
      "Correlation and Regressions",
      "Index Numbers"
    ],
    "Business Economics": [
      "Nature and Scope of Business Economics",
      "Theory of Demand and Supply",
      "Theory of Production and Cost",
      "Price Determination in different markets",
      "Business Cycles",
      "Determination of National Income",
      "Public Finance",
      "Money Market",
      "International Trade",
      "Indian Economy"
    ]
  },
  "CMA Foundation": {
    "Fundamentals of Business Laws and Business Communications": [
      "Introduction",
      "Indian Contract Act, 1872",
      "Sale of Goods Act, 1930",
      "Negotiable Instruments Act, 1881",
      "Business Communication"
    ],
    "Fundamentals of Financial and Cost Accounting": [
      "Accounting Fundamentals",
      "Accounting for Special Transactions",
      "Preparation of Final Accounts",
      "Fundamentals of Cost Accounting"
    ],
    "Fundamentals of Business Mathematics and Statistics": [
      "Arithmetic",
      "Algebra",
      "Calculus - Application in Business",
      "Mathematics of Finance",
      "Statistical Representation of Data",
      "Measures of Central Tendency and Dispersion",
      "Correlation and Regressions",
      "Probability",
      "Index Numbers & Time Series"
    ],
    "Fundamentals of Business Economics and Management": [
      "Basic Concepts",
      "Forms of Market",
      "Money and Banking",
      "Economic and Business Environment",
      "Fundamentals of Management"
    ]
  },
  "CS Foundation": {
    "Business Environment and Law": [
      "Business Environment",
      "Forms of Business Organization",
      "Scales of Business",
      "Emerging Trends in Business",
      "Business Functions",
      "Introduction to Law",
      "Elements of Company Law",
      "Elements of Law relating to Partnership and LLP",
      "Elements of Law relating to Contract",
      "Elements of Law relating to Sale of Goods",
      "Elements of Law relating to Negotiable Instruments",
      "Elements of Information Technology Act",
      "Role of CS - Duties and Responsibilities, Areas of Practice"
    ],
    "Business Management, Ethics & Entrepreneurship": [
      "Planning",
      "Organizing",
      "Human Resource Management",
      "Direction and Co-ordination",
      "Controlling",
      "Recent Trends in Management",
      "Business Ethics",
      "Business Communication",
      "Essentials of Good English",
      "Business Correspondence",
      "Interdepartmental Communication",
      "E Correspondence",
      "Entrepreneurship",
      "Entrepreneurship - Creativity and Innovation",
      "Growth and Challenges of Entrepreneurial Ventures",
      "Social Entrepreneurship",
      "Government Initiatives for Business Development"
    ],
    "Business Economics": [
      "The Fundamentals of Economics",
      "Basic Elements of Demand and Supply",
      "Theory of Consumer Behaviour",
      "Theory of Production and Costs",
      "Analysis of Markets",
      "Indian Economy - An Overview",
      "Basic Elements of Money and Banking",
      "Descriptive Statistics",
      "Mathematics of Finance and Elementary Probability"
    ],
    "Fundamentals of Accounting and Auditing": [
      "Theoretical Framework",
      "Accounting Process",
      "Bank Reconciliation Statement – Meaning; Causes of difference between Bank Book Balance and Balance as per Bank Pass",
      "Depreciation Accounting",
      "Preparation of Final Accounts for Sole Proprietors",
      "Partnership Accounts",
      "Joint Venture and Consignment Account",
      "Introduction to Company Accounts",
      "Accounting for Non-Profit Organisations",
      "Computerized Accounting Environment",
      "Auditing",
      "Audits and Auditor’s Reports"
    ]
  }
};


const App = () => {
  const [questionId, setQuestionId] = useState(null);
  const [query, setQuery] = useState('');
  const [matchedQuestions, setMatchedQuestions] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [customApproach, setCustomApproach] = useState('');
  const [imageURLs, setImageURLs] = useState([]);
  const [userId, setUserId] = useState('student 123'); // Replace with actual logic later
  const [ragResponse, setRagResponse] = useState("");
  const [userRole, setUserRole] = useState('student'); // 'admin' or 'student'
  const [showLogin, setShowLogin] = useState(true); // toggle between login/register
  const [authData, setAuthData] = useState({ email: '', password: '', full_name: '', exam_level: '' });
  const [showAskAI, setShowAskAI] = useState(false);
  const [askAIQuery, setAskAIQuery] = useState('');
  const [askAIResponse, setAskAIResponse] = useState('');
  const [askAILoading, setAskAILoading] = useState(false);
  const [icaiNotifications, setIcaiNotifications] = useState([]);
  const [prevNotifs, setPrevNotifs] = useState([]);
  const [showNotifBadge, setShowNotifBadge] = useState(false);
  const [lastFetchedTime, setLastFetchedTime] = useState('');
  const prevNotifsRef = useRef([]);
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);  // for menu dropdown
  const [ragQuery, setRagQuery] = useState('');
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResponseCA, setRagResponseCA] = useState("");
  const [ragResponseCMA, setRagResponseCMA] = useState("");
  const [ragResponseCS, setRagResponseCS] = useState("");
  const [ragLoadingCA, setRagLoadingCA] = useState(false);
  const [ragLoadingCMA, setRagLoadingCMA] = useState(false);
  const [ragLoadingCS, setRagLoadingCS] = useState(false);
  const [ragQueryCMA, setRagQueryCMA] = useState('');
  const [ragQueryCS, setRagQueryCS] = useState('');
  const [showCAGPT, setShowCAGPT] = useState(false);
  const [showCMAGPT, setShowCMAGPT] = useState(false);
  const [showCSGPT, setShowCSGPT] = useState(false);
  const [queryCA, setQueryCA] = useState('');
  const [queryCMA, setQueryCMA] = useState('');
  const [queryCS, setQueryCS] = useState('');
  const [responseCA, setResponseCA] = useState('');
  const [responseCMA, setResponseCMA] = useState('');
  const [responseCS, setResponseCS] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [deletedImages, setDeletedImages] = useState([]);

  
  const groupByDate = (history) => {
    return history.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toDateString();
      acc[date] = acc[date] || [];
      acc[date].push(entry);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchSavedImages = async () => {
      if (!userId || !selectedResult?.questionId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-approach?userId=${userId}&questionId=${selectedResult.questionId}`);
        const data = await response.json();

        if (data && data.imageURLs && Array.isArray(data.imageURLs)) {
          setImageURLs(data.imageURLs);
        }
      } catch (err) {
        console.error("Failed to load saved images:", err);
      }
    };

    fetchSavedImages();
  }, [userId, selectedResult]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/icai-notifications`);
        const data = await res.json();

        if (data.updates) {
          // Compare with previous
          if (
            prevNotifsRef.current.length > 0 &&
            JSON.stringify(data.updates) !== JSON.stringify(prevNotifsRef.current)
          ) {
            setShowNotifBadge(true); // 🔴 Show badge if changed
            setTimeout(() => setShowNotifBadge(false), 3000);
          }

          prevNotifsRef.current = data.updates;      // ✅ Store in ref instead of state
          setIcaiNotifications(data.updates);         // Display to user
          setLastFetchedTime(data.timestamp);        // Save timestamp
        }
      } catch (err) {
        console.error("Failed to fetch ICAI notifications", err);
      }
    };

    fetchNotifications();                    // Initial call
    const interval = setInterval(fetchNotifications, 60000); // Check every 1 min

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAuthInput = (e) => {
  setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authData.email, password: authData.password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Login failed');

      alert('✅ Login Successful');
      setUserId(data.user_id);
      setUserRole(data.role);
      // ✅ Fetch previous history
      const histRes = await fetch(`${import.meta.env.VITE_API_URL}/get-search-history?user_id=${data.user_id}`);
      const histData = await histRes.json();
      setSearchHistoryList(histData);
      setShowLogin(false); // hide form after login
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Registration failed');

      alert('✅ Registered successfully. Please login.');
      setShowLogin(true);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };


  const handleRagQuery = async () => {
  if (!ragQuery.trim()) return;

  setRagLoading(true);
  setRagResponse('');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/rag-approach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: ragQuery })
    });

    const data = await res.json();
    setRagResponseCA(res.ok ? data.response : "❌ " + (data.detail || "Failed to fetch explanation"));
  } catch (err) {
    console.error("RAG request failed:", err);
    setRagResponseCA("❌ Request failed");
  }
  setRagLoadingCA(false);
};

  const handleRagQueryCMA = async () => {
  if (!ragQueryCMA.trim()) return;

  setRagLoading(true);
  setRagResponse('');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/rag-approach-cma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: ragQueryCMA })
    });

    const data = await res.json();
    setRagResponseCMA(res.ok ? data.response : "❌ " + (data.detail || "Failed to fetch explanation"));
  } catch (err) {
    console.error("RAG request failed:", err);
    setRagResponseCMA("❌ Request failed");
  }
  setRagLoadingCMA(false);
};

  const handleRagQueryCS = async () => {
  if (!ragQueryCS.trim()) return;

  setRagLoading(true);
  setRagResponse('');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/rag-approach-cs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: ragQueryCS })
    });

    const data = await res.json();
    setRagResponseCS(res.ok ? data.response : "❌ " + (data.detail || "Failed to fetch explanation"));
  } catch (err) {
    console.error("RAG request failed:", err);
    setRagResponseCS("❌ Request failed");
  }
  setRagLoadingCS(false);
};

  const handleAskGpt = async (query, model, setResponse) => {
    if (!query.trim()) return;

    let endpoint = "";

    if (model === "ca") endpoint = "/rag-approach";
    else if (model === "cma") endpoint = "/rag-approach-cma";
    else if (model === "cs") endpoint = "/rag-approach-cs";

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });

      const data = await res.json();
      setResponse(data.response || "⚠️ No answer received.");
    } catch (err) {
      console.error("❌ GPT RAG Error:", err);
      setResponse("❌ Error fetching explanation.");
    }
  };
 

  const handleSearch = async (customQuery) => {
    const searchText = customQuery || query;
    if (!searchText.trim()) return;

    setLoading(true);
    setSelectedResult(null);
    setNoResults(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchText,
          level: selectedLevel,
          subject: selectedSubject,
          chapter: selectedChapter 
        }),
      });

      const data = await response.json();
      const results = Object.values(data.full_data || {});

      if (results.length === 0) {
        setMatchedQuestions([]);
        setCachedResults([]);
        setNoResults(true);
      } else {
        setMatchedQuestions(results);
        setCachedResults(results);
        setNoResults(false);

        // ✅ Save search to backend
        await fetch(`${import.meta.env.VITE_API_URL}/save-search-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            query: searchText,
            level: selectedLevel,
            subject: selectedSubject,
            chapter: selectedChapter,
            timestamp: new Date().toISOString(),
            results: results, // 🆕 send full results
          }),
        });

        setSearchHistoryList((prev) => [
          {
            user_id: userId,
            query: searchText,
            level: selectedLevel,
            subject: selectedSubject,
            chapter: selectedChapter,
            timestamp: new Date().toISOString(),
            results: results,  // 🆕 store locally too
          },
          ...prev,
        ]);



        // Add to search history only if it’s not from history click
        if (!customQuery) {
          setSearchHistory((prev) => [
            searchText,
            ...prev.filter((q) => q !== searchText),
          ]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching results:', error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelect = async (result) => {
    setSelectedResult(result);
    setQuestionId(result.questionId);  // ✅ Use the exact field name from Weaviate
    setQuery(''); // ✅ Clear the search bar
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsEditing(false);
    setCustomApproach(''); // Reset before fetching
    setRagResponse(""); // ✅ Reset previous RAG output

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/get-approach?user_id=${userId}&question_id=${result.questionId}`);
      const data = await res.json();
      setCustomApproach(data.custom_approach || '');
      setImageURLs(data.image_urls || []);
    } catch (err) {
      console.error("Error loading custom approach:", err);
    }
  };

  const handleBack = () => {
    setSelectedResult(null);
    setMatchedQuestions(cachedResults);
  };

  const handleSaveApproach = async () => {
    // ✅ Optional safety check before trying to save
    if (!questionId) {
      alert("Question ID is missing. Please select a question first.");
      return;
    }
    try {
      console.log("Saving with:", {
        questionId: questionId,
        user_id: userId,
        custom_approach: customApproach,
        image_urls: imageURLs,
        deleted_images: deletedImages,
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/save-approach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          question_id: questionId,
          custom_approach: customApproach,
          image_urls: imageURLs, // ✅ Add this
          deleted_images: deletedImages, // ✅ added
        })
      });

      const data = await response.json();
      console.log("Save response:", data);

      if (response.ok) {
        alert("Saved successfully!");
        setIsEditing(false);  // ✅ Add this here
        setDeletedImages([]);  // ✅ Reset deleted image list
      } else {
        alert("Failed to save.");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving approach.");
    }
  };

  const fetchRagApproach = async (ragQuery) => {
    setRagLoading(true);
    setRagResponse("⏳ Generating explanation...");

    try {
      const res = await fetch("http://127.0.0.1:8000/rag-approach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: ragQuery }),
      });

      const data = await res.json();
      if (res.ok) {
        setRagResponse(data.response);
      } else {
        setRagResponse(data.detail || "❌ Failed to fetch explanation");
      }
    } catch (err) {
      console.error("RAG Error:", err);
      setRagResponse("❌ RAG request failed");
    }

    setRagLoading(false);
  };
  

  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      if (file.size > 51200) {
        alert(`Image "${file.name}" is too large. Max allowed size is 50 KB.`);
        continue; // Skip this file
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ca_final_tool"); // 🔁 Change this
      formData.append("folder", `user_uploads/${userId}/${selectedResult.questionId}`); // Optional foldering

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dxe2ybdcv/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    // ✅ Add to imageURLs state
    setImageURLs((prev) => [...prev, ...uploadedUrls]);
  };

  const handleImageDelete = (url) => {
    setImageURLs((prev) => prev.filter((img) => img !== url));
    setDeletedImages((prev) => [...prev, url]);
  };
  

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
    {showSettings && (
      <div className="absolute inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
        <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
          <Settings userId={userId} />

          {/* 🌗 Theme Toggle */}
          <div className="flex items-center justify-between py-2 mt-4">
            <span className="text-sm font-medium">🌗 Theme</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-4 text-red-500 hover:underline"
          >
            ✖ Close
          </button>
        </div>
      </div>
    )}

    {/*
      {!userId && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-8 w-[90%] max-w-md shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-center">{showLogin ? "Login" : "Register"}</h2>

            {!showLogin && (
              <>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={authData.full_name}
                  onChange={handleAuthInput}
                  className="w-full p-2 border rounded"
                />
                <select
                  name="exam_level"
                  value={authData.exam_level}
                  onChange={handleAuthInput}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Exam Level & Group</option>
                  <option value="CA Final Group I">CA Final Group I</option>
                  <option value="CA Final Group II">CA Final Group II</option>
                  <option value="CMA Final Group III">CMA Final Group III</option>
                  <option value="CMA Final Group IV">CMA Final Group IV</option>
                  <option value="CS Professional Group 1">CS Professional Group 1</option>
                  <option value="CS Professional Group 2">CS Professional Group 2</option>
                  <option value="CA Inter Group I">CA Inter Group I</option>
                  <option value="CA Inter Group II">CA Inter Group II</option>
                  <option value="CMA Inter Group I">CMA Inter Group I</option>
                  <option value="CMA Inter Group II">CMA Inter Group II</option>
                  <option value="CS Executive Group 1">CS Executive Group 1</option>
                  <option value="CS Executive Group 2">CS Executive Group 2</option>
                  <option value="CA Foundation">CA Foundation</option>
                  <option value="CMA Foundation">CMA Foundation</option>
                  <option value="CS Foundation">CS Foundation</option>
                </select>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={authData.email}
              onChange={handleAuthInput}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authData.password}
              onChange={handleAuthInput}
              className="w-full p-2 border rounded"
            />

            <button
              onClick={showLogin ? handleLogin : handleRegister}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {showLogin ? "Login" : "Register"}
            </button>

            <p className="text-center text-sm">
              {showLogin ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setShowLogin(false)} className="text-blue-600 hover:underline">Register</button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button onClick={() => setShowLogin(true)} className="text-blue-600 hover:underline">Login</button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    */}       
      {/* Sidebar Toggle Button - Fixed on Top Left */}
      <div className="flex h-screen bg-gray-900 text-white relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-700 focus:outline-none"
        >
          {sidebarOpen ? '≡' : '≡'}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed sm:relative z-40 ${sidebarOpen ? 'w-60' : 'w-0'} transition-all duration-300 bg-gray-800 h-screen overflow-y-auto`}
      >
        <div className="p-4 flex flex-col h-full gap-y-2">
          {sidebarOpen && (
            <>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  const level = e.target.value;
                  setSelectedLevel(level);
                  setSelectedSubject('');
                  setSelectedChapter('');
                  setSelectedCourse(level);  // for sidebar population
                }}
                className="w-full mt-12 p-2 bg-gray-700 text-white rounded"
              >
                <option value="">Select Level</option>
                {Object.keys(courseSubjects).map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>

              {selectedLevel && (
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                  }}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                >
                  <option value="">Select Subject</option>
                  {courseSubjects[selectedLevel].filter(sub => !sub.startsWith("Group")).map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              )}

              {selectedSubject && courseChapters[selectedLevel]?.[selectedSubject] ? (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                >
                  <option value="">Select Chapter (optional)</option>
                  {courseChapters[selectedLevel][selectedSubject].map((chapter, idx) => (
                    <option key={idx} value={chapter}>{chapter}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  placeholder="Enter Chapter (optional)"
                />
              )}


              <div className="space-y-2 mt-2">
                {/*
                {selectedSubject && (
                  <div className="mt-4 space-y-2">
                    <div
                      className="text-sm hover:bg-gray-700 p-2 rounded cursor-pointer"
                      onClick={() => {
                        console.log("Sidebar subject selected:", selectedSubject);
                        // You can trigger a filter or search here if needed
                      }}
                    >
                      {selectedSubject}
                    </div>
                  </div>
                )}
                */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowAskAI(true)}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm"
                  >
                    🧠 Ask ChatGPT
                  </button>
                </div>

                {/* ICAI Notifications Chatbox */}
                <div className="mt-4 bg-gray-700 rounded-lg p-3 text-white max-h-60 overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    📢 ICAI Notifications
                    {showNotifBadge && (
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    )}
                  </h3>
                  <ul className="text-sm space-y-1">
                    {icaiNotifications.length === 0 ? (
                      <li>Loading latest updates...</li>
                    ) : (
                      icaiNotifications.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))
                    )}
                  </ul>

                  {lastFetchedTime && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {lastFetchedTime}
                    </p>
                  )}
                </div>

                {/* GPT Explain Buttons */}
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => setShowCAGPT(!showCAGPT)}
                    className={`w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition duration-200`}
                  >
                    📘 Ask CA GPT
                    <span>{showCAGPT ? "▲" : "▼"}</span>
                  </button>

                  <button
                    onClick={() => setShowCMAGPT(!showCMAGPT)}
                    className={`w-full flex items-center justify-between bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition duration-200`}
                  >
                    📗 Ask CMA GPT
                    <span>{showCMAGPT ? "▲" : "▼"}</span>
                  </button>

                  <button
                    onClick={() => setShowCSGPT(!showCSGPT)}
                    className={`w-full flex items-center justify-between bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition duration-200`}
                  >
                    📕 Ask CS GPT
                    <span>{showCSGPT ? "▲" : "▼"}</span>
                  </button>
                </div>
                {showCAGPT && (
                  <div className="bg-gray-700 rounded p-3 text-white mt-2 animate-fadeIn">
                    <textarea
                      value={queryCA}
                      onChange={(e) => setQueryCA(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-800 text-white rounded resize-none"
                      placeholder="Enter your CA-related query..."
                    />
                    <button
                      onClick={() => handleAskGpt(queryCA, 'ca', setResponseCA)}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
                    >
                      Ask CA GPT
                    </button>

                    {responseCA && (
                      <div className="mt-2 bg-gray-800 p-2 rounded text-sm max-h-40 overflow-y-auto">
                        {responseCA}
                      </div>
                    )}
                  </div>
                )}

                {showCMAGPT && (
                  <div className="bg-gray-700 rounded p-3 text-white mt-2 animate-fadeIn">
                    <textarea
                      value={queryCMA}
                      onChange={(e) => setQueryCMA(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-800 text-white rounded resize-none"
                      placeholder="Enter your CMA-related query..."
                    />
                    <button
                      onClick={() => handleAskGpt(queryCMA, 'cma', setResponseCMA)}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                    >
                      Ask CMA GPT
                    </button>

                    {responseCMA && (
                      <div className="mt-2 bg-gray-800 p-2 rounded text-sm max-h-40 overflow-y-auto">
                        {responseCMA}
                      </div>
                    )}
                  </div>
                )}

                {showCSGPT && (
                  <div className="bg-gray-700 rounded p-3 text-white mt-2 animate-fadeIn">
                    <textarea
                      value={queryCS}
                      onChange={(e) => setQueryCS(e.target.value)}
                      rows={3}
                      className="w-full p-2 bg-gray-800 text-white rounded resize-none"
                      placeholder="Enter your CS-related query..."
                    />
                    <button
                      onClick={() => handleAskGpt(queryCS, 'cs', setResponseCS)}
                      className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-1 rounded"
                    >
                      Ask CS GPT
                    </button>

                    {responseCS && (
                      <div className="mt-2 bg-gray-800 p-2 rounded text-sm max-h-40 overflow-y-auto">
                        {responseCS}
                      </div>
                    )}
                  </div>
                )}


                {/*<div className="space-y-2 mt-4">
                  <button onClick={() => setShowCAGPT(!showCAGPT)} className="bg-blue-600 text-white px-3 py-2 rounded w-full">Ask CA GPT</button>
                  <button onClick={() => setShowCMAGPT(!showCMAGPT)} className="bg-green-600 text-white px-3 py-2 rounded w-full">Ask CMA GPT</button>
                  <button onClick={() => setShowCSGPT(!showCSGPT)} className="bg-purple-600 text-white px-3 py-2 rounded w-full">Ask CS GPT</button>
                </div>

              
                {/* RAG Explain Sidebar Button */}
               {/*
                <div className="mt-4 bg-gray-700 rounded-lg p-3 text-white">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    🤖 CA RAG Explain
                  </h3>

                  <textarea
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    className="w-full bg-gray-600 text-white rounded p-2 resize-none"
                    placeholder="Enter your query..."
                    rows={3}
                  />

                  <button
                    disabled={ragLoading}
                    className={`${
                      ragLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    } text-white px-3 py-2 rounded text-sm w-full mt-2`}
                    onClick={() => {
                      if (!ragQuery.trim()) {
                        alert("Please enter a query first.");
                        return;
                      }
                      fetchRagApproach(ragQuery);
                    }}
                  >
                    {ragLoading ? "⏳ Thinking..." : "🔍 Explain Current Query"}
                  </button>

                  {ragResponseCA && (
                    <details className="mt-3 text-xs text-white whitespace-pre-wrap">
                      <summary className="cursor-pointer text-blue-300 underline">📖 View Explanation</summary>
                      <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-600 pt-2">
                        {ragResponseCA}
                      </div>
                    </details>
                     )}

                  {ragResponseCMA && (
                    <details className="mt-3 text-xs text-white whitespace-pre-wrap">
                      <summary className="cursor-pointer text-blue-300 underline">📖 View Explanation</summary>
                      <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-600 pt-2">
                        {ragResponseCMA}
                      </div>
                    </details>
                     )}

                   {ragResponseCS && (
                     <details className="mt-3 text-xs text-white whitespace-pre-wrap">
                       <summary className="cursor-pointer text-blue-300 underline">📖 View Explanation</summary>
                       <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-600 pt-2">
                         {ragResponseCS}
                       </div>
                     </details>
                      )}
                </div>.  */}
                      
                {/* CMA RAG Explain */}
                {/*<div className="p-3 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">CMA RAG Explain</h3>
                  <input
                    type="text"
                    value={ragQueryCMA}
                    onChange={(e) => setRagQueryCMA(e.target.value)}
                    placeholder="Ask CMA-related doubt"
                    className="w-full p-1 mb-2 text-sm rounded bg-gray-800 border border-gray-600 text-white"
                  />
                  <button
                    onClick={handleRagQueryCMA}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-1 rounded"
                  >
                    Ask CMA GPT
                  </button>
                </div>

                <div className="p-3 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">CS RAG Explain</h3>
                  <input
                    type="text"
                    value={ragQueryCS}
                    onChange={(e) => setRagQueryCS(e.target.value)}
                    placeholder="Ask CS-related doubt"
                    className="w-full p-1 mb-2 text-sm rounded bg-gray-800 border border-gray-600 text-white"
                  />
                  <button
                    onClick={handleRagQueryCS}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-1 rounded"
                  >
                    Ask CS GPT
                  </button>
                </div> */}

{/*<div className="mt-4 bg-gray-700 rounded-lg p-3 text-white">
                  <h3 className="font-semibold">📘 CMA RAG Explain</h3>
                  <textarea
                    value={ragQueryCMA}
                    onChange={(e) => setRagQueryCMA(e.target.value)}
                    className="w-full bg-gray-600 text-white rounded p-2 resize-none"
                    placeholder="Enter CMA query..."
                    rows={3}
                  />

                  <button
                    disabled={ragLoading}
                    className={`${
                      ragLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    } text-white px-3 py-2 rounded text-sm w-full mt-2`}
                    onClick={() => {
                      if (!ragQuery.trim()) {
                        alert("Please enter a query first.");
                        return;
                      }
                      fetchRagApproach(ragQueryCMA);
                    }}
                  >
                    {ragLoading ? "⏳ Thinking..." : "🔍 Explain Current Query"}
                  </button>

                  {ragResponseCMA && (
                    <details className="mt-3 text-xs text-white whitespace-pre-wrap">
                      <summary className="cursor-pointer text-blue-300 underline">📖 View Explanation</summary>
                      <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-600 pt-2">
                        {ragResponse}
                      </div>
                    </details>
                     )}
                </div>. 

                {/* CS RAG Explain */}
                {/*<div className="mt-4 bg-gray-700 rounded-lg p-3 text-white">
                  <h3 className="font-semibold">📗 CS RAG Explain</h3>
                  <textarea
                    value={ragQueryCS}
                    onChange={(e) => setRagQueryCS(e.target.value)}
                    className="w-full bg-gray-600 text-white rounded p-2 resize-none"
                    placeholder="Enter CS query..."
                    rows={3}
                  />
                  <button
                    disabled={ragLoading}
                    className={`${
                      ragLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    } text-white px-3 py-2 rounded text-sm w-full mt-2`}
                    onClick={() => {
                      if (!ragQuery.trim()) {
                        alert("Please enter a query first.");
                        return;
                      }
                      fetchRagApproach(ragQueryCS);
                    }}
                  >
                    {ragLoading ? "⏳ Thinking..." : "🔍 Explain Current Query"}
                  </button>

                  {ragResponseCS && (
                    <details className="mt-3 text-xs text-white whitespace-pre-wrap">
                      <summary className="cursor-pointer text-blue-300 underline">📖 View Explanation</summary>
                      <div className="mt-2 max-h-48 overflow-y-auto border-t border-gray-600 pt-2">
                        {ragResponse}
                      </div>
                    </details>
                     )}
                </div> */}
                 
              </div>
              <h2 className="text-md font-semibold border-b border-gray-600 pb-1 mt-6">Search History</h2>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {
                  (() => {
                    const groupedHistory = groupByDate(searchHistoryList);
                    return searchHistoryList.length === 0 ? (
                      <div className="text-xs text-gray-400 italic">No history yet</div>
                    ) : (
                      Object.entries(groupedHistory).map(([date, entries]) => (
                        <details key={date} className="mb-2">
                          <summary className="text-sm font-bold text-blue-400">{date}</summary>
                          <div className="space-y-1 mt-1">
                            {entries.map((entry, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  setMatchedQuestions(entry.results);
                                  setCachedResults(entry.results);
                                  setSelectedResult(null);
                                  setQuery(entry.query);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="cursor-pointer hover:bg-gray-700 p-2 rounded text-xs bg-gray-800"
                              >
                                <div className="text-white truncate font-semibold">{entry.query}</div>
                                <div className="text-gray-400 text-[10px]">{entry.subject} – {entry.level}</div>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))
                    );
                  })()
                }
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 pt-8 pb-24 px-4 sm:px-8 flex flex-col items-center overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">
          {selectedLevel || "Select Level"} {selectedSubject ? `· ${selectedSubject}` : ""} Q&A
        </h1>

        {loading && (
          <div className="flex flex-col items-center mt-12 text-gray-300 text-sm animate-pulse">
            <svg className="h-8 w-8 mb-2 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Searching...
         </div>
        )}

        {noResults && (
          <div className="flex flex-col items-center mt-12 text-red-400 text-sm">
            <svg className="h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No results found. Try refining your query.
          </div>
        )}
        
        {/* Ask GPT Popups */}
        {showCAGPT && (
          <div className="w-full max-w-2xl mt-6 bg-gray-800 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center mb-2">
              <strong>Ask CA GPT</strong>
              <button onClick={() => setShowCAGPT(false)} className="text-red-400">✕ Close</button>
            </div>
            <textarea
              placeholder="Type your doubt..."
              className="w-full p-2 rounded text-black"
              rows={4}
              value={queryCA}
              onChange={(e) => setQueryCA(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
              onClick={() => handleAskGpt(queryCA, 'ca', setResponseCA)}
            >Ask</button>
            {responseCA && <div className="mt-3 bg-gray-700 p-3 rounded">{responseCA}</div>}
          </div>
        )}

        {showCMAGPT && (
          <div className="w-full max-w-2xl mt-6 bg-gray-800 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center mb-2">
              <strong>Ask CMA GPT</strong>
              <button onClick={() => setShowCMAGPT(false)} className="text-red-400">✕ Close</button>
            </div>
            <textarea
              placeholder="Type your doubt..."
              className="w-full p-2 rounded text-black"
              rows={4}
              value={queryCMA}
              onChange={(e) => setQueryCMA(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
              onClick={() => handleAskGpt(queryCMA, 'cma', setResponseCMA)}
            >Ask</button>
            {responseCMA && <div className="mt-3 bg-gray-700 p-3 rounded">{responseCMA}</div>}
          </div>
        )}

        {showCSGPT && (
          <div className="w-full max-w-2xl mt-6 bg-gray-800 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center mb-2">
              <strong>Ask CS GPT</strong>
              <button onClick={() => setShowCSGPT(false)} className="text-red-400">✕ Close</button>
            </div>
            <textarea
              placeholder="Type your doubt..."
              className="w-full p-2 rounded text-black"
              rows={4}
              value={queryCS}
              onChange={(e) => setQueryCS(e.target.value)}
            />
            <button
              className="bg-purple-600 text-white px-3 py-1 mt-2 rounded"
              onClick={() => handleAskGpt(queryCS, 'cs', setResponseCS)}
            >Ask</button>
            {responseCS && <div className="mt-3 bg-gray-700 p-3 rounded">{responseCS}</div>}
          </div>
        )}

        {showAskAI && (
          <div className="w-full max-w-2xl mt-6 bg-gray-800 p-6 rounded-xl text-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">🧠 Ask ChatGPT (OpenAI)</h2>
              <button
                onClick={() => {
                  setShowAskAI(false);
                  setAskAIQuery('');
                  setAskAIResponse('');
                }}
                className="text-red-400 hover:text-red-500 text-sm"
              >
                ✖ Close
              </button>
            </div>
            {/* 🔍 Search History Section */}
            {searchHistoryList.length > 0 && (
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <hr className="my-4 border-gray-600" />
                <h3 className="text-md font-semibold mb-2 text-white">Search History</h3>
                <div className="max-h-52 overflow-y-auto space-y-2 text-sm">
                  {searchHistoryList.map((item, idx) => (
                    <div key={idx} className="p-2 bg-gray-700 rounded text-white">
                      <div
                        onClick={() => handleSearch(item.query)}
                        className="font-medium cursor-pointer text-blue-400 hover:underline"
                      >
                        {item.query}
                      </div>
                      <div className="text-xs text-gray-300">
                        {item.level} / {item.subject} / {item.chapter}
                      </div>
                      <div className="text-[10px] text-gray-400">{item.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <textarea
              value={askAIQuery}
              onChange={(e) => setAskAIQuery(e.target.value)}
              placeholder="Type your doubt or concept..."
              className="w-full p-3 text-black rounded mb-2"
              rows={4}
            />

            <button
              onClick={async () => {
                if (!askAIQuery.trim()) return;
                setAskAILoading(true);
                setAskAIResponse('');

              try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/ask-ai`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ query: askAIQuery, model: "openai" })
                });

                const data = await res.json();
                setAskAIResponse(data.response);
              } catch (err) {
                console.error(err);
                setAskAIResponse("❌ Failed to get response.");
              } finally {
                setAskAILoading(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
            disabled={askAILoading}
          >
            {askAILoading ? "Thinking..." : "Ask"}
          </button>

          {askAIResponse && (
            <div className="mt-4 bg-gray-700 p-4 rounded text-sm whitespace-pre-wrap">
              <strong>Response:</strong>
              <p className="mt-2">{askAIResponse}</p>
            </div>
          )}
        </div>
      )}

        {!selectedResult && matchedQuestions.length > 0 && (
          <div className="mt-2 w-full max-w-3xl space-y-4 px-2 sm:px-0">
            <h2 className="text-xl font-bold mb-4 text-white">Matched Questions</h2>

            {matchedQuestions.map((res, index) => (
              <div
                key={index}
                onClick={() => handleSelect(res)}
                className="bg-white text-black p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
              >
                <div className="text-sm text-gray-700 mb-1">
                  ID: {res.questionId || res.id || res._id || "N/A"}.{""}
                {/*</div>
                <div className="font-medium text-base">
                */}
                  {res.question?.length > 0
                    ? res.question.slice(0, 80) + (res.question.length > 80 ? "..." : "")
                    : "No question text"}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedResult && (
          <div className="mt-6 w-full max-w-4xl bg-gray-800 text-white px-8 pt-6 pb-4 rounded-2xl shadow-md space-y-6">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
            >
              ← Back to Results
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-300">
              {/* ✅ Question ID and Chapter side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-sm text-gray-300 mb-2">
                <div>
                  <span className="font-semibold text-white">Question ID:</span>{" "}
                  {selectedResult.questionId || selectedResult.id || selectedResult._id || "N/A"}
                </div>
                <div>
                  <span className="font-semibold text-white">Chapter:</span>{" "}
                  {selectedResult.chapter || "N/A"}
                </div>
              </div>

              {/* ✅ Source on a new row */}
              <div className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">Source:</span>{" "}
                {selectedResult.sourceDetails || "N/A"}
              </div>

              {/* ✅ Concept as a full-width block */}
              <div className="text-sm text-gray-300 mb-6">
                <span className="font-semibold text-white">Concept:</span>{" "}
                {selectedResult.conceptTested || "N/A"}
            
            </div>      
               <h3 className="text-lg font-bold mb-1 text-white">📘 Concept Summary</h3>
               <article
                 className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                 dangerouslySetInnerHTML={{ __html: selectedResult.conceptSummary }}
               />
             </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-white">📝 Question</h3>
              <article
                className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                dangerouslySetInnerHTML={{ __html: selectedResult.question }}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-white">✅ Answer</h3>
              <article
                className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                dangerouslySetInnerHTML={{ __html: selectedResult.answer }}
              />
            </div>

            
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">💡 How to Approach</h3>

              {isEditing ? (
                <>
                  <textarea
                    value={customApproach || selectedResult.howToApproach}
                    onChange={(e) => setCustomApproach(e.target.value)}
                    className="w-full p-3 rounded text-black text-sm bg-white border border-gray-300"
                    rows={6}
                  />
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-semibold text-white">📷 Upload Images (Max 50KB):</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                                 file:rounded-full file:border-0 file:text-sm file:font-semibold
                                 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imageURLs.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="rounded border border-gray-600 max-h-32 object-contain"
                        />
                        <button
                          className="absolute top-1 right-1 text-red-500 bg-white rounded-full text-sm px-1"
                          onClick={() => handleImageDelete(url)}
                          title="Delete Image"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSaveApproach}
                    className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <article
                  className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                  dangerouslySetInnerHTML={{
                    __html: customApproach || selectedResult.howToApproach,
                  }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {imageURLs.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Saved ${index + 1}`}
                      className="rounded border border-gray-600 max-h-32 object-contain"
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  ✏️ Edit
                </button>
              </>
            )}

              {/* ✅ Add RAG Button here */}
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => fetchRagApproach(selectedResult?.question || '')}
              >
                💡 RAG Explain
              </button>
            </div>

            {ragResponse && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-gray-800">
                <h3 className="font-semibold mb-2">📘 AI Suggested Explanation:</h3>
                <p className="whitespace-pre-wrap">{ragResponse}</p>
              </div>
            )}

            {/* ✅ Show uploaded images if available */}
            {!isEditing && imageURLs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-1 text-white">📸 Uploaded Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  {imageURLs.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="rounded border border-gray-600 max-h-48 object-contain"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 🔹 User Menu (Settings + Logout) */}
      {/*{userId && (
        <div className="absolute top-4 right-4 z-50">
          <button onClick={() => setShowMenu(prev => !prev)} className="absolute top-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-700 focus:outline-none">
            ☰ Menu
          </button>

          {showMenu && (
            <div className="absolute top-16 right-4 bg-white text-black rounded-lg shadow-lg p-3 w-40 z-50 space-y-2">
              <button
                className="w-full flex items-center gap-2 text-sm px-3 py-2 hover:bg-gray-100 rounded"
                onClick={() => {
                  setShowSettings(true);
                  setShowMenu(false);
                }}
              >
                ⚙️ Settings
              </button>
              <button
                className="w-full flex items-center gap-2 text-sm px-3 py-2 text-red-600 hover:bg-red-100 rounded"
                onClick={() => {
                 localStorage.clear();
                 setUserId(null);
                 setUserRole(null);
                 setShowLogin(true);
                 setShowMenu(false);
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )} */}
            
      {/* Fixed Bottom Search Bar */}
      <div className={`fixed bottom-0 right-0 bg-gray-900 p-4 border-t border-gray-700 z-40 transition-all duration-300 ${sidebarOpen ? 'ml-60 w-[calc(100%-15rem)]'  : 'ml-0 w-full'}`}>
        <div className="w-full max-w-3xl flex mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by keyword, chapter, or question type..."
            className="flex-grow pl-10 pr-4 py-2 text-sm sm:text-base text-black rounded-l-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSearch()}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
      {/* 🔧 Menu Button and Dropdown */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          ☰ Menu
        </button>

        {showMenu && (
          <div className="bg-white text-black rounded-lg shadow-lg mt-2 p-4 space-y-2 w-48">
            <div
              className="cursor-pointer hover:underline flex items-center gap-2"
              onClick={() => {
                setShowSettings(true);
                setShowMenu(false);
              }}
            >
              ⚙️ Settings
            </div>
            <div
              className="cursor-pointer text-red-500 hover:underline flex items-center gap-2"
              onClick={() => {
                setUserId(null);
                setShowLogin(true);
                setShowMenu(false);
              }}
            >
              📕 Logout
            </div>
          </div>
        )}
      </div> 

    </div> 

  );
};

export default App;
