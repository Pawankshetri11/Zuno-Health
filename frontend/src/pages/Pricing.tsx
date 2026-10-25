import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, ArrowRight, Lock, ArrowLeft, ShieldCheck, Zap, Flame, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { api, getLogoUrl } from "@/lib/api";

const tierOf = (t: string) => {
    const s = (t || "").toLowerCase();
    if (s.includes("monthly")) return 3;
    if (s.includes("weekly")) return 2;
    if (s.includes("daily")) return 1;
    if (s.includes("trial")) return 0;
    return 0;
};

const Pricing = () => {
    const navigate = useNavigate();
    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");
    const [activeSub, setActiveSub] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("zuno_auth_user");
        if (!stored) return;
        const u = JSON.parse(stored);
        api.subscriptions.getActiveByUserId(String(u.id)).then(setActiveSub).catch(() => setActiveSub(null));
    }, []);

    const currentTier = activeSub ? tierOf(activeSub.plan_type) : -1;

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    const plans = [
        {
            key: "daily",
            name: "Daily",
            price: Number(settings.priceDaily) || 99,
            original: Number(settings.originalPriceDaily) || 199,
            days: 1,
            badge: "Try It",
            icon: Zap,
            tagline: "Quick Kickstart",
            features: [
                "1 Day AI Precision Diet Plan",
                "Personalized Indian Meal Options",
                "Instant Dashboard Access",
                "Printable PDF Diet Plan Download",
            ],
        },
        {
            key: "weekly",
            name: "Weekly",
            price: Number(settings.priceWeekly) || 599,
            original: Number(settings.originalPriceWeekly) || 1399,
            days: 7,
            badge: "Most Popular",
            featured: true,
            icon: Flame,
            tagline: "Best for Habit Building",
            features: [
                "7 Days Precision AI Diet Plans",
                "Daily Progress & Meal Swaps",
                "Instant Dashboard Access",
                "Printable PDF Diet Plan Download",
            ],
        },
        {
            key: "monthly",
            name: "Monthly",
            price: Number(settings.priceMonthly) || 1999,
            original: Number(settings.originalPriceMonthly) || 5999,
            days: 30,
            badge: "Best Value",
            icon: Crown,
            tagline: "Full Body Transformation",
            features: [
                "30 Days Complete AI Diet Journey",
                "Adaptive Metabolic Tuning & Priority Support",
                "Instant Dashboard Access",
                "Printable PDF Diet Plan Download",
            ],
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            {/* Ambient Background Glows */}
            <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <UserSidebar logoUrl={logoUrl} onSignOut={handleSignOut} />

            <main className="relative flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-4 py-8 md:px-8 pt-24 lg:pt-8 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-7">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-3xl font-medium font-sans text-[#10243e] tracking-tight leading-snug">
                                Choose Your <span className="text-orange-500 font-medium">Plan</span>
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Transparent pricing for your personal health transformation. Cancel or upgrade anytime.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3.5 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] text-xs font-semibold shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600"
                            onClick={() => navigate("/dashboard")}
                        >
                            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Dashboard
                        </Button>
                    </div>

                    {/* Active Subscription Banner */}
                    {activeSub && (
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-white to-blue-50/50 border border-blue-200/80 shadow-[0_2px_5px_rgba(37,99,235,0.05),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#10243e]">
                                        Currently on <span className="uppercase text-blue-700 font-bold">{activeSub.plan_type}</span> Plan
                                    </p>
                                    <p className="text-[11px] text-slate-500">Active until {activeSub.end_date}</p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                Active Status
                            </div>
                        </div>
                    )}

                    {/* Pricing Cards Grid - 3D Tactile Theme with matched radius */}
                    <div className="grid md:grid-cols-3 gap-6 pt-3">
                        {plans.map((p) => {
                            const planTier = tierOf(p.key);
                            const isCurrent = activeSub && tierOf(activeSub.plan_type) === planTier;
                            const isDowngrade = activeSub && planTier < currentTier;
                            const isUpgrade = activeSub && planTier > currentTier;
                            const discountPercent = p.original > p.price ? Math.round(((p.original - p.price) / p.original) * 100) : 0;

                            const ctaLabel = isCurrent
                                ? "Current Plan"
                                : isDowngrade
                                    ? "Lower Tier"
                                    : isUpgrade
                                        ? `Upgrade to ${p.name}`
                                        : `Get Started`;

                            return (
                                <div
                                    key={p.key}
                                    className={`relative rounded-2xl p-6 sm:p-7 transition-all flex flex-col ${
                                        p.featured
                                            ? "bg-gradient-to-b from-white via-[#fffaf5] to-[#fff6ec] border-2 border-orange-400/90 shadow-[0_12px_32px_rgba(249,115,22,0.12),inset_0_1.5px_0_rgba(255,255,255,1)]"
                                            : "bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300"
                                    } ${isDowngrade ? "opacity-65" : ""}`}
                                >
                                    {/* 3D Tactile Floating Top Badge */}
                                    {isCurrent ? (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40">
                                            Your Plan
                                        </div>
                                    ) : p.badge && (
                                        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] ${
                                            p.featured 
                                                ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40"
                                                : "bg-gradient-to-b from-white to-slate-100 text-slate-700 border border-slate-200 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]"
                                        }`}>
                                            {p.badge}
                                        </div>
                                    )}

                                    {/* Plan Title with Category Icon */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            p.featured 
                                                ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2px_5px_rgba(249,115,22,0.35)]" 
                                                : "bg-gradient-to-b from-white to-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                                        }`}>
                                            <p.icon className="h-5 w-5" strokeWidth={2.2} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-[#10243e] tracking-tight">{p.name} Plan</h3>
                                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.12em]">
                                                {p.days} Day{p.days > 1 ? "s" : ""} · {p.tagline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price Plate with Red Highlighted Discount */}
                                    <div className="mb-5 pb-5 border-b border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-medium text-[#10243e] tracking-tight">₹{p.price.toLocaleString()}</span>
                                            <span className="text-sm font-semibold text-rose-500 line-through decoration-rose-400/90">₹{p.original.toLocaleString()}</span>
                                        </div>
                                        {discountPercent > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/90 text-[10px] font-bold tracking-wider uppercase shadow-[0_1px_2px_rgba(244,63,94,0.08)]">
                                                {discountPercent}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Features List with Rich Highlighted Item Strips */}
                                    <ul className="space-y-2 mb-7 flex-1">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-orange-200 transition-colors">
                                                <div className="w-5 h-5 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-[0_1.5px_3px_rgba(16,185,129,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.7)]">
                                                    <Check className="h-3 w-3 text-white stroke-[2.8]" />
                                                </div>
                                                <span className="text-xs font-medium text-[#10243e] leading-snug">{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Action Button */}
                                    <Button
                                        className={`w-full h-11 rounded-xl text-xs font-medium uppercase tracking-[0.14em] transition-all ${
                                            p.featured && !isDowngrade
                                                ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40 hover:brightness-105"
                                                : "bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        onClick={() => navigate(`/checkout?plan=${p.key}`)}
                                        disabled={isDowngrade || isCurrent}
                                    >
                                        {isDowngrade && <Lock className="mr-2 h-3.5 w-3.5" />}
                                        {ctaLabel}
                                        {!isDowngrade && !isCurrent && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
                                    </Button>
                                    {isDowngrade && (
                                        <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">Available after current plan ends</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust Footnote */}
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-white to-blue-50/40 border border-blue-200/70 shadow-[0_1.5px_3px_rgba(37,99,235,0.04),inset_0_1px_0_rgba(255,255,255,1)] flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            All subscriptions are securely processed through encrypted payment gateways. Instant plan access is granted automatically upon payment confirmation.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Pricing;
