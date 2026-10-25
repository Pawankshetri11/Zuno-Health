import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  HeartPulse,
  Scale,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import featureLoss from "@/assets/feature-loss.webp";
import featureGain from "@/assets/feature-gain.webp";
import featurePeriod from "@/assets/feature-period.webp";
import heroFood from "@/assets/hero-food.jpg";
import appMockup from "@/assets/zuno_app_mockup.png";

const featureBanners = [
  {
    icon: Scale,
    eyebrow: "Fat Loss",
    title: "Weight loss without boring crash diets",
    description: "Calorie control, Indian meals, cravings support, and daily structure built around your current body data.",
    image: featureLoss,
  },
  {
    icon: Dumbbell,
    eyebrow: "Lean Gain",
    title: "Healthy weight gain and muscle nutrition",
    description: "Protein-rich meals, higher calorie plans, digestion-friendly timing, and foods that are realistic to eat daily.",
    image: featureGain,
  },
  {
    icon: CalendarDays,
    eyebrow: "Cycle Care",
    title: "Period tracker with nutrition context",
    description: "Track cycle patterns and build calmer routines around cravings, hydration, symptoms, and energy shifts.",
    image: featurePeriod,
  },
  {
    icon: HeartPulse,
    eyebrow: "Condition-Aware",
    title: "PCOS, thyroid, diabetes and lifestyle issues",
    description: "Plans adapt to metabolic needs, food restrictions, meal timing, local ingredients, and health goals.",
    image: heroFood,
  },
];

const appFeatures = [
  { icon: Utensils, label: "Daily meal timeline" },
  { icon: Activity, label: "Check-ins and progress" },
  { icon: ShieldCheck, label: "Plan unlock system" },
  { icon: Sparkles, label: "AI substitutions" },
];

const FeaturesSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div
            data-aos="fade-up"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-card px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-gold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Built Around Real Goals
          </div>
          <h2 data-aos="fade-up" data-aos-delay="80" className="text-2xl font-black tracking-normal text-foreground sm:text-3xl md:text-5xl">
            Plans for weight loss, weight gain, periods and health conditions.
          </h2>
          <p data-aos="fade-up" data-aos-delay="140" className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            No repeated collage. Each journey gets its own visual language and enough breathing room.
          </p>
        </div>

        <div className="space-y-12 md:space-y-20">
          {featureBanners.map((item, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={item.title}
                data-aos="fade-up"
                className="grid items-center gap-6 rounded-xl border border-border/70 bg-card p-3 shadow-[0_18px_55px_hsl(232_22%_13%_/_0.08)] md:p-5 lg:grid-cols-2"
              >
                <div className={`overflow-hidden rounded-lg ${reverse ? "lg:order-2" : ""}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[260px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[340px] lg:h-[420px]"
                  />
                </div>
                <div className="p-3 md:p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.eyebrow}
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-foreground md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-20 grid items-center gap-8 rounded-xl border border-border/70 bg-card p-5 shadow-[0_18px_55px_hsl(232_22%_13%_/_0.08)] lg:grid-cols-[0.75fr_1.25fr] md:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
              <Activity className="h-3.5 w-3.5" />
              Premium App Experience
            </div>
            <h3 className="text-2xl font-black leading-tight text-foreground md:text-4xl">
              A dashboard that feels built for daily use.
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Clean meal cards, progress check-ins, hydration prompts, substitutions, plan downloads, and the sidebar navigation your customers expect.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {appFeatures.map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
                  <item.icon className="h-4 w-4 text-gold" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/auth"
              className="mt-6 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-gold px-5 text-[11px] font-black uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Start Your Plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/70 bg-secondary/30">
            <img
              src={appMockup}
              alt="Zuno app dashboard mockup"
              className="h-full max-h-[420px] w-full object-contain p-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
