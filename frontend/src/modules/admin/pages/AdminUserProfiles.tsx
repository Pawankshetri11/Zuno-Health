import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    UserCircle, Edit, Trash2, Loader2,
    Mail, Target, Search, Crown, Download, Clock, X
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminUserProfiles = () => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [goalFilter, setGoalFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name_asc");
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");

    const fetchProfiles = async () => {
        try {
            const res = await api.admin.getUserProfiles(currentUser.id);
            setProfiles(res);
            setFilteredProfiles(res);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [currentUser.id]);

    useEffect(() => {
        let result = [...profiles];

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.email.toLowerCase().includes(term)
            );
        }

        // Goal Filter
        if (goalFilter !== "all") {
            result = result.filter(p => p.goal === goalFilter);
        }

        // Plan Filter
        if (planFilter !== "all") {
            if (planFilter === "paid") result = result.filter(p => p.active_plan && p.active_plan !== "Trial");
            else if (planFilter === "free") result = result.filter(p => !p.active_plan || p.active_plan === "Trial");
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "name_asc") return a.name.localeCompare(b.name);
            if (sortBy === "name_desc") return b.name.localeCompare(a.name);
            if (sortBy === "age_high") return b.age - a.age;
            if (sortBy === "age_low") return a.age - b.age;
            if (sortBy === "weight_high") return b.weight - a.weight;
            if (sortBy === "weight_low") return a.weight - b.weight;
            return 0;
        });

        setFilteredProfiles(result);
    }, [searchTerm, goalFilter, planFilter, sortBy, profiles]);

    const handleEditProfile = (profile: any) => {
        navigate(`/admin/profile-edit/${profile.id}`);
    };

    const exportToCSV = () => {
        if (filteredProfiles.length === 0) return;
        
        const headers = [
            "Name", "Email", "WhatsApp", "Age", "Gender", "Height(cm)", "Weight(kg)", "Primary_Goal", "Plan",
            "City", "Occupation", "Work_Hours", "Marital_Status", "Children", "Living_Situation",
            "Fitness_Goals", "Hormonal_Goals", "Hormonal_Male_Specific", "Hormonal_Female_Specific", "Other_Conditions", "Timeline", "Exp_Weight", "Motivation",
            "Metabolic_Conditions", "Digestive_Health", "Digestive_Overall", "Menstrual_Regularity", "Cycle_Length", "Period_Duration", "Period_Flow", "Period_Symptoms", "PCOS_Status", "Pregnancy_Status",
            "Supplements", "Past_Surgeries", "Alcohol", "Smoking", "Wake_Up", "Sleep_Time", "Sleep_Duration", "Sleep_Quality", "Daily_Movement", "Stress_Level", "Water_Intake",
            "Currently_Exercise", "Exercise_Type", "Exercise_Freq", "Diet_Type", "Disliked_Foods", "Food_Allergies", "Food_Allergies_Other", "Tea_Coffee_Intake", "Outside_Food", "Spice_Tolerance",
            "Breakfast_Time", "Mid_Morning_Snack", "Lunch_Time", "Evening_Snack", "Dinner_Time", "Late_Night_Eating", "Who_Cooks", "Kitchen_Appliances", "Food_Budget", "Special_Instructions"
        ];

        const rows = filteredProfiles.map(p => {
            const ext = p.extended_data || {};
            const joinArr = (val: any) => Array.isArray(val) ? val.join("; ") : (val || "");

            return [
                p.name || "",
                p.email || "",
                p.phone || "",
                p.age || "",
                p.gender || "",
                p.height || "",
                p.weight || "",
                p.goal || "",
                p.active_plan || "Trial",
                ext.city || "",
                ext.occupation || "",
                ext.workingHours || "",
                ext.maritalStatus || "",
                ext.children || "",
                ext.livingSituation || "",
                joinArr(ext.primaryFitnessGoals),
                joinArr(ext.hormonalGoals),
                joinArr(ext.hormonalMaleSpecific),
                joinArr(ext.hormonalFemaleSpecific),
                joinArr(ext.otherConditions),
                ext.targetTimeline || "",
                ext.expectedWeight || "",
                ext.motivationLevel || "",
                joinArr(ext.lifestyleMetabolic),
                joinArr(ext.digestiveHealth),
                ext.digestiveHealthOverall || "",
                ext.menstrualRegularity || "",
                ext.averageCycleLength || "",
                ext.periodDuration || "",
                ext.menstrualFlow || "",
                joinArr(ext.periodSymptoms),
                ext.pcos || "",
                ext.pregnancyStatus || "",
                joinArr(ext.currentSupplements),
                ext.pastSurgeries || "",
                ext.alcoholConsumption || "",
                ext.smokingHabit || "",
                ext.wakeUpTime || "",
                ext.sleepTime || "",
                ext.sleepDuration || "",
                ext.sleepQuality || "",
                ext.dailyMovementLevel || "",
                ext.stressLevel || "",
                ext.waterIntake || "",
                ext.currentlyExercise || "",
                joinArr(ext.exerciseTypes),
                ext.exerciseFrequency || "",
                joinArr(ext.dietType),
                ext.foodsDislike || "",
                joinArr(ext.foodAllergies),
                ext.foodAllergiesOther || "",
                ext.teaCoffeeIntake || "",
                ext.outsideFood || "",
                ext.spiceTolerance || "",
                ext.breakfastTime || "",
                ext.midMorningSnackTime || "",
                ext.lunchTime || "",
                ext.eveningSnackTime || "",
                ext.dinnerTime || "",
                ext.lateNightEating || "",
                ext.whoCooksMeals || "",
                joinArr(ext.kitchenAppliances),
                ext.budgetForFood || "",
                ext.specialInstructions || ""
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${String(val || "").replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `zuno_master_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteProfile = async (profileId: string) => {
        if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
            return;
        }

        try {
            await api.admin.deleteUserProfile(currentUser.id, profileId);
            toast.success("Profile deleted successfully!");
            fetchProfiles();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete profile");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProfiles.length === 0) {
            toast.error("Please select profiles to delete");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedProfiles.length} profile(s)? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        try {
            for (const profileId of selectedProfiles) {
                await api.admin.deleteUserProfile(currentUser.id, profileId);
            }
            toast.success(`${selectedProfiles.length} profile(s) deleted successfully!`);
            setSelectedProfiles([]);
            fetchProfiles();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete profiles");
        } finally {
            setDeleting(false);
        }
    };

    const toggleProfileSelection = (profileId: string) => {
        setSelectedProfiles(prev =>
            prev.includes(profileId)
                ? prev.filter(id => id !== profileId)
                : [...prev, profileId]
        );
    };

    const selectAllProfiles = () => {
        if (selectedProfiles.length === filteredProfiles.length) {
            setSelectedProfiles([]);
        } else {
            setSelectedProfiles(filteredProfiles.map(p => p.id));
        }
    };

    if (loading && profiles.length === 0) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
                <span className="text-xs font-semibold text-slate-500">Loading user profiles...</span>
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
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">Health Profiles</h1>
                            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/80">
                                Detailed Records
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Inspect comprehensive biometric data, medical history and dietary habits
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedProfiles.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={deleting}
                                className="h-9 px-3.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all flex items-center cursor-pointer disabled:opacity-50"
                            >
                                {deleting ? (
                                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Delete ({selectedProfiles.length})
                            </button>
                        )}
                        <button
                            onClick={exportToCSV}
                            className="h-9 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-all flex items-center cursor-pointer"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                            Export CSV
                        </button>
                        <div className="px-3.5 py-1 text-center bg-white border border-slate-200/90 rounded-xl shadow-xs">
                            <p className="text-[10px] font-medium uppercase text-slate-400 tracking-wider">Total Profiles</p>
                            <p className="text-lg font-semibold tabular-nums text-[#10243e] leading-tight">{profiles.length}</p>
                        </div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 pr-9 h-9 bg-slate-50/70 border-slate-200 text-xs font-normal text-[#10243e] rounded-xl focus-visible:ring-orange-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                                    title="Clear search"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Select value={goalFilter} onValueChange={setGoalFilter}>
                                <SelectTrigger className="w-[140px] bg-slate-50/70 border-slate-200 h-9 rounded-xl text-xs font-medium text-[#10243e]">
                                    <div className="flex items-center gap-1.5">
                                        <Target className="h-3.5 w-3.5 text-orange-500" />
                                        <SelectValue placeholder="Goal" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="all">All Goals</SelectItem>
                                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={planFilter} onValueChange={setPlanFilter}>
                                <SelectTrigger className="w-[130px] bg-slate-50/70 border-slate-200 h-9 rounded-xl text-xs font-medium text-[#10243e]">
                                    <div className="flex items-center gap-1.5">
                                        <Crown className="h-3.5 w-3.5 text-orange-500" />
                                        <SelectValue placeholder="Plan" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="all">All Plans</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="free">Trial</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px] bg-slate-50/70 border-slate-200 h-9 rounded-xl text-xs font-medium text-[#10243e]">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                                    <SelectItem value="age_high">Highest Age</SelectItem>
                                    <SelectItem value="age_low">Lowest Age</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Showing <strong className="font-semibold text-slate-700">{filteredProfiles.length}</strong> of {profiles.length} health profiles</span>
                        {(searchTerm || goalFilter !== "all" || planFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setGoalFilter("all");
                                    setPlanFilter("all");
                                }}
                                className="text-orange-600 hover:text-orange-700 font-medium text-xs cursor-pointer"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Profiles Table */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                                    <th className="py-3 px-4 w-12">
                                        <Checkbox
                                            checked={selectedProfiles.length === filteredProfiles.length && filteredProfiles.length > 0}
                                            onCheckedChange={selectAllProfiles}
                                            className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                        />
                                    </th>
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4 text-center">Age / Gender</th>
                                    <th className="py-3 px-4 text-center">Height / Weight</th>
                                    <th className="py-3 px-4 text-center">Primary Goal</th>
                                    <th className="py-3 px-4 text-center">Plan</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProfiles.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-xs">
                                            No health profiles match your filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProfiles.map((profile) => (
                                        <tr key={profile.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 w-12">
                                                <Checkbox
                                                    checked={selectedProfiles.includes(profile.id)}
                                                    onCheckedChange={() => toggleProfileSelection(profile.id)}
                                                    className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                                />
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center font-semibold text-sm shadow-xs">
                                                        {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[#10243e]">
                                                            {profile.name}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                                                            <Mail className="h-3 w-3" /> {profile.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="font-medium text-[#10243e]">{profile.age} yrs</div>
                                                <div className="text-[10px] font-normal text-slate-400 uppercase">{profile.gender}</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="font-medium text-[#10243e]">{profile.height} cm</div>
                                                <div className="text-[10px] font-normal text-slate-400">{profile.weight} kg</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
                                                    {profile.goal || "General"}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                {profile.active_plan && profile.active_plan !== "Trial" ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                                        <Crown className="h-3 w-3 text-emerald-600" /> {profile.active_plan}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
                                                        <Clock className="h-3 w-3 text-amber-600" /> Trial
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleEditProfile(profile)}
                                                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Edit className="h-3 w-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProfile(profile.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete profile"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserProfiles;
