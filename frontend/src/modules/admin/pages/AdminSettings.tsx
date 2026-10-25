import React, { useEffect, useState } from "react";
import AdminLayout from "@/modules/admin/components/AdminLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Save, Settings2, IndianRupee, Zap, BellRing, RefreshCcw,
    CreditCard, Key, Palette, FileText, Image as ImageIcon, Upload, Loader2, Timer, Smartphone
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLogoUrl } from "@/lib/api";

const AdminSettings = () => {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
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
            toast.success("Configuration Updated", { description: "Changes synced instantly." });
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
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin h-12 w-12 text-gold" />
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                <div className="relative overflow-hidden bg-card/20 border border-border/40 rounded-xl p-5 backdrop-blur-md">
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <Settings2 className="h-6 w-6 text-gold" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground tracking-tight">System Config</h1>
                                <p className="text-muted-foreground text-xs font-medium">Manage API Keys & Theming</p>
                            </div>
                        </div>
                        <Button onClick={handleSaveSettings} disabled={saving} variant="luxury" className="h-10 px-6 font-bold uppercase tracking-widest text-xs">
                            {saving ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" /> : <Save className="h-3.5 w-3.5 mr-2" />}
                            Save Config
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-card/50 p-1 rounded-xl border border-border/30 h-14 w-full justify-start gap-2 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="general" className="h-10 px-6 rounded-lg data-[state=active]:bg-gold data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-xs">General</TabsTrigger>
                        <TabsTrigger value="apis" className="h-10 px-6 rounded-lg data-[state=active]:bg-gold data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-xs">API Keys</TabsTrigger>
                        <TabsTrigger value="payments" className="h-10 px-6 rounded-lg data-[state=active]:bg-gold data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-xs">Payments</TabsTrigger>
                        <TabsTrigger value="theme" className="h-10 px-6 rounded-lg data-[state=active]:bg-gold data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-xs">Theme & Brand</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1 text-gold">
                                        <IndianRupee className="h-4 w-4" />
                                        <CardTitle className="text-lg font-bold">Pricing Strategy</CardTitle>
                                    </div>
                                    <CardDescription>Adjust plan pricing.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {['Daily', 'Weekly', 'Monthly'].map((plan) => (
                                        <div key={plan} className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">{plan} Price</Label>
                                                <Input
                                                    type="number"
                                                    value={settings[`price${plan}`] || ''}
                                                    onChange={(e) => setSettings({ ...settings, [`price${plan}`]: e.target.value })}
                                                    className="bg-background/50 border-border/50 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">Strike Price</Label>
                                                <Input
                                                    type="number"
                                                    value={settings[`originalPrice${plan}`] || ''}
                                                    onChange={(e) => setSettings({ ...settings, [`originalPrice${plan}`]: e.target.value })}
                                                    className="bg-background/20 border-border/20 text-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>


                            <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1 text-gold">
                                        <Zap className="h-4 w-4" />
                                        <CardTitle className="text-lg font-bold">Process Automation</CardTitle>
                                    </div>
                                    <CardDescription>Control AI generation and unlocking logic.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                                        <div className="flex items-center gap-3 text-gold">
                                            <RefreshCcw className="h-4 w-4" />
                                            <div className="text-foreground">
                                                <Label className="font-bold">Allow Regeneration</Label>
                                                <p className="text-[10px] text-muted-foreground">User can re-generate daily meals.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.enableRegenerate === "1"}
                                            onCheckedChange={(c) => setSettings({ ...settings, enableRegenerate: c ? "1" : "0" })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30">
                                        <div className="flex items-center gap-3 text-gold">
                                            <Zap className="h-4 w-4" />
                                            <div className="text-foreground">
                                                <Label className="font-bold">Enable Dummy Data</Label>
                                                <p className="text-[10px] text-muted-foreground">Show "Test: Fill Data" buttons in Get Started.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings.enableDummyData === "1"}
                                            onCheckedChange={(c) => setSettings({ ...settings, enableDummyData: c ? "1" : "0" })}
                                        />
                                    </div>

                                    <div className="p-4 rounded-xl bg-secondary/10 border border-border/30 space-y-4">
                                        <div className="flex items-center justify-between text-gold">
                                            <Label className="font-bold text-foreground">Metabolic Lock (Timer)</Label>
                                            <Switch
                                                checked={settings.enableGenerationTimer === "1"}
                                                onCheckedChange={(c) => setSettings({ ...settings, enableGenerationTimer: c ? "1" : "0" })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase opacity-60">Min Stall (Hrs)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={settings.timerMinHours || ''}
                                                    onChange={(e) => setSettings({ ...settings, timerMinHours: e.target.value })}
                                                    className="bg-background/30 border-border/50 font-bold h-8 text-xs font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase opacity-60">Max Stall (Hrs)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={settings.timerMaxHours || ''}
                                                    onChange={(e) => setSettings({ ...settings, timerMaxHours: e.target.value })}
                                                    className="bg-background/30 border-border/50 font-bold h-8 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gold">
                                            <Timer className="h-4 w-4" />
                                            <CardTitle className="text-lg font-bold">Limited Time Offer</CardTitle>
                                        </div>
                                        <Switch
                                            checked={settings.offerEnabled === "1"}
                                            onCheckedChange={(c) => setSettings({ ...settings, offerEnabled: c ? "1" : "0" })}
                                        />
                                    </div>
                                    <CardDescription>Show countdown timer on pricing cards.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase opacity-60">Offer Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            value={settings.offerStartDate || ''}
                                            onChange={(e) => setSettings({ ...settings, offerStartDate: e.target.value })}
                                            className="bg-background/50 border-border/50 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase opacity-60">Duration (Days)</Label>
                                        <Input
                                            type="number"
                                            value={settings.offerDurationDays || ''}
                                            onChange={(e) => setSettings({ ...settings, offerDurationDays: e.target.value })}
                                            className="bg-background/50 border-border/50 font-bold"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1 text-gold">
                                        <Smartphone className="h-4 w-4" />
                                        <CardTitle className="text-lg font-bold">Mobile App Links</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Store URLs shown in the user sidebar. Leave blank to redirect users to the "Coming Soon" page instead.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase opacity-60">Google Play Store URL</Label>
                                        <Input
                                            type="url"
                                            value={settings.play_store_url || ''}
                                            onChange={(e) => setSettings({ ...settings, play_store_url: e.target.value })}
                                            placeholder="https://play.google.com/store/apps/details?id=..."
                                            className="bg-background/50 border-border/50 font-mono text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase opacity-60">Apple App Store URL</Label>
                                        <Input
                                            type="url"
                                            value={settings.app_store_url || ''}
                                            onChange={(e) => setSettings({ ...settings, app_store_url: e.target.value })}
                                            placeholder="https://apps.apple.com/in/app/..."
                                            className="bg-background/50 border-border/50 font-mono text-xs"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        Tip: Blank fields automatically route to <span className="text-gold">/coming-soon</span> until the app is live.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="apis" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-gold">
                                    <Key className="h-5 w-5" />
                                    <CardTitle>API Integrations</CardTitle>
                                </div>
                                <CardDescription>Securely manage your third-party keys.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>OpenAI API Key</Label>
                                        <Input
                                            type="password"
                                            value={settings.openai_api_key || ''}
                                            onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
                                            placeholder="sk-..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gemini API Key</Label>
                                        <Input
                                            type="password"
                                            value={settings.gemini_api_key || ''}
                                            onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                                            placeholder="AIzaSy..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Google Client ID</Label>
                                        <Input
                                            value={settings.google_client_id || ''}
                                            onChange={(e) => setSettings({ ...settings, google_client_id: e.target.value })}
                                            placeholder="...apps.googleusercontent.com"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </TabsContent>

                    <TabsContent value="payments" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <Card className={`border-border/50 bg-card/30 ${settings.enable_cashfree === "1" ? 'border-emerald-500/30' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg">Cashfree</CardTitle>
                                    <Switch
                                        checked={settings.enable_cashfree === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_cashfree: c ? "1" : "0" })}
                                    />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input value={settings.cashfree_app_id || ''} onChange={(e) => setSettings({ ...settings, cashfree_app_id: e.target.value })} placeholder="App ID" />
                                    <Input type="password" value={settings.cashfree_secret_key || ''} onChange={(e) => setSettings({ ...settings, cashfree_secret_key: e.target.value })} placeholder="Secret Key" />
                                </CardContent>
                            </Card>

                            <Card className={`border-border/50 bg-card/30 ${settings.enable_razorpay === "1" ? 'border-primary/30' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg">Razorpay</CardTitle>
                                    <Switch
                                        checked={settings.enable_razorpay === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_razorpay: c ? "1" : "0" })}
                                    />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input value={settings.razorpay_key_id || ''} onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })} placeholder="Key ID" />
                                    <Input type="password" value={settings.razorpay_key_secret || ''} onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value })} placeholder="Key Secret" />
                                </CardContent>
                            </Card>

                            <Card className={`border-border/50 bg-card/30 ${settings.enable_paypal === "1" ? 'border-blue-500/30' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg">PayPal</CardTitle>
                                    <Switch
                                        checked={settings.enable_paypal === "1"}
                                        onCheckedChange={(c) => setSettings({ ...settings, enable_paypal: c ? "1" : "0" })}
                                    />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input value={settings.paypal_client_id || ''} onChange={(e) => setSettings({ ...settings, paypal_client_id: e.target.value })} placeholder="Client ID" />
                                    <Input type="password" value={settings.paypal_client_secret || ''} onChange={(e) => setSettings({ ...settings, paypal_client_secret: e.target.value })} placeholder="Client Secret" />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="theme" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-gold">
                                    <Palette className="h-5 w-5" />
                                    <CardTitle>Branding & Appearance</CardTitle>
                                </div>
                                <CardDescription>Customize colors and logos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="font-bold uppercase text-[10px] tracking-widest text-gold">Light Mode Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-lg bg-white border border-border/20 flex items-center justify-center overflow-hidden">
                                                {logoPreviewLight ? <img src={logoPreviewLight} className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-muted-foreground/30 h-8 w-8" />}
                                            </div>
                                            <Input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'light')} className="text-xs" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="font-bold uppercase text-[10px] tracking-widest text-gold">Dark Mode Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-lg bg-slate-900 border border-border/20 flex items-center justify-center overflow-hidden">
                                                {logoPreviewDark ? <img src={logoPreviewDark} className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-muted-foreground/30 h-8 w-8" />}
                                            </div>
                                            <Input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'dark')} className="text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
