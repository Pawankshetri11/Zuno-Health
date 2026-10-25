import type { ReactNode } from "react";
import { BarChart3, CreditCard, Settings, Ticket, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Overview", to: "/admin", icon: BarChart3 },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Transactions", to: "/admin/transactions", icon: CreditCard },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/80">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/admin" className="text-lg font-black tracking-tight">
            ZUNO <span className="text-orange-500">ADMIN</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin navigation">
            {links.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-orange-500/10 text-orange-600" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">
              View site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-5 py-8 md:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
