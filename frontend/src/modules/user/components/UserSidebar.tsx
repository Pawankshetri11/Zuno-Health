import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, Settings, LogOut, ChevronRight, ChevronLeft, Menu, History as HistoryIcon, Activity, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface UserSidebarProps {
    logoUrl?: string;
    gender?: string;
    onSignOut: () => void;
}

const UserSidebar = ({ onSignOut }: UserSidebarProps) => {
    const location = useLocation();
    const displayLogo = "/zuno-logo-cropped.png";
    const isHomeActive = location.pathname === "/";
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("zuno_sidebar_collapsed") === "true");

    const navItems = [
        { label: "My Diet Plan", path: "/dashboard", icon: Utensils },
        { label: "Health Metrics", path: "/health-metrics", icon: Activity },
        { label: "Pricing & Plans", path: "/pricing", icon: Tag },
        { label: "Payment History", path: "/payments", icon: HistoryIcon },
        { label: "Profile Settings", path: "/profile", icon: Settings },
    ];

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("zuno_sidebar_collapsed", String(next));
    };

    const NavContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-white via-[#fcfdff] to-[#f6f9fe] py-3.5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-orange-100/35 blur-2xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-100/35 blur-2xl" />
            
            {/* Brand Header - Sharp Logo with No Extra Radius */}
            <div className={cn(
                "relative flex h-9 items-center transition-all",
                isCollapsed ? "justify-center px-1" : "justify-between px-3.5"
            )}>
                <Link to="/" aria-label="Zuno home" onClick={() => setOpen(false)} className="inline-flex items-center focus-visible:outline-none">
                    <img 
                        src={isCollapsed ? "/zuno-z-mark.png" : displayLogo} 
                        alt={isCollapsed ? "Zuno mark" : "Zuno"} 
                        className={cn(
                            "object-contain object-left transition-all rounded-none",
                            isCollapsed ? "h-7 w-7" : "h-7 w-32"
                        )} 
                    />
                </Link>

                <button
                    type="button"
                    onClick={toggleCollapse}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    className={cn(
                        "hidden lg:flex items-center justify-center rounded-lg bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 shadow-[0_1.5px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] text-slate-500 hover:text-slate-800 hover:border-slate-300",
                        isCollapsed ? "mt-0.5 h-6.5 w-6.5" : "h-6.5 w-6.5"
                    )}
                >
                    {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </div>

            {/* Divider after logo with 3D groove */}
            <div className="mx-3 my-2.5 border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />

            {/* Navigation Menu */}
            <div className="relative flex-1 overflow-y-auto px-2.5 py-0.5 no-scrollbar">
                {!isCollapsed && (
                    <h3 className="font-poppins mb-2 px-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Main Menu</h3>
                )}
                <nav className="space-y-1.5" aria-label="User dashboard navigation">
                    {navItems.map((item) => {
                        const displayActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                aria-current={displayActive ? "page" : undefined}
                                className={cn(
                                    "group relative flex items-center rounded-xl",
                                    isCollapsed ? "h-10 w-10 mx-auto justify-center" : "min-h-[42px] justify-between px-2.5 py-2 text-[12.5px] font-medium",
                                    displayActive
                                        ? "bg-gradient-to-b from-white via-orange-50/50 to-orange-50/80 border border-orange-200/90 text-[#10243e] font-medium shadow-[0_2.5px_5px_rgba(249,115,22,0.14),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1.5px_0_rgba(249,115,22,0.22)]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-[#10243e]"
                                )}
                            >
                                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                                    <span className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-1.5",
                                        displayActive 
                                            ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40" 
                                            : "bg-gradient-to-b from-white to-[#f1f5f9] border border-slate-200/90 text-slate-500 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] group-hover:text-blue-600 group-hover:border-blue-200"
                                    )}>
                                        <item.icon className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                    {!isCollapsed && (
                                        <span className="font-poppins truncate">{item.label}</span>
                                    )}
                                </div>
                                {!isCollapsed && displayActive && (
                                    <span aria-hidden="true" className="mr-1 h-2 w-2 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 shadow-[0_1px_3px_rgba(249,115,22,0.7),inset_0_0.5px_0.5px_rgba(255,255,255,0.9),inset_0_-0.5px_0.5px_rgba(0,0,0,0.25)] ring-2 ring-orange-200/90" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="relative mt-auto px-2.5 pt-1">
                <div className="mb-2 mx-1 border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />
                <div className="space-y-1.5">
                    <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        title={isCollapsed ? "Home page" : undefined}
                        aria-current={isHomeActive ? "page" : undefined}
                        className={cn(
                            "group relative flex items-center rounded-xl",
                            isCollapsed ? "h-10 w-10 mx-auto justify-center" : "min-h-[42px] justify-between px-2.5 py-2 text-[12.5px] font-medium",
                            isHomeActive 
                                ? "bg-gradient-to-b from-white via-orange-50/50 to-orange-50/80 border border-orange-200/90 text-[#10243e] font-medium shadow-[0_2.5px_5px_rgba(249,115,22,0.14),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1.5px_0_rgba(249,115,22,0.22)]" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-[#10243e]"
                        )}
                    >
                        <span className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                            <span className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-1.5",
                                isHomeActive 
                                    ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40" 
                                    : "bg-gradient-to-b from-white to-[#f1f5f9] border border-slate-200/90 text-slate-500 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] group-hover:text-blue-600 group-hover:border-blue-200"
                            )}>
                                <Home className="h-4 w-4" strokeWidth={2} />
                            </span>
                            {!isCollapsed && <span className="font-poppins">Home page</span>}
                        </span>
                        {!isCollapsed && isHomeActive && <span aria-hidden="true" className="mr-1 h-2 w-2 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 shadow-[0_1px_3px_rgba(249,115,22,0.7),inset_0_0.5px_0.5px_rgba(255,255,255,0.9),inset_0_-0.5px_0.5px_rgba(0,0,0,0.25)] ring-2 ring-orange-200/90" />}
                    </Link>
                    <button
                        onClick={onSignOut}
                        title={isCollapsed ? "Sign Out" : undefined}
                        className={cn(
                            "group flex min-h-[42px] w-full items-center rounded-xl text-[12.5px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600",
                            isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-2.5 py-2"
                        )}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-white to-[#f1f5f9] border border-slate-200/90 text-slate-500 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.04)] p-1.5 group-hover:border-red-200 group-hover:text-red-500">
                            <LogOut className="h-4 w-4" />
                        </span>
                        {!isCollapsed && <span className="font-poppins">Sign Out</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl lg:hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <Link to="/" aria-label="Zuno home" className="inline-flex items-center">
                    <img src={displayLogo} alt="Zuno" className="h-6.5 w-28 object-contain object-left rounded-none" />
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="h-8.5 w-8.5 rounded-lg border border-slate-200 bg-white text-[#10243e] shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-slate-50">
                            <Menu className="h-4.5 w-4.5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-56 border-r border-slate-200 bg-white p-0 shadow-xl">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">Access your diet plan and health metrics.</SheetDescription>
                        <NavContent isCollapsed={false} />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Desktop Sidebar - Strictly Fixed & Collapsible */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-slate-200/90 bg-white transition-all duration-300 lg:flex shadow-[1px_0_8px_rgba(0,0,0,0.03)]",
                collapsed ? "w-16" : "w-56"
            )}>
                <NavContent isCollapsed={collapsed} />
            </aside>
            {/* Spacer for fixed sidebar on desktop */}
            <div className={cn(
                "hidden shrink-0 transition-all duration-300 lg:block",
                collapsed ? "w-16" : "w-56"
            )} />
        </>
    );
};

export default UserSidebar;
