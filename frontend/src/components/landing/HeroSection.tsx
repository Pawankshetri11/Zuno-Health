import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  HeartPulse,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useAppConfig } from "@/hooks/useAppConfig";
import featureLoss from "@/assets/feature-loss.webp";

const goals = [
  { icon: Scale, label: "Weight Loss" },
  { icon: Dumbbell, label: "Weight Gain" },
  { icon: CalendarDays, label: "Period Tracker" },
  { icon: HeartPulse, label: "PCOS / Diabetes" },
];

const stats = [
  { icon: Utensils, value: "1500+", label: "clients guided" },
  { icon: Activity, value: "30 days", label: "plan depth" },
  { icon: ShieldCheck, value: "24/7", label: "AI planning" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(135deg,hsl(34_44%_98%),hsl(356_42%_96%))] pt-28 pb-12 md:pt-32 md:pb-18">
      <div className="absolute right-[-12rem] top-16 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute left-[-10rem] bottom-0 h-[24rem] w-[24rem] rounded-full bg-rose-200/25 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid min-h-[calc(90vh-9rem)] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-3xl space-y-7">
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-card/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-gold shadow-sm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Luxury AI Nutrition Studio
            </div>

            <div className="space-y-5">
              <h1
                data-aos="fade-up"
                className="max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Diet plans for your body goal, cycle, and lifestyle.
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="max-w-2xl text-sm font-semibold leading-7 text-slate-700 sm:text-base md:text-lg"
              >
                Practical Indian meal plans for fat loss, healthy weight gain, PCOS,
                thyroid, diabetes, muscle nutrition, and women's cycle-aware wellness.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="180" className="flex flex-wrap gap-2.5">
              {goals.map((goal) => (
                <div
                  key={goal.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/85 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur"
                >
                  <goal.icon className="h-4 w-4 text-gold" />
                  {goal.label}
                </div>
              ))}
            </div>

            <div data-aos="fade-up" data-aos-delay="260" className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="luxury" className="h-14 w-full rounded-lg px-7 text-xs font-black uppercase tracking-[0.2em] sm:w-auto">
                  Get Free Day 1 Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-14 items-center justify-center rounded-lg border border-border/80 bg-card/85 px-7 text-xs font-black uppercase tracking-[0.2em] text-foreground transition-colors hover:border-gold/40 hover:text-gold"
              >
                See Pricing
              </a>
            </div>

            <div data-aos="fade-up" data-aos-delay="320" className="grid gap-2 pt-2 sm:grid-cols-3">
              {["AI meal plan in minutes", "Indian food preferences", "Check-ins and PDF plans"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Check className="h-4 w-4 text-gold" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="220" className="relative mx-auto w-full max-w-[440px] lg:ml-auto">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
            <PlanCarousel />
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="420"
          className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70 shadow-[0_18px_55px_hsl(232_22%_13%_/_0.08)] sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card/88 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xl font-black leading-none text-foreground">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlanCarousel = () => {
  const cfg = useAppConfig();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 45 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const offerEnabled = cfg.offerEnabled === "1";
  const offerStartDate = cfg.offerStartDate;
  const offerDurationDays = Number(cfg.offerDurationDays) || 90;

  const getEndDate = () => {
    if (!offerStartDate) return 0;
    return new Date(offerStartDate).getTime() + offerDurationDays * 24 * 60 * 60 * 1000;
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const endDate = getEndDate();
    return endDate > 0 ? Math.max(0, endDate - Date.now()) : 0;
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!offerEnabled || !offerStartDate) {
      setTimeLeft(0);
      return;
    }
    const endDate = getEndDate();
    const remaining = endDate - Date.now();
    if (remaining <= 0) {
      setTimeLeft(0);
      return;
    }
    setTimeLeft(remaining);
    intervalRef.current = setInterval(() => {
      const left = endDate - Date.now();
      if (left <= 0) {
        setTimeLeft(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setTimeLeft(left);
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [offerEnabled, offerStartDate, offerDurationDays]);

  const timer = timeLeft > 0 ? (() => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  })() : null;

  const plans = [
    {
      id: "daily",
      name: "Daily Plan",
      price: Number(cfg.priceDaily) || 99,
      originalPrice: Number(cfg.originalPriceDaily) || 199,
      tag: "Best Entry Point",
      features: ["1-Day Custom Ledger", "Immediate Access", "Macro Mapping", "PDF Download"],
    },
    {
      id: "weekly",
      name: "Weekly Plan",
      price: Number(cfg.priceWeekly) || 599,
      originalPrice: Number(cfg.originalPriceWeekly) || 1399,
      tag: "Most Popular",
      features: ["7-Day Strategy", "Daily Check-ins", "Meal Substitutions", "Full Support"],
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      price: Number(cfg.priceMonthly) || 1999,
      originalPrice: Number(cfg.originalPriceMonthly) || 5999,
      tag: "Elite Results",
      features: ["30-Day Roadmap", "Weekly AI Updates", "Priority Support", "Doc Supervision"],
    },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="hidden md:block absolute top-3 -right-4 h-[94%] w-full rounded-2xl border border-border/60 bg-card/45 -z-20" />
      <div className="hidden md:block absolute top-1.5 -right-2 h-[98%] w-full rounded-2xl border border-border/60 bg-card/70 -z-10" />

      <div className="rounded-2xl bg-gradient-to-b from-gold/35 via-card to-card p-0.5 shadow-[0_28px_80px_hsl(232_22%_13%_/_0.16)]">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {plans.map((plan) => (
              <div key={plan.id} className="min-w-0 flex-[0_0_100%] bg-card p-5 sm:p-6">
                <div className="space-y-1">
                  <div className="inline-flex rounded-full bg-gold/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-gold">
                    {plan.tag}
                  </div>
                  <h3 className="text-2xl font-black leading-none text-foreground">{plan.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">AI custom nutrition</p>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground line-through">Rs. {plan.originalPrice}</p>
                    <p className="text-5xl font-black leading-none tracking-tight text-foreground">Rs. {plan.price}</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gold">Limited Time</p>
                    <p className="text-xl font-black text-rose-500">
                      {Math.round((1 - plan.price / plan.originalPrice) * 100)}% Off
                    </p>
                  </div>
                </div>

                {timer && (
                  <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                    <div className="flex items-center justify-center gap-2 font-mono text-sm font-black text-rose-600">
                      <Clock className="h-4 w-4" />
                      {String(timer.days).padStart(2, "0")}d : {String(timer.hours).padStart(2, "0")}h :{" "}
                      {String(timer.minutes).padStart(2, "0")}m : {String(timer.seconds).padStart(2, "0")}s
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10">
                        <Check className="h-3 w-3 text-gold" />
                      </span>
                      <span className="text-xs font-semibold text-foreground/75">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/auth?plan=${plan.id}`} className="mt-6 block">
                  <Button variant="luxury" className="h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                    Claim Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">340+ joined</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-gold"
                  >
                    Next
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {plans.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all ${selectedIndex === index ? "w-10 bg-gold" : "w-2 bg-secondary"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
