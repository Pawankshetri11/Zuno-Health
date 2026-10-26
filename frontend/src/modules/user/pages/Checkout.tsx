import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowLeft, Lock, Tag, Check, Loader2, ShieldCheck, Zap, Flame, Crown, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { api, getLogoUrl } from "@/lib/api";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { load } from "@cashfreepayments/cashfree-js";

type PlanKey = "daily" | "weekly" | "monthly";

interface PlanDetail {
    name: string;
    price: number;
    original: number;
    days: number;
    badge: string;
    icon: any;
    tagline: string;
    features: string[];
}

const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const planParam = (searchParams.get("plan") || "weekly") as PlanKey;

    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");

    const planMap: Record<PlanKey, PlanDetail> = {
        daily: {
            name: "Daily",
            price: Number(settings.priceDaily) || 99,
            original: Number(settings.originalPriceDaily) || 199,
            days: 1,
            badge: "Quick Kickstart",
            icon: Zap,
            tagline: "Quick Kickstart",
            features: [
                "1 Day AI Precision Diet Plan",
                "Personalized Indian Meal Options",
                "Instant Dashboard Access",
                "Printable PDF Diet Plan Download",
            ],
        },
        weekly: {
            name: "Weekly",
            price: Number(settings.priceWeekly) || 599,
            original: Number(settings.originalPriceWeekly) || 1399,
            days: 7,
            badge: "Most Popular",
            icon: Flame,
            tagline: "Best for Habit Building",
            features: [
                "7 Days Precision AI Diet Plans",
                "Daily Progress & Meal Swaps",
                "Instant Dashboard Access",
                "Printable PDF Diet Plan Download",
            ],
        },
        monthly: {
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
    };
    const plan = planMap[planParam] || planMap.weekly;
    const discountPercent = plan.original > plan.price ? Math.round(((plan.original - plan.price) / plan.original) * 100) : 0;
    const PlanIcon = plan.icon;

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [couponCode, setCouponCode] = useState("");
    const [applying, setApplying] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponMessage, setCouponMessage] = useState<string>("");
    const [paying, setPaying] = useState(false);
    const [preview, setPreview] = useState<any | null>(null);
    const [previewLoading, setPreviewLoading] = useState(true);

    const credit = Number(preview?.credit) || 0;
    const subtotal = plan.price;
    const finalAmount = Math.max(0, Math.round((subtotal - credit - discount) * 100) / 100);
    const isBlocked = preview?.mode === "downgrade";

    useEffect(() => {
        const stored = localStorage.getItem("zuno_auth_user");
        if (!stored) {
            navigate("/auth?plan=" + planParam);
            return;
        }
        const u = JSON.parse(stored);
        setUser(u);
        api.profiles.getByUserId(u.id).then((p) => {
            setProfile(p || null);
        }).catch(() => setProfile(null));
        api.subscriptions.previewChange(String(u.id), planParam)
            .then((res) => setPreview(res))
            .catch(() => setPreview({ mode: "new", final_amount: plan.price, credit: 0 }))
            .finally(() => setPreviewLoading(false));
        // eslint-disable-next-line
    }, []);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setApplying(true);
        setCouponMessage("");
        try {
            const r = await api.coupons.validate(couponCode.trim().toUpperCase(), planParam, plan.price);
            if (r.valid) {
                setDiscount(Number(r.discount_amount) || 0);
                setAppliedCoupon(r.code);
                setCouponMessage(r.message || "Coupon applied successfully!");
                toast.success("Coupon applied — ₹" + (Number(r.discount_amount) || 0) + " off");
            } else {
                setDiscount(0);
                setAppliedCoupon(null);
                setCouponMessage(r.message || "Invalid coupon code");
                toast.error(r.message || "Invalid coupon code");
            }
        } catch (e: any) {
            setCouponMessage("Could not validate coupon");
            toast.error("Could not validate coupon");
        } finally {
            setApplying(false);
        }
    };

    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponMessage("");
    };

    const loadRazorpayScript = () =>
        new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    const handlePay = async () => {
        if (!user?.id) return;
        if (isBlocked) {
            toast.error(preview?.message || "Plan change not allowed");
            return;
        }
        setPaying(true);
        try {
            let activeProfile = profile;
            if (!activeProfile || !activeProfile.id) {
                const created = await api.profiles.create({
                    user_id: user.id,
                    name: user.name || "User",
                    email: user.email || "",
                    age: 0,
                    gender: "",
                    height: 0,
                    weight: 0,
                    goal: "",
                    activity_level: "",
                    dietary_restrictions: [],
                    allergies: "",
                    meal_preference: "",
                    extended_data: {},
                });
                activeProfile = await api.profiles.getByUserId(user.id);
                if (!activeProfile?.id && created?.id) activeProfile = { ...activeProfile, id: created.id };
                setProfile(activeProfile);
            }
            const cfg = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
            const useRazorpay = cfg.enable_razorpay === "1";
            const gateway: "razorpay" | "cashfree" = useRazorpay ? "razorpay" : "cashfree";

            let startBase = new Date();
            if (preview?.mode === "renew" && preview?.current_end) {
                const currentEnd = new Date(preview.current_end);
                if (currentEnd > startBase) startBase = currentEnd;
            }
            const endDate = new Date(startBase);
            endDate.setDate(endDate.getDate() + plan.days);

            const replacesId = preview?.mode === "upgrade" ? preview?.current_sub_id : null;

            const subscription = await api.subscriptions.create({
                user_id: user.id,
                profile_id: activeProfile.id,
                plan_type: planParam,
                plan_days: plan.days,
                end_date: endDate.toISOString().split("T")[0],
                amount: finalAmount,
                payment_method: gateway,
                payment_status: finalAmount === 0 ? "completed" : "pending",
                replaces_subscription_id: replacesId,
            });

            const dayPlanEntries: any[] = [];
            for (let i = 1; i <= plan.days; i++) {
                const pd = new Date();
                pd.setDate(pd.getDate() + i - 1);
                dayPlanEntries.push({
                    subscription_id: subscription.id,
                    day_number: i,
                    plan_date: pd.toISOString().split("T")[0],
                    is_unlocked: false,
                    user_name: user.name || activeProfile.name,
                });
            }
            await api.dietPlans.createBatch(dayPlanEntries);

            if (finalAmount === 0) {
                toast.success("Plan activated — no payment needed!");
                window.location.href = "/dashboard";
                return;
            }

            localStorage.setItem("zuno_pending_payment", JSON.stringify({
                selectedPlan: planParam,
                currentUser: user,
                profileId: activeProfile.id,
                subscriptionId: subscription.id,
                gateway,
                couponCode: appliedCoupon,
                discount,
            }));

            const phone = activeProfile.extended_data?.phone || "9999999999";
            const orderData = await api.payment.createOrder(
                finalAmount,
                { ...user, phone },
                gateway,
                { coupon_code: appliedCoupon || "", plan_type: planParam }
            );

            if (gateway === "razorpay") {
                if (!orderData?.order_id || !orderData?.key_id) {
                    throw new Error(orderData?.error || "Razorpay order failed");
                }
                const ok = await loadRazorpayScript();
                if (!ok) throw new Error("Could not load Razorpay");

                const rzp = new (window as any).Razorpay({
                    key: orderData.key_id,
                    order_id: orderData.order_id,
                    amount: orderData.amount,
                    currency: orderData.currency || "INR",
                    name: cfg.brand_name || "Zuno",
                    description: `${plan.name} Plan`,
                    prefill: orderData.prefill || { name: user?.name, email: user?.email, contact: phone },
                    theme: { color: "#f97316" },
                    handler: async (response: any) => {
                        try {
                            const verify = await api.payment.verifyRazorpay({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            if (verify.order_status === "PAID") {
                                toast.success("Payment successful!");
                                window.location.href = `/dashboard?order_id=${response.razorpay_order_id}&gateway=razorpay`;
                            } else {
                                toast.error("Payment verification failed");
                                setPaying(false);
                            }
                        } catch (e: any) {
                            toast.error(e?.message || "Verification error");
                            setPaying(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            toast.info("Payment cancelled");
                            setPaying(false);
                        }
                    }
                });
                rzp.on("payment.failed", (resp: any) => {
                    toast.error(resp?.error?.description || "Payment failed");
                    setPaying(false);
                });
                rzp.open();
                return;
            }

            const cashfree = await load({ mode: (orderData.cf_mode || "production") as any });
            if (orderData.payment_session_id) {
                toast.info("Redirecting to Secure Payment...");
                cashfree.checkout({ paymentSessionId: orderData.payment_session_id, redirectTarget: "_self" });
            } else {
                throw new Error("Failed to initiate payment gateway");
            }
        } catch (e: any) {
            console.error("Checkout error:", e);
            toast.error(e?.message || "Payment initiation failed");
            setPaying(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    if (!user) {
        return (
            <div className="relative min-h-screen bg-[#fafcff] flex items-center justify-center">
                <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
                <div className="text-center relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_4px_12px_rgba(249,115,22,0.35)] flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Checkout…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <UserSidebar logoUrl={logoUrl} gender={profile?.gender} onSignOut={handleSignOut} />

            <main className="relative flex-1 min-h-screen overflow-y-auto px-4 py-8 md:px-8 pt-24 lg:pt-8 text-slate-900">
                <div className="max-w-5xl mx-auto space-y-7">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-3xl font-medium font-sans text-[#10243e] tracking-tight leading-snug">
                                Complete Your <span className="text-orange-500 font-medium">Order</span>
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Review your plan summary, apply coupons, and activate your personalized nutrition journey.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3.5 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] text-xs font-semibold shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600 transition-all"
                            onClick={() => navigate("/pricing")}
                        >
                            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Plans
                        </Button>
                    </div>

                    {/* Upgrade / renew / downgrade notice */}
                    {!previewLoading && preview && preview.mode !== "new" && (
                        <div className={`p-4 rounded-2xl border shadow-sm flex items-start gap-3.5 ${
                            preview.mode === "upgrade"
                                ? "bg-gradient-to-b from-white to-emerald-50/60 border-emerald-200 text-emerald-800"
                                : preview.mode === "renew"
                                    ? "bg-gradient-to-b from-white to-blue-50/60 border-blue-200 text-blue-800"
                                    : "bg-gradient-to-b from-white to-rose-50/60 border-rose-200 text-rose-800"
                        }`}>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                preview.mode === "upgrade"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : preview.mode === "renew"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-rose-100 text-rose-700"
                            }`}>
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-0.5">
                                    {preview.mode === "upgrade" ? "Subscription Upgrade" : preview.mode === "renew" ? "Plan Renewal" : "Plan Change Blocked"}
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{preview.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                        {/* Left Column: Plan Inclusions & User Summary */}
                        <div className="lg:col-span-7 space-y-6">
                            <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Selected Plan</h2>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-bold uppercase tracking-wider">
                                        {plan.badge}
                                    </span>
                                </div>

                                {/* Plan Highlight Plate */}
                                <div className="bg-gradient-to-b from-white via-[#fffaf5] to-[#fff6ec] border-2 border-orange-300/80 rounded-2xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(249,115,22,0.07),inset_0_1.5px_0_rgba(255,255,255,1)]">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_6px_rgba(249,115,22,0.4)] flex items-center justify-center shrink-0">
                                                <PlanIcon className="h-6 w-6 stroke-[2.2]" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-[#10243e] tracking-tight">{plan.name} Plan</h3>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {plan.days} Day{plan.days > 1 ? "s" : ""} Full Access · {plan.tagline}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-baseline justify-end gap-2">
                                                <span className="text-2xl sm:text-3xl font-bold text-[#10243e] tracking-tight">₹{plan.price.toLocaleString()}</span>
                                                <span className="text-xs sm:text-sm font-semibold text-rose-500 line-through">₹{plan.original.toLocaleString()}</span>
                                            </div>
                                            {discountPercent > 0 && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                                                    {discountPercent}% OFF SAVINGS
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="mt-5 pt-5 border-t border-orange-100/90 space-y-2.5">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included in this plan:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {plan.features.map((f) => (
                                                <div key={f} className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                    <div className="w-4 h-4 rounded-md bg-gradient-to-b from-emerald-500 to-emerald-600 text-white flex items-center justify-center shrink-0">
                                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-[#10243e] leading-tight">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Subscribing Account Info */}
                                <div className="mt-5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Subscribing account: <strong className="text-[#10243e]">{user.name || "Member"}</strong> ({user.email})</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-orange-600">Verified</span>
                                </div>
                            </Card>

                            {/* Trust Footnote */}
                            <div className="p-4 rounded-2xl bg-gradient-to-b from-white to-blue-50/40 border border-blue-200/70 shadow-[0_1.5px_3px_rgba(37,99,235,0.04),inset_0_1px_0_rgba(255,255,255,1)] flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-600 leading-relaxed font-medium">
                                    <strong className="text-[#10243e] block mb-0.5">Secure Transaction Guarantee</strong>
                                    All payments are encrypted with bank-level security. Your subscription activates automatically on payment confirmation, and you can switch or renew anytime.
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Coupon & Order Summary */}
                        <div className="lg:col-span-5 space-y-6">
                            <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-6">
                                <div>
                                    <h2 className="text-base font-semibold text-[#10243e] tracking-tight">Order Summary</h2>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Review breakdown and proceed to payment</p>
                                </div>

                                {/* Coupon Section */}
                                <div className="space-y-2.5">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5 text-orange-500" /> Have a Coupon Code?
                                    </Label>

                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-gradient-to-b from-white to-emerald-50/60 shadow-[0_1.5px_3px_rgba(16,185,129,0.08)]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#10243e] tracking-wider">{appliedCoupon}</p>
                                                    <p className="text-[10px] text-emerald-600 font-semibold">{couponMessage}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs h-7 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                onClick={removeCoupon}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="h-10 rounded-xl bg-white border border-slate-200/90 text-xs font-bold tracking-wider uppercase text-[#10243e] shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(0,0,0,0.02)] focus-visible:ring-orange-500"
                                                disabled={applying}
                                            />
                                            <Button
                                                onClick={applyCoupon}
                                                disabled={applying || !couponCode.trim()}
                                                className="h-10 px-4 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] font-bold text-xs uppercase tracking-wider shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600 transition-all shrink-0"
                                            >
                                                {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                                            </Button>
                                        </div>
                                    )}
                                    {couponMessage && !appliedCoupon && (
                                        <p className="text-[11px] text-rose-500 font-medium">{couponMessage}</p>
                                    )}
                                </div>

                                {/* Price Breakdown Box */}
                                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-600">
                                        <span>Plan Subtotal</span>
                                        <span className="text-[#10243e] font-semibold">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    {credit > 0 && (
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-600">Loyalty Credit (Upgrade)</span>
                                            <span className="text-emerald-600 font-semibold">−₹{credit.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-600">Coupon Discount ({appliedCoupon})</span>
                                            <span className="text-emerald-600 font-semibold">−₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between items-center">
                                        <div>
                                            <span className="text-sm font-bold text-[#10243e] block">Total Amount</span>
                                            <span className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</span>
                                        </div>
                                        <span className="text-2xl font-bold text-orange-600 tracking-tight">₹{finalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <button
                                    type="button"
                                    onClick={handlePay}
                                    disabled={paying || isBlocked || previewLoading}
                                    className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] shadow-[0_3px_10px_rgba(249,115,22,0.38),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {paying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Processing Payment…</span>
                                        </>
                                    ) : isBlocked ? (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            <span>Plan Change Blocked</span>
                                        </>
                                    ) : finalAmount === 0 ? (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            <span>Activate Plan (₹0)</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            <span>Pay ₹{finalAmount.toLocaleString()}</span>
                                        </>
                                    )}
                                </button>

                                {/* Payment Trust Badge */}
                                <div className="space-y-2 pt-1 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                        <Lock className="h-3 w-3 text-slate-400" />
                                        <span>PCI-DSS Compliant · UPI, Cards & NetBanking</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 pt-1 opacity-70">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase">UPI</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase">Cards</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase">NetBanking</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase">Wallets</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;

