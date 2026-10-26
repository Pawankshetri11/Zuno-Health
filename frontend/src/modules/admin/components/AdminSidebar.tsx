import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, Users, CreditCard, Ticket, Settings, 
    LogOut, ChevronRight, ChevronLeft, Menu, ExternalLink, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminSidebarProps {
    onSignOut?: () => void;
}

const AdminSidebar = ({ onSignOut }: AdminSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const displayLogo = "/zuno-logo-cropped.png";
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("zuno_admin_sidebar_collapsed") === "true");

    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");
        } catch {
            return {};
        }
    })();

    const navItems = [
        { label: "Dashboard Intel", path: "/admin", icon: LayoutDashboard },
        { label: "User Management", path: "/admin/users", icon: Users },
        { label: "Transactions", path: "/admin/transactions", icon: CreditCard },
        { label: "Discount Coupons", path: "/admin/coupons", icon: Ticket },
        { label: "Platform Settings", path: "/admin/settings", icon: Settings },
    ];

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("zuno_admin_sidebar_collapsed", String(next));
    };

    const handleSignOut = () => {
        if (onSignOut) {
            onSignOut();
        } else {
            localStorage.removeItem("zuno_auth_user");
            sessionStorage.clear();
            navigate("/admin/auth");
        }
    };

    const NavContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
        <div className="relative flex h-full max-h-screen flex-col overflow-hidden bg-gradient-to-b from-white via-[#fcfdff] to-[#f6f9fe] py-3.5 select-none">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-orange-100/35 blur-2xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-100/35 blur-2xl" />
            
            {/* Brand Header */}
            <div className={cn(
                "relative flex h-9 shrink-0 items-center transition-all",
                isCollapsed ? "justify-center px-1" : "justify-between px-3.5"
            )}>
                <Link to="/admin" aria-label="Zuno Admin" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 focus-visible:outline-none">
                    <img 
                        src={isCollapsed ? "/zuno-z-mark.png" : displayLogo} 
                        alt="Zuno Admin" 
                        className={cn(
                            "object-contain object-left transition-all rounded-none",
                            isCollapsed ? "h-7 w-7" : "h-7 w-28"
                        )} 
                    />
                    {!isCollapsed && (
                        <span className="rounded-md bg-gradient-to-b from-orange-500 to-orange-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-xs">
                            Admin
                        </span>
                    )}
                </Link>

                <button
                    type="button"
                    onClick={toggleCollapse}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    className={cn(
                        "hidden lg:flex items-center justify-center rounded-lg bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 shadow-[0_1.5px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] text-slate-500 hover:text-slate-800 hover:border-slate-300",
                        isCollapsed ? "mt-0.5 h-7 w-7" : "h-7 w-7"
                    )}
                >
                    {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </div>

            {/* Divider with 3D groove */}
            <div className="mx-3 my-2.5 border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />

            {/* Navigation Menu */}
            <div className="relative flex-1 overflow-y-auto px-2.5 py-0.5 no-scrollbar">
                {!isCollapsed && (
                    <h3 className="font-poppins mb-2 px-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Admin Controls
                    </h3>
                )}
                <nav className="space-y-1.5" aria-label="Admin dashboard navigation">
                    {navItems.map((item) => {
                        const displayActive = item.path === "/admin" 
                            ? location.pathname === "/admin" 
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                aria-current={displayActive ? "page" : undefined}
                                className={cn(
                                    "group relative flex items-center rounded-xl transition-all duration-200",
                                    isCollapsed ? "h-10 w-10 mx-auto justify-center" : "min-h-[42px] justify-between px-2.5 py-2 text-[12.5px] font-medium",
                                    displayActive
                                        ? "bg-gradient-to-b from-white via-orange-50/50 to-orange-50/80 border border-orange-200/90 text-[#10243e] font-semibold shadow-[0_2.5px_5px_rgba(249,115,22,0.14),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1.5px_0_rgba(249,115,22,0.22)]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-[#10243e]"
                                )}
                            >
                                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                                    <span className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-1.5 transition-all",
                                        displayActive 
                                            ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40" 
                                            : "bg-gradient-to-b from-white to-[#f1f5f9] border border-slate-200/90 text-slate-500 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] group-hover:text-orange-500 group-hover:border-orange-200"
                                    )}>
                                        <item.icon className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    {!isCollapsed && (
                                        <span className="font-poppins truncate">{item.label}</span>
                                    )}
                                </div>
                                {!isCollapsed && displayActive && (
                                    <span aria-hidden="true" className="mr-1 h-2 w-2 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 shadow-[0_1px_3px_rgba(249,115,22,0.7)] ring-2 ring-orange-200/90" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-2">
                        <Link
                            to="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title={isCollapsed ? "View Live Site" : undefined}
                            className={cn(
                                "group relative flex items-center rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                                isCollapsed ? "h-10 w-10 mx-auto justify-center" : "min-h-[38px] justify-between px-2.5 py-1.5 text-[12px] font-medium"
                            )}
                        >
                            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:text-slate-700">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </span>
                                {!isCollapsed && <span className="truncate">View Live Website</span>}
                            </div>
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Bottom Profile & Sign Out Section */}
            <div className="mt-auto shrink-0 px-2.5 pt-2">
                <div className="my-2 border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />
                
                <div className={cn(
                    "flex items-center gap-2.5 rounded-xl bg-gradient-to-b from-white to-[#f8faff] border border-slate-200/90 p-2 shadow-sm",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#10243e] to-[#1e3a5f] text-white shadow-sm font-bold text-xs">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white ring-1 ring-white" />
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold text-[#10243e] truncate">
                                {currentUser.name || "Administrator"}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                                <ShieldAlert className="h-2.5 w-2.5" />
                                <span>Super Admin</span>
                            </div>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            type="button"
                            onClick={handleSignOut}
                            title="Sign Out"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <button
                        type="button"
                        onClick={handleSignOut}
                        title="Sign Out"
                        className="mt-2 flex h-8 w-8 mx-auto items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Strictly Fixed & Locked to Viewport Height */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 hidden h-screen max-h-screen flex-col border-r border-slate-200/90 bg-white transition-all duration-300 lg:flex shadow-[1px_0_8px_rgba(0,0,0,0.03)]",
                    collapsed ? "w-16" : "w-60"
                )}
            >
                <NavContent isCollapsed={collapsed} />
            </aside>

            {/* Desktop Spacer */}
            <div
                className={cn(
                    "hidden shrink-0 transition-all duration-300 lg:block",
                    collapsed ? "w-16" : "w-60"
                )}
            />

            {/* Mobile Top Floating Bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md shadow-sm">
                <Link to="/admin" className="flex items-center gap-2">
                    <img src={displayLogo} alt="Zuno Admin" className="h-6 w-auto" />
                    <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                        Admin
                    </span>
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-600 shadow-sm"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavContent isCollapsed={false} />
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
};

export default AdminSidebar;
