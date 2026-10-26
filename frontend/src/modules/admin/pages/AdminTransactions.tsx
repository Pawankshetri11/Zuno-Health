import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
    Search, CreditCard, TrendingUp, AlertCircle, Clock, 
    IndianRupee, Receipt, X, CheckCircle2, Shield
} from "lucide-react";

type Txn = {
    id: number | string;
    user_id: number | string;
    user_name?: string;
    profile_name?: string;
    email?: string;
    plan_type: string;
    plan_days: number;
    start_date: string;
    end_date: string;
    amount: string | number;
    payment_method: string;
    payment_status: string;
    transaction_id?: string | null;
    admin_note?: string | null;
};

const STATUS_BADGES: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    pending: "bg-amber-50 text-amber-700 border-amber-200/80",
    failed: "bg-rose-50 text-rose-700 border-rose-200/80",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200/80",
    upgraded: "bg-blue-50 text-blue-700 border-blue-200/80",
    refunded: "bg-purple-50 text-purple-700 border-purple-200/80",
};

const AdminTransactions = () => {
    const user = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");
    const [txns, setTxns] = useState<Txn[]>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_admin_txns") || "[]"); } catch { return []; }
    });
    const [stats, setStats] = useState<any>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_admin_txns_stats") || "null"); } catch { return null; }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_admin_txns"));
    const [status, setStatus] = useState("all");
    const [gateway, setGateway] = useState("all");
    const [q, setQ] = useState("");
    const [editing, setEditing] = useState<Txn | null>(null);
    const [draft, setDraft] = useState({ payment_status: "", transaction_id: "", admin_note: "" });
    const [saving, setSaving] = useState(false);

    const fetchAll = async () => {
        if (txns.length === 0) setLoading(true);
        try {
            const r = await api.admin.transactions.list(user.id, { status, gateway, q });
            setTxns(r.transactions || []);
            setStats(r.stats || null);
            sessionStorage.setItem("zuno_admin_txns", JSON.stringify(r.transactions || []));
            if (r.stats) sessionStorage.setItem("zuno_admin_txns_stats", JSON.stringify(r.stats));
        } catch (e: any) {
            toast.error(e?.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (user.id) fetchAll(); }, [status, gateway]);

    const startEdit = (t: Txn) => {
        setEditing(t);
        setDraft({
            payment_status: t.payment_status || "pending",
            transaction_id: t.transaction_id || "",
            admin_note: t.admin_note || "",
        });
    };

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            await api.admin.transactions.updateStatus(user.id, {
                id: editing.id,
                payment_status: draft.payment_status,
                transaction_id: draft.transaction_id,
                admin_note: draft.admin_note,
            });
            toast.success(`Transaction #${editing.id} updated`);
            setEditing(null);
            fetchAll();
        } catch (e: any) {
            toast.error(e?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const formatINR = (val: any) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">Financial Transactions</h1>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                Billing
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Real-time order audit logs, payment gateway callbacks & billing statuses
                        </p>
                    </div>

                    {stats && (
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs shadow-xs">
                            <span className="text-slate-500 font-medium">Total Volume:</span>
                            <span className="font-semibold text-emerald-600 tabular-nums">{formatINR(stats.revenue)}</span>
                        </div>
                    )}
                </div>

                {/* KPI Metrics */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                        {[
                            { 
                                label: "Total Revenue", 
                                value: formatINR(stats.revenue), 
                                icon: IndianRupee, 
                                plate: "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-xs" 
                            },
                            { 
                                label: "Completed", 
                                value: stats.completed_count || 0, 
                                icon: TrendingUp, 
                                plate: "bg-gradient-to-b from-blue-500 to-indigo-600 text-white shadow-xs" 
                            },
                            { 
                                label: "Pending", 
                                value: stats.pending_count || 0, 
                                icon: Clock, 
                                plate: "bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-xs" 
                            },
                            { 
                                label: "Failed", 
                                value: stats.failed_count || 0, 
                                icon: AlertCircle, 
                                plate: "bg-gradient-to-b from-rose-500 to-red-600 text-white shadow-xs" 
                            },
                        ].map((s) => (
                            <div key={s.label} className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-4 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{s.label}</span>
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${s.plate}`}>
                                        <s.icon className="h-4 w-4" />
                                    </span>
                                </div>
                                <div className="text-2xl font-semibold text-[#10243e] tracking-tight tabular-nums">{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-4 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Search Query</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && fetchAll()}
                                        placeholder="Search by customer, email or txn ID..."
                                        className="pl-9 pr-8 bg-white border-slate-200/90 h-9 rounded-xl text-xs text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                    />
                                    {q && (
                                        <button
                                            type="button"
                                            onClick={() => { setQ(""); fetchAll(); }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                            title="Clear"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={fetchAll}
                                    className="h-9 px-4 bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white rounded-xl text-xs font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Payment Status</Label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)} 
                                className="w-full h-9 bg-white border border-slate-200/90 rounded-xl px-3 font-medium text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="upgraded">Upgraded</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Payment Gateway</Label>
                            <select 
                                value={gateway} 
                                onChange={(e) => setGateway(e.target.value)} 
                                className="w-full h-9 bg-white border border-slate-200/90 rounded-xl px-3 font-medium text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                            >
                                <option value="all">All Gateways</option>
                                <option value="razorpay">Razorpay</option>
                                <option value="cashfree">Cashfree</option>
                                <option value="free">Free / Trial</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#10243e]">All Transactions ({txns.length})</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                <tr className="text-left">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-3">Date</th>
                                    <th className="py-3 px-3">Customer</th>
                                    <th className="py-3 px-3">Plan</th>
                                    <th className="py-3 px-3">Amount</th>
                                    <th className="py-3 px-3">Gateway</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">Transaction ID</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {txns.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                                            No transactions match these filters.
                                        </td>
                                    </tr>
                                ) : (
                                    txns.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">#{t.id}</td>
                                            <td className="py-3 px-3 text-slate-600 font-medium">
                                                {String(t.start_date).slice(0, 10)}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-semibold text-[#10243e] text-xs">{t.user_name || t.profile_name || "User"}</div>
                                                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{t.email}</div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="capitalize px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[10px]">
                                                    {t.plan_type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 font-semibold text-[#10243e]">{formatINR(t.amount)}</td>
                                            <td className="py-3 px-3 capitalize text-slate-600 font-medium text-[11px]">
                                                {t.payment_method || "—"}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium tracking-wider uppercase ${STATUS_BADGES[t.payment_status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                                    {t.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 font-mono text-[10px] text-slate-400 max-w-[130px] truncate">
                                                {t.transaction_id || "—"}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button 
                                                    className="h-8 px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-xs cursor-pointer" 
                                                    onClick={() => startEdit(t)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit modal */}
            {editing && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" 
                    onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}
                >
                    <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-[#10243e]">Update Transaction #{editing.id}</h3>
                                <p className="text-xs text-slate-500">Edit payment status or audit note manually</p>
                            </div>
                            <button 
                                onClick={() => setEditing(null)} 
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1 block">Payment Status</Label>
                                <select 
                                    value={draft.payment_status} 
                                    onChange={(e) => setDraft({ ...draft, payment_status: e.target.value })} 
                                    className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="upgraded">Upgraded</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1 block">Transaction / Ref ID</Label>
                                <Input 
                                    value={draft.transaction_id} 
                                    onChange={(e) => setDraft({ ...draft, transaction_id: e.target.value })} 
                                    placeholder="cf_order_... or pay_..." 
                                    className="bg-white border-slate-200 text-xs font-mono"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1 block">Admin Note (Internal)</Label>
                                <textarea 
                                    value={draft.admin_note} 
                                    onChange={(e) => setDraft({ ...draft, admin_note: e.target.value })} 
                                    rows={3} 
                                    placeholder="Reason for manual adjustment..." 
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>

                            <div className="flex gap-2.5 pt-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-xl text-xs font-medium" 
                                    onClick={() => setEditing(null)}
                                >
                                    Cancel
                                </Button>
                                <button 
                                    onClick={save} 
                                    disabled={saving} 
                                    className="flex-1 h-10 px-4 text-xs font-semibold text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminTransactions;
