import { Sparkles, Download, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { useAppConfig } from "@/hooks/useAppConfig";

// Modules & Utils
import { useDashboard } from "@/modules/diet/hooks/useDashboard";
import { canUnlockDay, calculateBMI, calculateDailyCalories, getLocalISODate } from "@/lib/utils/diet";
import { downloadMealPlanAsPDF } from "@/lib/utils/pdf-utils";
import { getLogoUrl, getEnableRegenerate, api } from "@/lib/api";

// Components
import { MealPlanDisplay } from "@/modules/diet/components/MealPlanDisplay";
import { DailySummary } from "@/modules/diet/components/DailySummary";
import { StatsGrid } from "@/modules/diet/components/StatsGrid";
import { DaySelector } from "@/modules/diet/components/DaySelector";
import { CheckinModal } from "@/modules/user/components/CheckinModal";



const Dashboard = () => {
    const appConfig = useAppConfig();
    const navigate = useNavigate();
    const {
        userData, dayPlans, setDayPlans, selectedDay, setSelectedDay, isLoading, isGenerating,
        showCheckinModal, setShowCheckinModal, checkinData, setCheckinData,
        pendingTimer, timeLeft, isTimerExpired, processUnlock,
        unlockTodaysPlan, handleTimerExpiryUnlock, startRegeneration,
        hasActiveSub, activePlanType
    } = useDashboard();

    const [searchParams] = useSearchParams();

    
    useEffect(() => {
        const orderId = searchParams.get("order_id") || searchParams.get("orderId");
        const gateway = searchParams.get("gateway");
        if (!orderId) return;

        // Razorpay verifies inside its checkout handler (already activated subscription).
        // Just clean up pending data and refresh.
        if (gateway === "razorpay") {
            const pendingData = JSON.parse(localStorage.getItem("zuno_pending_payment") || "{}");
            const subId = pendingData.subscriptionId;
            if (subId) {
                api.subscriptions.update(subId, { payment_status: 'completed' }).catch(() => { });
            }
            localStorage.removeItem("zuno_pending_payment");
            toast.success("Payment successful! Your plan is now active.");
            setTimeout(() => window.location.href = "/dashboard", 1500);
            return;
        }

        const verifyPayment = async () => {
            try {
                // 1. Verify with Cashfree
                const verification = await api.payment.verifyOrder(orderId);
                const status = (verification.order_status || "").toUpperCase();

                if (status === "PAID" || status === "ACTIVE" || status === "COMPLETED") {
                    // 2. Get pending sub ID from localStorage
                    const pendingData = JSON.parse(localStorage.getItem("zuno_pending_payment") || "{}");
                    const subId = pendingData.subscriptionId;

                    if (subId) {
                        console.log("[Dashboard] Payment Verified. Activating subscription:", subId);
                        
                        await api.subscriptions.update(subId, { payment_status: 'completed' });

                        // Cleanup
                        localStorage.removeItem("zuno_pending_payment");
                        toast.success("Payment successful! Your plan is now active.");

                        // Refresh dashboard logic is handled via useDashboard hook reactivity normally,
                        // but a quick reload ensures everything is perfectly synced.
                        setTimeout(() => window.location.href = "/dashboard", 1500);
                    }
                } else if (status === "FAILED") {
                    toast.error("Payment failed. Please try again.");
                }
            } catch (error) {
                console.error("Payment verification error:", error);
            }
        };

        verifyPayment();
    }, [searchParams]);
    // ---------------------------------------------------------

    // Feature 2: Handle meal substitution — update timeline in local state
    const handleMealSubstituted = (mealIndex: number, newMeal: any, updatedChangesCount: number) => {
        setDayPlans((prev: any[]) => {
            const updated = [...prev];
            const day = { ...updated[selectedDay] };
            if (day.meal_plan?.timeline) {
                const timeline = [...day.meal_plan.timeline];
                // Replace the substituted meal (merge new data into timeline item)
                timeline[mealIndex] = {
                    ...timeline[mealIndex],
                    option_1: newMeal,
                    option_2: undefined,
                    name: newMeal.name,
                    calories: newMeal.calories,
                    protein: newMeal.protein,
                    carbs: newMeal.carbs,
                    fat: newMeal.fat,
                };
                day.meal_plan = { ...day.meal_plan, timeline };
            }
            day.meal_changes_count = 5 - updatedChangesCount;
            updated[selectedDay] = day;
            return updated;
        });
    };

    const currentDayPlan = dayPlans[selectedDay] || null;
    const targetCalories = userData ? calculateDailyCalories(userData) : 2000;
    
    // Fetch settings for logo
    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");

    const handleDownload = () => {
        if (!currentDayPlan?.day_number) return;
        downloadMealPlanAsPDF("printable-meal-plan", currentDayPlan.day_number);
    };

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    // -------- Free Day 1 (dashboard CTA) --------
    const [trialUsed, setTrialUsed] = useState<boolean | null>(null);
    const [startingFreeTrial, setStartingFreeTrial] = useState(false);

    useEffect(() => {
        const userId = (userData as any)?.user_id || (userData as any)?.id;
        if (!userId) return;
        // Decide whether to show the free CTA: only if no past trial subscription exists.
        api.subscriptions.getAllByUserId(String(userId))
            .then((subs: any[]) => {
                const hadTrial = Array.isArray(subs) && subs.some((s) =>
                    String(s?.plan_type || "").toLowerCase() === "trial" ||
                    String(s?.payment_method || "").toLowerCase() === "free"
                );
                setTrialUsed(hadTrial);
            })
            .catch(() => setTrialUsed(false));
    }, [userData]);

    const handleStartFreeDay1Dashboard = async () => {
        const userId = (userData as any)?.user_id || (userData as any)?.id;
        if (!userId) return;
        setStartingFreeTrial(true);
        try {
            const activeSub = await api.subscriptions.getActiveByUserId(String(userId));
            if (activeSub) {
                toast.info("You already have an active plan.");
                window.location.reload();
                return;
            }
            // Auto-create a placeholder profile if user hasn't filled metrics yet —
            // they can complete it later from /health-metrics.
            let profile = await api.profiles.getByUserId(String(userId));
            if (!profile || !profile.id) {
                await api.profiles.create({
                    user_id: userId,
                    name: userData?.name || "User",
                    email: (userData as any)?.email || "",
                    age: 0, gender: "", height: 0, weight: 0,
                    goal: "", activity_level: "",
                    dietary_restrictions: [], allergies: "", meal_preference: "",
                    extended_data: {},
                });
                profile = await api.profiles.getByUserId(String(userId));
            }

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);

            const subscription = await api.subscriptions.create({
                user_id: userId,
                profile_id: profile.id,
                plan_type: "trial",
                plan_days: 1,
                end_date: endDate.toISOString().split("T")[0],
                amount: 0,
                payment_method: "free",
                payment_status: "completed",
            });

            await api.dietPlans.createBatch([{
                subscription_id: subscription.id,
                day_number: 1,
                plan_date: new Date().toISOString().split("T")[0],
                is_unlocked: false,
                user_name: userData?.name || "",
            }]);

            toast.success("Day 1 unlocked — generating your free plan!");
            window.location.reload();
        } catch (e: any) {
            console.error("Free Day 1 error:", e);
            toast.error(e?.message || "Could not start your free Day 1");
            setStartingFreeTrial(false);
        }
    };
    // --------------------------------------------

    if (!userData) return null;

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            {/* Ambient Background Glows */}
            <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            {/* Sidebar Component */}
            <UserSidebar logoUrl={logoUrl} gender={userData?.gender} onSignOut={handleSignOut} />

            {/* Main Content Area */}
            <main className="relative flex-1 min-h-screen overflow-y-auto overflow-x-hidden px-4 py-8 md:px-8 pt-24 lg:pt-8 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-7">
                    
                    {(userData as any).is_placeholder && (
                        <div className="bg-gradient-to-b from-white via-red-50/30 to-red-50/60 border border-red-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-[0_2px_6px_rgba(239,68,68,0.06),inset_0_1px_0_rgba(255,255,255,1)]">
                            <div className="flex items-start sm:items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-red-100/80 rounded-xl flex-shrink-0 text-red-600">
                                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[13px] sm:text-sm font-medium text-[#10243e]">Please complete your health metrics to generate your diet plan.</h4>
                                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">Your health profile data is required before you can unlock and generate any diet plans.</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => window.location.href='/health-metrics'}
                                className="w-full md:w-auto h-10 px-5 bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white text-xs font-medium uppercase tracking-[0.14em] rounded-xl shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65)] hover:brightness-105 flex-shrink-0"
                            >
                                Complete Health Data
                            </Button>
                        </div>
                    )}

                    
                    {/* Welcome Header Section */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-3xl font-medium text-[#10243e] tracking-tight leading-snug">
                                Welcome, <span className="text-orange-500 font-medium">{userData.name || 'Guest'}!</span>
                            </h1>
                            <p className="max-w-sm text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Personalized nutrition for your <span className="text-[#10243e] font-semibold">Health Transformation</span>.
                            </p>
                        </div>

                        {/* Stats Grid - Inline */}
                        <div className="w-full lg:w-auto">
                            <StatsGrid 
                                targetCalories={targetCalories} 
                                selectedDay={selectedDay} 
                                calculateBMI={() => calculateBMI(userData.height, userData.weight)} 
                                userData={userData} 
                                hasActiveSub={hasActiveSub}
                                activePlanType={activePlanType}
                            />
                        </div>
                    </div>

                    {/* Day Selection Area */}
                    {dayPlans.length > 0 ? (
                        <>
                            <div className="space-y-3">
                                <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400">Select Day</h2>
                                <DaySelector 
                                    dayPlans={dayPlans} 
                                    selectedDay={selectedDay} 
                                    setSelectedDay={setSelectedDay} 
                                    canUnlockDay={(day, idx) => canUnlockDay(day, idx, dayPlans)} 
                                    getLocalISODate={getLocalISODate} 
                                />
                            </div>

                            {/* Meal Plan Display Section */}
                            <div className="grid lg:grid-cols-3 gap-5">
                                <div className="lg:col-span-2">
                                    <div id="printable-meal-plan" className="bg-transparent space-y-5">
                                        <MealPlanDisplay
                                            currentDayPlan={currentDayPlan}
                                            selectedDay={selectedDay}
                                            dayPlans={dayPlans}
                                            canUnlockDay={(day, idx) => canUnlockDay(day, idx, dayPlans)}
                                            unlockTodaysPlan={unlockTodaysPlan}
                                            isGenerating={isGenerating}
                                            pendingTimer={pendingTimer}
                                            timeLeft={timeLeft}
                                            isTimerExpired={isTimerExpired}
                                            handleTimerExpiryUnlock={handleTimerExpiryUnlock}
                                            userData={userData}
                                            activePlanType={activePlanType}
                                            onMealSubstituted={handleMealSubstituted}
                                        />
                                        {/* Print-only Daily Summary — shown in PDF but hidden on screen */}
                                        {currentDayPlan?.meal_plan && (
                                            <div className="print-only-summary">
                                                <DailySummary
                                                    currentDayPlan={currentDayPlan}
                                                    targetCalories={targetCalories}
                                                    userData={userData}
                                                    printMode={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Sidebar Info */}
                                <div className="space-y-4">
                                    <DailySummary
                                        currentDayPlan={currentDayPlan}
                                        targetCalories={targetCalories}
                                        userData={userData}
                                    />

                                    {currentDayPlan?.meal_plan && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-11 border-blue-200 bg-white text-xs font-semibold hover:bg-blue-50 hover:border-blue-400 text-blue-700 rounded-2xl shadow-sm transition-all" 
                                            onClick={handleDownload}
                                        >
                                            <Download className="mr-2 h-4 w-4 text-blue-600" />
                                            DOWNLOAD MEAL PLAN (PDF)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : isLoading ? (
                        <div aria-hidden="true" className="min-h-40" />
                    ) : (
                        <div className="max-w-4xl mx-auto py-12 text-center">
                            <div className="h-20 w-20 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Sparkles className="h-10 w-10 text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#10243e] mb-3">
                                {trialUsed ? "Plan Expired/Inactive" : "Choose A Plan"}
                            </h2>
                            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-10">
                                {trialUsed
                                    ? "Your current nutritional strategy has ended. Choose a new membership tier to continue your health transformation."
                                    : "Want more than Day 1? Upgrade anytime to unlock the full journey."}
                            </p>

                            <div className="grid md:grid-cols-3 gap-5">
                                {[
                                    { id: 'daily', name: 'Daily', price: Number(appConfig.priceDaily) || 99, dur: '1 Day' },
                                    { id: 'weekly', name: 'Weekly', price: Number(appConfig.priceWeekly) || 599, dur: '7 Days' },
                                    { id: 'monthly', name: 'Monthly', price: Number(appConfig.priceMonthly) || 1999, dur: '30 Days' }
                                ].map((p) => (
                                    <div 
                                        key={p.id} 
                                        className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center group hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer" 
                                        onClick={() => window.location.href=`/checkout?plan=${p.id}`}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2">{p.name} Plan</p>
                                        <div className="text-3xl font-black text-[#10243e] mb-1">₹{p.price}</div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{p.dur} Access</p>
                                        <Button className="w-full mt-6 h-11 text-xs font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.25)] transition-all">
                                            {trialUsed ? "RENEW NOW" : "UPGRADE"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {getEnableRegenerate() && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button 
                        onClick={startRegeneration} 
                        disabled={isGenerating}
                        className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-2xl flex items-center gap-2 group"
                    >
                        <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                        <span className="text-[10px] tracking-widest uppercase">Fix AI Plan</span>
                    </Button>
                </div>
            )}

            {showCheckinModal && (
                <CheckinModal
                    checkinData={checkinData}
                    setCheckinData={setCheckinData}
                    processUnlock={processUnlock}
                    langOptions={['English', 'Hindi', 'Hinglish', 'Punjabi', 'Marathi', 'Gujarati']}
                    onClose={() => setShowCheckinModal(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
