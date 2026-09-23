"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  Palette,
  Eye,
  RefreshCw,
  MapPin,
  Award,
  Sparkles,
  BookOpen,
  User,
  Plus,
  Trash2,
  Check,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Globe,
  Building2,
  CheckCircle,
  Lock,
  Key,
  ShieldAlert,
  EyeOff
} from "lucide-react";
import SchoolLogo from "@/components/common/SchoolLogo";
import { schoolInfo } from "@/data/schoolInfo";
import { defaultSchoolSettings, saveSchoolSettingsCloud, SchoolSettingsData } from "@/hooks/useSchoolSettings";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getGoogleMapsEmbedUrl, getGoogleMapsNavigationUrl } from "@/lib/maps";
import { setAdminPassword, getAdminPassword, DEFAULT_ADMIN_PASSWORD } from "@/components/admin/AdminAuthGuard";
import Swal from "sweetalert2";

type SettingsTab = "hero" | "branding" | "general" | "vision" | "director" | "contact" | "operations" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("hero");
  const [saved, setSaved] = useState(false);

  // Admin password change states
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State initialized with defaults
  const [formData, setFormData] = useState({
    name: defaultSchoolSettings.name,
    nameEn: defaultSchoolSettings.nameEn,
    schoolCode: defaultSchoolSettings.schoolCode,
    schoolCode10: defaultSchoolSettings.schoolCode10,
    smisCode8: defaultSchoolSettings.smisCode8,
    obecCode6: defaultSchoolSettings.obecCode6,
    affiliation: defaultSchoolSettings.affiliation,
    subAffiliation: defaultSchoolSettings.subAffiliation,
    affiliationBadge: defaultSchoolSettings.affiliationBadge,
    province: defaultSchoolSettings.province,
    district: defaultSchoolSettings.district,
    subDistrict: defaultSchoolSettings.subDistrict,
    villageNo: defaultSchoolSettings.villageNo,
    postalCode: defaultSchoolSettings.postalCode,
    phone: defaultSchoolSettings.phone,
    email: defaultSchoolSettings.email,
    facebook: defaultSchoolSettings.facebook,
    lineOfficial: defaultSchoolSettings.lineOfficial,
    mapsUrl: defaultSchoolSettings.mapsUrl,
    schoolLevels: defaultSchoolSettings.schoolLevels,
    establishedYear: defaultSchoolSettings.establishedYear,
    schoolGroup: defaultSchoolSettings.schoolGroup,
    localGov: defaultSchoolSettings.localGov,
    distanceFromOffice: defaultSchoolSettings.distanceFromOffice,
    distanceFromDistrict: defaultSchoolSettings.distanceFromDistrict,
    historyText: defaultSchoolSettings.historyText,
    motto: defaultSchoolSettings.motto,
    vision: defaultSchoolSettings.vision,
    welcomeMessage: defaultSchoolSettings.welcomeMessage,
    heroBtn1Text: defaultSchoolSettings.heroBtn1Text,
    heroBtn1Url: defaultSchoolSettings.heroBtn1Url,
    heroBtn2Text: defaultSchoolSettings.heroBtn2Text,
    heroBtn2Url: defaultSchoolSettings.heroBtn2Url,
    heroBtn3Text: defaultSchoolSettings.heroBtn3Text,
    heroBtn3Url: defaultSchoolSettings.heroBtn3Url,
    heroImageUrl: defaultSchoolSettings.heroImageUrl,
    heroBadge1Label: defaultSchoolSettings.heroBadge1Label,
    heroBadge1Value: defaultSchoolSettings.heroBadge1Value,
    heroBadge2Label: defaultSchoolSettings.heroBadge2Label,
    heroBadge2Value: defaultSchoolSettings.heroBadge2Value,
    mission: [...schoolInfo.mission],
    identity: defaultSchoolSettings.identity,
    uniqueness: defaultSchoolSettings.uniqueness,
    emblemType: defaultSchoolSettings.emblemType,
    customLogoUrl: defaultSchoolSettings.customLogoUrl,
    primaryColor: defaultSchoolSettings.primaryColor,
    accentColor: defaultSchoolSettings.accentColor,
    directorName: defaultSchoolSettings.directorName,
    directorTitle: defaultSchoolSettings.directorTitle,
    directorAcademicStanding: defaultSchoolSettings.directorAcademicStanding,
    directorImageUrl: defaultSchoolSettings.directorImageUrl,
    directorMessage: defaultSchoolSettings.directorMessage,
    directorPhone: defaultSchoolSettings.phone,
    directorEmail: defaultSchoolSettings.email,
    colors: defaultSchoolSettings.colors,
    philosophy: defaultSchoolSettings.philosophy,
    currentAcademicYear: "2568",
    currentSemester: "ภาคเรียนที่ 1/2568",
    visitorCountBase: "0",
  });

  const [newMissionItem, setNewMissionItem] = useState("");
  const [heroImageFileName, setHeroImageFileName] = useState("");
  const [customLogoFileName, setCustomLogoFileName] = useState("");
  const [directorImageFileName, setDirectorImageFileName] = useState("");

  // Load saved settings from localStorage and Supabase on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem("nhm_school_settings");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Failed to load settings from localStorage", e);
      }
    }

    // Fetch from Supabase cloud
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from("school_settings")
        .select("value")
        .eq("key", "school_info")
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.value && typeof data.value === "object") {
            setFormData((prev) => ({ ...prev, ...data.value }));
            if (typeof window !== "undefined") {
              localStorage.setItem("nhm_school_settings", JSON.stringify({ ...defaultSchoolSettings, ...data.value }));
            }
          }
        });
    }
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      // 1. Save to cloud and localStorage via helper
      await saveSchoolSettingsCloud(formData as unknown as SchoolSettingsData);

      // 2. Two-way sync: Update director in personnel database as well
      try {
        if (typeof window !== "undefined") {
          const persRaw = localStorage.getItem("nhm_school_personnel");
          if (persRaw) {
            const persList = JSON.parse(persRaw);
            const updated = persList.map((p: any) => {
              if (p.id === "p-01" || p.name.includes("อดุลย์") || (p.position && p.position.includes("ผู้อำนวยการ"))) {
                return {
                  ...p,
                  imageUrl: formData.directorImageUrl || p.imageUrl,
                  name: formData.directorName || p.name,
                };
              }
              return p;
            });
            localStorage.setItem("nhm_school_personnel", JSON.stringify(updated));
            window.dispatchEvent(new Event("nhm_personnel_updated"));
          }
        }

        // Sync director update to Supabase personnel table
        if (isSupabaseConfigured() && supabase) {
          await supabase
            .from("personnel")
            .update({
              name: formData.directorName,
              image_url: formData.directorImageUrl,
              updated_at: new Date().toISOString()
            })
            .eq("id", "p-01");
        }
      } catch (persErr) {
        console.error("Error syncing director to personnel", persErr);
      }

      await Swal.fire({
        icon: "success",
        title: "บันทึกการตั้งค่าเรียบร้อยแล้ว!",
        text: "ข้อมูลถูกบันทึกและซิงค์ Cloud Database (Real-time) เรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Save error", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึก",
        text: "กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "คืนค่าเริ่มต้นระบบ?",
      text: "คุณต้องการคืนค่าเริ่มต้นทั้งหมดของระบบหรือไม่? ข้อมูลการแก้ไขจะกลับสู่ค่ามาตรฐานของโรงเรียน",
      showCancelButton: true,
      confirmButtonText: "ใช่, คืนค่าเริ่มต้น",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
    });

    if (result.isConfirmed) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("nhm_school_settings");
        window.dispatchEvent(new Event("nhm_settings_updated"));
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from("school_settings").delete().eq("key", "school_info");
        } catch (e) {
          console.warn("Could not delete school_info from Supabase:", e);
        }
      }

      await Swal.fire({
        icon: "success",
        title: "คืนค่าเริ่มต้นเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.reload();
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result;
        if (typeof result === "string") {
          setFormData((prev) => ({
            ...prev,
            heroImageUrl: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMission = () => {
    if (newMissionItem.trim()) {
      setFormData({
        ...formData,
        mission: [...formData.mission, newMissionItem.trim()],
      });
      setNewMissionItem("");
    }
  };

  const handleRemoveMission = (idx: number) => {
    setFormData({
      ...formData,
      mission: formData.mission.filter((_, i) => i !== idx),
    });
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result;
        if (typeof result === "string") {
          setFormData((prev) => ({
            ...prev,
            emblemType: "custom",
            customLogoUrl: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirectorImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result;
        if (typeof result === "string") {
          setFormData((prev) => ({
            ...prev,
            directorImageUrl: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSyncWithPersonnel = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("nhm_school_personnel");
      if (saved) {
        const personnel = JSON.parse(saved);
        const director = personnel.find(
          (p: any) =>
            p.id === "p-01" ||
            p.name.includes("อดุลย์") ||
            (p.position && p.position.includes("ผู้อำนวยการ"))
        );
        if (director && director.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            directorImageUrl: director.imageUrl,
            directorName: director.name || prev.directorName,
          }));
          Swal.fire({
            icon: "success",
            title: "ซิงค์รูปถ่ายสำเร็จ!",
            text: `ดึงข้อมูลรูปถ่ายของ ${director.name} จากฐานข้อมูลบุคลากรเรียบร้อยแล้ว`,
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
      }
      Swal.fire({
        icon: "info",
        title: "ไม่พบข้อมูลรูปถ่ายในส่วนบุคลากร",
        text: "สามารถคลิก 'เลือกไฟล์ภาพจากเครื่อง' เพื่ออัปโหลดรูป ผอ. ได้โดยตรง",
        confirmButtonText: "เข้าใจแล้ว",
        confirmButtonColor: "#0F2942",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeAdminPassword = async () => {
    if (!currentPasswordInput) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุรหัสผ่านเดิม",
        text: "หากจำรหัสผ่านเดิมไม่ได้ ให้กรอกรหัสผ่านเริ่มต้น @31030078",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    const currentSaved = getAdminPassword();
    if (currentPasswordInput !== currentSaved && currentPasswordInput !== DEFAULT_ADMIN_PASSWORD) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านเดิมไม่ถูกต้อง",
        text: "กรุณาตรวจสอบรหัสผ่านเดิมอีกครั้ง (หรือใช้ @31030078)",
        confirmButtonText: "ลองใหม่",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่านสั้นเกินไป",
        text: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "รหัสผ่านใหม่และช่องยืนยันรหัสผ่านต้องตรงกันทุกตัวอักษร",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await setAdminPassword(newPasswordInput);
      await Swal.fire({
        icon: "success",
        title: "เปลี่ยนรหัสผ่านสำเร็จ!",
        html: `รหัสผ่านใหม่ของคุณคือ: <strong class="font-mono text-blue-900 bg-blue-50 px-2 py-0.5 rounded">${newPasswordInput}</strong><br><span class="text-xs text-slate-500">ระบบซิงค์รหัสผ่านใหม่เรียบร้อยแล้ว ใช้เข้าสู่ระบบได้ทันที</span>`,
        confirmButtonText: "เข้าใจแล้ว",
        confirmButtonColor: "#0F2942",
      });
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    } catch (err) {
      console.error("Change password error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกรหัสผ่านใหม่ได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0F2942",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: "hero", label: "ส่วนหัวต้อนรับหน้าแรก (Hero Banner)", icon: Sparkles },
    { id: "branding", label: "อัตลักษณ์และโลโก้", icon: Palette },
    { id: "general", label: "ข้อมูลทั่วไปและสังกัด", icon: Building },
    { id: "vision", label: "วิสัยทัศน์และพันธกิจ", icon: BookOpen },
    { id: "director", label: "ข้อมูลผู้บริหาร", icon: User },
    { id: "contact", label: "ที่อยู่และการติดต่อ", icon: MapPin },
    { id: "operations", label: "ปีการศึกษาและระบบ", icon: Settings },
    { id: "security", label: "รหัสผ่าน Admin", icon: Lock },
  ];

  const heroImagePresets = [
    {
      title: "ซุ้มประตูโรงเรียนบ้านหนองหัวหมู (ภาพหลักสถานศึกษา)",
      url: "/images/school-hero-gate.png",
    },
    {
      title: "บรรยากาศการเรียนรู้เชิงรุก (Active Learning)",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "กิจกรรมการเรียนการสอนและนักเรียน",
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "ห้องสมุดและศูนย์วิทยบริการ",
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "วิทยาศาสตร์ เทคโนโลยี และทดลอง",
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header with Action Buttons */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0F2942] text-[11px] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>School Configuration Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F2942]">
            ตั้งค่าระบบและข้อมูลสถานศึกษา
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการตราสัญลักษณ์ โลโก้ ส่วนหัวหน้าแรก คำขวัญ วิสัยทัศน์ คณะผู้บริหาร และข้อมูลติดต่อ สพป. บุรีรัมย์ เขต 3
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกสำเร็จ</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            title="คืนค่าข้อมูลตั้งต้น"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[42px]"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                isActive
                  ? "bg-[#0F2942] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form noValidate onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        
        {/* ================= TAB 0: HERO BANNER (ส่วนหัวต้อนรับหน้าแรก) ================= */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            {/* Live Interactive Hero Preview Box */}
            <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-700" />
                  <h3 className="text-sm sm:text-base font-bold text-[#0F2942]">
                    ตัวอย่างการแสดงผลส่วนหัวหน้าแรกจริง (Live Hero Banner Preview)
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ⚡ พรีวิวแบบเรียลไทม์
                </span>
              </div>

              {/* Exact Simulated Hero Component */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 border border-slate-200/80 shadow-xs p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                  {/* Left: Text & Actions */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-900 border border-blue-200/60 text-xs font-bold">
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>{formData.subAffiliation}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200/60 text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{formData.affiliationBadge}</span>
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942] tracking-tight leading-tight">
                        {formData.name}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {formData.nameEn}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-xs border border-blue-100 shadow-2xs">
                      <span className="text-[11px] font-bold text-amber-600 block uppercase">
                        คำขวัญประจำโรงเรียน
                      </span>
                      <p className="text-sm sm:text-base font-bold text-[#0F2942] mt-0.5">
                        &ldquo;{formData.motto}&rdquo;
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {formData.welcomeMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs">
                        <span>{formData.heroBtn1Text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0F2942] font-bold text-xs border border-slate-200">
                        <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                        <span>{formData.heroBtn2Text}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                        <span>{formData.heroBtn3Text}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: School Photo & Education Level Badge Below (Not Floating) */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white aspect-[16/11] shadow-md">
                      <img
                        src={formData.heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Placed below the photo so it never covers the image */}
                    <div className="mt-3 flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="leading-tight">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          {formData.heroBadge1Label || "ระดับการศึกษา"}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#0F2942]">
                          {formData.heroBadge1Value || "อนุบาล 2 – ประถมศึกษาปีที่ 6"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Config Card 1: School Identity & Badges */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-[#0F2942]">
                  1. ชื่อสถานศึกษาและป้ายสังกัด (School Name & Badges)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อโรงเรียน (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อโรงเรียน (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสสถานศึกษา 10 หลัก
                  </label>
                  <input
                    type="text"
                    value={formData.schoolCode}
                    onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ป้ายสังกัดเขตพื้นที่ (ป้ายสีฟ้าบนซ้าย)
                  </label>
                  <input
                    type="text"
                    value={formData.subAffiliation}
                    onChange={(e) => setFormData({ ...formData, subAffiliation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ป้ายสังกัดระดับกระทรวง (ป้ายสีทองบนซ้าย)
                  </label>
                  <input
                    type="text"
                    value={formData.affiliationBadge}
                    onChange={(e) => setFormData({ ...formData, affiliationBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Config Card 2: Motto & Welcome Message */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#0F2942]">
                  2. คำขวัญประจำโรงเรียนและข้อความต้อนรับ
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    คำขวัญประจำโรงเรียน (แสดงเด่นในกรอบไฮไลต์)
                  </label>
                  <input
                    type="text"
                    value={formData.motto}
                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                    placeholder="เรียนดี กีฬาเด่น เน้นคุณธรรม นำชุมชน"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ข้อความแนะนำสถานศึกษา / สารต้อนรับหน้าแรก
                  </label>
                  <textarea
                    rows={3}
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    ข้อความสั้นกระชับ 2-3 บรรทัด เพื่อสรุปจุดเด่นและแนวทางการจัดการศึกษาของโรงเรียน
                  </p>
                </div>
              </div>
            </div>

            {/* Config Card 3: Action Buttons */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ArrowRight className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#0F2942]">
                  3. ปุ่มนำทางด่วนหน้าแรก 3 ปุ่ม (Hero Action Buttons)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Button 1 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">ปุ่มที่ 1 (ปุ่มสีกรมท่าเข้ม)</span>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ข้อความบนปุ่ม</label>
                    <input
                      type="text"
                      value={formData.heroBtn1Text}
                      onChange={(e) => setFormData({ ...formData, heroBtn1Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ลิงก์ปลายทาง</label>
                    <input
                      type="text"
                      value={formData.heroBtn1Url}
                      onChange={(e) => setFormData({ ...formData, heroBtn1Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Button 2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">ปุ่มที่ 2 (ปุ่มสีขาว)</span>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ข้อความบนปุ่ม</label>
                    <input
                      type="text"
                      value={formData.heroBtn2Text}
                      onChange={(e) => setFormData({ ...formData, heroBtn2Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ลิงก์ปลายทาง</label>
                    <input
                      type="text"
                      value={formData.heroBtn2Url}
                      onChange={(e) => setFormData({ ...formData, heroBtn2Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Button 3 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">ปุ่มที่ 3 (ปุ่มสีทอง/เขตพื้นที่)</span>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ข้อความบนปุ่ม</label>
                    <input
                      type="text"
                      value={formData.heroBtn3Text}
                      onChange={(e) => setFormData({ ...formData, heroBtn3Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">ลิงก์ปลายทาง</label>
                    <input
                      type="text"
                      value={formData.heroBtn3Url}
                      onChange={(e) => setFormData({ ...formData, heroBtn3Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Config Card 4: Hero Image & 2 Floating Badges */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-[#0F2942]">
                  4. รูปภาพหน้าปกและป้ายข้อมูลลอย (Hero Visual & Floating Badges)
                </h3>
              </div>

              {/* Image Presets Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  เลือกรูปภาพบรรยากาศจากพรีเซ็ตคุณภาพสูง หรืออัปโหลดรูปของโรงเรียน
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {heroImagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, heroImageUrl: preset.url })}
                      className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all aspect-[16/10] ${
                        formData.heroImageUrl === preset.url
                          ? "border-blue-600 ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2 opacity-90 group-hover:opacity-100">
                        <span className="text-[10px] text-white font-bold line-clamp-2 leading-tight">
                          {preset.title}
                        </span>
                      </div>
                      {formData.heroImageUrl === preset.url && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL or Upload */}
              <div className="space-y-3 pt-2">
                {formData.heroImageUrl?.startsWith("data:") ? (
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-blue-200 shrink-0 bg-white shadow-2xs">
                        <img
                          src={formData.heroImageUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-blue-950 block truncate">
                          {heroImageFileName || "ไฟล์ภาพหน้าปกจากเครื่อง"}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          เลือกไฟล์ภาพเรียบร้อย (พร้อมบันทึกออนไลน์)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F2942] cursor-pointer shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>เปลี่ยนไฟล์</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, heroImageUrl: "" });
                          setHeroImageFileName("");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบออก</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL รูปภาพหน้าปก (หรือวางลิงก์รูปภาพของโรงเรียน)
                      </label>
                      <input
                        type="text"
                        placeholder="https://... หรือ /images/school-gate.jpg"
                        value={formData.heroImageUrl}
                        onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        หรืออัปโหลดไฟล์จากเครื่อง
                      </label>
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer text-xs font-bold text-blue-900 transition-colors min-h-[42px]">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>เลือกไฟล์รูปภาพ</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Education Level Badge Below Photo Configuration */}
              <div className="pt-3 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-blue-950">ป้ายข้อมูลระดับการศึกษา (แสดงใต้รูปภาพ ไม่บังรูป)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">หัวข้อป้าย (เช่น ระดับการศึกษา)</label>
                      <input
                        type="text"
                        value={formData.heroBadge1Label}
                        onChange={(e) => setFormData({ ...formData, heroBadge1Label: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">ข้อความระดับชั้น (เช่น อนุบาล 2 – ประถมศึกษาปีที่ 6)</label>
                      <input
                        type="text"
                        value={formData.heroBadge1Value}
                        onChange={(e) => setFormData({ ...formData, heroBadge1Value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#0F2942]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Reminder */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[42px]"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>บันทึกการตั้งค่าส่วนหัวต้อนรับ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 1: BRANDING & LOGO ================= */}
        {activeTab === "branding" && (
          <div className="space-y-6">
            {/* Live Header Simulator Preview Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-[#0F2942]">
                    ตัวอย่างการแสดงผลบนแถบ Header หน้าเว็บจริง (Live Website Header Preview)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">อัปเดตแบบเรียลไทม์</span>
              </div>

              {/* Simulated Brand Header Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <SchoolLogo
                    size={52}
                    customLogoUrl={formData.customLogoUrl}
                    emblemType={formData.emblemType}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-[#0F2942] tracking-tight">
                        {formData.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formData.subAffiliation}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 font-mono">
                    👁️ เข้าชม {Number(formData.visitorCountBase).toLocaleString()} ครั้ง
                  </span>
                </div>
              </div>
            </div>

            {/* Emblem / Logo Selection */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ImageIcon className="w-4 h-4 text-[#0F2942]" />
                <h3 className="text-sm font-bold text-[#0F2942]">
                  เลือกรูปแบบตราสัญลักษณ์สถานศึกษา (School Emblem & Logo)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Option 1: Official Vector Emblem */}
                <div
                  onClick={() => setFormData({ ...formData, emblemType: "vector" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
                    formData.emblemType === "vector"
                      ? "border-[#0F2942] bg-blue-50/40 ring-2 ring-[#0F2942]/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <SchoolLogo size={56} emblemType="vector" />
                  <div>
                    <span className="text-xs font-bold text-[#0F2942] block">
                      ตราประจำโรงเรียน (Vector)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ตราสัญลักษณ์ น.ห.ม. เปลวเทียนปัญญา
                    </p>
                  </div>
                  {formData.emblemType === "vector" && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> ใช้งานอยู่
                    </span>
                  )}
                </div>

                {/* Option 2: OBEC Logo */}
                <div
                  onClick={() => setFormData({ ...formData, emblemType: "obec" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
                    formData.emblemType === "obec"
                      ? "border-[#0F2942] bg-blue-50/40 ring-2 ring-[#0F2942]/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <SchoolLogo size={56} emblemType="obec" />
                  <div>
                    <span className="text-xs font-bold text-[#0F2942] block">
                      ตรา สพฐ.
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน
                    </p>
                  </div>
                  {formData.emblemType === "obec" && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> ใช้งานอยู่
                    </span>
                  )}
                </div>

                {/* Option 3: MOE Logo */}
                <div
                  onClick={() => setFormData({ ...formData, emblemType: "moe" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
                    formData.emblemType === "moe"
                      ? "border-[#0F2942] bg-blue-50/40 ring-2 ring-[#0F2942]/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <SchoolLogo size={56} emblemType="moe" />
                  <div>
                    <span className="text-xs font-bold text-[#0F2942] block">
                      ตราเสมาธรรมจักร
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      กระทรวงศึกษาธิการ
                    </p>
                  </div>
                  {formData.emblemType === "moe" && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> ใช้งานอยู่
                    </span>
                  )}
                </div>

                {/* Option 4: Custom Upload */}
                <div
                  onClick={() => setFormData({ ...formData, emblemType: "custom" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
                    formData.emblemType === "custom"
                      ? "border-[#0F2942] bg-blue-50/40 ring-2 ring-[#0F2942]/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {formData.customLogoUrl ? (
                    <img
                      src={formData.customLogoUrl}
                      alt="Custom Logo"
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#0F2942] block">
                      อัปโหลดโลโก้เอง
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ไฟล์ภาพ PNG, JPG หรือ SVG
                    </p>
                  </div>
                  {formData.emblemType === "custom" && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> ใช้งานอยู่
                    </span>
                  )}
                </div>
              </div>

              {/* Custom Upload Input & File Box */}
              {formData.emblemType === "custom" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    อัปโหลดไฟล์ภาพตราสัญลักษณ์ หรือใส่ URL ภาพ
                  </span>

                  {formData.customLogoUrl?.startsWith("data:") ? (
                    <div className="p-3 rounded-xl bg-white border border-blue-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center p-1">
                          <img
                            src={formData.customLogoUrl}
                            alt="Logo Preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#0F2942] block truncate">
                            {customLogoFileName || "ไฟล์ตราสัญลักษณ์โรงเรียน"}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            เลือกไฟล์สำเร็จ
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          เปลี่ยนไฟล์
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomLogoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, customLogoUrl: "" });
                            setCustomLogoFileName("");
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          ลบออก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>เลือกไฟล์จากเครื่อง...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomLogoUpload}
                          className="hidden"
                        />
                      </label>

                      <span className="text-xs text-slate-400">หรือวาง URL:</span>

                      <input
                        type="url"
                        placeholder="https://example.com/school-logo.png"
                        value={formData.customLogoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, customLogoUrl: e.target.value })
                        }
                        className="flex-1 w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Color Palette Customizer */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Palette className="w-4 h-4 text-[#0F2942]" />
                <h3 className="text-sm font-bold text-[#0F2942]">
                  โทนสีหลักประจำโรงเรียน (Color Theme)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    สีหลักสถานศึกษา (Primary Navy Color)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ค่ามาตรฐาน: #0F2942 (Deep Navy Blue สพป.)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    สีไฮไลต์ประจำโรงเรียน (Accent Gold Color)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) =>
                        setFormData({ ...formData, accentColor: e.target.value })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) =>
                        setFormData({ ...formData, accentColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ค่ามาตรฐาน: #EAB308 (Royal Gold)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: GENERAL INFO ================= */}
        {activeTab === "general" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-[#0F2942]">
                ข้อมูลพื้นฐานสถานศึกษาและสังกัดทางการ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ชื่อสถานศึกษา (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ชื่อสถานศึกษา (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รหัสสถานศึกษา 10 หลัก (School Code)
                </label>
                <input
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolCode: e.target.value,
                      schoolCode10: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รหัส Smis 8 หลัก
                </label>
                <input
                  type="text"
                  value={formData.smisCode8}
                  onChange={(e) => setFormData({ ...formData, smisCode8: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รหัส Obec 6 หลัก
                </label>
                <input
                  type="text"
                  value={formData.obecCode6}
                  onChange={(e) => setFormData({ ...formData, obecCode6: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ระดับชั้นที่เปิดสอน (School Levels)
                </label>
                <input
                  type="text"
                  value={formData.schoolLevels}
                  onChange={(e) => setFormData({ ...formData, schoolLevels: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  วัน-เดือน-ปี ก่อตั้ง (พ.ศ.)
                </label>
                <input
                  type="text"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  กลุ่มโรงเรียน (School Group)
                </label>
                <input
                  type="text"
                  value={formData.schoolGroup}
                  onChange={(e) => setFormData({ ...formData, schoolGroup: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  องค์กรปกครองส่วนท้องถิ่น (อปท.)
                </label>
                <input
                  type="text"
                  value={formData.localGov}
                  onChange={(e) => setFormData({ ...formData, localGov: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ระยะทางจาก รร. ถึง สพท.
                </label>
                <input
                  type="text"
                  value={formData.distanceFromOffice}
                  onChange={(e) => setFormData({ ...formData, distanceFromOffice: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ระยะทางจาก รร. ถึง ที่ว่าการอำเภอ
                </label>
                <input
                  type="text"
                  value={formData.distanceFromDistrict}
                  onChange={(e) => setFormData({ ...formData, distanceFromDistrict: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  สำนักงานเขตพื้นที่การศึกษา (สพป.) *
                </label>
                <input
                  type="text"
                  value={formData.subAffiliation}
                  onChange={(e) => setFormData({ ...formData, subAffiliation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  สังกัดส่วนกลาง
                </label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  ประวัติความเป็นมาของโรงเรียน (History & Background)
                </label>
                <textarea
                  rows={4}
                  value={formData.historyText}
                  onChange={(e) => setFormData({ ...formData, historyText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  แสดงในหน้า &ldquo;ข้อมูลโรงเรียนและประวัติความเป็นมา&rdquo; (/about)
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  คำขวัญประจำโรงเรียน (Motto)
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  อัตลักษณ์สถานศึกษา (Identity)
                </label>
                <input
                  type="text"
                  value={formData.identity}
                  onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  เอกลักษณ์สถานศึกษา (Uniqueness)
                </label>
                <input
                  type="text"
                  value={formData.uniqueness}
                  onChange={(e) => setFormData({ ...formData, uniqueness: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[42px]"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>บันทึกข้อมูลพื้นฐาน</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VISION & MISSION ================= */}
        {activeTab === "vision" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-[#0F2942]">
                วิสัยทัศน์และพันธกิจของโรงเรียนบ้านหนองหัวหมู
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  วิสัยทัศน์สถานศึกษา (Vision)
                </label>
                <textarea
                  rows={3}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Mission Bullet Points Editor */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  พันธกิจของโรงเรียน (Missions)
                </label>

                {/* Add new mission */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์พันธกิจข้อใหม่ที่ต้องการเพิ่ม..."
                    value={newMissionItem}
                    onChange={(e) => setNewMissionItem(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMission}
                    className="px-4 py-2 rounded-xl bg-[#0F2942] text-white font-bold text-xs hover:bg-[#163C61] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มข้อ</span>
                  </button>
                </div>

                {/* Mission list */}
                <div className="space-y-2 pt-2">
                  {formData.mission.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="text-slate-700 flex-1 mr-3">
                        {idx + 1}. {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="ลบข้อนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DIRECTOR PROFILE ================= */}
        {activeTab === "director" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-[#0F2942]">
                ข้อมูลผู้อำนวยการโรงเรียนและสาส์นจากผู้บริหาร
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 text-xs items-start">
              {/* Photo Preview Column (4 cols) */}
              <div className="sm:col-span-4 flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="relative group w-28 h-36 rounded-xl overflow-hidden border-2 border-slate-300 shadow-xs bg-slate-200">
                  <img
                    src={formData.directorImageUrl || "/images/school-emblem-doc.png"}
                    alt={formData.directorName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/school-emblem-doc.png";
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0F2942] block">
                    {formData.directorName}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {formData.directorTitle} ({formData.directorAcademicStanding})
                  </span>
                </div>

                {/* Upload Button from machine */}
                <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-[#0F2942] cursor-pointer shadow-2xs transition-colors min-h-[38px]">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>เลือกไฟล์ภาพจากเครื่อง</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirectorImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Sync from Personnel Button */}
                <button
                  type="button"
                  onClick={handleSyncWithPersonnel}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors min-h-[36px] cursor-pointer"
                  title="ซิงค์รูปและชื่อ ผอ. จากฐานข้อมูลบุคลากร"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>ซิงค์จากข้อมูลบุคลากร</span>
                </button>

                {/* File info or Fallback URL input */}
                <div className="w-full text-left pt-1">
                  {formData.directorImageUrl?.startsWith("data:") ? (
                    <div className="p-2.5 rounded-xl bg-white border border-blue-200 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-blue-950 block truncate">
                          {directorImageFileName || "ไฟล์รูป ผอ. ที่เลือก"}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          พร้อมบันทึก
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, directorImageUrl: "" });
                          setDirectorImageFileName("");
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                      >
                        ลบ
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="text-[10px] text-slate-400 block mb-0.5">หรือวาง URL ภาพ:</label>
                      <input
                        type="url"
                        placeholder="URL ภาพผู้อำนวยการ..."
                        value={formData.directorImageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, directorImageUrl: e.target.value })
                        }
                        className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Form Fields (8 cols) */}
              <div className="sm:col-span-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ชื่อ-นามสกุล ผู้อำนวยการ *
                    </label>
                    <input
                      type="text"
                      value={formData.directorName}
                      onChange={(e) =>
                        setFormData({ ...formData, directorName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      วิทยฐานะ
                    </label>
                    <input
                      type="text"
                      value={formData.directorAcademicStanding}
                      onChange={(e) =>
                        setFormData({ ...formData, directorAcademicStanding: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      เบอร์โทรศัพท์ติดต่อสถานศึกษา / ส่วนกลาง
                    </label>
                    <input
                      type="text"
                      value={formData.directorPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, directorPhone: e.target.value })
                      }
                      placeholder="เช่น 044-xxxxxx หรือ 081-743-2407"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      (เบอร์ส่วนตัวจะไม่แสดงบนหัวเว็บสาธารณะ เพื่อความปลอดภัย)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      อีเมลผู้บริหาร
                    </label>
                    <input
                      type="email"
                      value={formData.directorEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, directorEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    สาส์นจากผู้อำนวยการสถานศึกษา (Director&rsquo;s Message)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.directorMessage}
                    onChange={(e) =>
                      setFormData({ ...formData, directorMessage: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: CONTACT & MAPS ================= */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-[#0F2942]">
                ที่ตั้งสถานศึกษา ช่องทางติดต่อ และโซเชียลมีเดีย
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  หมู่ที่ / บ้าน
                </label>
                <input
                  type="text"
                  value={formData.villageNo}
                  onChange={(e) => setFormData({ ...formData, villageNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ตำบล
                </label>
                <input
                  type="text"
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  อำเภอ
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  จังหวัด
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  โทรศัพท์โรงเรียน
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  อีเมลทางการสถานศึกษา
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  LINE Official ID
                </label>
                <input
                  type="text"
                  value={formData.lineOfficial}
                  onChange={(e) => setFormData({ ...formData, lineOfficial: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Facebook Fanpage URL (ลิงก์เพจเฟซบุ๊กโรงเรียน)
                  </label>
                  {formData.facebook && formData.facebook.startsWith("http") && (
                    <a
                      href={formData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>ทดสอบเปิดลิงก์ Facebook</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://www.facebook.com/profile.php?id=100071517975903"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none text-xs sm:text-sm font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ลิงก์นี้จะนำไปแสดงบนหน้าแรก หน้าติดต่อ และตารางข้อมูลทั่วไปโรงเรียน
                </span>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="block font-bold text-slate-700">
                    พิกัดหรือลิงก์แผนที่ Google Maps
                  </label>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("โรงเรียนบ้านหนองหัวหมู ตำบลทุ่งกระเต็น อำเภอหนองกี่ จังหวัดบุรีรัมย์")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>ค้นหาตำแหน่งบน Google Maps</span>
                    </a>
                    {formData.mapsUrl && (
                      <a
                        href={getGoogleMapsNavigationUrl(formData.mapsUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>ทดสอบเปิดพิกัดนี้</span>
                      </a>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={formData.mapsUrl}
                  onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                  placeholder="เช่น https://maps.app.goo.gl/... หรือ 14.6854, 102.5321 หรือ <iframe src=...>"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none font-mono text-xs sm:text-sm"
                />

                {/* Instructions Box */}
                <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-blue-900 block mb-1">
                    💡 วิธีการใส่ลิงก์แผนที่ให้ตรงหมุดโรงเรียน (เลือกวิธีใดวิธีหนึ่งได้เลย):
                  </span>
                  <div className="space-y-1 text-slate-600 pl-1">
                    <p>• <strong>วิธีที่ 1 (แนะนำและง่ายที่สุด):</strong> เปิด Google Maps บนมือถือหรือคอม &gt; ค้นหา &ldquo;โรงเรียนบ้านหนองหัวหมู&rdquo; &gt; กดปุ่ม <strong>&ldquo;แชร์&rdquo; (Share)</strong> &gt; คัดลอกลิงก์ (เช่น <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">https://maps.app.goo.gl/...</code>) มาวางลงในช่องนี้ได้ทันที</p>
                    <p>• <strong>วิธีที่ 2:</strong> ใช้ตัวเลขพิกัด GPS ละติจูด, ลองจิจูด เช่น <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">14.6823, 102.5312</code></p>
                    <p>• <strong>วิธีที่ 3:</strong> คัดลอกโค้ด <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">&lt;iframe src=&quot;...&quot;&gt;</code> จากเมนู &ldquo;แชร์ &gt; ฝังแผนที่&rdquo; ของ Google Maps มาวาง</p>
                  </div>
                </div>

                {/* Live Map Preview */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      ตัวอย่างการแสดงผลแผนที่บนหน้าเว็บจริง (Live Map Preview):
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          mapsUrl: "https://maps.google.com/?q=โรงเรียนบ้านหนองหัวหมู+ตำบลทุ่งกระเต็น+อำเภอหนองกี่+จังหวัดบุรีรัมย์",
                        })
                      }
                      className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold"
                    >
                      ↺ คืนค่าพิกัดมาตรฐานของโรงเรียน
                    </button>
                  </div>
                  <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
                    <iframe
                      title="ตัวอย่างแผนที่ Google Maps"
                      src={getGoogleMapsEmbedUrl(
                        formData.mapsUrl,
                        "โรงเรียนบ้านหนองหัวหมู ตำบลทุ่งกระเต็น อำเภอหนองกี่ จังหวัดบุรีรัมย์"
                      )}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#091A2B]/85 text-white text-[10px] px-2.5 py-1 rounded backdrop-blur-xs font-medium">
                      📍 หมุดตัวอย่าง: {formData.name} (ต.{formData.subDistrict} อ.{formData.district})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: OPERATIONS ================= */}
        {activeTab === "operations" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings className="w-4 h-4 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-[#0F2942]">
                ปีการศึกษาที่เปิดใช้งานและค่าเริ่มต้นของระบบ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ปีการศึกษาปัจจุบัน (Active Academic Year)
                </label>
                <select
                  value={formData.currentAcademicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAcademicYear: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                >
                  <option value="2568">2568 (ปัจจุบัน)</option>
                  <option value="2567">2567</option>
                  <option value="2569">2569</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ภาคเรียนที่เปิดใช้งาน
                </label>
                <input
                  type="text"
                  value={formData.currentSemester}
                  onChange={(e) =>
                    setFormData({ ...formData, currentSemester: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ตัวนับสถิติผู้เข้าชมเริ่มต้น (Visitor Base)
                </label>
                <input
                  type="number"
                  value={formData.visitorCountBase}
                  onChange={(e) =>
                    setFormData({ ...formData, visitorCountBase: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: SECURITY & ADMIN PASSWORD ================= */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2942]">
                    ความปลอดภัยและการเปลี่ยนรหัสผ่านผู้ดูแลระบบ (Admin Password)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    กำหนดรหัสผ่านสำหรับเข้าสู่ระบบหลังบ้านเพื่อจัดการข้อมูลสถานศึกษา
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                ระบบรักษาความปลอดภัย 2 ชั้น
              </span>
            </div>

            {/* Information Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-2 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>คำแนะนำด้านความปลอดภัยและการป้องกันการลืมรหัสผ่าน:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                <li>
                  รหัสผ่านเริ่มต้นของระบบคือ: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-[#0F2942]">@31030078</strong> (อิงตามรหัส SMIS 8 หลักของโรงเรียน)
                </li>
                <li>
                  ท่านสามารถเปลี่ยนเป็นรหัสผ่านใหม่ที่จำง่ายสำหรับคณะครูได้ตลอดเวลา (แนะนำความยาวตั้งแต่ 4 ตัวอักษรขึ้นไป)
                </li>
                <li>
                  <strong className="text-emerald-800">ระบบกู้คืนฉุกเฉิน (Master Key):</strong> หากในอนาคตผู้ดูแลลืมรหัสผ่านใหม่ ระบบยังมีรหัสผ่าน Master ฉุกเฉินคือ <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-blue-900 font-bold">@31030078</code> ที่จะใช้เข้าสู่ระบบได้เสมอ ไม่ต้องกลัวถูกล็อค!
                </li>
              </ul>
            </div>

            {/* Change Password Form */}
            <div className="max-w-md space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รหัสผ่านเดิม (Current Password) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="กรอกรหัสผ่านปัจจุบัน (หรือ @31030078)..."
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รหัสผ่านใหม่ที่ต้องการตั้ง (New Password) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="ระบุรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง (Confirm New Password) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งเพื่อยืนยัน..."
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isChangingPassword}
                  onClick={handleChangeAdminPassword}
                  className="px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 min-h-[42px] disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{isChangingPassword ? "กำลังบันทึก..." : "บันทึกและเปลี่ยนรหัสผ่านทันที"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <span className="text-xs text-slate-500">
            * การบันทึกข้อมูลจะถูกซิงค์ไปยังหน้าเว็บหลักและระบบวิเคราะห์สถิติทันที
          </span>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#163C61] text-white text-xs font-bold shadow-xs transition-colors min-h-[42px]"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </form>
    </div>
  );
}
