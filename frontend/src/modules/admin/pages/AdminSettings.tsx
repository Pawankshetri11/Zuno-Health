import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Save, IndianRupee, Zap, RefreshCcw,
    Key, Palette, Image as ImageIcon, Loader2, Timer
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLogoUrl } from "@/lib/api";

const AdminSettings = () => {
    const [settings, setSettings] = useState<any>(() => {
        try { return JSON.parse(sessionStorage.getItem("zuno_admin_settings") || "{}"); } catch { return {}; }
    });
    const [loading, setLoading] = useState(() => !sessionStorage.getItem("zuno_admin_settings"));
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [logoPreviewLight, setLogoPreviewLight] = useState<string | null>(null);
    const [logoPreviewDark, setLogoPreviewDark] = useState<string | null>(null);

    const user = JSON.parse(localStorage.getItem("zuno_auth_user") || "{}");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resSettings = await api.admin.getSettings(user.id);
                setSettings(resSettings);
                sessionStorage.setItem("zuno_admin_settings", JSON.stringify(resSettings));
                if (resSettings.logo_light) setLogoPreviewLight(getLogoUrl(resSettings.logo_light));
                if (resSettings.logo_dark) setLogoPreviewDark(getLogoUrl(resSettings.logo_dark));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await api.admin.updateSettings(user.id, settings);
            const updatedConfig = await api.config.fetchPublic();
            const { syncConfig } = await import("@/lib/api");
            syncConfig(updatedConfig);
            window.dispatchEvent(new Event("theme-loaded"));
            toast.success("Configuration Updated", { description: "Changes synced instantly across platform." });
        } catch (err) {
            toast.error("Save Failed");
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'light' | 'dark') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (type === 'light') setLogoPreviewLight(ev.target?.result as string);
            else setLogoPreviewDark(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
        setSettings({ ...settings, [`logo_${type}`]: file });
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
                <span className="text-xs font-medium text-slate-500">Loading system settings...</span>
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
                            <h1 className="text-2xl font-semibold text-[#10243e] tracking-tight">System Settings</h1>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70">
                                Configuration
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Manage API keys, payment gateways, brand assets & business rules
                        </p>
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="h-10 px-5 text-xs font-semibold text-white bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />
                        ) : (
                            <Save className="h-3.5 w-3.5 mr-2" />
                        )}
                        Save Changes
                    </button>
                </div>

                {/* Tabs Container */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 h-auto w-full sm:w-auto inline-flex items-center justify-start gap-1 overflow-x-auto no-scrollbar shadow-xs">
                        <TabsTrigger 
                            value="general" 
                            className="h-9 px-4 rounded-lg font-medium text-xs tracking-wide text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:font-semibold data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-slate-200/80 transition-all cursor-pointer"
                        >
                            General & Pricing
                        </TabsTrigger>
                        <TabsTrigger 
                            value="apis" 
                            className="h-9 px-4 rounded-lg font-medium text-xs tracking-wide text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:font-semibold data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-slate-200/80 transition-all cursor-pointer"
                        >
                            API Integrations
                        </TabsTrigger>
                        <TabsTrigger 
                            value="payments" 
                            className="h-9 px-4 rounded-lg font-medium text-xs tracking-wide text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:font-semibold data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-slate-200/80 transition-all cursor-pointer"
                        >
                            Payment Gateways
                        </TabsTrigger>
                        <TabsTrigger 
                            value="theme" 
                            className="h-9 px-4 rounded-lg font-medium text-xs tracking-wide text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:font-semibold data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-slate-200/80 transition-all cursor-pointer"
                        >
                            Theme & Brand
                        </TabsTrigger>
                    </TabsList>

                    {/* GENERAL TAB */}
                    <TabsContent value="general" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Pricing Strategy */}
                            <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] flex items-center justify-center text-white shadow-xs">
                                        <IndianRupee className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-[#10243e]">Plan Pricing Strategy</h3>
                                        <p className="text-xs text-slate-500 font-normal">Live prices and strikeout discounts</p>
                                    </div>
                                </div>
                                <div className="space-y-3.5">
                                    {['Daily', 'Weekly', 'Monthly'].map((plan) => (
                                        <div key={plan} className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-200/70">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-slate-600">{plan} Price (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={settings[`price${plan}`] || ''}
                                                    onChange={(e) => setSettings({ ...settings, [`price${plan}`]: e.target.value })}
                                                    className="bg-white border-slate-200 font-medium text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-slate-400">Strike Price (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={settings[`originalPrice${plan}`] || ''}
                                                    onChange={(e) => setSettings({ ...settings, [`originalPrice${plan}`]: e.target.value })}
                                                    className="bg-white border-slate-200 text-slate-400 line-through focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Automation & Controls */}
                            <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-[#10243e]">Process Automation</h3>
                                        <p className="text-xs text-slate-500 font-normal">Plan generation and user unlock gates</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                                        <div className="flex items-center gap-3">
                                            <RefreshCcw className="h-4 w-4 text-orange-500" />
                                            <div>
                                                <Label className="text-xs font-medium text-[#10243e] cursor-pointer">Allow Plan Regeneration</Label>
                                                <p className="text-xs text-slate-500">Subscribers can request meal regenerations</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.enableRegenerate === "1"}
                                            onCheckedChange={(c) => setSettings({ ...settings, enableRegenerate: c ? "1" : "0" })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-4 w-4 text-orange-500" />
                                            <div>
                                                <Label className="text-xs font-medium text-[#10243e] cursor-pointer">Demo / Test Auto-fill</Label>
                                                <p className="text-xs text-slate-500">Show sample data buttons during onboarding</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.enableDummyData === "1"}
                                            onCheckedChange={(c) => setSettings({ ...settings, enableDummyData: c ? "1" : "0" })}
                                        />
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-xs font-medium text-[#10243e] cursor-pointer">Metabolic Lock Delay</Label>
                                                <p className="text-xs text-slate-500">Simulate nutritional calculation time</p>
                                            </div>
                                            <Switch
                                                checked={settings.enableGenerationTimer === "1"}
                                                onCheckedChange={(c) => setSettings({ ...settings, enableGenerationTimer: c ? "1" : "0" })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-slate-500">Min Stall (Hrs)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={settings.timerMinHours || ''}
                                                    onChange={(e) => setSettings({ ...settings, timerMinHours: e.target.value })}
                                                    className="bg-white border-slate-200 font-mono font-medium text-xs text-[#10243e]"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-slate-500">Max Stall (Hrs)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={settings.timerMaxHours || ''}
                                                    onChange={(e) => setSettings({ ...settings, timerMaxHours: e.target.value })}
                                                    className="bg-white border-slate-200 font-mono font-medium text-xs text-[#10243e]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Limited Time Offer */}
                            <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-xs">
                                            <Timer className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-[#10243e]">Limited Time Promotion</h3>
                                            <p className="text-xs text-slate-500 font-normal">Countdown timer displayed on checkout</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.offerEnabled === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, offerEnabled: c ? "1" : "0" })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Offer Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            value={settings.offerStartDate || ''}
                                            onChange={(e) => setSettings({ ...settings, offerStartDate: e.target.value })}
                                            className="bg-white border-slate-200 font-medium text-xs text-[#10243e]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Duration (Days)</Label>
                                        <Input
                                            type="number"
                                            value={settings.offerDurationDays || ''}
                                            onChange={(e) => setSettings({ ...settings, offerDurationDays: e.target.value })}
                                            className="bg-white border-slate-200 font-medium text-xs text-[#10243e]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* API KEYS TAB */}
                    <TabsContent value="apis" className="space-y-6">
                        <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
                            <div className="flex items-center gap-3 pb-3.5 mb-5 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                                    <Key className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[#10243e]">Third-Party API Credentials</h3>
                                    <p className="text-xs text-slate-500 font-normal">Safely configure machine learning and OAuth credentials</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-700">OpenAI API Secret Key</Label>
                                    <Input
                                        type="password"
                                        value={settings.openai_api_key || ''}
                                        onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
                                        placeholder="sk-..."
                                        className="bg-white border-slate-200 font-mono text-xs text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-slate-700">Google Gemini API Key</Label>
                                    <Input
                                        type="password"
                                        value={settings.gemini_api_key || ''}
                                        onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                                        placeholder="AIzaSy..."
                                        className="bg-white border-slate-200 font-mono text-xs text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-xs font-medium text-slate-700">Google OAuth Client ID</Label>
                                    <Input
                                        value={settings.google_client_id || ''}
                                        onChange={(e) => setSettings({ ...settings, google_client_id: e.target.value })}
                                        placeholder="...apps.googleusercontent.com"
                                        className="bg-white border-slate-200 font-mono text-xs text-[#10243e] focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* PAYMENTS TAB */}
                    <TabsContent value="payments" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Cashfree */}
                            <div className={`bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border ${settings.enable_cashfree === "1" ? 'border-emerald-300 ring-1 ring-emerald-300/40' : 'border-slate-200/90'} rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-3.5`}>
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div>
                                        <h4 className="font-semibold text-sm text-[#10243e]">Cashfree Payments</h4>
                                        <p className="text-xs text-slate-400">Domestic UPI & Cards</p>
                                    </div>
                                    <Switch
                                        checked={settings.enable_cashfree === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_cashfree: c ? "1" : "0" })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">App ID</Label>
                                        <Input 
                                            value={settings.cashfree_app_id || ''} 
                                            onChange={(e) => setSettings({ ...settings, cashfree_app_id: e.target.value })} 
                                            placeholder="App ID" 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Secret Key</Label>
                                        <Input 
                                            type="password" 
                                            value={settings.cashfree_secret_key || ''} 
                                            onChange={(e) => setSettings({ ...settings, cashfree_secret_key: e.target.value })} 
                                            placeholder="Secret Key" 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Razorpay */}
                            <div className={`bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border ${settings.enable_razorpay === "1" ? 'border-orange-300 ring-1 ring-orange-300/40' : 'border-slate-200/90'} rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-3.5`}>
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div>
                                        <h4 className="font-semibold text-sm text-[#10243e]">Razorpay</h4>
                                        <p className="text-xs text-slate-400">Standard Gateway</p>
                                    </div>
                                    <Switch
                                        checked={settings.enable_razorpay === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_razorpay: c ? "1" : "0" })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Key ID</Label>
                                        <Input 
                                            value={settings.razorpay_key_id || ''} 
                                            onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })} 
                                            placeholder="rzp_live_..." 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Key Secret</Label>
                                        <Input 
                                            type="password" 
                                            value={settings.razorpay_key_secret || ''} 
                                            onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value })} 
                                            placeholder="Key Secret" 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PayPal */}
                            <div className={`bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border ${settings.enable_paypal === "1" ? 'border-blue-300 ring-1 ring-blue-300/40' : 'border-slate-200/90'} rounded-2xl p-5 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-3.5`}>
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div>
                                        <h4 className="font-semibold text-sm text-[#10243e]">PayPal</h4>
                                        <p className="text-xs text-slate-400">International Currency</p>
                                    </div>
                                    <Switch
                                        checked={settings.enable_paypal === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_paypal: c ? "1" : "0" })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Client ID</Label>
                                        <Input 
                                            value={settings.paypal_client_id || ''} 
                                            onChange={(e) => setSettings({ ...settings, paypal_client_id: e.target.value })} 
                                            placeholder="Client ID" 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Client Secret</Label>
                                        <Input 
                                            type="password" 
                                            value={settings.paypal_client_secret || ''} 
                                            onChange={(e) => setSettings({ ...settings, paypal_client_secret: e.target.value })} 
                                            placeholder="Client Secret" 
                                            className="bg-white border-slate-200 font-mono text-xs text-[#10243e]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* THEME & BRAND TAB */}
                    <TabsContent value="theme" className="space-y-6">
                        <div className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
                                    <Palette className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[#10243e]">Branding & Visual Assets</h3>
                                    <p className="text-xs text-slate-500 font-normal">Upload primary logo variations for light and dark contexts</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2.5 p-4 rounded-xl bg-slate-50/60 border border-slate-200/70">
                                    <Label className="font-medium text-xs text-slate-600">Light Mode Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden p-1">
                                            {logoPreviewLight ? (
                                                <img src={logoPreviewLight} className="max-h-full max-w-full object-contain" alt="Light logo preview" />
                                            ) : (
                                                <ImageIcon className="text-slate-300 h-7 w-7" />
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'light')} className="text-xs bg-white border-slate-200 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="space-y-2.5 p-4 rounded-xl bg-slate-50/60 border border-slate-200/70">
                                    <Label className="font-medium text-xs text-slate-600">Dark Mode Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-xl bg-slate-900 border border-slate-700 shadow-xs flex items-center justify-center overflow-hidden p-1">
                                            {logoPreviewDark ? (
                                                <img src={logoPreviewDark} className="max-h-full max-w-full object-contain" alt="Dark logo preview" />
                                            ) : (
                                                <ImageIcon className="text-slate-500 h-7 w-7" />
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'dark')} className="text-xs bg-white border-slate-200 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
