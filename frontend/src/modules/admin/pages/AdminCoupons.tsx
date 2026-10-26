import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Loader2, TrendingUp, Hash, Power, Clock, Ban, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Coupon = {
    id?: number;
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    max_uses?: number | null;
    used_count?: number;
    min_amount: number;
    applies_to: string; // 'all' | 'daily' | 'weekly' | 'monthly'
    valid_from?: string | null;
    valid_until?: string | null;
    is_active: number | boolean;
};

const blank: Coupon = {
    code: "",
    discount_type: "percent",
    discount_value: 10,
    max_uses: null,
    min_amount: 0,
    applies_to: "all",
    valid_from: "",
    valid_until: "",
    is_active: 1,
};

const AdminCoupons = () => {
    const user = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");
    const [list, setList] = useState<Coupon[]>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_admin_coupons") || "[]"); } catch { return []; }
    });
    const [analytics, setAnalytics] = useState<any>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_admin_coupons_analytics") || "null"); } catch { return null; }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_admin_coupons"));
    const [saving, setSaving] = useState(false);
    const [draft, setDraft] = useState<Coupon>(blank);
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchAll = async () => {
        if (list.length === 0) setLoading(true);
        try {
            const [listData, analyticsData] = await Promise.all([
                api.admin.coupons.list(user.id),
                api.admin.coupons.analytics(user.id),
            ]);
            setList(Array.isArray(listData) ? listData : []);
            setAnalytics(analyticsData);
            sessionStorage.setItem("zuno_admin_coupons", JSON.stringify(Array.isArray(listData) ? listData : []));
            if (analyticsData) sessionStorage.setItem("zuno_admin_coupons_analytics", JSON.stringify(analyticsData));
        } catch (e: any) {
            toast.error(e?.message || "Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const fetchList = fetchAll;

    useEffect(() => { if (user.id) fetchAll(); /* eslint-disable-next-line */ }, []);

    const startEdit = (c: Coupon) => {
        setEditingId(c.id || null);
        setDraft({
            ...c,
            valid_from: c.valid_from ? c.valid_from.replace(" ", "T").slice(0, 16) : "",
            valid_until: c.valid_until ? c.valid_until.replace(" ", "T").slice(0, 16) : "",
            max_uses: c.max_uses ?? null,
            is_active: c.is_active ? 1 : 0,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraft(blank);
    };

    const save = async () => {
        if (!draft.code.trim()) {
            toast.error("Code is required");
            return;
        }
        if (!(draft.discount_value > 0)) {
            toast.error("Discount value must be > 0");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...draft,
                code: draft.code.trim().toUpperCase(),
                valid_from: draft.valid_from ? draft.valid_from.replace("T", " ") + ":00" : "",
                valid_until: draft.valid_until ? draft.valid_until.replace("T", " ") + ":00" : "",
                max_uses: draft.max_uses === null || draft.max_uses === undefined || (draft.max_uses as any) === "" ? "" : Number(draft.max_uses),
                is_active: draft.is_active ? 1 : 0,
            };
            if (editingId) {
                await api.admin.coupons.update(user.id, editingId, payload);
                toast.success("Coupon updated successfully");
            } else {
                await api.admin.coupons.create(user.id, payload);
                toast.success("Coupon created successfully");
            }
            cancelEdit();
            fetchList();
        } catch (e: any) {
            toast.error(e?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id?: number) => {
        if (!id) return;
        if (!confirm("Delete this coupon permanently?")) return;
        try {
            await api.admin.coupons.remove(user.id, id);
            toast.success("Coupon deleted");
            fetchList();
        } catch (e: any) {
            toast.error(e?.message || "Delete failed");
        }
    };

    const toggleActive = async (c: Coupon) => {
        try {
            await api.admin.coupons.update(user.id, c.id!, { is_active: c.is_active ? 0 : 1 });
            fetchList();
        } catch (e: any) {
            toast.error(e?.message || "Toggle failed");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">Coupon Engine</h1>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70">
                                Promotions
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Create discounts, manage redemptions & configure campaign rules
                        </p>
                    </div>
                </div>

                {/* Analytics Metric Plates */}
                {analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                        {[
                            { 
                                label: "Total Coupons", 
                                value: analytics.total_coupons ?? 0, 
                                icon: Hash, 
                                plateGradient: "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09]",
                                borderLight: "rgba(255,135,54,0.4)" 
                            },
                            { 
                                label: "Active", 
                                value: analytics.active_coupons ?? 0, 
                                icon: Power, 
                                plateGradient: "bg-gradient-to-b from-emerald-500 to-emerald-600",
                                borderLight: "rgba(16,185,129,0.3)" 
                            },
                            { 
                                label: "Total Uses", 
                                value: analytics.total_redemptions ?? 0, 
                                icon: TrendingUp, 
                                plateGradient: "bg-gradient-to-b from-blue-500 to-indigo-600",
                                borderLight: "rgba(59,130,246,0.3)" 
                            },
                            { 
                                label: "Expired", 
                                value: analytics.expired_coupons ?? 0, 
                                icon: Clock, 
                                plateGradient: "bg-gradient-to-b from-amber-500 to-amber-600",
                                borderLight: "rgba(245,158,11,0.3)" 
                            },
                            { 
                                label: "Exhausted", 
                                value: analytics.exhausted_coupons ?? 0, 
                                icon: Ban, 
                                plateGradient: "bg-gradient-to-b from-rose-500 to-rose-600",
                                borderLight: "rgba(244,63,94,0.3)" 
                            },
                        ].map((s) => (
                            <div 
                                key={s.label} 
                                className="relative overflow-hidden bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-4 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                        {s.label}
                                    </span>
                                    <div 
                                        className={`w-8 h-8 shrink-0 rounded-xl ${s.plateGradient} flex items-center justify-center text-white shadow-xs`}
                                    >
                                        <s.icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-2xl font-semibold text-[#10243e] tracking-tight tabular-nums">{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Top Coupons */}
                {analytics?.top_coupons?.length > 0 && analytics.total_redemptions > 0 && (
                    <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                        <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b border-slate-100">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-[#10243e]">Top Performing Coupons</h3>
                                <p className="text-xs text-slate-500 font-normal">Ranked by total client redemptions</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {analytics.top_coupons.filter((c: any) => c.used_count > 0).map((c: any, i: number) => (
                                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-orange-200 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-semibold text-[10.5px] flex items-center justify-center">
                                            #{i + 1}
                                        </span>
                                        <div>
                                            <p className="font-mono font-semibold tracking-wider text-orange-600 text-xs">{c.code}</p>
                                            <p className="text-[11px] font-normal text-slate-500">
                                                {c.discount_type === "percent" ? `${c.discount_value}% off` : `₹${c.discount_value} off`} · <span className="capitalize">{c.applies_to}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-[#10243e] tabular-nums">{c.used_count}</div>
                                        <div className="text-[9.5px] font-medium text-slate-400 uppercase tracking-wider">uses</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create / Edit Form */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                    <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] flex items-center justify-center text-white shadow-xs">
                                {editingId ? <Save className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-[#10243e]">
                                    {editingId ? "Edit Coupon" : "Create New Coupon"}
                                </h2>
                                <p className="text-xs text-slate-500 font-normal">
                                    {editingId ? `Editing existing coupon #${editingId}` : "All coupon codes are automatically stored in uppercase."}
                                </p>
                            </div>
                        </div>
                        {editingId && (
                            <button
                                onClick={cancelEdit}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Coupon Code</Label>
                            <Input
                                value={draft.code}
                                onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
                                placeholder="WELCOME10"
                                className="bg-white border-slate-200 font-mono font-semibold tracking-wider text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Discount Type</Label>
                            <div className="flex bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
                                {(["percent", "fixed"] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setDraft({ ...draft, discount_type: t })}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                                            draft.discount_type === t 
                                                ? "bg-white text-orange-600 shadow-xs border border-slate-200/80 font-semibold" 
                                                : "text-slate-500 hover:text-slate-800"
                                        }`}
                                    >
                                        {t === "percent" ? "% Percentage Off" : "₹ Fixed Amount Off"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                                {draft.discount_type === "percent" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                            </Label>
                            <Input
                                type="number"
                                value={draft.discount_value}
                                onChange={(e) => setDraft({ ...draft, discount_value: parseFloat(e.target.value) || 0 })}
                                className="bg-white border-slate-200 font-medium text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Min Cart Total (₹)</Label>
                            <Input
                                type="number"
                                value={draft.min_amount}
                                onChange={(e) => setDraft({ ...draft, min_amount: parseFloat(e.target.value) || 0 })}
                                className="bg-white border-slate-200 font-medium text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Max Redemptions (blank = Unlimited)</Label>
                            <Input
                                type="number"
                                value={(draft.max_uses ?? "") as any}
                                onChange={(e) => setDraft({ ...draft, max_uses: e.target.value === "" ? null : parseInt(e.target.value) })}
                                placeholder="Unlimited"
                                className="bg-white border-slate-200 font-medium text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Applies To Plan</Label>
                            <select
                                value={draft.applies_to}
                                onChange={(e) => setDraft({ ...draft, applies_to: e.target.value })}
                                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 font-medium text-xs text-[#10243e] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                            >
                                <option value="all">All Plans</option>
                                <option value="daily">Daily Plan Only</option>
                                <option value="weekly">Weekly Plan Only</option>
                                <option value="monthly">Monthly Plan Only</option>
                            </select>
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Valid From</Label>
                            <Input
                                type="datetime-local"
                                value={draft.valid_from || ""}
                                onChange={(e) => setDraft({ ...draft, valid_from: e.target.value })}
                                className="bg-white border-slate-200 font-medium text-xs text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Valid Until</Label>
                            <Input
                                type="datetime-local"
                                value={draft.valid_until || ""}
                                onChange={(e) => setDraft({ ...draft, valid_until: e.target.value })}
                                disabled={!draft.valid_until && draft.valid_until !== ""}
                                placeholder="Lifetime"
                                className="bg-white border-slate-200 font-medium text-xs text-[#10243e] disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <div>
                                <Label className="text-xs font-semibold text-[#10243e] cursor-pointer">Lifetime Validity</Label>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    No expiration date — coupon stays active indefinitely until manually disabled.
                                </p>
                            </div>
                            <Switch
                                checked={!draft.valid_until}
                                onCheckedChange={(c) => setDraft({ ...draft, valid_until: c ? "" : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16) })}
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <div>
                                <Label className="text-xs font-semibold text-[#10243e] cursor-pointer">Coupon Status</Label>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    When active, users can apply this code during checkout.
                                </p>
                            </div>
                            <Switch
                                checked={!!draft.is_active}
                                onCheckedChange={(c) => setDraft({ ...draft, is_active: c ? 1 : 0 })}
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={save}
                                disabled={saving}
                                className="h-10 px-5 font-semibold text-xs text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center justify-center flex-1 cursor-pointer disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                ) : editingId ? (
                                    <Save className="h-4 w-4 mr-2" />
                                ) : (
                                    <Plus className="h-4 w-4 mr-2" />
                                )}
                                {editingId ? "Save Changes" : "Create Coupon"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="h-10 px-5 font-medium text-xs text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* List Table */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-[#10243e]">All Coupons ({list.length})</h3>
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className="py-12 text-center text-slate-400">
                                <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2 text-orange-500" />
                                <span className="text-xs font-semibold">Loading coupons...</span>
                            </div>
                        ) : list.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-xs font-medium">
                                No coupons found. Create one using the form above.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                                            <th className="py-3 px-4">Code</th>
                                            <th className="py-3 px-4">Discount</th>
                                            <th className="py-3 px-4">Min Order</th>
                                            <th className="py-3 px-4">Plan</th>
                                            <th className="py-3 px-4">Used</th>
                                            <th className="py-3 px-4">Validity</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {list.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3 px-4 font-mono font-semibold">
                                                    <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/80 text-orange-600 text-xs">
                                                        {c.code}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-[#10243e]">
                                                    {c.discount_type === "percent" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-600">
                                                    ₹{c.min_amount}
                                                </td>
                                                <td className="py-3 px-4 capitalize font-medium text-slate-600">
                                                    {c.applies_to}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-600">
                                                    {c.used_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ""}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {!c.valid_until ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-medium uppercase tracking-wider">
                                                            Lifetime
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] font-normal text-slate-500">
                                                            till {String(c.valid_until).slice(0, 10)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Switch checked={!!c.is_active} onCheckedChange={() => toggleActive(c)} />
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button 
                                                            onClick={() => startEdit(c)}
                                                            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-orange-600 transition-colors cursor-pointer shadow-xs"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => remove(c.id)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete coupon"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCoupons;
