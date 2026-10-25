import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import authShowcaseImage from "@/assets/landing/auth-showcase.png";

const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M23.49 12.27c0-.78-.07-1.53-.2-2.25H12v4.26h6.47c-.28 1.51-1.12 2.79-2.39 3.64v3h3.87c2.26-2.08 3.54-5.15 3.54-8.65Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.72-4.95h-4v3.09A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.28 14.3A7.22 7.22 0 0 1 4.9 12c0-.8.14-1.58.38-2.3V6.61h-4A12 12 0 0 0 0 12c0 1.94.46 3.78 1.28 5.39l4-3.09Z" />
    <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.96 1.17 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoResponse.json();
        const data = await api.auth.googleLoginManual({
          email: userInfo.email,
          name: userInfo.name,
          google_id: userInfo.sub,
          picture: userInfo.picture,
        });

        if (data.user) {
          localStorage.setItem("zuno_auth_user", JSON.stringify(data.user));
          toast.success("Successfully logged in with Google!");
          navigate(from, { replace: true });
        }
      } catch (error: unknown) {
        console.error("Google Login Error:", error);
        toast.error("Google login failed. Please try again.");
      }
    },
    onError: () => toast.error("Google Login Failed to Initialize"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data;
      if (authMode === "signup") {
        if (!name) {
          toast.error("Name is required");
          setIsLoading(false);
          return;
        }
        data = await api.auth.signup(email, password, name);
        toast.success("Account created successfully!");
      } else {
        data = await api.auth.login(email, password);
        toast.success("Logged in successfully!");
      }

      if (data.user) {
        localStorage.setItem("zuno_auth_user", JSON.stringify(data.user));
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      toast.error((error as Error)?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:fixed lg:inset-0 lg:h-dvh w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-start lg:justify-center items-center pt-[82px] pb-8 lg:pt-[72px] lg:pb-[14px] px-3 sm:px-4 bg-[#fafcff] text-slate-900 landing-display">
      {/* Background radial atmosphere matching Hero Section */}
      <div className="pointer-events-none absolute -left-[20%] -top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-blue-400/10 via-sky-300/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-[15%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-orange-400/10 via-amber-300/5 to-transparent blur-3xl" />

      {/* Subtle tech dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#2563eb 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl my-auto p-0">
        {/* Main Card with Glassmorphic Border */}
        <div className="grid overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_16px_40px_rgba(16,36,62,0.06)] lg:grid-cols-12">

          {/* ════════════ SHOWCASE PANEL (Desktop: Left / Mobile: Bottom) ════════════ */}
          <div className="order-2 lg:order-1 relative overflow-hidden bg-gradient-to-b from-[#f0f6ff] via-[#f7faff] to-[#fff7ed] p-5 lg:p-6 lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-slate-200/80">
            {/* Top Badge */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-900 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                AI-Powered Nutrition Coach
              </div>

              <h2 className="mt-3.5 text-2xl sm:text-3xl font-medium tracking-tight text-[#10243e] leading-tight">
                Your Goals.{" "}
                <br />
                <span className="text-orange-500 font-semibold">Your Food.</span>{" "}
                <br />
                <span className="text-blue-600 font-semibold">Your Plan.</span>
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Personalized Indian diet & workout plans designed for your real lifestyle.
              </p>
            </div>

            {/* Central Hero Graphic & Floating Feature Badges */}
            <div className="relative mx-auto my-4 w-full max-w-[370px] px-1 pb-3 pt-3">
              <div className="relative mx-auto max-w-[340px] overflow-hidden rounded-2xl border border-blue-100 bg-white/80 p-2 shadow-[0_12px_28px_rgba(37,99,235,0.10)]">
                <img
                  src={authShowcaseImage}
                  alt="Two athletes sharing a balanced meal after a workout"
                  className="h-44 w-full rounded-xl object-cover object-center"
                />
              </div>

              {/* Floating Pill: Weight Loss & Gains */}
              <div className="absolute left-[15px] top-0 z-20 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 shadow-[0_4px_12px_rgba(16,36,62,0.10)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <TrendingDown className="h-2.5 w-2.5" />
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium text-[#10243e]">Weight Loss & Gain</span>
              </div>

              {/* Floating Pill: 100% Indian Meals */}
              <div className="absolute bottom-0 right-[15px] z-20 inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-2.5 py-1 shadow-[0_4px_12px_rgba(16,36,62,0.10)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <UtensilsCrossed className="h-2.5 w-2.5" />
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium text-[#10243e]">Authentic Indian Meals</span>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-3 text-center">
              <div>
                <p className="text-sm font-bold text-[#10243e]">10,000+</p>
                <p className="text-[10px] font-medium text-slate-500">Diet Plans</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-sm font-bold text-blue-600">AI-Guided</p>
                <p className="text-[10px] font-medium text-slate-500">Real Time</p>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-500">Free</p>
                <p className="text-[10px] font-medium text-slate-500">Full Access</p>
              </div>
            </div>
          </div>

          {/* ════════════ FORM PANEL (Desktop: Right / Mobile: Top) ════════════ */}
          <div className="order-1 lg:order-2 p-6 sm:p-7 lg:p-8 lg:col-span-7 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
                    {authMode === "login" ? "Welcome back" : "Get Started Free"}
                  </span>
                  <Link to="/" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition">
                    ← Back to Home
                  </Link>
                </div>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#10243e]">
                  {authMode === "login" ? "Sign in to Zuno" : "Create your account"}
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  {authMode === "login"
                    ? "Access your saved Indian diet plans and workout routines."
                    : "Join thousands achieving their health goals with smart nutrition."}
                </p>
              </div>

              {/* Mode Toggle Switcher */}
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                    authMode === "login"
                      ? "bg-white text-[#10243e] shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                    authMode === "signup"
                      ? "bg-white text-[#10243e] shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-10 pl-10 rounded-xl border-slate-200 bg-white text-[#10243e] placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 pl-10 rounded-xl border-slate-200 bg-white text-[#10243e] placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                      Password
                    </Label>
                    {authMode === "login" && (
                      <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-10 pl-10 pr-10 rounded-xl border-slate-200 bg-white text-[#10243e] placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button (Hero Signature Orange) */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl bg-orange-500 font-medium text-white shadow-[0_6px_18px_rgba(249,115,22,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_10px_22px_rgba(249,115,22,0.30)] active:translate-y-0 mt-1"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : authMode === "login" ? (
                    <span className="inline-flex items-center gap-2">
                      Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Separator */}
              <div className="relative my-3.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-2.5 font-semibold text-slate-400">Or continue with</span>
                </div>
              </div>

              {/* Google SSO Button */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs sm:text-sm font-semibold text-blue-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:border-blue-400 hover:shadow-[0_6px_16px_rgba(37,99,235,0.10)] active:translate-y-0"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Continue with Google</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>256-bit encryption • Your data is 100% private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
