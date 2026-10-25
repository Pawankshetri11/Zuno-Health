import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, UserCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home", hash: "" },
  { href: "/#pricing", label: "Pricing", hash: "#pricing" },
  { href: "/#how-it-works", label: "How It Works", hash: "#how-it-works" },
  { href: "/#faqs", label: "FAQs", hash: "#faqs" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const floating = isHome && !scrolled && !isOpen;

  const handleLogout = () => {
    localStorage.removeItem("zuno_auth_user");
    localStorage.removeItem("zuno_user");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("zuno_auth_user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const element = document.getElementById(location.hash.substring(1));
    if (!element) return;
    setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
  }, [location]);

  const isActive = (hash: string) => {
    if (hash) return location.pathname === "/" && location.hash === hash;
    return location.pathname === "/" && !location.hash;
  };

  const navText = "text-[#456258] hover:text-[#0f766e]";
  const activeText = "text-[#0f766e]";

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      style={{
        background: floating ? "rgba(255, 255, 255, 0.78)" : "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(18px) saturate(1.35)",
        WebkitBackdropFilter: "blur(18px) saturate(1.35)",
        borderBottom: floating ? "1px solid rgba(185,222,210,0.55)" : "1px solid rgba(207,226,216,0.78)",
        boxShadow: floating ? "0 8px 28px rgba(15, 118, 110, 0.08)" : "0 10px 30px rgba(20, 33, 27, 0.06)",
      }}
    >
      <div className="container mx-auto px-5 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <img src="/zuno-logo.png" alt="Zuno" className="h-12 w-[144px] object-contain object-left transition-transform group-hover:scale-[1.02]" />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition ${isActive(link.hash) ? activeText : navText}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link to="/dashboard" className={`text-sm font-medium transition ${location.pathname === "/dashboard" ? activeText : navText}`}>
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className={`text-sm font-medium transition ${location.pathname === "/auth" ? activeText : navText}`}>
                Login
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className={`text-xs font-medium uppercase tracking-normal transition ${floating ? "text-white/65 hover:text-white" : "text-[#9b4c43] hover:text-[#d95733]"}`}
                >
                  Logout
                </button>
                <Link
                  to="/dashboard"
                  className={`inline-flex h-11 items-center gap-2 rounded-[8px] px-5 text-xs font-semibold uppercase tracking-normal transition ${
                    "bg-[#0f766e] text-white hover:bg-[#0d665f]"
                  }`}
                >
                  My Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className={`inline-flex h-11 items-center gap-2 rounded-[8px] px-5 text-xs font-semibold uppercase tracking-normal transition ${
                  "bg-[#0f766e] text-white hover:bg-[#0d665f]"
                }`}
              >
                Get Free Plan
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {user && (
              <Link
                to="/dashboard"
                aria-label="My Dashboard"
                className="rounded-[8px] p-2 text-[#0f766e] transition hover:bg-[#0f766e]/10"
              >
                <UserCircle className="h-5 w-5" />
              </Link>
            )}
            <button
              className="rounded-[8px] p-2 text-[#456258] transition hover:bg-[#0f766e]/10 hover:text-[#0f3b35]"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-4 border-t border-[#d9e7df] pb-3 pt-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`rounded-[8px] px-2 py-2 text-sm font-medium transition ${isActive(link.hash) ? "text-[#0f513f]" : "text-[#63746a] hover:bg-[#eef7f3] hover:text-[#0f513f]"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-[8px] px-2 py-2 text-sm font-medium text-[#63746a] transition hover:bg-[#eef7f3] hover:text-[#0f513f]"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="rounded-[8px] px-2 py-2 text-left text-sm font-medium text-[#b85a4b] transition hover:bg-[#fff0df]"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#0f513f] text-sm font-semibold uppercase tracking-normal text-white"
                  >
                    My Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="rounded-[8px] px-2 py-2 text-sm font-medium text-[#63746a] transition hover:bg-[#eef7f3] hover:text-[#0f513f]"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#0f513f] text-sm font-semibold uppercase tracking-normal text-white"
                  >
                    Get Free Plan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
