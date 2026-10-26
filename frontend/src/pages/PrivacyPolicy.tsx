import Footer from "@/components/Footer";
import { 
    ShieldCheck, 
    Lock, 
    Bot, 
    EyeOff, 
    FileText, 
    Clock, 
    CheckCircle2, 
    Mail, 
    Phone, 
    ArrowUpRight, 
    Database, 
    UserCheck,
    Layers,
    Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    const highlights = [
        {
            icon: EyeOff,
            title: "No Selling of Health Data",
            desc: "We never sell, rent, or trade your personal health metrics, dietary preferences, or contact details to third-party advertisers."
        },
        {
            icon: Bot,
            title: "Private AI Processing",
            desc: "Dietary prompts sent to third-party AI APIs are processed via secure enterprise channels and are not used to train public models."
        },
        {
            icon: Lock,
            title: "End-to-End Encryption",
            desc: "All network communication is strictly encrypted via HTTPS / TLS 1.3, and personal credentials use secure hashing."
        },
        {
            icon: UserCheck,
            title: "Right to Data Deletion",
            desc: "You have complete control over your information. Request full account and health profile erasure at any time."
        }
    ];

    const clauses = [
        {
            number: "01",
            title: "Introduction & Scope",
            content: (
                <div className="space-y-3">
                    <p>
                        Welcome to <strong className="font-medium text-[#10243e]">Zuno</strong> ("we", "us", or "our"). We respect your privacy and are deeply committed to protecting the personal and health-related data you share with us.
                    </p>
                    <p>
                        This Privacy Policy outlines our transparent data practices when you visit our website (zuno.health), use our automated dietary planner, or interact with our digital wellness services.
                    </p>
                </div>
            )
        },
        {
            number: "02",
            title: "Information We Collect",
            content: (
                <div className="space-y-3">
                    <p>To construct personalized meal plans and calculate precise caloric/macronutrient recommendations, we collect the following categories of information:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 font-normal">
                        <li><strong className="font-medium text-[#10243e]">Identity & Contact Data:</strong> Name, email address, phone number (WhatsApp authentication), age, and gender.</li>
                        <li><strong className="font-medium text-[#10243e]">Biometric & Health Metrics:</strong> Current weight, target weight, height, activity level, and fitness objectives.</li>
                        <li><strong className="font-medium text-[#10243e]">Dietary & Lifestyle Preferences:</strong> Food restrictions (vegetarian, non-vegetarian, vegan, eggetarian), cuisine choices, known food allergies, fasting schedules, and medical conditions voluntarily submitted for dietary tailoring.</li>
                        <li><strong className="font-medium text-[#10243e]">Payment Metadata:</strong> Transaction IDs and payment timestamps processed securely by PCI-DSS certified payment gateways. We do not store raw credit card numbers or bank passwords.</li>
                    </ul>
                </div>
            )
        },
        {
            number: "03",
            title: "How We Use Your Information",
            content: (
                <div className="space-y-3">
                    <p>We process your data strictly for legitimate operational and service delivery purposes:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 font-normal">
                        <li>Generating tailored, AI-synthesized Indian and global meal plans matching your caloric targets.</li>
                        <li>Calculating estimated macronutrient distributions (protein, carbohydrates, fats).</li>
                        <li>Delivering downloadable PDF meal plans and tracking your progress across your user dashboard.</li>
                        <li>Communicating service announcements, payment confirmations, and responding to support queries.</li>
                        <li>Detecting and mitigating security threats, abuse, or unauthorized platform activities.</li>
                    </ul>
                </div>
            )
        },
        {
            number: "04",
            title: "Third-Party AI APIs & Infrastructure Disclosure",
            content: (
                <div className="space-y-3">
                    <p>
                        In order to provide cutting-edge nutritional guidance, <strong className="font-medium text-[#10243e]">Zuno utilizes enterprise third-party APIs</strong> (including generative Large Language Model providers and cloud nutritional databases).
                    </p>
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-600 leading-relaxed font-normal space-y-2">
                        <p className="font-medium text-[#10243e]">AI Data Handling Safeguards:</p>
                        <p>
                            • Dietary parameters transmitted to external AI endpoints are sent over encrypted TLS connections.<br />
                            • We contractually engage with enterprise AI vendors who do not utilize customer API prompt data to train foundation public models.<br />
                            • No sensitive personally identifiable credentials (such as passwords or payment tokens) are ever sent to third-party AI models.
                        </p>
                    </div>
                </div>
            )
        },
        {
            number: "05",
            title: "Data Security & Storage",
            content: (
                <div className="space-y-3 text-sm text-slate-600 font-normal">
                    <p>
                        We have implemented robust technical, organizational, and physical security measures to safeguard your personal metrics from accidental loss, unauthorized access, alteration, or disclosure.
                    </p>
                    <p>
                        Access to your personal profile is restricted to authorized systems on a strict need-to-know basis, and authentication tokens are secured with industry-standard cryptographic algorithms.
                    </p>
                </div>
            )
        },
        {
            number: "06",
            title: "Data Sharing & Non-Disclosure",
            content: (
                <div className="space-y-3 text-sm text-slate-600 font-normal">
                    <p>
                        <strong className="font-medium text-[#10243e]">We do not sell your personal data.</strong> We only share information with verified service providers necessary for operating our platform:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Payment gateways for processing subscription transactions.</li>
                        <li>Cloud hosting providers and infrastructure database services with strict confidentiality covenants.</li>
                        <li>Legal and regulatory bodies, only when mandated by applicable law, subpoena, or official judicial order.</li>
                    </ul>
                </div>
            )
        },
        {
            number: "07",
            title: "Your Rights & Account Deletion",
            content: (
                <div className="space-y-3 text-sm text-slate-600 font-normal">
                    <p>You hold the right to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Access, view, and update your personal health parameters directly through your user profile.</li>
                        <li>Request a full export or permanent deletion of your account and associated historical diet records.</li>
                        <li>Opt-out of non-essential promotional communications at any point.</li>
                    </ul>
                    <p>
                        To request data deletion or account removal, simply email us at <a href="mailto:support@zuno.health" className="font-medium text-orange-600 hover:underline">support@zuno.health</a>, and our support team will process your request within 7 business days.
                    </p>
                </div>
            )
        },
        {
            number: "08",
            title: "Changes to this Policy",
            content: (
                <div className="space-y-3 text-sm text-slate-600 font-normal">
                    <p>
                        We may update this Privacy Policy periodically to reflect technological updates, product features, or regulatory compliance. Any revisions will be published directly on this page with an updated revision date.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#fcfdff] text-slate-800 font-poppins">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
            <div className="pointer-events-none fixed -left-24 top-1/3 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <main className="pt-28 pb-20 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                            <span>Privacy & Security Commitment</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-[#10243e]">
                            Privacy <span className="text-orange-500">Policy</span>
                        </h1>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            Your health metrics and privacy matter. Learn how Zuno securely manages your information, handles AI prompts, and ensures transparency.
                        </p>
                        
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500 font-normal">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                                <Clock className="h-3 w-3 text-orange-500" /> Last Revised: March 2026
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                                <CheckCircle2 className="h-3 w-3 text-blue-600" /> Zuno Health
                            </span>
                        </div>
                    </div>

                    {/* Privacy Pillars Grid */}
                    <div className="mb-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {highlights.map((h, i) => (
                                <div key={i} className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-[0_1.5px_4px_rgba(0,0,0,0.02)] hover:border-orange-200 transition-colors">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
                                            <h.icon className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-semibold text-[#10243e]">
                                                {h.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                                {h.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clauses */}
                    <div className="space-y-4">
                        {clauses.map((c) => (
                            <section 
                                key={c.number} 
                                className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white shadow-[0_1.5px_4px_rgba(0,0,0,0.02)] hover:border-orange-200 transition-colors"
                            >
                                <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b border-slate-100">
                                    <span className="text-xs font-mono font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200/50">
                                        {c.number}
                                    </span>
                                    <h2 className="text-base sm:text-lg font-medium text-[#10243e]">
                                        {c.title}
                                    </h2>
                                </div>
                                <div className="text-slate-600 text-sm font-normal leading-relaxed">
                                    {c.content}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Privacy Desk Contact Banner */}
                    <div className="mt-10 p-6 sm:p-7 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-[#fffaf5] to-[#f8fbff] shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>Privacy & Grievance Desk</span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#10243e]">
                                    Questions about your personal data?
                                </h3>
                                <p className="text-xs text-slate-600 font-normal max-w-md leading-relaxed">
                                    Contact our privacy team anytime to request data deletion, profile reviews, or ask questions regarding our security protocols.
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
                                    <span>Contact Privacy Desk</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                                <Link
                                    to="/terms"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs hover:border-blue-300 hover:text-blue-700 transition-colors text-center shadow-sm"
                                >
                                    <span>Terms of Service</span>
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

export default PrivacyPolicy;
