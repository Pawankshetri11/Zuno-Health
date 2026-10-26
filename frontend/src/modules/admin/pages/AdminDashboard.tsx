import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    TrendingUp, Users, ArrowUpRight, 
    Activity, DollarSign, RefreshCw, Sparkles, CheckCircle2, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "sonner";

const AdminDashboard = () => {
    const [data, setData] = useState<any>(() => {
        try {
            return JSON.parse(sessionStorage.getItem("zuno_admin_analytics") || "null");
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_admin_analytics"));
    const [refreshing, setRefreshing] = useState(false);
    const user = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");

    const fetchData = async (force = false) => {
        if (force) setRefreshing(true);
        try {
            const res = await api.admin.getAnalytics(user.id, force);
            setData(res);
            sessionStorage.setItem("zuno_admin_analytics", JSON.stringify(res));
            if (force) toast.success("Analytics updated");
        } catch (err) {
            console.error(err);
            if (force) toast.error("Failed to refresh analytics");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.id]);

    if (loading && !data) {
        return (
            <AdminLayout>
                <div className="space-y-6 pb-20 animate-pulse">
                    <div className="h-20 bg-white/70 rounded-2xl border border-slate-200/80 shadow-sm" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 bg-white/70 rounded-2xl border border-slate-200/80 shadow-sm" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-72 bg-white/70 rounded-2xl border border-slate-200/80 shadow-sm" />
                        <div className="h-72 bg-white/70 rounded-2xl border border-slate-200/80 shadow-sm" />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${(data?.stats?.totalRevenue || 0).toLocaleString()}`,
            icon: TrendingUp,
            plate: "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_2px_4px_rgba(16,185,129,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]",
            trend: data?.stats?.revenueToday ? `+₹${data.stats.revenueToday.toLocaleString()} today` : null,
            trendUp: true
        },
        {
            title: "Monthly Revenue (MRR)",
            value: `₹${(data?.stats?.mrr || 0).toLocaleString()}`,
            icon: DollarSign,
            plate: "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2px_4px_rgba(249,115,22,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] border-t border-white/40",
            trend: "Monthly plans",
            trendUp: true
        },
        {
            title: "Total Users",
            value: (data?.stats?.totalUsers || 0).toLocaleString(),
            icon: Users,
            plate: "bg-gradient-to-b from-blue-500 to-indigo-600 text-white shadow-[0_2px_4px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]",
            trend: data?.stats?.activeSubscriptions ? `${data.stats.activeSubscriptions} active members` : null,
            trendUp: true
        },
        {
            title: "Conversion Rate",
            value: `${data?.stats?.conversionRate || 0}%`,
            icon: Sparkles,
            plate: "bg-gradient-to-b from-purple-500 to-violet-600 text-white shadow-[0_2px_4px_rgba(147,51,234,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]",
            trend: `${data?.stats?.totalProfiles || 0} profiles created`,
            trendUp: true
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 pb-16">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">
                                Platform Overview
                            </h1>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70">
                                Live
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Real-time subscriber metrics, revenue streams & recent orders
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-slate-500 font-medium">Today:</span>
                            <span className="font-semibold text-emerald-600">₹{(data?.stats?.revenueToday || 0).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                            <span className="text-slate-500 font-medium">Pending:</span>
                            <span className="font-semibold text-amber-600">{data?.stats?.pendingPayments || 0}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${refreshing ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics 4-Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-200/80 transition-all duration-200 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                        {stat.title}
                                    </span>
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${stat.plate}`}>
                                        <stat.icon className="h-4 w-4" strokeWidth={2} />
                                    </span>
                                </div>
                                <div className="text-2xl font-semibold text-[#10243e] tabular-nums tracking-tight">
                                    {stat.value}
                                </div>
                            </div>
                            <div className="mt-2.5 min-h-[22px] flex items-center">
                                {stat.trend ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                        <ArrowUpRight className="h-3 w-3" />
                                        {stat.trend}
                                    </span>
                                ) : (
                                    <span className="text-[10.5px] text-slate-400 font-normal">All time aggregate</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Revenue Area Chart */}
                    <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#10243e] tracking-tight">Revenue Trend</h3>
                                <p className="text-xs text-slate-500 font-normal">Daily earnings over the last 30 days</p>
                            </div>
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <TrendingUp className="h-3.5 w-3.5" />
                            </span>
                        </div>
                        <div className="h-[210px] w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.revenueChart || []}>
                                    <defs>
                                        <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => {
                                            try {
                                                return new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                                            } catch {
                                                return val;
                                            }
                                        }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `₹${val}`}
                                        width={45}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                            fontSize: '11px',
                                            color: '#10243e'
                                        }}
                                        formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#adminRevGrad)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Growth Bar Chart */}
                    <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#10243e] tracking-tight">Member Signups</h3>
                                <p className="text-xs text-slate-500 font-normal">New accounts created daily</p>
                            </div>
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                                <Users className="h-3.5 w-3.5" />
                            </span>
                        </div>
                        <div className="h-[210px] w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.growthChart || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => {
                                            try {
                                                return new Date(val).toLocaleDateString('en-US', { day: 'numeric' });
                                            } catch {
                                                return val;
                                            }
                                        }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        width={25}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(241,245,249,0.7)' }}
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                            fontSize: '11px',
                                            color: '#10243e'
                                        }}
                                        formatter={(val: any) => [`${val} users`, 'New Registrations']}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RECENT TRANSACTIONS TABLE */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-[#10243e]">Recent Orders</h3>
                            <p className="text-xs text-slate-500 font-normal">Latest payment transactions across plans</p>
                        </div>
                        <a
                            href="/admin/transactions"
                            className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                        >
                            View all &rarr;
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/70 border-b border-slate-200/70">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider h-9 px-5">Customer</TableHead>
                                    <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center h-9">Plan</TableHead>
                                    <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center h-9">Amount</TableHead>
                                    <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center h-9">Status</TableHead>
                                    <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-right h-9 px-5">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(!data?.recentTransactions || data.recentTransactions.length === 0) ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-400">
                                            No transactions found yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.recentTransactions.map((tx: any) => {
                                        const isSuccess = tx.payment_status === 'completed' || tx.payment_status === 'SUCCESS';
                                        return (
                                            <TableRow key={tx.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                                                <TableCell className="px-5 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                                                            {tx.name ? tx.name.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-semibold text-[#10243e] truncate">{tx.name || "User"}</div>
                                                            <div className="text-[11px] text-slate-500 truncate">{tx.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-3">
                                                    <span className="text-[10.5px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80">
                                                        {tx.plan_type || "Plan"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center py-3 font-semibold text-xs text-[#10243e]">
                                                    ₹{Number(tx.amount || 0).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                                        isSuccess
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                                                    }`}>
                                                        {isSuccess ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> : <Clock className="h-2.5 w-2.5 text-amber-600" />}
                                                        {tx.payment_status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right py-3 px-5 text-[11px] font-medium text-slate-500">
                                                    {new Date(tx.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
