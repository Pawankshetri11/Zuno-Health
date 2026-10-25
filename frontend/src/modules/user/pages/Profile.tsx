import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
    User, Mail, Phone, MapPin, 
    Shield, Lock, Save, ArrowRight,
    Scale, Ruler, Activity, Heart,
    LogOut
} from "lucide-react";
import UserSidebar from "@/modules/user/components/UserSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, getLogoUrl } from "@/lib/api";
import { calculateBMI } from "@/lib/utils/diet";

const getInitialProfile = () => {
    try {
        const cached = localStorage.getItem("zuno_profile_data");
        if (cached) return JSON.parse(cached);
        const authUser = localStorage.getItem("zuno_auth_user");
        if (authUser) return JSON.parse(authUser);
    } catch (e) {
        return null;
    }
    return null;
};

const Profile = () => {
    const initialProfile = getInitialProfile();
    const [userData, setUserData] = useState<any>(initialProfile);
    const [loading, setLoading] = useState(!initialProfile);
    const [saving, setSaving] = useState(false);
    
    // Form States
    const [name, setName] = useState(initialProfile?.name || "");
    const [phone, setPhone] = useState(initialProfile?.phone || "");
    const [city, setCity] = useState(initialProfile?.city || "");
    const [newPassword, setNewPassword] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");
    const settings = JSON.parse(window.localStorage.getItem("app_public_settings") || "{}");
    const logoUrl = getLogoUrl(settings.logo_dark || "");

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser.id) {
            navigate("/auth", { replace: true });
            return;
        }
        const fetchProfile = async () => {
            try {
                const data = await api.profiles.getByUserId(currentUser.id);
                if (data) {
                    setUserData(data);
                    localStorage.setItem("zuno_profile_data", JSON.stringify(data));
                    setName((prev) => prev || data.name || "");
                    setPhone((prev) => prev || data.phone || "");
                    setCity((prev) => prev || data.city || "");
                }
            } catch (err) {
                console.error("Profile Fetch Error Details:", err);
                if (!initialProfile) {
                    toast.error("Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser.id]);

    // Handle smooth scroll to hash sections
    const { hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash, loading]);

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            await api.profiles.update(currentUser.id, {
                name,
                phone,
                city,
                password: newPassword || undefined
            });
            
            // Sync with localStorage
            const updatedProfile = await api.profiles.getByUserId(currentUser.id);
            if (updatedProfile) {
                localStorage.setItem("zuno_profile_data", JSON.stringify(updatedProfile));
                setUserData(updatedProfile);
            }

            toast.success("Profile Updated", { description: "Changes saved successfully." });
            setNewPassword("");
        } catch (err) {
            toast.error("Update Failed");
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("zuno_auth_user");
        window.location.href = "/auth";
    };

    const bmi = userData ? calculateBMI(userData.height, userData.weight) : "---";

    return (
        <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex overflow-hidden landing-display font-sans antialiased">
            <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

            <UserSidebar logoUrl={logoUrl} gender={userData?.gender} onSignOut={handleSignOut} />

            <main className="relative flex-1 min-h-screen overflow-y-auto px-4 py-8 md:px-8 pt-24 lg:pt-8 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-7">
                    
                    {/* Header Section - Clean & Focused without redundant Sign Out */}
                    <div className="space-y-1.5">
                        <h1 className="text-2xl md:text-3xl font-medium font-sans text-[#10243e] tracking-tight leading-snug">
                            Profile <span className="text-orange-500 font-medium">Settings</span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium">
                            Manage your personal credentials and nutritional health parameters.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column: Account Details & Security */}
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="lg:col-span-2 space-y-6">
                            
                            {/* Account Details Card */}
                            <Card id="settings" className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] scroll-mt-24">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)] border-t border-white/40">
                                            <Shield className="h-4.5 w-4.5" strokeWidth={2.2} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-[#10243e] uppercase tracking-wider leading-none">Account Details</h3>
                                            <p className="text-xs text-slate-500 font-medium leading-none mt-1">Keep your primary contact credentials updated.</p>
                                        </div>
                                    </div>

                                    {/* Divider with 3D groove */}
                                    <div className="border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-0.5">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="pl-10 h-11 rounded-xl text-xs font-medium border-slate-200/90 bg-white shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)] focus:border-orange-500 focus:ring-1 focus:ring-orange-400/25 text-[#10243e]" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 opacity-75">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-0.5">Email Address</Label>
                                            <div className="relative cursor-not-allowed">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input readOnly value={userData?.email} className="pl-10 h-11 rounded-xl text-xs font-mono border-slate-200/70 bg-slate-50 text-slate-500 shadow-none cursor-not-allowed" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-0.5">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    value={phone} 
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="pl-10 h-11 rounded-xl text-xs font-medium border-slate-200/90 bg-white shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)] focus:border-orange-500 focus:ring-1 focus:ring-orange-400/25 text-[#10243e]" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-0.5">City / Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input 
                                                    value={city} 
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="pl-10 h-11 rounded-xl text-xs font-medium border-slate-200/90 bg-white shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)] focus:border-orange-500 focus:ring-1 focus:ring-orange-400/25 text-[#10243e]" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Security Card */}
                            <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-slate-600 shadow-[0_1.5px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
                                            <Lock className="h-4.5 w-4.5" strokeWidth={2.2} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-[#10243e] uppercase tracking-wider leading-none">Security</h3>
                                            <p className="text-xs text-slate-500 font-medium leading-none mt-1">Set a new security password if needed.</p>
                                        </div>
                                    </div>

                                    {/* Divider with 3D groove */}
                                    <div className="border-t border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,1)]" />

                                    <div className="space-y-1.5 max-w-sm">
                                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-0.5">New Password</Label>
                                        <Input 
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-11 rounded-xl text-xs font-medium border-slate-200/90 bg-white shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.03),0_1px_0_rgba(255,255,255,1)] focus:border-orange-500 focus:ring-1 focus:ring-orange-400/25 text-[#10243e]" 
                                        />
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end pt-1">
                                <Button 
                                    type="submit"
                                    disabled={saving}
                                    className="h-11 px-8 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_3px_6px_rgba(249,115,22,0.38),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.25)] border-t border-white/40 hover:from-[#f97316] hover:to-[#ea580c] active:shadow-inner"
                                >
                                    {saving ? "Saving..." : "Save Changes"} <Save className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>

                        {/* Right Column: Health Snapshot */}
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                <div className="bg-gradient-to-b from-white to-blue-50/60 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-[#10243e] uppercase tracking-[0.16em]">Health Snapshot</h3>
                                    <span className="h-2 w-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_1px_3px_rgba(37,99,235,0.6),inset_0_0.5px_0.5px_rgba(255,255,255,0.9)] ring-1.5 ring-blue-200" />
                                </div>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex flex-col items-center justify-center text-center space-y-1.5 py-3 rounded-xl bg-gradient-to-b from-white to-slate-50/70 border border-slate-200/70 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Body Mass Index</p>
                                        <div className="text-4xl font-extrabold text-[#10243e] tracking-tight">{bmi}</div>
                                        <div className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 text-white uppercase tracking-wider shadow-[0_1.5px_3px_rgba(16,185,129,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]">
                                            Optimal Index
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-50 border border-blue-200/80 text-blue-600">
                                                    <Scale className="h-3 w-3" strokeWidth={2.2} />
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weight</span>
                                            </div>
                                            <p className="text-lg font-bold text-[#10243e]">{userData?.weight || 0} <span className="text-xs font-normal text-slate-500">kg</span></p>
                                        </div>
                                        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-600">
                                                    <Ruler className="h-3 w-3" strokeWidth={2.2} />
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Height</span>
                                            </div>
                                            <p className="text-lg font-bold text-[#10243e]">{userData?.height || 0} <span className="text-xs font-normal text-slate-500">cm</span></p>
                                        </div>
                                        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-orange-50 border border-orange-200/80 text-orange-600">
                                                    <Activity className="h-3 w-3" strokeWidth={2.2} />
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</span>
                                            </div>
                                            <p className="text-lg font-bold text-[#10243e]">{userData?.age || 25}</p>
                                        </div>
                                        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-rose-50 border border-rose-200/80 text-rose-600">
                                                    <Heart className="h-3 w-3" strokeWidth={2.2} />
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</span>
                                            </div>
                                            <p className="text-sm font-bold text-orange-600 uppercase tracking-tight">{(userData?.plan?.charAt(0).toUpperCase() + userData?.plan?.slice(1)) || 'Starter'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-10 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 text-[#10243e] text-xs font-semibold shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 hover:text-orange-600"
                                            onClick={() => window.location.href='/dashboard'}
                                        >
                                            Back to Dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-4 bg-gradient-to-b from-white to-blue-50/40 rounded-2xl border border-blue-200/70 shadow-[0_1.5px_3px_rgba(37,99,235,0.04),inset_0_1px_0_rgba(255,255,255,1)] space-y-1.5">
                                <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider leading-none">Security & Privacy</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    Your personal health data is encrypted and used strictly for personalizing your daily nutrition recommendations.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Profile;
