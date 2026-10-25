import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    Save,
    ArrowLeft,
    Activity,
    Check,
    ArrowRight,
    User,
    Target,
    Stethoscope,
    Moon,
    Utensils,
    Scale,
    Flame,
    Heart,
    Zap,
    ShieldCheck,
    Clock,
    Coffee,
    Dumbbell,
    Droplets,
    AlertCircle,
    Info,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { load } from "@cashfreepayments/cashfree-js";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { getLogoUrl } from "@/lib/api";

type FormData = {
    name: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
    heightFt: string;
    heightIn: string;
    weight: string;
    city: string;
    occupation: string;
    workingHours: string;
    maritalStatus: string;
    children: string;
    livingSituation: string;
    hormonalGoals: string[];
    primaryFitnessGoals: string[];
    targetTimeline: string;
    expectedWeight: string;
    motivationLevel: string;
    lifestyleMetabolic: string[];
    digestiveHealth: string[];
    hormonalMaleSpecific: string[];
    hormonalFemaleSpecific: string[];
    otherConditions: string[];
    menstrualRegularity: string;
    averageCycleLength: string;
    periodDuration: string;
    menstrualFlow: string;
    periodSymptoms: string[];
    pcos: string;
    pregnancyStatus: string;
    currentSupplements: string[];
    pastSurgeries: string;
    digestiveHealthOverall: string;
    alcoholConsumption: string;
    smokingHabit: string;
    wakeUpTime: string;
    sleepTime: string;
    sleepDuration: string;
    sleepQuality: string;
    dailyMovementLevel: string;
    stressLevel: string;
    waterIntake: string;
    currentlyExercise: string;
    exerciseTypes: string[];
    exerciseFrequency: string;
    dietType: string[];
    foodsDislike: string;
    foodAllergies: string[];
    foodAllergiesOther: string;
    teaCoffeeIntake: string;
    outsideFood: string;
    spiceTolerance: string;
    breakfastTime: string;
    midMorningSnackTime: string;
    lunchTime: string;
    eveningSnackTime: string;
    dinnerTime: string;
    lateNightEating: string;
    whoCooksMeals: string;
    kitchenAppliances: string[];
    budgetForFood: string;
    specialInstructions: string;
};

const emptyFormData: FormData = {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    heightFt: "",
    heightIn: "",
    weight: "",
    city: "",
    occupation: "",
    workingHours: "",
    maritalStatus: "",
    children: "",
    livingSituation: "",
    hormonalGoals: [],
    primaryFitnessGoals: [],
    targetTimeline: "",
    expectedWeight: "",
    motivationLevel: "",
    lifestyleMetabolic: [],
    digestiveHealth: [],
    hormonalMaleSpecific: [],
    hormonalFemaleSpecific: [],
    otherConditions: [],
    menstrualRegularity: "",
    averageCycleLength: "",
    periodDuration: "",
    menstrualFlow: "",
    periodSymptoms: [],
    pcos: "",
    pregnancyStatus: "",
    currentSupplements: [],
    pastSurgeries: "",
    digestiveHealthOverall: "",
    alcoholConsumption: "",
    smokingHabit: "",
    wakeUpTime: "",
    sleepTime: "",
    sleepDuration: "",
    sleepQuality: "",
    dailyMovementLevel: "",
    stressLevel: "",
    waterIntake: "",
    currentlyExercise: "",
    exerciseTypes: [],
    exerciseFrequency: "",
    dietType: [],
    foodsDislike: "",
    foodAllergies: [],
    foodAllergiesOther: "",
    teaCoffeeIntake: "",
    outsideFood: "",
    spiceTolerance: "",
    breakfastTime: "",
    midMorningSnackTime: "",
    lunchTime: "",
    eveningSnackTime: "",
    dinnerTime: "",
    lateNightEating: "",
    whoCooksMeals: "",
    kitchenAppliances: [],
    budgetForFood: "",
    specialInstructions: "",
};

const SECTIONS = [
    { id: "basic", label: "Basic Info", icon: User, desc: "Personal & body metrics" },
    { id: "goals", label: "Goals & Targets", icon: Target, desc: "Fitness & target weight" },
    { id: "medical", label: "Health & Medical", icon: Stethoscope, desc: "Symptoms & medical history" },
    { id: "lifestyle", label: "Lifestyle & Routine", icon: Moon, desc: "Sleep, stress & workouts" },
    { id: "food", label: "Food & Meals", icon: Utensils, desc: "Diet, timings & preferences" },
];

