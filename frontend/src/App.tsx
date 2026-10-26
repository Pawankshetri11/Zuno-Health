import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./lib/api";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import UniversalHeader from "@/components/UniversalHeader";
import ProtectedAdminRoute from "./modules/admin/components/ProtectedAdminRoute";
import { api, syncConfig, API_BASE_URL } from "./lib/api";

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Each page is split into its own JS chunk — the browser downloads only the
// chunk it actually needs, instead of the entire bundle upfront.
const Index           = lazy(() => import("./pages/Index"));
const AuthPage        = lazy(() => import("./pages/Auth"));
const About           = lazy(() => import("./pages/About"));
const Contact         = lazy(() => import("./pages/Contact"));
const PrivacyPolicy   = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService  = lazy(() => import("./pages/TermsOfService"));
const Pricing         = lazy(() => import("./pages/Pricing"));
const ComingSoon      = lazy(() => import("./pages/ComingSoon"));
const NotFound        = lazy(() => import("./pages/NotFound"));

// User pages
const Dashboard       = lazy(() => import("./modules/user/pages/Dashboard"));
const HealthMetrics   = lazy(() => import("./modules/user/pages/HealthMetrics"));
const Profile         = lazy(() => import("./modules/user/pages/Profile"));
const PaymentHistory  = lazy(() => import("./modules/user/pages/PaymentHistory"));
const Checkout        = lazy(() => import("./modules/user/pages/Checkout"));

// Admin pages
const AdminAuth         = lazy(() => import("./modules/admin/pages/AdminAuth"));
const AdminDashboard    = lazy(() => import("./modules/admin/pages/AdminDashboard"));
const AdminUsers        = lazy(() => import("./modules/admin/pages/AdminUsers"));
const AdminUserProfiles = lazy(() => import("./modules/admin/pages/AdminUserProfiles"));
const AdminSettings     = lazy(() => import("./modules/admin/pages/AdminSettings"));
const AdminCoupons      = lazy(() => import("./modules/admin/pages/AdminCoupons"));
const AdminTransactions = lazy(() => import("./modules/admin/pages/AdminTransactions"));
const AdminProfileEdit  = lazy(() => import("./modules/admin/pages/AdminProfileEdit"));

const queryClient = new QueryClient();

// Minimal full-screen spinner shown while a lazy chunk is loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Old /get-started links → redirect to /auth (logged-out) or /health-metrics (logged-in),
// preserving the ?plan= query param.
const GetStartedRedirect = () => {
  const isLoggedIn = !!localStorage.getItem("zuno_auth_user");
  const search = window.location.search || "";
  return <Navigate to={`${isLoggedIn ? "/health-metrics" : "/auth"}${search}`} replace />;
};

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname, search, hash]);

  return null;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const storedUser = localStorage.getItem("zuno_auth_user");

  if (!storedUser) {
    return <Navigate to="/auth" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user?.id) {
      localStorage.removeItem("zuno_auth_user");
      return <Navigate to="/auth" replace state={{ from: `${location.pathname}${location.search}` }} />;
    }
  } catch {
    localStorage.removeItem("zuno_auth_user");
    return <Navigate to="/auth" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
    });

    // Fetch initial config
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings_public.php?_t=${Date.now()}`);
        if (!response.ok) {
          console.warn("[Zuno] Config endpoint returned non-OK status:", response.status, "- using defaults");
          return;
        }
        const text = await response.text();
        if (!text || text.trim().startsWith("<")) {
          console.warn("[Zuno] Config endpoint returned HTML instead of JSON - using defaults");
          return;
        }
        const config = JSON.parse(text);
        syncConfig(config);
      } catch (e) {
        console.warn("Failed to load global config (non-fatal):", e);
      }
    };
    loadConfig();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <WhatsAppButton />
            <UniversalHeader />
            {/* Suspense wraps all lazy routes — shows PageLoader while chunk downloads */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/get-started" element={<GetStartedRedirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health-metrics" element={<HealthMetrics />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payments" element={<PaymentHistory />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/coming-soon" element={<ComingSoon />} />

                {/* Admin Routes */}
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
                <Route path="/admin/user-profiles" element={<ProtectedAdminRoute><AdminUserProfiles /></ProtectedAdminRoute>} />
                <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
                <Route path="/admin/coupons" element={<ProtectedAdminRoute><AdminCoupons /></ProtectedAdminRoute>} />
                <Route path="/admin/transactions" element={<ProtectedAdminRoute><AdminTransactions /></ProtectedAdminRoute>} />
                <Route path="/admin/profile-edit/:id" element={<ProtectedAdminRoute><AdminProfileEdit /></ProtectedAdminRoute>} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
