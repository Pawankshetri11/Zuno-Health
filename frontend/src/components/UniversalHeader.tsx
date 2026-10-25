import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "Meal Plans", to: "/#meal-plans" },
  { label: "Workouts", to: "/#workouts" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Blog", to: "/coming-soon" },
];

const navLinkClass =
  "relative whitespace-nowrap text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-blue-700 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-500 after:transition-all after:duration-200 after:content-[''] hover:after:w-full";

const UniversalHeader = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("zuno_auth_user")));
  const isHome = pathname === "/";
  const hideHeader =
    pathname.startsWith("/admin") ||
    ["/dashboard", "/health-metrics", "/profile", "/payments", "/checkout", "/pricing"].includes(pathname);
  const hasReservedTopSpace = ["/auth", "/about", "/contact", "/privacy-policy", "/terms"].includes(pathname);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 16);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    const syncLoginState = () => setIsLoggedIn(Boolean(localStorage.getItem("zuno_auth_user")));
    syncLoginState();
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("zuno_auth_user");
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/");
  };

  if (hideHeader) return null;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-colors duration-200 ${
        isHome && !scrolled
          ? "bg-transparent"
          : "border-b border-slate-200/70 bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between px-8 md:px-12 lg:px-16">
        <Link to="/" className="flex items-center" aria-label="Zuno home">
          <img src="/zuno-logo-cropped.png" alt="Zuno" className="h-9 w-36 object-contain object-left" />
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 rounded-full bg-white/45 px-4 py-2 backdrop-blur-sm lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-400 bg-white/85 px-4 text-xs font-medium text-blue-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-blue-50 hover:shadow-md active:translate-y-0 active:scale-100"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-blue-600" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-orange-500 px-4 text-xs font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-orange-600 active:translate-y-0 active:scale-100"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-400 bg-white/85 px-4 text-xs font-medium text-blue-900 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-blue-50 hover:shadow-md active:translate-y-0 active:scale-100"
              >
                <LogIn className="h-3.5 w-3.5 text-blue-600" />
                Sign In
              </Link>
              <Link
                to="/auth"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-orange-500 px-4 text-xs font-medium text-white shadow-[0_6px_16px_rgba(249,115,22,0.22)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-orange-600 hover:shadow-[0_10px_22px_rgba(249,115,22,0.32)] active:translate-y-0 active:scale-100"
              >
                Sign Up
                <UserPlus className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-800 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white px-5 pb-6 pt-3 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-400 px-4 text-xs font-medium text-blue-900 transition hover:bg-blue-50"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-blue-600" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-xs font-medium text-white transition hover:bg-orange-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-400 px-4 text-xs font-medium text-blue-900 transition hover:bg-blue-50"
                >
                  <LogIn className="h-3.5 w-3.5 text-blue-600" />
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-xs font-medium text-white transition hover:bg-orange-600"
                >
                  Sign Up
                  <UserPlus className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    {!isHome && !hasReservedTopSpace && <div aria-hidden="true" className="h-[72px]" />}
    </>
  );
};

export default UniversalHeader;
