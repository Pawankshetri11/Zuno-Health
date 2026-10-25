import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  Terminal,
  ArrowRight,
  Sparkles,
  KeyRound,
} from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.auth.login(email, password);

      if (data.user) {
        if (data.user.is_admin === 1 || data.user.is_admin === "1" || data.user.is_admin === true) {
          localStorage.setItem("zuno_auth_user", JSON.stringify(data.user));
          toast.success("Admin Access Granted", { description: "Welcome to Zuno Command Center." });
          navigate("/admin", { replace: true });
        } else {
          toast.error("Access Denied", { description: "You do not have administrative privileges." });
        }
      }
    } catch (error: any) {
      toast.error("Auth Error", { description: error.message || "Invalid credentials" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090f1d] text-slate-100 relative overflow-hidden px-4 py-12 landing-display">
      {/* Background Cyber Glow Gradients */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[550px] w-[550px] rounded-full bg-orange-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[140px]" />

      {/* Cyber Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Command Center Card */}
        <div className="rounded-3xl border border-blue-500/20 bg-[#0e172a]/85 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
          {/* Subtle Top Glow Line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-orange-500" />

          {/* Icon & Title */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-sky-500/10 shadow-[0_0_25px_rgba(37,99,235,0.25)]">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                <KeyRound className="h-3.5 w-3.5" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              Admin Portal
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 font-medium">
              Authorized personnel only. Credentials are authenticated in real-time.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Admin Identifier / Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@zuno.com"
                  className="h-12 pl-10 rounded-xl border-slate-700/80 bg-[#142036]/70 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" title="Enter your secure password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Security Key / Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="h-12 pl-10 pr-10 rounded-xl border-slate-700/80 bg-[#142036]/70 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(37,99,235,0.35)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Initiate Admin Access <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-400" /> v2.4 Kernel
              </span>
              <Link to="/" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
                Return to Site →
              </Link>
            </div>
            <p className="mt-3 text-[10px] text-slate-500">
              All access requests are audited & encrypted via Zuno Guard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
