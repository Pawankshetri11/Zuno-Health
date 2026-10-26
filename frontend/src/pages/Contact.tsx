import Footer from "@/components/Footer";
import { Mail, MessageSquare, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#fcfdff] text-slate-800 font-poppins">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
            <div className="pointer-events-none fixed -left-24 top-1/3 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <main className="pt-28 pb-20 relative z-10">
                <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
                    
                    {/* Header */}
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <Mail className="h-3.5 w-3.5 text-orange-500" />
                            <span>Connect with Zuno</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-[#10243e]">
                            Get in <span className="text-orange-500">Touch</span>
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                            Have questions about our personalized meal plans, need support with your account, or want to report an AI-generated suggestion? We're here to help.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-5 mb-12">
                        {/* Email Card */}
                        <div className="p-7 rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-orange-300 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5 text-orange-600">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-semibold text-[#10243e] mb-1">Email Support</h3>
                                <p className="text-xs text-slate-500 mb-6 font-normal">General queries, billing & feedback</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <a 
                                    href="mailto:support@zuno.health" 
                                    className="text-sm font-medium text-orange-600 hover:text-orange-700 break-all inline-flex items-center gap-1.5"
                                >
                                    <span>support@zuno.health</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="p-7 rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-[#f8fbff] shadow-[0_2px_8px_rgba(37,99,235,0.06)] hover:border-blue-300 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5 text-blue-600">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-semibold text-[#10243e] mb-1">WhatsApp Assistant</h3>
                                <p className="text-xs text-slate-500 mb-6 font-normal">Quick responses for members</p>
                            </div>
                            <div className="pt-4 border-t border-blue-100">
                                <a 
                                    href="https://wa.me/919322820524" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 tracking-wide inline-flex items-center gap-1.5"
                                >
                                    <span>+91 9322820524</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Support Hours Card */}
                        <div className="p-7 rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-orange-300 transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5 text-orange-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="text-base font-semibold text-[#10243e] mb-1">Operational Hours</h3>
                                <p className="text-xs text-slate-500 mb-6 font-normal">Active customer response window</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 font-normal">
                                <p className="font-medium text-[#10243e]">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                                <p className="text-slate-500 mt-0.5">Closed on National Holidays</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Safety & Inaccuracy Reporting Banner */}
                    <div className="p-6 sm:p-8 rounded-2xl border border-orange-200 bg-gradient-to-br from-white via-[#fffaf5] to-orange-50/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-xl">
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                                <ShieldCheck className="h-4 w-4" />
                                <span>AI Safety & Dietary Feedback</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#10243e]">
                                Did an AI-generated meal suggestion look incorrect or unsafe?
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                We encourage immediate reporting of any allergen conflicts, calculation anomalies, or unsuitable recommendations. Help us fine-tune Zuno's safety guardrails.
                            </p>
                        </div>

                        <a 
                            href="mailto:support@zuno.health?subject=Reporting%20AI%20Generated%20Output%20-%20Zuno&body=Hello%20Zuno%20Safety%20Team%2C%0A%0AI%20am%20reporting%20an%20issue%20with%20a%20dietary%20recommendation%3A%0A%0A-%20Account%20Email%2FPhone%3A%0A-%20Details%20of%20the%20output%3A%0A-%20Screenshots%20(if%20any)%3A%0A%0AThank%20you."
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-medium text-xs hover:bg-orange-600 transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.22)] shrink-0"
                        >
                            <Mail className="h-4 w-4" />
                            <span>Report an AI Output</span>
                        </a>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
