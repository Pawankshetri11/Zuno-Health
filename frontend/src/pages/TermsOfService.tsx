import { useState } from "react";
import Footer from "@/components/Footer";
import { 
    AlertTriangle, 
    Bot, 
    Layers, 
    Flag, 
    ShieldCheck, 
    FileText, 
    CheckCircle2, 
    Mail, 
    Phone, 
    Scale, 
    CreditCard, 
    UserCheck, 
    Lock, 
    Clock, 
    Sparkles, 
    Info, 
    ArrowUpRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
    const [activeSection, setActiveSection] = useState<string>("all");

    const sections = [
        {
            id: "medical-disclaimer",
            category: "safety",
            number: "01",
            title: "Strict Medical & Healthcare Disclaimer (No Medical Advice)",
            icon: ShieldCheck,
            badge: "Health Disclaimer",
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/80 text-slate-800 font-normal text-sm flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-[#10243e]">Important Notice:</span> Zuno is strictly an informational dietary and lifestyle wellness companion. We do <span className="underline decoration-orange-500 underline-offset-2 font-medium text-orange-600">not</span> provide medical advice, diagnosis, treatment, prescriptions, or clinical healthcare services.
                        </div>
                    </div>
                    <p>
                        Nothing on the Zuno platform—including generated meal suggestions, calorie and macronutrient breakdowns, health assessments, or workout guides—is intended as medical advice or as a substitute for professional clinical judgment.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm font-normal">
                        <li><strong className="font-medium text-[#10243e]">Consult Your Doctor:</strong> Always seek the guidance of a licensed physician, certified clinical nutritionist, or qualified healthcare professional before beginning any new diet, workout routine, fasting protocol, or lifestyle change.</li>
                        <li><strong className="font-medium text-[#10243e]">Underlying Conditions:</strong> If you are pregnant, nursing, diabetic, hypertensive, have kidney or cardiovascular issues, eating disorders, or severe food allergies, do not use Zuno without direct clearance from your doctor.</li>
                        <li><strong className="font-medium text-[#10243e]">Never Ignore Medical Advice:</strong> Never disregard, avoid, or delay obtaining medical advice from your healthcare provider because of something you read or received through Zuno.</li>
                        <li><strong className="font-medium text-[#10243e]">Medical Emergencies:</strong> If you experience an allergic reaction, acute illness, or any medical emergency, stop following any plan immediately and contact your local emergency services (such as 112 / 108) or visit the nearest healthcare facility.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "ai-generated-content",
            category: "safety",
            number: "02",
            title: "AI-Generated Content & Information Notice",
            icon: Bot,
            badge: "AI Technology",
            content: (
                <div className="space-y-4">
                    <p>
                        All meal plans, recipe ideas, nutritional estimations, and wellness recommendations provided by Zuno are <strong className="font-medium text-[#10243e]">generated dynamically using Artificial Intelligence (AI) and automated algorithms</strong>.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 my-2">
                        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 font-medium text-[#10243e] text-sm">
                                <Sparkles className="h-4 w-4 text-orange-500" />
                                <span>Algorithmic Calculations</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                Caloric targets, portion estimates, and nutrient values are automated calculations and may vary from real-world food items and culinary preparations.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 font-medium text-[#10243e] text-sm">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <span>Potential Inaccuracies</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                Like any automated AI system, outputs may occasionally include approximations, errors, omissions, or food recommendations that may not suit your exact bodily requirements.
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 font-normal">
                        You retain full responsibility for verifying every ingredient, allergen detail, and cooking instruction before consuming any suggested food item.
                    </p>
                </div>
            )
        },
        {
            id: "third-party-apis",
            category: "technology",
            number: "03",
            title: "Third-Party APIs & External Service Integration",
            icon: Layers,
            badge: "Integrations",
            content: (
                <div className="space-y-4">
                    <p>
                        To formulate personalized meal protocols, <strong className="font-medium text-[#10243e]">Zuno integrates with and relies upon third-party APIs</strong>, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm font-normal">
                        <li><strong className="font-medium text-[#10243e]">Generative AI APIs:</strong> Enterprise AI model providers (such as Large Language Model APIs) that process nutritional prompts and synthesize tailored dietary recommendations.</li>
                        <li><strong className="font-medium text-[#10243e]">Nutritional & Food Databases:</strong> Third-party databases and ingredient libraries used for calorie and nutrient reference data.</li>
                        <li><strong className="font-medium text-[#10243e]">Payment Processors & Cloud Infrastructure:</strong> Secured payment gateways and authenticated cloud servers.</li>
                    </ul>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed font-normal space-y-2">
                        <p>
                            <span className="font-medium text-[#10243e]">Third-Party Terms:</span> Zuno does not directly control the underlying training data or continuous uptime of third-party APIs. Consequently, Zuno is not liable for upstream third-party API service interruptions, latency, model hallucination, or any limitations inherent to external AI engines.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "mandatory-reporting",
            category: "safety",
            number: "04",
            title: "Duty to Report Inaccurate or Unsafe Suggestions",
            icon: Flag,
            badge: "Safety Policy",
            content: (
                <div className="space-y-4">
                    <p>
                        We are committed to user safety and responsible AI. If you come across <strong className="font-medium text-[#10243e]">any recommendation that appears incorrect, contradictory to your food allergies, misleading, biologically unsafe, or uncomfortable</strong>, we ask that you act immediately:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-sm font-normal">
                        <li><strong className="font-medium text-[#10243e]">Do Not Follow the Suggestion:</strong> Stop following the generated meal or recommendation right away.</li>
                        <li><strong className="font-medium text-[#10243e]">Report Immediately:</strong> Notify our team at <a href="mailto:support@zuno.health" className="font-medium text-orange-600 hover:underline">support@zuno.health</a> or through our <Link to="/contact" className="font-medium text-orange-600 hover:underline">Contact Desk</Link> with details of the output.</li>
                        <li><strong className="font-medium text-[#10243e]">Prompt Safety Review:</strong> Our engineering team promptly analyzes reported outputs to refine AI guardrails, filter unwanted patterns, and ensure platform safety.</li>
                    </ol>
                    <div className="mt-4 p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                            <div className="text-xs text-slate-600 font-normal">
                                <span className="font-medium text-[#10243e] block">Noticed an error or safety concern?</span>
                                Please report it immediately so we can inspect and update the AI prompts.
                            </div>
                        </div>
                        <a 
                            href="mailto:support@zuno.health?subject=Report%3A%20AI%20Generated%20Content%20Issue%20on%20Zuno&body=Hello%20Zuno%20Team%2C%0A%0AI%20would%20like%20to%20report%20an%20issue%20with%20an%20AI%20suggestion%3A%0A%0A-%20Details%3A%0A-%20Screenshot%20or%20Text%3A%0A%0AThank%20you."
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 text-white font-medium text-xs hover:bg-orange-600 transition-colors shadow-[0_2px_8px_rgba(249,115,22,0.25)] shrink-0"
                        >
                            <Flag className="h-3.5 w-3.5" />
                            <span>Report an Issue</span>
                        </a>
                    </div>
                </div>
            )
        },
        {
            id: "acceptance-of-terms",
            category: "legal",
            number: "05",
            title: "Acceptance of Terms",
            icon: FileText,
            badge: "Agreement",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600">
                    <p>
                        These Terms of Service govern your use of the <strong className="font-medium text-[#10243e]">Zuno</strong> platform, website, and related digital services. By creating an account, browsing the website, or accessing any AI-generated plan, you confirm that you have read, understood, and agreed to be bound by these terms.
                    </p>
                    <p>
                        If you do not agree with any part of these terms, please discontinue your use of Zuno immediately.
                    </p>
                </div>
            )
        },
        {
            id: "user-accounts",
            category: "account",
            number: "06",
            title: "User Accounts & Input Accuracy",
            icon: UserCheck,
            badge: "Account Rules",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600">
                    <p>
                        You must be at least 18 years old to create an account on Zuno.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong className="font-medium text-[#10243e]">Accurate Metrics:</strong> Because AI outputs depend on the parameters you enter (such as height, weight, activity level, and known allergies), you agree to provide accurate and updated information.</li>
                        <li><strong className="font-medium text-[#10243e]">Confidentiality:</strong> You are responsible for safeguarding your login credentials and for any activity carried out through your account.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "payments",
            category: "commercial",
            number: "07",
            title: "Payments, Subscriptions & Non-Refundable Policy",
            icon: CreditCard,
            badge: "Billing",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600">
                    <p>
                        Certain features, personalized meal regimens, and downloadable guides may require a paid subscription or one-time fee.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong className="font-medium text-[#10243e]">Secure Transactions:</strong> All financial transactions are processed securely via third-party payment gateways. Zuno does not store your sensitive financial or banking passwords.</li>
                        <li><strong className="font-medium text-[#10243e]">Non-Refundable Policy:</strong> Due to the immediate computation and digital delivery of personalized AI diet plans, all payments and subscriptions are final and non-refundable unless specified otherwise by local consumer protection regulations.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "acceptable-use",
            category: "legal",
            number: "08",
            title: "Acceptable Use & Platform Integrity",
            icon: Lock,
            badge: "Rules of Use",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600">
                    <p>When using Zuno, you agree not to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Scrape, extract, copy, or reverse-engineer system prompts, algorithmic logic, or platform assets.</li>
                        <li>Abuse or bypass rate limits, server connections, or third-party API configurations.</li>
                        <li>Use outputs to create deceptive medical claims or unauthorized commercial diet programs.</li>
                    </ul>
                </div>
            )
        },
        {
            id: "limitation-of-liability",
            category: "legal",
            number: "09",
            title: "Limitation of Liability & Warranty Disclaimer",
            icon: Scale,
            badge: "Liability",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600 leading-relaxed">
                    <p>
                        <strong className="font-medium text-[#10243e]">Service Provided 'As-Is':</strong> Zuno and its AI-generated features are provided on an "as is" and "as available" basis without warranties of any kind.
                    </p>
                    <p>
                        <strong className="font-medium text-[#10243e]">Health & Indirect Damages:</strong> To the fullest extent permitted by law, Zuno shall not be liable for any health complications, adverse reactions, dietary discrepancies, or indirect, incidental, or consequential damages resulting from your use of the platform.
                    </p>
                </div>
            )
        },
        {
            id: "changes-to-terms",
            category: "legal",
            number: "10",
            title: "Modifications to Terms",
            icon: Clock,
            badge: "Updates",
            content: (
                <div className="space-y-3 font-normal text-sm text-slate-600">
                    <p>
                        We may update these Terms from time to time to reflect product enhancements, legal updates, or evolving AI technologies. Any changes will be posted directly on this page with an updated revision date. Your continued use of Zuno signifies your acceptance of the updated terms.
                    </p>
                </div>
            )
        }
    ];

    const filterCategories = [
        { id: "all", label: "All Terms" },
        { id: "safety", label: "Health & AI Safety" },
        { id: "technology", label: "Third-Party APIs" },
        { id: "commercial", label: "Payments" },
        { id: "legal", label: "General & Legal" }
    ];

    const filteredSections = activeSection === "all" 
        ? sections 
        : sections.filter(s => s.category === activeSection || (activeSection === "safety" && ["medical-disclaimer", "ai-generated-content", "mandatory-reporting"].includes(s.id)));

    return (
        <div className="min-h-screen bg-[#fcfdff] text-slate-800 font-poppins">
            {/* Subtle Orange & Blue Ambient Glows */}
            <div className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
            <div className="pointer-events-none fixed -left-24 top-1/3 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <main className="pt-28 pb-20 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <FileText className="h-3.5 w-3.5 text-orange-500" />
                            <span>Legal Terms & Transparency</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-[#10243e]">
                            Terms of <span className="text-orange-500">Service</span>
                        </h1>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            Please review these terms carefully. This agreement details our AI-driven wellness tools, outlines the use of third-party APIs, and disclaims medical advice.
                        </p>
                        
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500 font-normal">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                                <Clock className="h-3 w-3 text-orange-500" /> Last Updated: March 2026
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                                <CheckCircle2 className="h-3 w-3 text-blue-600" /> Zuno Health
                            </span>
                        </div>
                    </div>

                    {/* 4 Core Highlight Cards in Brand Theme (Orange + Blue) */}
                    <div className="mb-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Card 1: No Medical Advice */}
                            <div className="p-5 rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-[#fffaf5] shadow-[0_2px_8px_rgba(249,115,22,0.06)] hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                                            Important Disclaimer
                                        </span>
                                        <h3 className="text-sm font-semibold text-[#10243e]">
                                            No Medical Advice
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            Zuno is strictly an informational tool, not a doctor or medical professional. Always consult a certified healthcare provider before altering your diet.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: 100% AI Generated */}
                            <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-[#f8fbff] shadow-[0_2px_8px_rgba(37,99,235,0.05)] hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                            Automated Output
                                        </span>
                                        <h3 className="text-sm font-semibold text-[#10243e]">
                                            100% AI-Generated
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            Diets, meal plans, and macro targets are dynamically produced by AI. Output may contain approximations; please verify food and allergy suitability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Third Party APIs */}
                            <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-[#f8fbff] shadow-[0_2px_8px_rgba(37,99,235,0.05)] hover:border-blue-300 transition-colors">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                            Technology Stack
                                        </span>
                                        <h3 className="text-sm font-semibold text-[#10243e]">
                                            Third-Party AI APIs
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            Plans are generated using third-party AI APIs (including Large Language Models) and cloud nutrition databases. Output is subject to third-party availability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Report Immediately */}
                            <div className="p-5 rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-[#fffaf5] shadow-[0_2px_8px_rgba(249,115,22,0.06)] hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-600">
                                        <Flag className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                                            Safety First
                                        </span>
                                        <h3 className="text-sm font-semibold text-[#10243e]">
                                            Report Unsafe Content
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                            Kuch bhi inaccurate, unsafe ya questionable lage to turant report karein. Stop following the advice and alert us via support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {filterCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveSection(cat.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                                    activeSection === cat.id
                                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:text-[#10243e] hover:border-orange-300"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Clauses Sections */}
                    <div className="space-y-4">
                        {filteredSections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <section 
                                    key={section.id} 
                                    id={section.id}
                                    className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white shadow-[0_1.5px_4px_rgba(0,0,0,0.02)] hover:border-orange-200 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xs font-mono font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200/50">
                                                {section.number}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4 text-orange-500 shrink-0" />
                                                <h2 className="text-base sm:text-lg font-medium text-[#10243e]">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50/70 text-blue-700 self-start sm:self-auto">
                                            {section.badge}
                                        </span>
                                    </div>

                                    <div className="text-slate-600 text-sm font-normal leading-relaxed">
                                        {section.content}
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Support & Contact Banner in Zuno Orange/Blue */}
                    <div className="mt-10 p-6 sm:p-7 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-[#fffaf5] to-[#f8fbff] shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600">
                                    <Info className="h-3.5 w-3.5" />
                                    <span>Support & Safety Desk</span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#10243e]">
                                    Need help or want to report an issue?
                                </h3>
                                <p className="text-xs text-slate-600 font-normal max-w-md leading-relaxed">
                                    Our support team is here to assist with any questions regarding our terms, diet generation, or safety reports.
                                </p>
                                <div className="pt-1 flex flex-wrap gap-4 text-xs text-slate-600 font-normal">
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-orange-500" />
                                        <a href="mailto:support@zuno.health" className="hover:text-orange-600 transition-colors">support@zuno.health</a>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-blue-600" />
                                        <a href="https://wa.me/919322820524" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">+91 9322820524</a>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium text-xs hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.22)] text-center"
                                >
                                    <span>Contact Support</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                                <Link
                                    to="/privacy-policy"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs hover:border-blue-300 hover:text-blue-700 transition-colors text-center shadow-sm"
                                >
                                    <span>Privacy Policy</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