export default function HealthMetrics() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState<FormData>(emptyFormData);
    const [activeSection, setActiveSection] = useState<string>("basic");
    const [isNewUser, setIsNewUser] = useState(false);
    const [showFreeDay1, setShowFreeDay1] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");

    useEffect(() => {
        const authUser = localStorage.getItem("zuno_auth_user");
        if (!authUser) {
            navigate("/auth" + window.location.search);
            return;
        }
        const user = JSON.parse(authUser);
        setCurrentUser(user);
        loadProfile(user.id);
    }, [navigate]);

    const loadProfile = async (userId: string) => {
        try {
            const profile = await api.profiles.getByUserId(userId);
            if (profile) {
                if (!profile.height || profile.height === 0) {
                    setIsNewUser(true);
                } else {
                    setIsNewUser(false);
                }
                let ed = profile.extended_data || {};
                if (ed.formData) {
                    ed = { ...ed, ...ed.formData };
                }
                const heightCm = parseFloat(profile.height) || 0;
                const heightTotalIn = heightCm / 2.54;
                const ft = Math.floor(heightTotalIn / 12);
                const inches = Math.round(heightTotalIn % 12);

                setFormData({
                    name: profile.name || ed.name || "",
                    email: profile.email || ed.email || "",
                    phone: ed.phone || "",
                    age: ed.age ? String(ed.age) : profile.age ? String(profile.age) : "",
                    gender: ed.gender || profile.gender || "",
                    heightFt: ed.heightFt || (ft ? String(ft) : ""),
                    heightIn: ed.heightIn || (inches ? String(inches) : ""),
                    weight: ed.weight ? String(ed.weight) : profile.weight ? String(profile.weight) : "",
                    city: ed.city || "",
                    occupation: ed.occupation || "",
                    workingHours: ed.workingHours || "",
                    maritalStatus: ed.maritalStatus || "",
                    children: ed.children || "",
                    livingSituation: ed.livingSituation || "",
                    hormonalGoals: ed.hormonalGoals || [],
                    primaryFitnessGoals: ed.primaryFitnessGoals || [],
                    targetTimeline: ed.targetTimeline || "",
                    expectedWeight: ed.expectedWeight || "",
                    motivationLevel: ed.motivationLevel || "",
                    lifestyleMetabolic: ed.lifestyleMetabolic || [],
                    digestiveHealth: ed.digestiveHealth || [],
                    hormonalMaleSpecific: ed.hormonalMaleSpecific || [],
                    hormonalFemaleSpecific: ed.hormonalFemaleSpecific || [],
                    otherConditions: ed.otherConditions || [],
                    menstrualRegularity: ed.menstrualRegularity || "",
                    averageCycleLength: ed.averageCycleLength || "",
                    periodDuration: ed.periodDuration || "",
                    menstrualFlow: ed.menstrualFlow || "",
                    periodSymptoms: ed.periodSymptoms || [],
                    pcos: ed.pcos || "",
                    pregnancyStatus: ed.pregnancyStatus || "",
                    currentSupplements: ed.currentSupplements || [],
                    pastSurgeries: ed.pastSurgeries || "",
                    digestiveHealthOverall: ed.digestiveHealthOverall || "",
                    alcoholConsumption: ed.alcoholConsumption || "",
                    smokingHabit: ed.smokingHabit || "",
                    wakeUpTime: ed.wakeUpTime || "",
                    sleepTime: ed.sleepTime || "",
                    sleepDuration: ed.sleepDuration || "",
                    sleepQuality: ed.sleepQuality || "",
                    dailyMovementLevel: ed.dailyMovementLevel || "",
                    stressLevel: ed.stressLevel || "",
                    waterIntake: ed.waterIntake || "",
                    currentlyExercise: ed.currentlyExercise || "",
                    exerciseTypes: ed.exerciseTypes || [],
                    exerciseFrequency: ed.exerciseFrequency || "",
                    dietType: ed.dietType || [],
                    foodsDislike: ed.foodsDislike || "",
                    foodAllergies: ed.foodAllergies || [],
                    foodAllergiesOther: ed.foodAllergiesOther || "",
                    teaCoffeeIntake: ed.teaCoffeeIntake || "",
                    outsideFood: ed.outsideFood || "",
                    spiceTolerance: ed.spiceTolerance || "",
                    breakfastTime: ed.breakfastTime || "",
                    midMorningSnackTime: ed.midMorningSnackTime || "",
                    lunchTime: ed.lunchTime || "",
                    eveningSnackTime: ed.eveningSnackTime || "",
                    dinnerTime: ed.dinnerTime || "",
                    lateNightEating: ed.lateNightEating || "",
                    whoCooksMeals: ed.whoCooksMeals || "",
                    kitchenAppliances: ed.kitchenAppliances || [],
                    budgetForFood: ed.budgetForFood || "",
                    specialInstructions: ed.specialInstructions || "",
                });
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayToggle = (field: keyof FormData, value: string) => {
        setFormData((prev) => {
            const currentArray = (prev[field] as string[]) || [];
            // If selecting "None", clear all others
            if (value === "None") {
                return { ...prev, [field]: currentArray.includes("None") ? [] : ["None"] };
            }
            // If selecting something else, remove "None"
            const filtered = currentArray.filter((item) => item !== "None");
            const newArray = filtered.includes(value)
                ? filtered.filter((item) => item !== value)
                : [...filtered, value];
            return { ...prev, [field]: newArray };
        });
    };

    // Calculate BMI
    const bmiData = useMemo(() => {
        const ft = parseFloat(formData.heightFt) || 0;
        const inch = parseFloat(formData.heightIn) || 0;
        const wt = parseFloat(formData.weight) || 0;
        const totalInches = ft * 12 + inch;
        if (totalInches <= 0 || wt <= 0) return null;
        const heightMeters = (totalInches * 2.54) / 100;
        const val = wt / (heightMeters * heightMeters);
        if (!isFinite(val) || val <= 0) return null;

        let status = "Healthy Weight";
        let colorCls = "text-emerald-700 bg-emerald-50 border-emerald-200";
        let barColor = "bg-emerald-500";
        if (val < 18.5) {
            status = "Underweight";
            colorCls = "text-sky-700 bg-sky-50 border-sky-200";
            barColor = "bg-sky-500";
        } else if (val < 25) {
            status = "Healthy Weight";
            colorCls = "text-emerald-700 bg-emerald-50 border-emerald-200";
            barColor = "bg-emerald-500";
        } else if (val < 30) {
            status = "Overweight";
            colorCls = "text-amber-700 bg-amber-50 border-amber-200";
            barColor = "bg-amber-500";
        } else {
            status = "Obese";
            colorCls = "text-rose-700 bg-rose-50 border-rose-200";
            barColor = "bg-rose-500";
        }

        return {
            val: val.toFixed(1),
            status,
            colorCls,
            barColor,
        };
    }, [formData.heightFt, formData.heightIn, formData.weight]);

    // Target Weight difference
    const weightDiff = useMemo(() => {
        const current = parseFloat(formData.weight);
        const target = parseFloat(formData.expectedWeight);
        if (!current || !target || current <= 0 || target <= 0) return null;
        const diff = target - current;
        if (Math.abs(diff) < 0.2) return "Maintain current weight";
        if (diff > 0) return `Gain +${diff.toFixed(1)} kg`;
        return `Lose ${Math.abs(diff).toFixed(1)} kg`;
    }, [formData.weight, formData.expectedWeight]);

    // Validation for Next / Save
    const validateSection = (sectionId: string): boolean => {
        if (sectionId === "basic") {
            if (!formData.gender) {
                toast.error("Please select your Gender");
                return false;
            }
            if (!formData.name.trim()) {
                toast.error("Please enter your Full Name");
                return false;
            }
            if (!formData.phone.trim()) {
                toast.error("Please enter your WhatsApp Number");
                return false;
            }
            if (!formData.age || parseInt(formData.age) <= 0) {
                toast.error("Please enter a valid Age");
                return false;
            }
            if (!formData.heightFt || !formData.weight) {
                toast.error("Please enter Height and Weight");
                return false;
            }
        } else if (sectionId === "goals") {
            if (formData.primaryFitnessGoals.length === 0) {
                toast.error("Please select at least one Primary Fitness Goal");
                return false;
            }
            if (!formData.targetTimeline) {
                toast.error("Please select your Target Timeline");
                return false;
            }
            if (!formData.expectedWeight) {
                toast.error("Please enter your Target / Expected Weight");
                return false;
            }
        } else if (sectionId === "food") {
            if (formData.dietType.length === 0) {
                toast.error("Please select your Diet Type (e.g., Vegetarian, Non-Vegetarian)");
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!currentUser?.id) return;
        if (!validateSection("basic")) {
            setActiveSection("basic");
            return;
        }

        setIsSaving(true);
        try {
            const savedEmail = formData.email || currentUser?.email || "";
            const savedPhone = formData.phone || currentUser?.phone || "";
            await api.profiles.create({
                name: formData.name,
                email: savedEmail,
                user_id: currentUser.id,
                age: parseInt(formData.age),
                gender: formData.gender,
                height:
                    parseFloat(formData.heightFt) * 30.48 +
                    (parseFloat(formData.heightIn) || 0) * 2.54,
                weight: parseFloat(formData.weight),
                goal: formData.primaryFitnessGoals.join(", "),
                activity_level: formData.dailyMovementLevel,
                dietary_restrictions: [
                    ...formData.lifestyleMetabolic,
                    ...formData.digestiveHealth,
                    ...formData.hormonalMaleSpecific,
                    ...formData.hormonalFemaleSpecific,
                    ...formData.otherConditions,
                ],
                allergies: [...formData.foodAllergies, formData.foodAllergiesOther]
                    .filter(Boolean)
                    .join(", "),
                meal_preference: `${formData.dietType.join(", ")}, ${formData.foodsDislike}`,
                extended_data: {
                    ...formData,
                    email: savedEmail,
                    phone: savedPhone,
                },
            });

            const updatedProfile = await api.profiles.getByUserId(currentUser.id);
            if (updatedProfile) {
                localStorage.setItem("zuno_profile_data", JSON.stringify(updatedProfile));
            }

            toast.success("Health metrics saved successfully!");
            if (isNewUser) {
                setShowFreeDay1(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to save health metrics");
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = () => {
        if (!validateSection(activeSection)) return;
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
        if (currentIndex < SECTIONS.length - 1) {
            setActiveSection(SECTIONS[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            handleSave();
        }
    };

    const handlePrev = () => {
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
        if (currentIndex > 0) {
            setActiveSection(SECTIONS[currentIndex - 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate("/dashboard");
        }
    };

    const handleStartFreeDay1 = async () => {
        if (!currentUser?.id) {
            toast.error("Please login first");
            return;
        }
        setIsProcessing(true);
        try {
            const activeSub = await api.subscriptions.getActiveByUserId(currentUser.id);
            if (activeSub) {
                toast.info("You already have an active plan. Redirecting...");
                window.location.href = "/dashboard";
                return;
            }

            const profile = await api.profiles.getByUserId(currentUser.id);
            if (!profile) throw new Error("Profile not found. Please save your data first.");

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);

            const subscription = await api.subscriptions.create({
                user_id: currentUser.id,
                profile_id: profile.id,
                plan_type: "trial",
                plan_days: 1,
                end_date: endDate.toISOString().split("T")[0],
                amount: 0,
                payment_method: "free",
                payment_status: "completed",
            });

            await api.dietPlans.createBatch([
                {
                    subscription_id: subscription.id,
                    day_number: 1,
                    plan_date: new Date().toISOString().split("T")[0],
                    is_unlocked: false,
                    user_name: currentUser.name || formData.name,
                },
            ]);

            toast.success("Day 1 unlocked — let's generate your free plan!");
            window.location.href = "/dashboard";
        } catch (error: any) {
            console.error("Free trial error:", error);
            toast.error(error.message || "Could not start your free Day 1");
            setIsProcessing(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    const selectedGender = formData.gender;
    const currentStepIndex = SECTIONS.findIndex((s) => s.id === activeSection);

    // Reusable UI Builders
    const renderOptionTile = (
        value: string,
        currentValue: string,
        onSelect: (v: string) => void,
        label?: string,
        subtext?: string
    ) => {
        const isSelected = currentValue === value;
        return (
            <button
                type="button"
                onClick={() => onSelect(value)}
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                        ? "bg-gradient-to-b from-orange-50/90 to-orange-100/40 border-orange-500 shadow-[0_2px_6px_rgba(249,115,22,0.15),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-orange-500/30"
                        : "bg-gradient-to-b from-white to-slate-50/60 border-slate-200/90 hover:border-orange-300 hover:bg-orange-50/20 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                }`}
            >
                <div className="pr-2 min-w-0">
                    <div
                        className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected ? "text-orange-950" : "text-slate-800"
                        }`}
                    >
                        {label || value}
                    </div>
                    {subtext && (
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{subtext}</div>
                    )}
                </div>
                <div
                    className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                            ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-sm"
                            : "border border-slate-300 bg-white"
                    }`}
                >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
            </button>
        );
    };

    const renderChip = (
        value: string,
        isSelected: boolean,
        onToggle: () => void,
        icon?: any
    ) => {
        const IconComponent = icon;
        return (
            <button
                type="button"
                onClick={onToggle}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-xs font-medium border transition-all duration-150 cursor-pointer ${
                    isSelected
                        ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white border-orange-600 shadow-[0_2.5px_6px_rgba(249,115,22,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.2)] font-semibold"
                        : "bg-gradient-to-b from-white to-slate-50/80 border-slate-200/90 text-slate-700 hover:border-orange-300 hover:bg-orange-50/20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                }`}
            >
                {IconComponent && (
                    <IconComponent
                        className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`}
                    />
                )}
                <span className="truncate">{value}</span>
                {isSelected ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                )}
            </button>
        );
    };

    if (showFreeDay1) {
        return (
            <div className="min-h-screen bg-[#fafcff] text-slate-900 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
                <div className="max-w-md w-full">
                    <Card className="bg-white border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(16,36,62,0.08)] text-center space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center justify-center shadow-inner">
                            <Sparkles className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-[#10243e] tracking-tight">
                                Profile Ready to Transform
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Your metrics are saved! We can now generate your{" "}
                                <span className="text-orange-600 font-semibold">Day 1 Meal & Habit Plan</span>{" "}
                                with customized macros — completely free.
                            </p>
                        </div>

                        <div className="rounded-xl border border-orange-200/70 bg-gradient-to-b from-orange-50/60 to-white p-4 space-y-3 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-[#10243e]">Personalized Calorie & Macro Target</span>
                                    <p className="text-slate-500 text-[11px]">Accurately computed for your age & weight goal.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-[#10243e]">Dietary & Allergy Filtered</span>
                                    <p className="text-slate-500 text-[11px]">Zero guesswork. Fits your home cooking & timings.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-[#10243e]">No Payment Required</span>
                                    <p className="text-slate-500 text-[11px]">Try day 1 completely risk free.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_3px_8px_rgba(249,115,22,0.35)] hover:from-[#f97316] hover:to-[#c2410c] transition-all cursor-pointer"
                                onClick={handleStartFreeDay1}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    "Activating Your Plan..."
                                ) : (
                                    <>
                                        Generate My Free Day 1 Plan
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            <UserSidebar logoUrl={logoUrl} gender={formData.gender} onSignOut={handleSignOut} />

            <main className="relative flex-1 min-h-screen overflow-y-auto px-4 py-8 md:px-8 pt-24 lg:pt-8 pb-24 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-7">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-3xl font-medium font-sans text-[#10243e] tracking-tight leading-snug">
                                Health <span className="text-orange-500 font-medium">Metrics</span>
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Complete your health profile for AI personalized nutrition plans.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3.5 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] text-xs font-semibold shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600 cursor-pointer"
                            onClick={() => navigate("/dashboard")}
                        >
                            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Dashboard
                        </Button>
                    </div>

                    {/* Step Navigation Bar */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                        <div className="grid grid-cols-5 gap-2 sm:gap-3">
                            {SECTIONS.map((s, idx) => {
                                const IconC = s.icon;
                                const isCurrent = activeSection === s.id;
                                const isPassed = currentStepIndex > idx;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                            if (validateSection(activeSection)) {
                                                setActiveSection(s.id);
                                            }
                                        }}
                                        className={`group relative flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-xl transition-all text-left cursor-pointer ${
                                            isCurrent
                                                ? "bg-gradient-to-b from-orange-50/90 to-orange-100/50 border border-orange-400 shadow-[0_2px_6px_rgba(249,115,22,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
                                                : isPassed
                                                ? "bg-slate-50/70 border border-slate-200 hover:border-slate-300"
                                                : "border border-transparent hover:bg-slate-50 text-slate-400"
                                        }`}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                                                isCurrent
                                                    ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-sm"
                                                    : isPassed
                                                    ? "bg-emerald-500 text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <IconC className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="hidden sm:block min-w-0">
                                            <div
                                                className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                                                    isCurrent
                                                        ? "text-orange-950"
                                                        : isPassed
                                                        ? "text-slate-800"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {s.label}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate hidden lg:block">
                                                {s.desc}
                                            </div>
                                        </div>
                                        {/* Mobile dot indicator */}
                                        <span className="sm:hidden text-[10px] font-bold truncate text-slate-600">
                                            {idx + 1}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION 1: BASIC INFO */}
                    {activeSection === "basic" && (
                        <div className="space-y-6">
                            {/* Gender Selection */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                        Step 1 of 5
                                    </h3>
                                    <h2 className="text-xl font-medium text-[#10243e]">Biological Gender</h2>
                                    <p className="text-xs text-slate-500">
                                        Caloric burn and hormonal metrics depend heavily on biological gender.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("gender", "men")}
                                        className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                                            selectedGender === "men"
                                                ? "border-sky-500 bg-gradient-to-br from-sky-50/80 to-sky-100/30 shadow-[0_4px_14px_rgba(14,165,233,0.15)] ring-2 ring-sky-500/20"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                                selectedGender === "men"
                                                    ? "bg-sky-500 text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            ♂
                                        </div>
                                        <div className="text-left flex-1">
                                            <div
                                                className={`text-base font-semibold ${
                                                    selectedGender === "men" ? "text-sky-950" : "text-slate-800"
                                                }`}
                                            >
                                                Male
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Testosterone & metabolic support
                                            </div>
                                        </div>
                                        {selectedGender === "men" && (
                                            <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("gender", "women")}
                                        className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                                            selectedGender === "women"
                                                ? "border-rose-400 bg-gradient-to-br from-rose-50/80 to-rose-100/30 shadow-[0_4px_14px_rgba(244,63,94,0.15)] ring-2 ring-rose-400/20"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                        }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                                selectedGender === "women"
                                                    ? "bg-rose-500 text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            ♀
                                        </div>
                                        <div className="text-left flex-1">
                                            <div
                                                className={`text-base font-semibold ${
                                                    selectedGender === "women" ? "text-rose-950" : "text-slate-800"
                                                }`}
                                            >
                                                Female
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Cycle sync & hormonal wellness
                                            </div>
                                        </div>
                                        {selectedGender === "women" && (
                                            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </Card>

                            {/* Personal Details */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <h2 className="text-base font-medium text-[#10243e] flex items-center gap-2">
                                    <User className="w-4 h-4 text-orange-500" /> Personal Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-name" className="text-xs font-semibold text-slate-700">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="hm-name"
                                            placeholder="e.g. Rahul Sharma"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-phone" className="text-xs font-semibold text-slate-700">
                                            WhatsApp Number *
                                        </Label>
                                        <Input
                                            id="hm-phone"
                                            type="tel"
                                            placeholder="e.g. 9876543210"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-email" className="text-xs font-semibold text-slate-700">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="hm-email"
                                            type="email"
                                            placeholder="rahul@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-age" className="text-xs font-semibold text-slate-700">
                                            Age (Years) *
                                        </Label>
                                        <Input
                                            id="hm-age"
                                            type="number"
                                            placeholder="e.g. 28"
                                            value={formData.age}
                                            onChange={(e) => handleInputChange("age", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Height & Weight with Live BMI Tracker */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h2 className="text-base font-medium text-[#10243e] flex items-center gap-2">
                                            <Scale className="w-4 h-4 text-orange-500" /> Body Metrics & BMI
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Used to accurately compute Basal Metabolic Rate (BMR) & daily calorie goals.
                                        </p>
                                    </div>
                                    {bmiData && (
                                        <div
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${bmiData.colorCls}`}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-current" />
                                            <span>BMI: {bmiData.val}</span>
                                            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                                                ({bmiData.status})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-heightFt" className="text-xs font-semibold text-slate-700">
                                            Height (Feet) *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-heightFt"
                                                type="number"
                                                placeholder="5"
                                                value={formData.heightFt}
                                                onChange={(e) => handleInputChange("heightFt", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm pr-10"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                                                ft
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-heightIn" className="text-xs font-semibold text-slate-700">
                                            Height (Inches) *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-heightIn"
                                                type="number"
                                                placeholder="8"
                                                value={formData.heightIn}
                                                onChange={(e) => handleInputChange("heightIn", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm pr-10"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                                                in
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-weight" className="text-xs font-semibold text-slate-700">
                                            Current Weight *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-weight"
                                                type="number"
                                                placeholder="70"
                                                value={formData.weight}
                                                onChange={(e) => handleInputChange("weight", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm pr-10"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                                                kg
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* SECTION 2: GOALS & TARGETS */}
                    {activeSection === "goals" && (
                        <div className="space-y-6">
                            {/* Primary Fitness Goals */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                        Step 2 of 5
                                    </h3>
                                    <h2 className="text-xl font-medium text-[#10243e] flex items-center gap-2">
                                        <Flame className="w-5 h-5 text-orange-500" /> Primary Fitness Goal *
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Choose what matters most to your transformation (select all that apply).
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {[
                                        "Fat Loss",
                                        "Weight Loss",
                                        "Muscle Gain",
                                        "Lean Muscle Toning",
                                        "Strength Building",
                                        "Body Recomposition",
                                        "Increase Energy",
                                        "Improve Stamina",
                                        "Improve Metabolism",
                                        "Weight Gain",
                                    ].map((goal) =>
                                        renderChip(
                                            goal,
                                            formData.primaryFitnessGoals.includes(goal),
                                            () => handleArrayToggle("primaryFitnessGoals", goal),
                                            Flame
                                        )
                                    )}
                                </div>
                            </Card>


                            {/* Target Timeline & Expected Weight */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Target Timeline *
                                        </Label>
                                        <span className="text-xs text-slate-400">
                                            Realistic pace yields sustainable results
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {[
                                            { id: "30 days", label: "30 Days", sub: "1 Month Sprint" },
                                            { id: "45 days", label: "45 Days", sub: "6 Weeks Transformation" },
                                            { id: "60 days (2 months)", label: "60 Days", sub: "2 Months Habit Fix" },
                                            { id: "90 days (3 months)", label: "90 Days", sub: "3 Months Lifestyle" },
                                        ].map((t) =>
                                            renderOptionTile(
                                                t.id,
                                                formData.targetTimeline,
                                                (v) => handleInputChange("targetTimeline", v),
                                                t.label,
                                                t.sub
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-expectedWeight" className="text-xs font-semibold text-slate-700">
                                            Target / Expected Weight *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-expectedWeight"
                                                type="number"
                                                placeholder="e.g. 62"
                                                value={formData.expectedWeight}
                                                onChange={(e) => handleInputChange("expectedWeight", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm pr-10"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                                                kg
                                            </span>
                                        </div>
                                    </div>

                                    {weightDiff && (
                                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                                                <Target className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-semibold text-orange-950 uppercase tracking-wider">
                                                    Target Outcome
                                                </div>
                                                <div className="text-xs font-bold text-orange-600">
                                                    {weightDiff}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </Card>
                        </div>
                    )}

                    {/* SECTION 3: MEDICAL & HEALTH */}
                    {activeSection === "medical" && (
                        <div className="space-y-6">
                            {/* Female Specific Health */}
                            {selectedGender === "women" && (
                                <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                            Step 3 of 5
                                        </h3>
                                        <h2 className="text-xl font-medium text-[#10243e] flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-rose-500" /> Menstrual & Hormonal Health
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Customizing meal phases around your cycle regularity and PCOS status.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Menstrual Cycle Regularity
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {["Regular", "Irregular", "Very irregular", "Missed periods"].map(
                                                (opt) =>
                                                    renderOptionTile(
                                                        opt,
                                                        formData.menstrualRegularity,
                                                        (v) => handleInputChange("menstrualRegularity", v)
                                                    )
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                Average Cycle Length
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["21–24 days", "25–28 days", "29–32 days", "Varies monthly"].map(
                                                    (opt) =>
                                                        renderOptionTile(
                                                            opt,
                                                            formData.averageCycleLength,
                                                            (v) => handleInputChange("averageCycleLength", v)
                                                        )
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                PCOS / PCOD Diagnosis
                                            </Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {["Diagnosed", "Suspected", "No"].map((opt) =>
                                                    renderOptionTile(
                                                        opt,
                                                        formData.pcos,
                                                        (v) => handleInputChange("pcos", v)
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-5 space-y-3">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Period Symptoms
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Severe cramps",
                                                "Mild cramps",
                                                "Back pain",
                                                "Headaches / migraine",
                                                "Mood swings",
                                                "Fatigue",
                                                "Bloating",
                                                "Acne breakouts",
                                                "None",
                                            ].map((sym) =>
                                                renderChip(
                                                    sym,
                                                    formData.periodSymptoms.includes(sym),
                                                    () => handleArrayToggle("periodSymptoms", sym)
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Lifestyle, Metabolic & Gut Conditions */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-base font-medium text-[#10243e] flex items-center gap-2">
                                        <Stethoscope className="w-4 h-4 text-orange-500" /> Lifestyle & Metabolic Conditions
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Select any existing health conditions so we can formulate safe recipes.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {[
                                        "Obesity / Overweight",
                                        "Diabetes (Type 2)",
                                        "Prediabetes",
                                        "High cholesterol",
                                        "High BP",
                                        "Fatty liver",
                                        "Anemia (low iron)",
                                        "Thyroid (Hypo/Hyper)",
                                        "None",
                                    ].map((cond) =>
                                        renderChip(
                                            cond,
                                            formData.lifestyleMetabolic.includes(cond),
                                            () => handleArrayToggle("lifestyleMetabolic", cond),
                                            ShieldCheck
                                        )
                                    )}
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Digestive & Gut Health
                                    </Label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            "Acidity / GERD",
                                            "Gas / Bloating",
                                            "IBS",
                                            "Constipation",
                                            "Diarrhea",
                                            "Frequent indigestion",
                                            "None",
                                        ].map((cond) =>
                                            renderChip(
                                                cond,
                                                formData.digestiveHealth.includes(cond),
                                                () => handleArrayToggle("digestiveHealth", cond)
                                            )
                                        )}
                                    </div>
                                </div>

                                {selectedGender === "men" && (
                                    <div className="border-t border-slate-100 pt-5 space-y-3">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Hormonal & Vitality Symptoms
                                        </Label>
                                        <div className="flex flex-wrap gap-2.5">
                                            {[
                                                "Low testosterone",
                                                "Low libido",
                                                "Fatigue / low stamina",
                                                "Thyroid issues",
                                                "None",
                                            ].map((cond) =>
                                                renderChip(
                                                    cond,
                                                    formData.hormonalMaleSpecific.includes(cond),
                                                    () => handleArrayToggle("hormonalMaleSpecific", cond)
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Current Supplements & Surgeries */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Current Supplements
                                    </Label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            "Multivitamin",
                                            "Omega-3",
                                            "Vitamin D",
                                            "Vitamin B12",
                                            "Protein powder",
                                            "Creatine",
                                            "Iron supplement",
                                            "Calcium",
                                            "Biotin",
                                            "None",
                                        ].map((sup) =>
                                            renderChip(
                                                sup,
                                                formData.currentSupplements.includes(sup),
                                                () => handleArrayToggle("currentSupplements", sup)
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-1.5">
                                    <Label htmlFor="hm-pastSurgeries" className="text-xs font-semibold text-slate-700">
                                        Past Surgeries, Medical Notes or Injuries
                                    </Label>
                                    <Textarea
                                        id="hm-pastSurgeries"
                                        placeholder="Mention any surgeries, back issues, knee pain, or details the nutritionist should know..."
                                        value={formData.pastSurgeries}
                                        onChange={(e) => handleInputChange("pastSurgeries", e.target.value)}
                                        className="min-h-[85px] rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        maxLength={600}
                                    />
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* SECTION 4: LIFESTYLE & ROUTINE */}
                    {activeSection === "lifestyle" && (
                        <div className="space-y-6">
                            {/* Sleep & Daily Schedule */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                        Step 4 of 5
                                    </h3>
                                    <h2 className="text-xl font-medium text-[#10243e] flex items-center gap-2">
                                        <Moon className="w-5 h-5 text-indigo-500" /> Sleep & Circadian Rhythm
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Nutrient absorption and hunger hormones (ghrelin/leptin) are regulated during deep sleep.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-wakeUpTime" className="text-xs font-semibold text-slate-700">
                                            Wake-Up Time
                                        </Label>
                                        <Input
                                            id="hm-wakeUpTime"
                                            type="time"
                                            value={formData.wakeUpTime}
                                            onChange={(e) => handleInputChange("wakeUpTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-sleepTime" className="text-xs font-semibold text-slate-700">
                                            Bed Time
                                        </Label>
                                        <Input
                                            id="hm-sleepTime"
                                            type="time"
                                            value={formData.sleepTime}
                                            onChange={(e) => handleInputChange("sleepTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-sleepDuration" className="text-xs font-semibold text-slate-700">
                                            Average Sleep Duration
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-sleepDuration"
                                                type="number"
                                                placeholder="7"
                                                value={formData.sleepDuration}
                                                onChange={(e) => handleInputChange("sleepDuration", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm pr-12"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                                                hrs
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Sleep Quality
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {["Deep & Refreshing", "Good", "Disturbed / Broken", "Poor"].map((sq) =>
                                            renderOptionTile(
                                                sq,
                                                formData.sleepQuality,
                                                (v) => handleInputChange("sleepQuality", v)
                                            )
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Activity, Stress & Water */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Daily Movement / Activity Level
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {[
                                            { id: "Sedentary", label: "Sedentary", sub: "Desk job, < 4k steps" },
                                            { id: "Lightly Active", label: "Light", sub: "4k – 7k steps/day" },
                                            { id: "Moderate", label: "Moderate", sub: "7k – 10k steps/day" },
                                            { id: "Very High", label: "Very Active", sub: "10k+ steps or physical job" },
                                        ].map((act) =>
                                            renderOptionTile(
                                                act.id,
                                                formData.dailyMovementLevel,
                                                (v) => handleInputChange("dailyMovementLevel", v),
                                                act.label,
                                                act.sub
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-4 h-4 text-sky-500" />
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Daily Water Intake
                                        </Label>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {["< 1.5 Litres", "1.5 – 2 Litres", "2 – 3 Litres", "3+ Litres"].map(
                                            (wi) =>
                                                renderOptionTile(
                                                    wi,
                                                    formData.waterIntake,
                                                    (v) => handleInputChange("waterIntake", v)
                                                )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Stress Level
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {["Low", "Moderate", "High", "Very High"].map((sl) =>
                                            renderOptionTile(
                                                sl,
                                                formData.stressLevel,
                                                (v) => handleInputChange("stressLevel", v)
                                            )
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Physical Exercise & Habits */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4 text-orange-500" />
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Do You Currently Exercise?
                                        </Label>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {["Yes", "Sometimes", "No"].map((opt) =>
                                            renderOptionTile(
                                                opt,
                                                formData.currentlyExercise,
                                                (v) => handleInputChange("currentlyExercise", v)
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Type of Workouts
                                    </Label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            "Gym / Weights",
                                            "Home Workouts",
                                            "Walking / Running",
                                            "Yoga",
                                            "Pilates",
                                            "HIIT / Cardio",
                                            "Sports",
                                            "None",
                                        ].map((wType) =>
                                            renderChip(
                                                wType,
                                                formData.exerciseTypes.includes(wType),
                                                () => handleArrayToggle("exerciseTypes", wType)
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-3">
                                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                        Exercise Frequency
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {["1–2 days/week", "3–4 days/week", "5–6 days/week", "Daily"].map(
                                            (freq) =>
                                                renderOptionTile(
                                                    freq,
                                                    formData.exerciseFrequency,
                                                    (v) => handleInputChange("exerciseFrequency", v)
                                                )
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* SECTION 5: FOOD & MEALS */}
                    {activeSection === "food" && (
                        <div className="space-y-6">
                            {/* Diet Type */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                                        Step 5 of 5
                                    </h3>
                                    <h2 className="text-xl font-medium text-[#10243e] flex items-center gap-2">
                                        <Utensils className="w-5 h-5 text-orange-500" /> Diet Type & Food Preferences *
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Every suggested recipe strictly abides by your diet category.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain"].map(
                                        (d) =>
                                            renderChip(
                                                d,
                                                formData.dietType.includes(d),
                                                () => handleArrayToggle("dietType", d),
                                                Utensils
                                            )
                                    )}
                                </div>
                            </Card>

                            {/* Allergies & Dislikes */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-rose-500" />
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Food Allergies & Intolerances
                                        </Label>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            "Lactose intolerance",
                                            "Dairy allergy",
                                            "Gluten intolerance",
                                            "Peanut allergy",
                                            "Soy allergy",
                                            "Egg allergy",
                                            "None",
                                        ].map((al) =>
                                            renderChip(
                                                al,
                                                formData.foodAllergies.includes(al),
                                                () => handleArrayToggle("foodAllergies", al)
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 space-y-1.5">
                                    <Label htmlFor="hm-foodsDislike" className="text-xs font-semibold text-slate-700">
                                        Foods You Dislike / Avoid
                                    </Label>
                                    <Input
                                        id="hm-foodsDislike"
                                        placeholder="e.g. Karela, Mushrooms, Baingan, Seafood"
                                        value={formData.foodsDislike}
                                        onChange={(e) => handleInputChange("foodsDislike", e.target.value)}
                                        className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-teaCoffeeIntake" className="text-xs font-semibold text-slate-700">
                                            Tea / Coffee Intake
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="hm-teaCoffeeIntake"
                                                placeholder="e.g. 2 cups with milk"
                                                value={formData.teaCoffeeIntake}
                                                onChange={(e) => handleInputChange("teaCoffeeIntake", e.target.value)}
                                                className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Outside Food Frequency
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Rarely (0-1x/wk)", "2-3x/week", "Almost daily", "Never"].map(
                                                (opt) =>
                                                    renderOptionTile(
                                                        opt,
                                                        formData.outsideFood,
                                                        (v) => handleInputChange("outsideFood", v)
                                                    )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Meal Timings */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-5">
                                <div className="space-y-1">
                                    <h2 className="text-base font-medium text-[#10243e] flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" /> Daily Meal Timings
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Helps sync your metabolic window and optimize digestion.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-breakfastTime" className="text-xs font-semibold text-slate-700">
                                            Breakfast
                                        </Label>
                                        <Input
                                            id="hm-breakfastTime"
                                            type="time"
                                            value={formData.breakfastTime}
                                            onChange={(e) => handleInputChange("breakfastTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-lunchTime" className="text-xs font-semibold text-slate-700">
                                            Lunch
                                        </Label>
                                        <Input
                                            id="hm-lunchTime"
                                            type="time"
                                            value={formData.lunchTime}
                                            onChange={(e) => handleInputChange("lunchTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-eveningSnackTime" className="text-xs font-semibold text-slate-700">
                                            Evening Snack
                                        </Label>
                                        <Input
                                            id="hm-eveningSnackTime"
                                            type="time"
                                            value={formData.eveningSnackTime}
                                            onChange={(e) => handleInputChange("eveningSnackTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="hm-dinnerTime" className="text-xs font-semibold text-slate-700">
                                            Dinner
                                        </Label>
                                        <Input
                                            id="hm-dinnerTime"
                                            type="time"
                                            value={formData.dinnerTime}
                                            onChange={(e) => handleInputChange("dinnerTime", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                        <Label htmlFor="hm-lateNightEating" className="text-xs font-semibold text-slate-700">
                                            Late Night Snacking
                                        </Label>
                                        <Input
                                            id="hm-lateNightEating"
                                            placeholder="e.g. No / around 11:30 PM"
                                            value={formData.lateNightEating}
                                            onChange={(e) => handleInputChange("lateNightEating", e.target.value)}
                                            className="h-10 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Special Dietary Instructions */}
                            <Card className="bg-white border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-[0_2px_6px_rgba(0,0,0,0.02)] space-y-3">
                                <Label htmlFor="hm-specialInstructions" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Special Dietary Instructions
                                </Label>
                                <Textarea
                                    id="hm-specialInstructions"
                                    placeholder="Any specific fasts, religious preferences, or cultural requirements..."
                                    value={formData.specialInstructions}
                                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                                    className="min-h-[85px] rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-xs sm:text-sm"
                                    maxLength={600}
                                />
                            </Card>
                        </div>
                    )}

                    {/* Action Bar (Previous / Next / Save) */}
                    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                type="button"
                                className="flex-1 sm:flex-none h-11 px-5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
                                onClick={handlePrev}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {currentStepIndex > 0 ? "Previous Step" : "Dashboard"}
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className="hidden sm:inline-flex h-11 px-5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Progress"}
                            </Button>

                            <Button
                                type="button"
                                className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_3px_8px_rgba(249,115,22,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1px_1px_rgba(0,0,0,0.25)] hover:from-[#f97316] hover:to-[#c2410c] transition-all cursor-pointer"
                                onClick={handleNext}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    "Saving..."
                                ) : currentStepIndex === SECTIONS.length - 1 ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Submit Profile
                                    </>
                                ) : (
                                    <>
                                        Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
