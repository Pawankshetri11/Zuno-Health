import React, { useEffect, useState } from "react";
import { 
    CreditCard, Calendar, CheckCircle2, 
    XCircle, Clock, Receipt, ArrowLeft 
} from "lucide-react";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, getLogoUrl } from "@/lib/api";

const PaymentHistory = () => {
    const [payments, setPayments] = useState<any[]>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_user_payments") || "[]"); } catch { return []; }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_user_payments"));
    
    const user = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");
    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.subscriptions.getAllByUserId(user.id);
                setPayments(res);
                sessionStorage.setItem("zuno_user_payments", JSON.stringify(res));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [user.id]);

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'bg-gradient-to-b from-emerald-50 to-emerald-100/60 text-emerald-700 border-emerald-200/90 shadow-[0_1px_2px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(255,255,255,1)]';
            case 'pending':
                return 'bg-gradient-to-b from-amber-50 to-amber-100/60 text-amber-700 border-amber-200/90 shadow-[0_1px_2px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(255,255,255,1)]';
            default:
                return 'bg-gradient-to-b from-rose-50 to-rose-100/60 text-rose-700 border-rose-200/90 shadow-[0_1px_2px_rgba(244,63,94,0.1),inset_0_1px_0_rgba(255,255,255,1)]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return <CheckCircle2 className="h-3 w-3 text-emerald-600" />;
            case 'pending':
                return <Clock className="h-3 w-3 text-amber-600" />;
            default:
                return <XCircle className="h-3 w-3 text-rose-600" />;
        }
    };

    const totalSpent = payments.reduce((acc, p) => p.payment_status === 'completed' ? acc + parseFloat(p.amount || 0) : acc, 0);
    const activePlansCount = payments.filter(p => p.payment_status === 'completed' && new Date(p.end_date) > new Date()).length;

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <UserSidebar logoUrl={logoUrl} onSignOut={handleSignOut} />

            <main className="relative flex-1 min-h-screen overflow-y-auto px-4 py-8 md:px-8 pt-24 lg:pt-8 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-7">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-3xl font-medium font-sans text-[#10243e] tracking-tight leading-snug">
                                Payment <span className="text-orange-500 font-medium">History</span>
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">
                                Tracking your membership subscriptions, payments, and billing transactions.
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3.5 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] text-xs font-semibold shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600"
                            onClick={() => window.location.href='/dashboard'}
                        >
                            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Dashboard
                        </Button>
                    </div>

                    {/* Stats Summary - 3D Tactile Mini-Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 p-5 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40">
                                <CreditCard className="h-5 w-5" strokeWidth={2.2} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] leading-none mb-1.5">Total Spent</p>
                                <p className="text-2xl font-medium text-[#10243e] tracking-tight">₹{totalSpent.toLocaleString()}</p>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 p-5 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_2.5px_5px_rgba(16,185,129,0.38),inset_0_1.5px_1px_rgba(255,255,255,0.65)]">
                                <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] leading-none mb-1.5">Active Plans</p>
                                <p className="text-2xl font-medium text-[#10243e] tracking-tight">{activePlansCount}</p>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 p-5 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2.5px_5px_rgba(37,99,235,0.38),inset_0_1.5px_1px_rgba(255,255,255,0.65)]">
                                <Receipt className="h-5 w-5" strokeWidth={2.2} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] leading-none mb-1.5">Transactions</p>
                                <p className="text-2xl font-medium text-[#10243e] tracking-tight">{payments.length}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Payments Table */}
                    <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
                        <CardHeader className="border-b border-slate-200/80 py-4 px-6 bg-gradient-to-b from-white to-slate-50/70 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-orange-500" />
                                <CardTitle className="text-xs font-bold uppercase tracking-[0.16em] text-[#10243e]">Transaction Records</CardTitle>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500">{payments.length} total entries</span>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto no-scrollbar">
                                <Table>
                                    <TableHeader className="bg-slate-50/70">
                                        <TableRow className="hover:bg-transparent border-slate-200/70">
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider h-11 text-slate-400 px-6">Plan Details</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider h-11 text-slate-400">Amount</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider h-11 text-slate-400">Date</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider h-11 text-slate-400 text-right px-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array(3).fill(0).map((_, i) => (
                                                <TableRow key={i} className="border-slate-100 animate-pulse">
                                                    <TableCell colSpan={4} className="h-16 bg-slate-50/50" />
                                                </TableRow>
                                            ))
                                        ) : payments.length > 0 ? (
                                            payments.map((p) => (
                                                <TableRow key={p.id} className="group hover:bg-orange-50/20 border-slate-100 transition-colors h-16">
                                                    <TableCell className="px-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-[#10243e] capitalize">{p.plan_type} Plan</span>
                                                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{p.plan_days} Days Membership</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm font-medium text-[#10243e]">₹{parseFloat(p.amount || 0).toLocaleString()}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            <span className="text-xs font-medium">{new Date(p.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right px-6">
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(p.payment_status || '')}`}>
                                                            {getStatusIcon(p.payment_status || '')}
                                                            {p.payment_status}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                                        <Receipt className="h-10 w-10 stroke-1 text-slate-300" />
                                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">No transactions recorded yet</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Help Note */}
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-white to-blue-50/40 border border-blue-200/70 shadow-[0_1.5px_3px_rgba(37,99,235,0.04),inset_0_1px_0_rgba(255,255,255,1)] flex items-start gap-3">
                        <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Need help with a billing transaction? Provide the payment date and plan details when contacting our support team via <span className="text-blue-700 font-bold underline cursor-pointer hover:text-blue-800">Support Chat</span>.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentHistory;
