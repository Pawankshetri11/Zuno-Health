import { Toaster } from "@/components/ui/toaster";
// Trigger HMR update
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Index from "./pages/Index";
import Dashboard from "./modules/user/pages/Dashboard";

import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./lib/api";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import UniversalHeader from "@/components/UniversalHeader";
import ProtectedAdminRoute from "./modules/admin/components/ProtectedAdminRoute";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import AdminUsers from "./modules/admin/pages/AdminUsers";
import AdminUserProfiles from "./modules/admin/pages/AdminUserProfiles";
import AdminSettings from "./modules/admin/pages/AdminSettings";
import AdminAuth from "./modules/admin/pages/AdminAuth";
import AdminProfileEdit from "./modules/admin/pages/AdminProfileEdit";

import Profile from "./modules/user/pages/Profile";
import PaymentHistory from "./modules/user/pages/PaymentHistory";
import HealthMetrics from "./modules/user/pages/HealthMetrics";
import Pricing from "./pages/Pricing";
import Checkout from "./modules/user/pages/Checkout";
import ComingSoon from "./pages/ComingSoon";
import AdminCoupons from "./modules/admin/pages/AdminCoupons";
import AdminTransactions from "./modules/admin/pages/AdminTransactions";
import { api, syncConfig, API_BASE_URL } from "./lib/api";
const queryClient = new QueryClient();

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
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
