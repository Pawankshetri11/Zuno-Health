import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Drumstick,
  Dumbbell,
  Droplets,
  Egg,
  FileText,
  HeartPulse,
  Home,
  Lock,
  Play,
  Salad,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingDown,
  User,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppConfig } from "@/hooks/useAppConfig";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/landing/hero-banner.png";
import goalWeightLoss from "@/assets/landing/goal-weight-loss-cutout.png";
import goalWeightGain from "@/assets/landing/goal-weight-gain-user.png";
import goalLossIcon from "@/assets/landing/goal-loss-icon.png";
import goalGainIcon from "@/assets/landing/goal-gain-icon.png";
import mealBreakfast from "@/assets/landing/meal-breakfast.png";
import mealLunch from "@/assets/landing/meal-lunch.png";
import mealSnacks from "@/assets/landing/meal-snacks.png";
import mealDinner from "@/assets/landing/meal-dinner.png";
import workoutHome from "@/assets/landing/workout-home.png";
import workoutGym from "@/assets/landing/workout-gym.png";
import pricingAthletes from "@/assets/landing/pricing-athletes.png";

const orange = "#f97316";
const blue = "#38bdf8";

/* ----------------------------------- Hero ---------------------------------- */

const heroChecklist = [
  { icon: UtensilsCrossed, label: "Indian Meals" },
  { icon: Sparkles, label: "Personalized Plans" },
  { icon: Dumbbell, label: "Gym & Home Workouts" },
  { icon: Activity, label: "Track Your Progress" },
];

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white text-slate-950">
      <img
        src={heroBanner}
        alt="Athletes with a healthy meal and personalized nutrition plan"
        className="absolute inset-x-0 top-0 -z-20 h-full w-full object-contain object-top"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[92vw] bg-gradient-to-r from-white/95 via-white/90 to-transparent md:w-[min(500px,72vw)]" />
      <div className="relative mx-auto flex min-h-[650px] max-w-[1600px] items-center px-8 pb-16 pt-28 md:min-h-[690px] md:px-12 lg:px-16 lg:pb-20">
        <div data-aos="fade-up" className="max-w-[460px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-900 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Nutrition Coach
            </div>

            <h1 className="mt-5 text-3xl font-medium leading-[1.02] tracking-tight text-[#10243e] sm:text-4xl xl:text-5xl">
              Your Goals.
              <br />
              <span className="text-orange-500">
                Your Food.
              </span>
              <br />
              <span className="text-blue-600">
                Your Plan.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-700 md:text-base md:leading-7">
              AI-powered Indian diet plans for weight loss and weight gain. Built for
              your lifestyle, whether you train at home or in the gym.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/auth"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-[13px] font-medium text-white shadow-[0_8px_20px_rgba(249,115,22,0.24)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_12px_24px_rgba(249,115,22,0.32)] active:translate-y-0"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-400 bg-white/85 px-6 text-[13px] font-medium text-blue-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_20px_rgba(37,99,235,0.14)] active:translate-y-0"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"><Play className="ml-0.5 h-3 w-3" /></span>
                Watch Demo
              </a>
            </div>
          <div className="mt-7 flex w-max max-w-[calc(100vw-4rem)] flex-nowrap items-center gap-x-2 overflow-x-auto rounded-xl bg-white/45 px-2 py-1 text-black backdrop-blur-[2px]">
            {heroChecklist.map(({ icon: Icon, label }, index) => (
              <React.Fragment key={label}>
                <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-black">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-white/80"><Icon className="h-3.5 w-3.5 text-blue-700" /></span>
                  {label}
                </span>
                {index < heroChecklist.length - 1 && <span aria-hidden="true" className="h-5 w-px shrink-0 bg-slate-900/20" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------- Goals ---------------------------------- */

const goals = [
  {
    title: "Weight Loss",
    copy: "Reduce body fat with balanced Indian meals and simple workouts.",
    image: goalWeightLoss,
    icon: goalLossIcon,
    accent: "sky" as const,
  },
  {
    title: "Weight Gain",
    copy: "Gain healthy weight and build muscle with high-calorie Indian meal plans.",
    image: goalWeightGain,
    icon: goalGainIcon,
    accent: "orange" as const,
  },
];

const accentStyles = {
  sky: {
    card: "border-blue-200 bg-gradient-to-br from-[#edf6ff] to-[#f8fbff] shadow-[0_12px_30px_rgba(37,99,235,0.07)]",
    icon: "bg-blue-600 text-white",
    arrow: "bg-blue-600 text-white hover:bg-blue-700",
  },
  orange: {
    card: "border-orange-200 bg-gradient-to-br from-[#fff4ec] to-[#fffaf7] shadow-[0_12px_30px_rgba(249,115,22,0.08)]",
    icon: "bg-orange-500 text-white",
    arrow: "bg-orange-500 text-white hover:bg-orange-600",
  },
};

const GoalSection = () => {
  return (
    <section id="goals" className="relative bg-white pb-10 pt-2 md:pb-12 md:pt-3">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-semibold tracking-tight text-[#10243e] md:text-4xl">
            What's Your Goal?
          </h2>
          <p className="mt-2 text-base text-slate-600">Choose your goal and get a personalized diet plan.</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
          {goals.map((goal) => {
            const s = accentStyles[goal.accent];
            return (
              <Link
                to="/auth"
                key={goal.title}
                data-aos="fade-up"
                className={`group relative flex min-h-[210px] items-center overflow-hidden rounded-2xl border px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:min-h-[228px] sm:px-7 ${s.card}`}
              >
                <img
                  src={goal.image}
                  alt=""
                  className="pointer-events-none absolute right-[2%] top-1/2 z-0 h-full max-h-full w-auto max-w-[90%] -translate-y-1/2 object-contain object-right"
                />
                <div className="relative z-10 flex w-[76%] items-center gap-3 sm:w-[68%] sm:gap-4">
                  <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-4 ring-white/70 sm:h-[72px] sm:w-[72px] ${s.icon}`}>
                    <img src={goal.icon} alt="" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
                  </span>
                  <div className="max-w-[110px] md:max-w-[130px] xl:max-w-[230px]">
                    <h3 className="text-lg font-medium leading-tight text-[#10243e] sm:text-xl">{goal.title}</h3>
                    <p className="mt-2 text-xs font-normal leading-5 text-slate-700 sm:text-sm sm:leading-6">{goal.copy}</p>
                  </div>
                </div>
                <span className={`absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-1 sm:bottom-5 sm:right-5 sm:h-12 sm:w-12 ${s.arrow}`}>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------- How It Works ------------------------------ */

const steps = [
  {
    icon: User,
    title: "Tell Us About You",
    copy: "Age, height, weight, activity level and food preference.",
    accent: "text-sky-600 bg-sky-400/10",
  },
  {
    icon: Target,
    title: "Choose Your Goal",
    copy: "Weight loss or weight gain.",
    accent: "text-orange-600 bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "Get AI Plan",
    copy: "Personalized Indian diet and workout plan.",
    accent: "text-emerald-400 bg-emerald-400/10",
  },
  {
    icon: BarChart3,
    title: "Follow & Track",
    copy: "Track your meals, workouts and see real progress.",
    accent: "text-violet-400 bg-violet-400/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Get Your Personalized Plan in{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
        </div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-9 hidden h-px bg-gradient-to-r from-sky-400/40 via-orange-500/40 to-violet-400/40 lg:block" />
          {steps.map((step, index) => (
            <div key={step.title} data-aos="fade-up" data-aos-delay={index * 100} className="relative text-center">
              <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white ${step.accent.split(" ")[1]}`}>
                  <step.icon className={`h-7 w-7 ${step.accent.split(" ")[0]}`} />
                </span>
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-[11px] font-extrabold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[230px] text-sm leading-6 text-slate-600">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------- Meal Plans ------------------------------- */

const mealsLoss = [
  { name: "Breakfast", items: "Oats + Banana + Nuts", kcal: "~ 350 kcal", image: mealBreakfast },
  { name: "Lunch", items: "Roti + Dal + Paneer + Salad", kcal: "~ 450 kcal", image: mealLunch },
  { name: "Snacks", items: "Sprouts Chaat + Green Tea", kcal: "~ 200 kcal", image: mealSnacks },
  { name: "Dinner", items: "Rice + Chicken Curry + Vegetables", kcal: "~ 500 kcal", image: mealDinner },
];

const mealsGain = [
  { name: "Breakfast", items: "Paneer Bhurji + 2 Toast + Milk", kcal: "~ 550 kcal", image: mealBreakfast },
  { name: "Lunch", items: "Rice + Chicken + Dal + Curd", kcal: "~ 700 kcal", image: mealLunch },
  { name: "Snacks", items: "Sprouts + Peanut Butter Shake", kcal: "~ 400 kcal", image: mealSnacks },
  { name: "Dinner", items: "Roti + Paneer Curry + Vegetables", kcal: "~ 600 kcal", image: mealDinner },
];

const varietyItems = [
  { icon: Salad, label: "Veg", color: "text-emerald-400 bg-emerald-400/10" },
  { icon: Drumstick, label: "Non-Veg", color: "text-orange-600 bg-orange-500/10" },
  { icon: Egg, label: "Eggetarian", color: "text-amber-300 bg-amber-400/10" },
];

const varietyPoints = [
  "Uses real Indian foods",
  "Balanced nutrition",
  "Budget friendly options",
  "Easy to follow recipes",
];

const MealPlanSection = () => {
  const [plan, setPlan] = useState<"loss" | "gain">("loss");
  const meals = plan === "loss" ? mealsLoss : mealsGain;

  return (
    <section id="meal-plans" className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          data-aos="fade-up"
        >
          <div>
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Personalized <span className="text-orange-500">Indian Meal Plans</span>
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Nutritious, tasty and easy to follow. Based on your goal, preferences and budget.
            </p>
          </div>
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5">
            {(
              [
                { id: "loss", label: "Weight Loss Plan" },
                { id: "gain", label: "Weight Gain Plan" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPlan(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  plan === tab.id
                    ? "bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-[0_8px_24px_rgba(56,189,248,0.35)]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.1fr)]">
          {meals.map((meal, index) => (
            <div
              key={meal.name}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-orange-500/40"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.items}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur">
                  {meal.kcal}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900">{meal.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{meal.items}</p>
              </div>
            </div>
          ))}

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:col-span-2 xl:col-span-1"
          >
            <h3 className="text-lg font-bold text-slate-900">Indian Food Variety</h3>
            <div className="mt-5 flex gap-4">
              {varietyItems.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 ${item.color.split(" ")[1]}`}>
                    <item.icon className={`h-6 w-6 ${item.color.split(" ")[0]}`} />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-3">
              {varietyPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------- Workouts -------------------------------- */

const workoutOptions = [
  {
    title: "Home Workout",
    icon: Home,
    image: workoutHome,
    accent: "sky" as const,
    points: ["No or minimal equipment", "Beginner to advanced plans", "Full body routines", "Easy to follow video guide"],
  },
  {
    title: "Gym Workout",
    icon: Dumbbell,
    image: workoutGym,
    accent: "orange" as const,
    points: ["Gym-based structured plans", "Muscle gain or fat loss focus", "Exercise library with videos", "Progressive training plans"],
  },
];

const WorkoutSection = () => {
  return (
    <section id="workouts" className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Workout Plans for Your <span className="text-orange-500">Lifestyle</span>
          </h2>
          <p className="mt-3 text-slate-600">
            Get effective workout routines based on your equipment and experience level.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {workoutOptions.map((option) => {
            const isSky = option.accent === "sky";
            return (
              <div
                key={option.title}
                data-aos="fade-up"
                className={`group relative overflow-hidden rounded-3xl border bg-white ${
                  isSky ? "border-sky-400/25 hover:border-sky-400/50" : "border-orange-500/25 hover:border-orange-500/50"
                } transition`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220] via-[#0a1220]/30 to-transparent" />
                </div>
                <div className="relative -mt-10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                          isSky ? "bg-sky-400/15 text-sky-700" : "bg-orange-500/15 text-orange-700"
                        }`}
                      >
                        <option.icon className="h-3.5 w-3.5" />
                        {option.title}
                      </span>
                      <ul className="mt-4 space-y-2.5">
                        {option.points.map((point) => (
                          <li key={point} className="flex items-center gap-2.5 text-sm text-slate-700">
                            <Check className={`h-4 w-4 shrink-0 ${isSky ? "text-sky-600" : "text-orange-600"}`} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      to="/auth"
                      aria-label={option.title}
                      className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition hover:brightness-110 ${
                        isSky ? "bg-sky-400 text-slate-950" : "bg-orange-500 text-white"
                      }`}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------ Calorie Tracker ----------------------------- */

const macros = [
  { label: "Protein", value: "120g / 150g", percent: 80, color: "#34d399" },
  { label: "Carbs", value: "180g / 251g", percent: 72, color: "#fb923c" },
  { label: "Fats", value: "60g / 70g", percent: 86, color: "#38bdf8" },
];

const todayMeals = [
  { name: "Breakfast", items: "Oats + Banana", kcal: "350 kcal", image: mealBreakfast },
  { name: "Lunch", items: "Roti, Dal, Paneer", kcal: "450 kcal", image: mealLunch },
  { name: "Snack", items: "Sprouts Chaat", kcal: "200 kcal", image: mealSnacks },
  { name: "Dinner", items: "Rice, Chicken Curry", kcal: "500 kcal", image: mealDinner },
];

const CalorieDonut = () => {
  const C = 2 * Math.PI * 80;
  const segments = [
    { color: "#34d399", start: 0, len: 0.308 },
    { color: "#fb923c", start: 0.32, len: 0.368 },
    { color: "#38bdf8", start: 0.7, len: 0.208 },
    { color: "#a78bfa", start: 0.92, len: 0.068 },
  ];

  return (
    <div className="relative mx-auto h-[220px] w-[220px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="18" />
        {segments.map((seg) => (
          <circle
            key={seg.color}
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${C * seg.len} ${C * (1 - seg.len)}`}
            strokeDashoffset={-C * seg.start}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-extrabold tracking-tight text-slate-900">1,850</p>
        <p className="mt-1 text-xs font-medium text-slate-600">/ 2,200 kcal</p>
      </div>
    </div>
  );
};

const TrackerSection = () => {
  return (
    <section className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Track Your <span className="text-orange-500">Nutrition</span> Easily
          </h2>
          <p className="mt-3 text-slate-600">Log your meals and keep track of calories and macros in real-time.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div
            data-aos="fade-up"
            className="rounded-3xl border border-slate-200 bg-white p-8"
          >
            <CalorieDonut />
            <div className="mt-8 space-y-5">
              {macros.map((macro) => (
                <div key={macro.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: macro.color }} />
                      {macro.label}
                    </span>
                    <span className="font-medium text-slate-600">{macro.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${macro.percent}%`, backgroundColor: macro.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Today's Meals</h3>
              <button type="button" className="text-xs font-bold uppercase tracking-wider text-orange-700 hover:text-orange-800">
                View All
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {todayMeals.map((meal) => (
                <div
                  key={meal.name}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
                >
                  <img
                    src={meal.image}
                    alt={meal.items}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{meal.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-600">{meal.items}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{meal.kcal}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------- Progress -------------------------------- */

const weightData = [
  { month: "Jan", weight: 73.7 },
  { month: "Feb", weight: 72.8 },
  { month: "Mar", weight: 71.6 },
  { month: "Apr", weight: 70.4 },
  { month: "May", weight: 69.3 },
  { month: "Jun", weight: 68.5 },
];

const progressStats = [
  { icon: TrendingDown, value: "-5.2 kg", label: "Weight Change", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { icon: Dumbbell, value: "28", label: "Workouts Completed", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { icon: Target, value: "85%", label: "Plan Adherence", color: "text-orange-600 bg-orange-500/10 border-orange-500/20" },
];

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-2xl">
      <span className="font-bold text-slate-900">{payload[0].value} kg</span>
      <span className="ml-2 text-slate-600">{payload[0].payload.month}</span>
    </div>
  );
};

const ProgressSection = () => {
  return (
    <section className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            See Your <span className="text-orange-500">Progress</span>
          </h2>
          <p className="mt-3 text-slate-600">Track your weight, calories, and consistency over time.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div data-aos="fade-up" className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">Weight Progress</h3>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Last 6 Months
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 10, right: 30, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="weightStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(148,163,184,0.4)"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[65, 78]}
                    stroke="rgba(148,163,184,0.4)"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(249,115,22,0.3)" }} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="url(#weightStroke)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ffffff", stroke: "#f97316", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {progressStats.map((stat, index) => (
              <div
                key={stat.label}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`flex items-center gap-5 rounded-3xl border bg-white p-6 ${stat.color.split(" ")[2]}`}
              >
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.color.split(" ")[1]}`}>
                  <stat.icon className={`h-7 w-7 ${stat.color.split(" ")[0]}`} />
                </span>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------- Features -------------------------------- */

const features = [
  {
    icon: UtensilsCrossed,
    title: "Food Preferences",
    copy: "Veg, Non-Veg, Eggetarian and all Indian foods.",
    accent: "text-sky-600 bg-sky-400/10",
  },
  {
    icon: Wallet,
    title: "Budget Friendly",
    copy: "Get plans that fit your budget with everyday foods.",
    accent: "text-orange-600 bg-orange-500/10",
  },
  {
    icon: Droplets,
    title: "Water Tracking",
    copy: "Track your daily water intake and stay hydrated.",
    accent: "text-cyan-300 bg-cyan-400/10",
  },
  {
    icon: SlidersHorizontal,
    title: "Plan Adjustments",
    copy: "Adjust plans based on your progress and feedback.",
    accent: "text-violet-400 bg-violet-400/10",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Everything You Need in <span className="text-orange-500">One Place</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-300"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.accent.split(" ")[1]}`}>
                <feature.icon className={`h-6 w-6 ${feature.accent.split(" ")[0]}`} />
              </span>
              <h3 className="mt-5 text-base font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------- Safety --------------------------------- */

const safetyItems = [
  {
    icon: ShieldCheck,
    title: "General Wellness Guidance",
    copy: "Provides AI-generated diet and workout plans for general fitness.",
    accent: "text-emerald-400 bg-emerald-400/10",
  },
  {
    icon: FileText,
    title: "Not Medical Advice",
    copy: "AI plans are estimates and not a substitute for professional medical advice.",
    accent: "text-orange-600 bg-orange-500/10",
  },
  {
    icon: Lock,
    title: "Your Data is Safe",
    copy: "Your personal data is encrypted and secure. We never sell your information.",
    accent: "text-sky-600 bg-sky-400/10",
  },
  {
    icon: HeartPulse,
    title: "Consult a Professional",
    copy: "If you have any medical conditions, injuries or special dietary needs, please consult a qualified healthcare professional.",
    accent: "text-violet-400 bg-violet-400/10",
  },
];

const SafetySection = () => {
  return (
    <section className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Your <span className="text-orange-500">Safety</span> Matters
          </h2>
          <p className="mt-3 text-slate-600">
            We're committed to providing a safe, transparent and responsible experience.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {safetyItems.map((item, index) => (
            <div
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-300"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent.split(" ")[1]}`}>
                <item.icon className={`h-6 w-6 ${item.accent.split(" ")[0]}`} />
              </span>
              <h3 className="mt-5 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------- Pricing --------------------------------- */

const PricingSection = () => {
  const cfg = useAppConfig();
  const monthlyPrice = Number(cfg.priceMonthly) || 1999;

  return (
    <section id="pricing" className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Simple & <span className="text-orange-500">Affordable</span> Pricing
          </h2>
          <p className="mt-3 text-slate-600">Start free and upgrade anytime.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div
            data-aos="fade-up"
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8"
          >
            <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
            <p className="mt-1 text-sm text-slate-600">Perfect to get started</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">₹0</span>
              <span className="pb-1.5 text-sm text-slate-600">/ month</span>
            </div>
            <ul className="mt-7 flex-1 space-y-3.5">
              {["Basic diet plan", "Limited meal suggestions", "Basic workout plans", "Track calories (limited)"].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 inline-flex h-13 items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-950 transition hover:bg-slate-200"
            >
              Get Started Free
            </Link>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="relative flex flex-col overflow-hidden rounded-3xl border border-orange-500/50 bg-gradient-to-b from-orange-500/15 to-white p-8 shadow-[0_24px_80px_rgba(249,115,22,0.15)]"
          >
            <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white">
              Most Popular
            </span>
            <h3 className="text-xl font-bold text-slate-900">Premium Plan</h3>
            <p className="mt-1 text-sm text-slate-600">Unlock full potential</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">₹{monthlyPrice}</span>
              <span className="pb-1.5 text-sm text-slate-600">/ month</span>
            </div>
            <ul className="mt-7 flex-1 space-y-3.5">
              {[
                "Personalized diet plans",
                "Unlimited meal suggestions",
                "Home & gym workout plans",
                "Advanced tracking & insights",
                "Plan adjustments",
                "Ad-free experience",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/auth?plan=monthly"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_16px_40px_rgba(249,115,22,0.4)] transition hover:brightness-110"
            >
              Start Premium
            </Link>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="relative overflow-hidden rounded-3xl border border-slate-200"
          >
            <img
              src={pricingAthletes}
              alt="Athletes"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070f] via-[#04070f]/40 to-transparent" />
            <div className="relative flex h-full min-h-[420px] flex-col justify-end p-8">
              <p className="text-2xl font-extrabold leading-snug text-white">
                Eat Better.
                <br />
                Train Smarter.
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Be a Healthier You.
                </span>
              </p>
              <Link
                to="/auth"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_16px_40px_rgba(249,115,22,0.4)] transition hover:brightness-110"
              >
                Build My Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------- Page ----------------------------------- */

const Index = () => {
  return (
    <div className="landing-display min-h-screen bg-slate-50 font-poppins text-slate-900 antialiased">
      <main>
        <HeroSection />
        <GoalSection />
        <HowItWorksSection />
        <MealPlanSection />
        <WorkoutSection />
        <TrackerSection />
        <ProgressSection />
        <FeaturesSection />
        <SafetySection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
