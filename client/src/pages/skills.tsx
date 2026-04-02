import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PurchaseModal } from "@/components/purchase-modal";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  AnimatedCounter,
} from "@/components/motion";
import {
  Shield,
  Lock,
  FileCheck,
  Users,
  Code,
  Database,
  Globe,
  MessageSquare,
  DollarSign,
  Cpu,
  FolderOpen,
  Plug,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Award,
  ChevronRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Skill Library Data ─────────────────────────────────────────────
type Skill = { name: string; description: string };
type Category = { id: string; label: string; icon: typeof Shield; skills: Skill[] };

const skillLibrary: Category[] = [
  {
    id: "core-security", label: "Core Security", icon: Shield, skills: [
      { name: "ai-policy-gate", description: "Enforces organizational AI usage policies by evaluating agent actions against configurable security rules before execution." },
      { name: "sensitive-data-detector", description: "Scans agent inputs, outputs, and tool call arguments for PII, credentials, secrets, and PHI before data is transmitted or stored." },
      { name: "compliance-audit-logger", description: "Generates structured audit logs of all agent activity for SOC 2, HIPAA, and compliance evidence collection." },
      { name: "skill-security-scanner", description: "Audits installed AI skills for security vulnerabilities, missing governance metadata, and malicious patterns." },
      { name: "prompt-injection-detector", description: "Scans documents, web pages, emails, and inputs for prompt injection attempts before the agent processes them." },
      { name: "credential-leak-guard", description: "Prevents accidental exposure of credentials, tokens, and secrets in agent outputs, git commits, files, and messages." },
      { name: "agent-action-approver", description: "Implements human-in-the-loop approval gates for high-risk agent actions, preventing destructive operations without explicit user consent." },
      { name: "data-classification-tagger", description: "Automatically classifies data the agent encounters or generates according to configurable data classification levels." },
      { name: "governance-report-generator", description: "Generates structured governance reports summarizing agent activity, security events, and policy compliance for management and auditors." },
      { name: "secure-tool-validator", description: "Validates that external tools, MCP servers, and API integrations meet baseline security requirements before the agent uses them." },
      { name: "iam-policy-reviewer", description: "Reviews IAM policies, RBAC configurations, and access control setups across AWS, GCP, Azure, and application-level permission systems for least-privilege violations and privilege escalation paths." },
      { name: "secure-auth-manager", description: "Reviews and manages authentication implementations including OAuth 2.0/OIDC flows, JWT configuration, session management, MFA setup, and API key lifecycle." },
    ],
  },
  {
    id: "hr-people-ops", label: "HR & People Ops", icon: Users, skills: [
      { name: "hr-policy-enforcer", description: "Enforces HR policies and labor law compliance when the agent generates people-related content such as communications, evaluations, or decisions." },
      { name: "employee-onboarding-assistant", description: "Generates structured employee onboarding checklists and workflows with compliance-required steps for IT, HR, and security provisioning." },
      { name: "performance-review-generator", description: "Generates structured, bias-checked performance reviews using objective criteria and measurable outcomes." },
      { name: "job-description-builder", description: "Creates structured, legally compliant, and bias-free job descriptions with proper qualifications, inclusive language, and EEO compliance." },
      { name: "interview-question-generator", description: "Generates role-specific, legally compliant interview questions with scoring rubrics and flags illegal or biased question patterns." },
    ],
  },
  {
    id: "productivity", label: "Productivity", icon: Zap, skills: [
      { name: "meeting-summarizer", description: "Generates structured meeting summaries with attendees, decisions, action items, deadlines, and follow-up tracking." },
      { name: "email-composer", description: "Drafts professional emails with tone calibration, compliance checking, and sensitive data scanning before send." },
      { name: "document-summarizer", description: "Summarizes long documents with configurable detail levels, key points extraction, and structured output." },
      { name: "knowledge-base-builder", description: "Organizes and structures information into searchable, categorized knowledge base articles with metadata and cross-references." },
      { name: "secure-spreadsheet-automator", description: "Automates spreadsheet operations with formula injection prevention, PII detection in cell data, and external reference blocking." },
      { name: "secure-presentation-generator", description: "Generates presentations with content classification, data redaction for different audiences, and IP protection on unreleased content." },
      { name: "secure-calendar-scheduler", description: "Manages calendar events and scheduling with attendee privacy, meeting content classification, and sensitive topic detection." },
      { name: "secure-agile-assistant", description: "Assists with agile processes including sprint planning, standups, and retrospectives with security story integration and risk tagging." },
      { name: "secure-product-manager", description: "Assists with PRDs, roadmaps, and prioritization with security requirement integration, compliance tracking, and stakeholder data protection." },
    ],
  },
  {
    id: "development", label: "Development", icon: Code, skills: [
      { name: "code-review-assistant", description: "Performs structured code reviews with security-first analysis, OWASP checks, and actionable feedback organized by severity." },
      { name: "secure-code-generator", description: "Generates code with built-in OWASP compliance, input validation, parameterized queries, and security best practices enforced by default." },
      { name: "secure-test-generator", description: "Generates test suites with security test cases, fuzzing inputs, boundary testing, and OWASP-aligned vulnerability checks." },
      { name: "secure-doc-generator", description: "Auto-generates documentation from code with sensitive data redaction, internal API filtering, and classification tagging." },
      { name: "secure-frontend-builder", description: "Generates frontend UI components with XSS prevention, CSP compliance, accessibility built in, and secure dependency selection." },
      { name: "secure-changelog-generator", description: "Auto-generates changelogs from git history with sensitive commit filtering and security fix classification." },
      { name: "secure-codebase-onboarder", description: "Helps new developers understand codebases with architecture mapping, security boundary identification, and sensitive area flagging." },
      { name: "secure-refactoring-assistant", description: "Assists with code refactoring while preserving security properties, maintaining test coverage, and preventing regression." },
      { name: "secure-e2e-test-runner", description: "Runs end-to-end browser tests with credential isolation, test data cleanup, environment verification, and screenshot safety." },
      { name: "secure-performance-profiler", description: "Profiles application performance with safe benchmarking, resource monitoring, and security implications analysis." },
      { name: "secure-git-operations", description: "Manages Git and GitHub operations with pre-commit secret scanning, branch protection enforcement, and force-push prevention." },
      { name: "api-design-reviewer", description: "Reviews API designs, OpenAPI specs, GraphQL schemas, and endpoint implementations for REST best practices, consistency, security, and backward compatibility." },
      { name: "architecture-review-assistant", description: "Reviews software architecture designs, system diagrams, and codebase structures for scalability, reliability, security, and maintainability concerns." },
    ],
  },
  {
    id: "crypto-blockchain", label: "Crypto & Blockchain", icon: Lock, skills: [
      { name: "smart-contract-auditor", description: "Audits Solidity and EVM-compatible smart contracts for security vulnerabilities, gas optimization issues, and compliance with best practices." },
      { name: "wallet-address-validator", description: "Validates cryptocurrency wallet addresses for format correctness, checksum integrity, and known-risk address screening." },
      { name: "defi-risk-analyzer", description: "Analyzes DeFi protocols, yield strategies, and token interactions for financial and smart contract risks." },
      { name: "blockchain-transaction-tracer", description: "Traces and explains blockchain transaction flows, decodes contract interactions, and identifies fund movement patterns." },
      { name: "token-contract-scanner", description: "Scans ERC-20, ERC-721, and ERC-1155 token contracts for honeypot patterns, rug pull indicators, and malicious mechanisms." },
    ],
  },
  {
    id: "legal-compliance", label: "Legal & Compliance", icon: FileCheck, skills: [
      { name: "contract-review-assistant", description: "Reviews legal contracts for risk clauses, unusual terms, missing protections, and compliance issues." },
      { name: "gdpr-compliance-checker", description: "Checks data handling processes, code, and documentation for GDPR compliance gaps and generates remediation guidance." },
      { name: "license-compatibility-checker", description: "Checks software license compatibility across project dependencies and flags conflicts, viral licenses, and obligations." },
      { name: "regulatory-change-monitor", description: "Tracks and summarizes regulatory changes relevant to the organization's industry, flagging action items and compliance deadlines." },
      { name: "terms-of-service-analyzer", description: "Analyzes Terms of Service and Privacy Policies for concerning clauses, data rights issues, and user-unfriendly provisions." },
      { name: "hipaa-compliance-checker", description: "Checks data handling processes, application code, infrastructure configurations, and documentation for HIPAA compliance gaps across the Privacy Rule, Security Rule, and Breach Notification Rule." },
    ],
  },
  {
    id: "devops-infrastructure", label: "DevOps & Infra", icon: Database, skills: [
      { name: "infrastructure-drift-detector", description: "Detects infrastructure-as-code drift by comparing declared state in Terraform, CloudFormation, or Kubernetes manifests." },
      { name: "container-security-scanner", description: "Scans Dockerfiles and container configurations for security misconfigurations, privilege escalation risks, and supply chain issues." },
      { name: "dependency-vulnerability-scanner", description: "Scans project dependency files for known vulnerable packages, outdated versions, and supply chain risk indicators." },
      { name: "ci-cd-pipeline-auditor", description: "Audits CI/CD pipeline configurations for security misconfigurations, secret exposure risks, and supply chain attack vectors." },
      { name: "cloud-cost-optimizer", description: "Analyzes cloud infrastructure configurations and usage patterns to identify cost optimization opportunities and waste." },
      { name: "secure-deployment-manager", description: "Manages application deployments with pre-deploy security checks, rollback safety, and secret management validation." },
      { name: "secure-kubernetes-manager", description: "Manages Kubernetes clusters with RBAC enforcement, pod security validation, secret protection, and destructive operation gates." },
      { name: "secure-monitoring-connector", description: "Connects to monitoring systems with query sanitization, alert data classification, and incident response logging." },
      { name: "secure-dns-manager", description: "Manages DNS records and domain configurations with change approval gates, propagation verification, and misconfiguration detection." },
      { name: "secure-incident-responder", description: "Guides incident response procedures with severity classification, evidence preservation, and compliance-aware escalation." },
      { name: "secure-workflow-automator", description: "Creates and manages automation workflows with input validation, action sandboxing, credential scoping, and approval gates." },
      { name: "disaster-recovery-planner", description: "Evaluates infrastructure and application architectures for disaster recovery readiness, analyzing backup strategies, failover mechanisms, RTO/RPO targets, and business continuity plans." },
      { name: "log-analysis-assistant", description: "Analyzes application, system, and infrastructure logs to identify errors, anomalies, patterns, and root causes with evidence-backed incident timelines." },
      { name: "secure-terraform-reviewer", description: "Reviews Terraform configurations for security vulnerabilities, cloud best practices, cost implications, and operational risks." },
    ],
  },
  {
    id: "data-analytics", label: "Data & Analytics", icon: BarChart3, skills: [
      { name: "sql-query-validator", description: "Validates SQL queries for injection vulnerabilities, performance anti-patterns, privilege escalation risks, and destructive operation safeguards." },
      { name: "data-pipeline-monitor", description: "Monitors data pipeline configurations for reliability risks, data quality issues, security gaps, and operational anti-patterns." },
      { name: "pii-anonymizer", description: "Anonymizes PII in datasets and text by applying consistent pseudonymization, masking, or redaction strategies while preserving data utility." },
      { name: "data-quality-checker", description: "Validates data quality across completeness, consistency, accuracy, freshness, and schema conformance dimensions." },
      { name: "schema-migration-reviewer", description: "Reviews database schema migrations for safety risks, data loss potential, backward compatibility, and performance impact." },
      { name: "database-performance-tuner", description: "Analyzes database queries, schemas, indexes, and execution plans to identify performance bottlenecks and recommend optimizations across PostgreSQL, MySQL, SQL Server, and MongoDB." },
      { name: "secure-data-visualizer", description: "Creates data visualizations with automatic PII redaction, data classification watermarking, and export controls." },
      { name: "secure-sentiment-analyzer", description: "Analyzes sentiment in text with PII protection, bias detection, ethical use guardrails, and aggregate-only reporting." },
      { name: "secure-ab-test-analyzer", description: "Designs and analyzes A/B tests with statistical rigor, privacy-preserving metrics, user consent verification, and bias detection." },
    ],
  },
  {
    id: "communication-content", label: "Communication", icon: MessageSquare, skills: [
      { name: "brand-voice-enforcer", description: "Ensures agent-generated content matches the organization's brand voice guidelines, tone, terminology, and style standards." },
      { name: "content-accessibility-checker", description: "Checks content for accessibility compliance with WCAG 2.1 guidelines, plain language standards, and inclusive communication." },
      { name: "social-media-compliance-guard", description: "Ensures social media posts comply with regulatory requirements, brand guidelines, and platform-specific rules." },
      { name: "translation-quality-validator", description: "Validates translations for accuracy, cultural appropriateness, terminology consistency, and locale-specific compliance." },
      { name: "technical-writing-assistant", description: "Structures and improves technical documentation with consistent formatting, clear language, and comprehensive coverage." },
      { name: "secure-email-campaign-manager", description: "Manages email marketing campaigns with CAN-SPAM/GDPR compliance, recipient list PII protection, and phishing prevention." },
      { name: "secure-sales-outreach", description: "Generates sales outreach communications with compliance checking, prospect data protection, and anti-spam enforcement." },
      { name: "secure-competitive-intel", description: "Gathers and analyzes competitive intelligence with ethical sourcing verification, classification of findings, and legal compliance." },
      { name: "secure-resume-builder", description: "Generates professional resumes and cover letters with PII handling controls and bias-free language checking." },
    ],
  },
  {
    id: "finance-operations", label: "Finance & Ops", icon: DollarSign, skills: [
      { name: "invoice-processor", description: "Extracts, validates, and structures invoice data with compliance checks for tax calculations, duplicate detection, and approval workflows." },
      { name: "expense-policy-enforcer", description: "Validates expense reports against configurable organizational policies, flagging out-of-policy items, missing receipts, and suspicious patterns." },
      { name: "financial-report-formatter", description: "Structures raw financial data into formatted reports with proper accounting conventions, variance analysis, and executive summaries." },
      { name: "fraud-detection-assistant", description: "Analyzes financial transactions and patterns for fraud indicators using rule-based detection across multiple fraud typologies." },
      { name: "vendor-risk-assessor", description: "Assesses third-party vendor risks across security, financial, operational, and compliance dimensions with structured risk scoring." },
      { name: "secure-crm-connector", description: "Integrates with CRM systems with contact PII protection, deal data classification, bulk operation gates, and field-level access controls." },
      { name: "secure-stripe-connector", description: "Integrates with Stripe payment processing with PCI DSS compliance enforcement, transaction data classification, and financial data redaction." },
      { name: "secure-shopify-connector", description: "Integrates with Shopify stores with order PII protection, inventory operation gates, customer data classification, and webhook validation." },
    ],
  },
  {
    id: "web-browser", label: "Web & Browser", icon: Globe, skills: [
      { name: "secure-web-scraper", description: "Securely extracts data from web pages with domain allowlisting, rate limiting, robots.txt compliance, and automatic PII detection." },
      { name: "secure-browser-automation", description: "Automates browser interactions with sandboxed execution, credential protection, screenshot redaction, and action approval gates." },
      { name: "secure-search-research", description: "Performs web searches with source verification, content safety scanning, prompt injection detection on results, and citation tracking." },
      { name: "secure-seo-auditor", description: "Audits websites for SEO with security header verification, safe redirect analysis, and detection of SEO spam injection patterns." },
    ],
  },
  {
    id: "file-document", label: "File & Document", icon: FolderOpen, skills: [
      { name: "secure-file-operations", description: "Performs file system operations with path traversal prevention, sensitive file protection, malware pattern scanning, and access logging." },
      { name: "secure-pdf-processor", description: "Processes PDF documents with embedded malware scanning, metadata stripping, PII detection, and content classification." },
    ],
  },
  {
    id: "integration-connectors", label: "Integrations", icon: Plug, skills: [
      { name: "secure-google-workspace", description: "Integrates with Google Workspace (Gmail, Calendar, Drive, Docs, Sheets) with data classification enforcement and DLP scanning." },
      { name: "secure-slack-integration", description: "Integrates with Slack workspaces with DLP scanning on outgoing messages, channel-level data classification, and approval gates." },
      { name: "secure-project-management", description: "Integrates with Jira, Linear, and Asana with data classification on tickets, PII redaction, and access-scoped operations." },
      { name: "secure-notion-integration", description: "Integrates with Notion workspaces with content classification, sharing controls, and sensitive data scanning." },
      { name: "secure-api-connector", description: "Connects to REST and GraphQL APIs with credential isolation, request/response DLP scanning, domain allowlisting, and rate limiting." },
      { name: "secure-figma-connector", description: "Integrates with Figma for design access with IP protection, draft content classification, export watermarking, and comment PII scanning." },
      { name: "secure-discord-integration", description: "Integrates with Discord servers with content moderation, DLP scanning on messages, invite link safety, and channel-level access controls." },
    ],
  },
  {
    id: "ai-agent", label: "AI & Agent", icon: Cpu, skills: [
      { name: "secure-memory-manager", description: "Manages persistent agent memory with data classification, PII filtering, access controls, and automatic expiry of sensitive information." },
      { name: "secure-multi-agent-orchestrator", description: "Coordinates multiple AI agents with privilege isolation, inter-agent communication scanning, and unified audit logging." },
      { name: "secure-prompt-optimizer", description: "Optimizes and refines prompts with injection hardening, safety testing, output format validation, and prompt leakage prevention." },
      { name: "secure-rag-builder", description: "Builds Retrieval-Augmented Generation pipelines with document classification, access control on chunks, PII filtering, and source attribution." },
      { name: "secure-image-generator", description: "Generates images from text prompts with content policy enforcement, metadata scrubbing, watermarking, and intellectual property guardrails." },
      { name: "secure-video-processor", description: "Processes video content with transcript PII scanning, face detection warnings, content classification, and metadata stripping." },
      { name: "hallucination-detector", description: "Detects hallucinations in AI-generated content by verifying claims against source material, checking factual consistency, and flagging fabricated references." },
      { name: "model-bias-auditor", description: "Audits AI model outputs, training data descriptions, and decision systems for bias across protected demographic groups using multiple fairness metrics." },
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "OWASP ASI Top 10 Audited",
    description: <>Every skill is audited against the <span className="text-white font-semibold">OWASP Agentic Security Initiative Top 10</span> — covering prompt injection, excessive agency, insecure tool integration, sensitive data exposure, and more.</>,
  },
  {
    icon: AlertTriangle,
    title: "The Problem It Solves",
    description: <><span className="font-semibold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">41% of community AI skills have vulnerabilities.</span> <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">99.3% lack permission manifests.</span> <span className="font-semibold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">12% contain malware.</span> <span className="text-white font-semibold">Groovy Skills are the enterprise-grade antidote.</span></>,
  },
  {
    icon: Award,
    title: "Production-Grade Quality",
    description: <>Self-contained, <span className="text-white font-semibold">zero external dependencies.</span> Policy-driven configuration. <span className="text-white font-semibold">Critical vulnerability patches within 48 hours.</span> Built for enterprises, not hobbyists.</>,
  },
];

export default function Skills() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(skillLibrary[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeData = skillLibrary.find((c) => c.id === activeCategory)!;

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching
    ? skillLibrary.flatMap((cat) =>
        cat.skills
          .filter((s) => {
            const q = searchQuery.toLowerCase();
            return s.name.includes(q) || s.description.toLowerCase().includes(q);
          })
          .map((s) => ({ ...s, category: cat.label }))
      )
    : [];

  return (
    <PageTransition>
      <AuroraBackground variant="green" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <HeroTextReveal>
                <HeroLine>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Secure AI Skills{" "}
                    <span className="block">
                      <GradientText from="from-emerald-400" to="to-teal-300" via="via-green-400">
                        for AI Agents
                      </GradientText>
                    </span>
                  </h1>
                </HeroLine>

                <HeroLine>
                  <p className="text-xl lg:text-2xl text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
                    The only <span className="text-white font-semibold">production-grade, security-audited</span> skill library for AI agents.
                    111 skills across 14 categories — <span className="text-white font-semibold">purpose-built governance</span>, secure integrations,
                    and <span className="text-white font-semibold">enterprise-ready alternatives to vulnerable community skills</span>.
                  </p>
                </HeroLine>
              </HeroTextReveal>

              <ScrollReveal delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setShowPurchaseModal(true)}>
                    <GradientButton variant="default" className="min-w-0 px-8 py-4 text-base rounded-xl btn-animate-colors">
                      Get Lifetime Access
                    </GradientButton>
                  </button>
                  <a href="#skill-library">
                    <GradientButton variant="default" className="min-w-0 px-8 py-4 text-base rounded-xl btn-animate-colors brightness-125">
                      <Search className="w-4 h-4 mr-2" /> Browse All Skills
                    </GradientButton>
                  </a>
                </div>
                <div className="mt-6 text-sm text-slate-500 text-center">
                  One-time purchase &middot; Lifetime access &middot; No subscription
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>


        {/* Why Groovy Skills */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Why Groovy Skills?
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Community skills are a liability. Groovy Skills are the paid antidote.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-8">
              {highlights.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="group rounded-2xl p-8 h-full bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl transition-all duration-500 ease-out hover:scale-110 hover:from-emerald-500/25 hover:border-emerald-500/35 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-default">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 transition-all duration-500 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">{item.title}</h3>
                    <p className="text-base lg:text-lg text-slate-400 leading-relaxed transition-colors duration-500 group-hover:text-slate-300">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── Skill Library Browser ── */}
        <section id="skill-library" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    Explore All 111 Skills
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Browse by category or search across the entire library.
                  </p>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <div className="flex gap-6">
              {/* Sidebar (Desktop) */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <nav className="space-y-1">
                    {skillLibrary.map((cat) => {
                      const isActive = cat.id === activeCategory && !isSearching;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-300 group ${
                            isActive
                              ? "bg-emerald-500/[0.1] border border-emerald-500/20 text-white"
                              : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-white/[0.03] text-slate-500 group-hover:text-slate-300"
                          }`}>
                            <cat.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="flex-1 truncate">{cat.label}</span>
                          <span className={`text-[10px] font-mono tabular-nums ${
                            isActive ? "text-emerald-400" : "text-slate-600"
                          }`}>
                            {cat.skills.length}
                          </span>
                          {isActive && <ChevronRight className="w-3 h-3 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Mobile Category FAB */}
              <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="w-14 h-14 bg-emerald-500/90 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sidebar Overlay */}
              <AnimatePresence>
                {mobileNavOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] lg:hidden"
                  >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
                    <motion.div
                      initial={{ x: -280 }}
                      animate={{ x: 0 }}
                      exit={{ x: -280 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/[0.06] p-4 pt-6 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-semibold text-white">Categories</h3>
                        <button onClick={() => setMobileNavOpen(false)} className="text-slate-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <nav className="space-y-1">
                        {skillLibrary.map((cat) => {
                          const isActive = cat.id === activeCategory;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); setMobileNavOpen(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-emerald-500/[0.1] border border-emerald-500/20 text-white"
                                  : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                              }`}
                            >
                              <cat.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                              <span className="flex-1">{cat.label}</span>
                              <span className={`text-[10px] font-mono ${isActive ? "text-emerald-400" : "text-slate-600"}`}>{cat.skills.length}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Skills Panel */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {isSearching ? (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-5">
                        <Search className="w-4 h-4 text-slate-500" />
                        <h3 className="text-lg font-bold text-white">{searchResults.length} results</h3>
                        <span className="text-sm text-slate-500">for "{searchQuery}"</span>
                      </div>
                      {searchResults.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {searchResults.map((skill) => (
                            <GlassCard key={skill.name} className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{skill.name}</code>
                                <span className="text-[10px] text-slate-600 font-medium">{skill.category}</span>
                              </div>
                              <p className="text-sm text-slate-400 leading-relaxed">{skill.description}</p>
                            </GlassCard>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-slate-500">No skills match your search.</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                          <activeData.icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{activeData.label}</h3>
                          <p className="text-xs text-slate-500">{activeData.skills.length} skills</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {activeData.skills.map((skill, i) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.03 }}
                          >
                            <GlassCard className="p-4 h-full">
                              <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mb-2 inline-block">{skill.name}</code>
                              <p className="text-sm text-slate-400 leading-relaxed">{skill.description}</p>
                            </GlassCard>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>


        {/* CTA / Pricing */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <GlassCard className="p-10 lg:p-14 text-center" glowColor="rgba(16,185,129,0.1)">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                  LIFETIME ACCESS
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  One Purchase. Unlimited Security.
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  Get lifetime access to all 111 Groovy Security Skills — including every future update, new skill, and security patch.
                </p>
                <button onClick={() => setShowPurchaseModal(true)}>
                  <GradientButton variant="default" className="min-w-0 px-10 py-4 text-lg rounded-xl btn-animate-colors">
                    Purchase Now <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </button>
                <p className="text-xs text-slate-600 mt-4">
                  Secure checkout powered by Stripe
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        <Footer />

        {/* Purchase Modal */}
        <AnimatePresence>
          {showPurchaseModal && (
            <PurchaseModal onClose={() => setShowPurchaseModal(false)} />
          )}
        </AnimatePresence>
      </AuroraBackground>
    </PageTransition>
  );
}
