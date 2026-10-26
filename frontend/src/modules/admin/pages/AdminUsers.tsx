import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api, API_BASE_URL } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users as UsersIcon, Shield, ShieldAlert, Mail, Calendar, Crown, Search, Filter, SortAsc, Wallet, Settings, Trash2, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type PlanKey = "daily" | "weekly" | "monthly";

const PLAN_OPTIONS: Array<{ key: PlanKey; label: string; days: number }> = [
    { key: "daily", label: "Daily", days: 1 },
    { key: "weekly", label: "Weekly", days: 7 },
    { key: "monthly", label: "Monthly", days: 30 },
];

const planKeyFromValue = (plan?: string): PlanKey => {
    const value = (plan || "").toLowerCase();
    if (value.includes("daily")) return "daily";
    if (value.includes("monthly")) return "monthly";
    return "weekly";
};

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>(() => {
        try {
            return JSON.parse(sessionStorage.getItem("zuno_admin_users") || "[]");
        } catch {
            return [];
        }
    });
    const [filteredUsers, setFilteredUsers] = useState<any[]>(() => {
        try {
            return JSON.parse(sessionStorage.getItem("zuno_admin_users") || "[]");
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_admin_users"));
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustType, setAdjustType] = useState<"add" | "remove">("add");
    const [adjustDescription, setAdjustDescription] = useState("");
    const [adjusting, setAdjusting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanKey>("weekly");
    const [changingPlan, setChangingPlan] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");

    const handleAdjustBalance = async () => {
        if (!adjustAmount || isNaN(Number(adjustAmount)) || Number(adjustAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setAdjusting(true);
        try {
            await api.admin.adjustBalance(currentUser.id, selectedUser.id, Number(adjustAmount), adjustType, adjustDescription);

            // Refresh users data
            const res = await api.admin.getUsers(currentUser.id);
            setUsers(res);
            setFilteredUsers(res);

            toast.success("Balance adjusted successfully");
            setAdjustModalOpen(false);
            setAdjustAmount("");
            setAdjustDescription("");
            setAdjustType("add");
            setSelectedUser(null);
        } catch (err) {
            toast.error("Failed to adjust balance");
            console.error(err);
        } finally {
            setAdjusting(false);
        }
    };

    const openAdjustModal = (user: any) => {
        setSelectedUser(user);
        setAdjustModalOpen(true);
    };

    const openPlanModal = (user: any) => {
        setSelectedUser(user);
        setSelectedPlan(planKeyFromValue(user.active_plan));
        setPlanModalOpen(true);
    };

    const handleChangePlan = async () => {
        if (!selectedUser) return;

        setChangingPlan(true);
        try {
            await api.admin.changeUserPlan(currentUser.id, selectedUser.id, selectedPlan);

            const res = await api.admin.getUsers(currentUser.id);
            setUsers(res);
            setFilteredUsers(res);

            toast.success("Plan changed successfully");
            setPlanModalOpen(false);
            setSelectedUser(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to change plan");
            console.error(err);
        } finally {
            setChangingPlan(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users.php?admin_id=${currentUser.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: selectedIds })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Users deleted successfully");
                setUsers(users.filter(u => !selectedIds.includes(u.id)));
                setSelectedIds([]);
                setDeleteModalOpen(false);
            } else {
                toast.error(data.error || "Failed to delete users");
            }
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (user.is_admin) {
            toast.error("Cannot delete admins");
            return;
        }
        if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users.php?admin_id=${currentUser.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("User deleted");
                setUsers(users.filter(u => u.id !== user.id));
            } else {
                toast.error(data.error || "Failed to delete");
            }
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredUsers.filter(u => !u.is_admin).length && filteredUsers.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredUsers.filter(u => !u.is_admin).map(u => u.id));
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.admin.getUsers(currentUser.id);
                setUsers(res);
                setFilteredUsers(res);
                sessionStorage.setItem("zuno_admin_users", JSON.stringify(res));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentUser.id]);

    useEffect(() => {
        let result = [...users];

        // Search
        if (searchTerm) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status Filter
        if (statusFilter !== "all") {
            result = result.filter(u => statusFilter === "admin" ? u.is_admin : !u.is_admin);
        }

        // Plan Filter
        if (planFilter !== "all") {
            if (planFilter === "paid") result = result.filter(u => u.active_plan);
            else if (planFilter === "free") result = result.filter(u => !u.active_plan);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === "name_asc") return a.name.localeCompare(b.name);
            if (sortBy === "name_desc") return b.name.localeCompare(a.name);
            return 0;
        });

        setFilteredUsers(result);
    }, [searchTerm, statusFilter, planFilter, sortBy, users]);

    if (loading && users.length === 0) return (
        <AdminLayout>
            <div className="space-y-6 pb-20 animate-pulse">
                <div className="h-20 bg-card/20 rounded-xl border border-border/40" />
                <div className="h-12 bg-card/20 rounded-xl border border-border/40" />
                <div className="h-96 bg-card/20 rounded-xl border border-border/40" />
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">User Directory</h1>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/70">
                                {users.length} Accounts
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Manage user credentials, subscription plans and wallet balances
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                className="h-9 px-3 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                onClick={() => setDeleteModalOpen(true)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Selected ({selectedIds.length})</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                            <span className="text-slate-500 font-medium">Total:</span>
                            <span className="font-semibold text-[#10243e] tabular-nums">{users.length}</span>
                        </div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-4 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search by member name or email..."
                                className="w-full pl-9 pr-8 bg-white border-slate-200/90 h-9 rounded-xl focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all text-xs text-slate-800"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                    title="Clear search"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[125px] bg-white border-slate-200/90 h-9 rounded-xl text-xs font-medium text-slate-700">
                                    <div className="flex items-center gap-1.5">
                                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                                        <SelectValue placeholder="Account" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 shadow-md">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                    <SelectItem value="member">Members</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={planFilter} onValueChange={setPlanFilter}>
                                <SelectTrigger className="w-[120px] bg-white border-slate-200/90 h-9 rounded-xl text-xs font-medium text-slate-700">
                                    <div className="flex items-center gap-1.5">
                                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                                        <SelectValue placeholder="Plan" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 shadow-md">
                                    <SelectItem value="all">All Plans</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[135px] bg-white border-slate-200/90 h-9 rounded-xl text-xs font-medium text-slate-700">
                                    <div className="flex items-center gap-1.5">
                                        <SortAsc className="h-3.5 w-3.5 text-slate-400" />
                                        <SelectValue placeholder="Sort" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 shadow-md">
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                        <span>Showing <strong className="font-semibold text-slate-700">{filteredUsers.length}</strong> of {users.length} members</span>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-orange-600 hover:underline font-medium"
                            >
                                Reset search
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                             <TableHeader className="bg-slate-50/70 border-b border-slate-200/70">
                                 <TableRow className="hover:bg-transparent">
                                     <TableHead className="w-[45px] px-4">
                                         <Checkbox
                                             checked={selectedIds.length === filteredUsers.filter(u => !u.is_admin).length && filteredUsers.length > 0}
                                             onCheckedChange={toggleSelectAll}
                                         />
                                     </TableHead>
                                     <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider">Member</TableHead>
                                     <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center">Role</TableHead>
                                     <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center">Subscription</TableHead>
                                     <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-center">Wallet</TableHead>
                                     <TableHead className="font-medium text-[11px] uppercase text-slate-500 tracking-wider text-right px-4">Actions</TableHead>
                                 </TableRow>
                             </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                                            No members match your search criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((u) => (
                                         <TableRow key={u.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                                             <TableCell className="px-4">
                                                 <Checkbox
                                                     checked={selectedIds.includes(u.id)}
                                                     onCheckedChange={() => toggleSelect(u.id)}
                                                     disabled={u.is_admin}
                                                 />
                                             </TableCell>
                                             <TableCell>
                                                 <div className="flex items-center gap-3 py-1">
                                                     <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-semibold text-xs shadow-xs ${
                                                         u.is_admin 
                                                             ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-xs' 
                                                             : 'bg-slate-100 border border-slate-200/80 text-slate-700'
                                                     }`}>
                                                         {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                                     </div>
                                                     <div className="min-w-0">
                                                         <div className="flex items-center gap-1.5">
                                                             <span className="font-semibold text-xs text-[#10243e]">{u.name}</span>
                                                             {u.is_admin && <Shield className="h-3 w-3 text-orange-500" />}
                                                         </div>
                                                         <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                                                             <Mail className="h-2.5 w-2.5 text-slate-400" /> {u.email}
                                                         </div>
                                                     </div>
                                                 </div>
                                             </TableCell>
                                             <TableCell className="text-center">
                                                 <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                                     u.is_admin 
                                                         ? 'bg-orange-50 text-orange-700 border border-orange-200/70' 
                                                         : 'bg-slate-100 text-slate-600 border border-slate-200/70'
                                                 }`}>
                                                     {u.is_admin ? 'Admin' : 'Member'}
                                                 </span>
                                             </TableCell>
                                             <TableCell className="text-center">
                                                 {u.active_plan ? (
                                                     <div className="flex flex-col items-center">
                                                         <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#10243e] uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-lg border border-amber-200/80 shadow-xs">
                                                             <Crown className="h-3 w-3 text-amber-600" /> {u.active_plan}
                                                         </span>
                                                         {u.active_plan_end_date && (
                                                             <span className="mt-0.5 text-[10px] text-slate-400">
                                                                 Till {new Date(u.active_plan_end_date).toLocaleDateString()}
                                                             </span>
                                                         )}
                                                     </div>
                                                 ) : (
                                                     (() => {
                                                         const created = new Date(u.created_at).getTime();
                                                         const now = new Date().getTime();
                                                         const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
                                                         if (hoursSinceCreation <= 24) {
                                                             return (
                                                                 <span className="inline-flex items-center gap-1 text-[10px] font-medium text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200/70">
                                                                     <Clock className="h-3 w-3 text-orange-500" /> Trial
                                                                 </span>
                                                             );
                                                         }
                                                         return (
                                                             <span className="text-[11px] text-slate-400 font-normal">
                                                                 Free User
                                                             </span>
                                                         );
                                                     })()
                                                 )}
                                             </TableCell>
                                             <TableCell className="text-center">
                                                 <div className="flex flex-col items-center gap-0.5">
                                                     <div className="flex items-center gap-1 text-xs font-semibold text-[#10243e] tabular-nums">
                                                         <Wallet className="h-3 w-3 text-emerald-600" />
                                                         ₹{parseFloat(u.current_balance || 0).toFixed(2)}
                                                     </div>
                                                     <button
                                                         type="button"
                                                         className="text-[10px] font-medium text-slate-500 hover:text-orange-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                                                         onClick={() => openAdjustModal(u)}
                                                     >
                                                         Adjust
                                                     </button>
                                                 </div>
                                             </TableCell>
                                             <TableCell className="text-right px-4">
                                                 <div className="flex items-center justify-end gap-1.5">
                                                      <button
                                                          type="button"
                                                          className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center cursor-pointer shadow-xs"
                                                          onClick={() => openPlanModal(u)}
                                                      >
                                                          <Crown className="h-3 w-3 mr-1 text-amber-500" />
                                                          Plan
                                                      </button>
                                                      {!u.is_admin && (
                                                          <button
                                                              type="button"
                                                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                                              onClick={() => handleDeleteUser(u)}
                                                              title="Delete user"
                                                          >
                                                              <Trash2 className="h-3.5 w-3.5" />
                                                          </button>
                                                      )}
                                                 </div>
                                             </TableCell>
                                         </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Adjust Balance Modal */}
                <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white border-slate-200 rounded-2xl shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-[#10243e]">
                                <Wallet className="h-4 w-4 text-orange-500" />
                                Adjust Wallet Balance
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Credit or deduct funds directly from the member's wallet account.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedUser && (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                                    <p className="text-xs font-semibold text-[#10243e]">{selectedUser.name}</p>
                                    <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                                    <p className="text-xs font-semibold text-emerald-600 mt-1">
                                        Current Balance: ₹{parseFloat(selectedUser.current_balance || 0).toFixed(2)}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="amount" className="text-xs font-medium text-slate-600">Amount (₹)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={adjustAmount}
                                            onChange={(e) => setAdjustAmount(e.target.value)}
                                            className="mt-1 bg-white border-slate-200 font-semibold"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium text-slate-600">Action Type</Label>
                                        <RadioGroup value={adjustType} onValueChange={(value) => setAdjustType(value as "add" | "remove")} className="mt-1.5 flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="add" id="add" />
                                                <Label htmlFor="add" className="text-xs font-medium cursor-pointer">Add Credit (+)</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="remove" id="remove" />
                                                <Label htmlFor="remove" className="text-xs font-medium cursor-pointer">Deduct Funds (-)</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-xs font-medium text-slate-600">Internal Note (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Reason for adjustment (e.g. Promo bonus or refund adjustment)"
                                            value={adjustDescription}
                                            onChange={(e) => setAdjustDescription(e.target.value)}
                                            className="mt-1 bg-white border-slate-200 text-xs"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setAdjustModalOpen(false)} disabled={adjusting} className="rounded-xl text-xs font-medium">
                                Cancel
                            </Button>
                            <button 
                                onClick={handleAdjustBalance} 
                                disabled={adjusting || !adjustAmount}
                                className="h-10 px-4 text-xs font-semibold text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {adjusting ? "Processing..." : "Confirm Adjustment"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Plan Modal */}
                <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white border-slate-200 rounded-2xl shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-[#10243e]">
                                <Crown className="h-4 w-4 text-orange-500" />
                                Assign Subscription Plan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Allocate or override active membership for this user.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedUser && (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                                    <p className="text-xs font-semibold text-[#10243e]">{selectedUser.name}</p>
                                    <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                                    <p className="text-xs font-medium text-slate-600 mt-1">
                                        Current Plan: <span className="font-semibold text-orange-600">{selectedUser.active_plan || "No active plan"}</span>
                                        {selectedUser.active_plan_end_date ? ` (ends ${selectedUser.active_plan_end_date})` : ""}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-xs font-medium text-slate-600">Select New Plan</Label>
                                    <Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanKey)}>
                                        <SelectTrigger className="mt-1 bg-white border-slate-200 font-medium text-xs">
                                            <SelectValue placeholder="Select plan" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200">
                                            {PLAN_OPTIONS.map((plan) => (
                                                <SelectItem key={plan.key} value={plan.key}>
                                                    {plan.label} - {plan.days} day{plan.days > 1 ? "s" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-xl border border-orange-200/70 bg-orange-50/50 p-3 text-[11px] text-slate-600 leading-relaxed">
                                    Allocating a plan will activate full day meal entries immediately for this user.
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setPlanModalOpen(false)} disabled={changingPlan} className="rounded-xl text-xs font-medium">
                                Cancel
                            </Button>
                            <button 
                                onClick={handleChangePlan} 
                                disabled={changingPlan}
                                className="h-10 px-4 text-xs font-semibold text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {changingPlan ? "Applying..." : "Activate Plan"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Delete Confirmation */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white border-slate-200 rounded-2xl shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-rose-600">
                                <ShieldAlert className="h-4 w-4" />
                                Confirm Permanent Deletion
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Are you sure you want to delete {selectedIds.length} user(s)? This will remove their plan subscriptions, profiles, and wallet balances permanently.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="rounded-xl text-xs font-medium">
                                Cancel
                            </Button>
                            <button 
                                onClick={handleBulkDelete} 
                                disabled={deleting}
                                className="h-10 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete Accounts"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;
