"use client";

import { useState, useEffect } from "react";
import { schoolInfo } from "@/data/schoolInfo";

export interface SchoolSettingsData {
  name: string;
  nameEn: string;
  schoolCode: string;
  schoolCode10: string;
  smisCode8: string;
  obecCode6: string;
  affiliation: string;
  subAffiliation: string;
  affiliationBadge: string;
  province: string;
  district: string;
  subDistrict: string;
  villageNo: string;
  postalCode: string;
  phone: string;
  email: string;
  facebook: string;
  lineOfficial: string;
  mapsUrl: string;
  schoolLevels: string;
  establishedYear: string;
  schoolGroup: string;
  localGov: string;
  distanceFromOffice: string;
  distanceFromDistrict: string;
  historyText: string;
  motto: string;
  vision: string;
  mission: string[];
  identity: string;
  uniqueness: string;
  colors: string;
  philosophy: string;
  welcomeMessage: string;
  heroBtn1Text: string;
  heroBtn1Url: string;
  heroBtn2Text: string;
  heroBtn2Url: string;
  heroBtn3Text: string;
  heroBtn3Url: string;
  heroImageUrl: string;
  heroBadge1Label: string;
  heroBadge1Value: string;
  heroBadge2Label: string;
  heroBadge2Value: string;
  emblemType: "vector" | "obec" | "moe" | "custom";
  customLogoUrl: string;
  primaryColor: string;
  accentColor: string;
  directorName: string;
  directorTitle: string;
  directorAcademicStanding: string;
  directorImageUrl: string;
  directorMessage: string;
}

export const defaultSchoolSettings: SchoolSettingsData = {
  name: schoolInfo.name,
  nameEn: "Ban Nong Hua Moo School",
  schoolCode: "1031260613",
  schoolCode10: "1031260613",
  smisCode8: "31030078",
  obecCode6: "260613",
  affiliation: schoolInfo.affiliation,
  subAffiliation: schoolInfo.subAffiliation,
  affiliationBadge: "สพฐ. กระทรวงศึกษาธิการ",
  province: "บุรีรัมย์",
  district: "หนองกี่",
  subDistrict: "ทุ่งกระเต็น",
  villageNo: "144 หมู่ที่ 7 บ้านโคกสะอาด",
  postalCode: "31210",
  phone: "081-743-2407",
  email: "31030078@brm3.go.th",
  facebook: "https://www.facebook.com/profile.php?id=100071517975903",
  lineOfficial: "@nhmschool",
  mapsUrl: "https://maps.google.com/?q=โรงเรียนบ้านหนองหัวหมู+ทุ่งกระเต็น+หนองกี่+บุรีรัมย์",
  schoolLevels: "อนุบาล-ประถมศึกษา (อนุบาล 2 – ประถมศึกษาปีที่ 6)",
  establishedYear: "2517",
  schoolGroup: "ดอนอะรางทุ่งกระเต็น",
  localGov: "องค์การบริหารส่วนตำบลทุ่งกระเต็น",
  distanceFromOffice: "26 กม.",
  distanceFromDistrict: "12 กม.",
  historyText:
    "โรงเรียนบ้านหนองหัวหมู ก่อตั้งขึ้นเมื่อวันที่ 1 พฤษภาคม พ.ศ. 2517 ตั้งอยู่เลขที่ 144 หมู่ที่ 7 บ้านโคกสะอาด ตำบลทุ่งกระเต็น อำเภอหนองกี่ จังหวัดบุรีรัมย์ สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาบุรีรัมย์ เขต 3 จัดการศึกษาขั้นพื้นฐานตั้งแต่ระดับอนุบาล 2 ถึงประถมศึกษาปีที่ 6 มุ่งเน้นการจัดการเรียนรู้เชิงรุก (Active Learning) ปลูกฝังคุณธรรม จริยธรรม สอดแทรกทักษะชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง",
  motto: "เรียนดี กีฬาเด่น เน้นคุณธรรม นำชุมชน",
  philosophy: "นตฺถิ ปญฺญา สมา อาภา “ไม่มีแสงสว่างใดเสมอด้วยปัญญา”",
  colors: "สีแสด – สีขาว",
  vision: schoolInfo.vision,
  mission: [...schoolInfo.mission],
  identity: "ยิ้มง่าย ไหว้สวย รวยน้ำใจ",
  uniqueness: "ภูมิทัศน์น่าอยู่ เชิดชูคุณธรรม ก้าวทันเทคโนโลยี",
  welcomeMessage:
    "สถานศึกษาแห่งการเรียนรู้เชิงรุก (Active Learning) มุ่งเน้นการจัดการศึกษาขั้นพื้นฐานอย่างมีคุณภาพ ปลูกฝังคุณธรรม จริยธรรม สอดแทรกทักษะชีวิตตามหลักปรัชญาของเศรษฐกิจพอเพียง",
  heroBtn1Text: "รู้จักโรงเรียน",
  heroBtn1Url: "/about",
  heroBtn2Text: "ข่าวประชาสัมพันธ์",
  heroBtn2Url: "/news",
  heroBtn3Text: "เว็บไซต์ สพป. บุรีรัมย์ เขต 3",
  heroBtn3Url: "https://www.brm3.go.th",
  heroImageUrl: "/images/school-hero-gate.png",
  heroBadge1Label: "ระดับการศึกษา",
  heroBadge1Value: "อนุบาล 2 – ประถมศึกษาปีที่ 6",
  heroBadge2Label: "ผลสัมฤทธิ์ทางการเรียน",
  heroBadge2Value: "สูงกว่าค่าเฉลี่ยระดับประเทศ",
  emblemType: "custom",
  customLogoUrl: "/images/school-logo.png",
  primaryColor: "#0F2942",
  accentColor: "#F97316", // Orange theme accent from official color "สีแสด - สีขาว"
  directorName: "นายอดุลย์ วิกุล",
  directorTitle: "ผู้อำนวยการสถานศึกษา",
  directorAcademicStanding: "ผู้อำนวยการชำนาญการพิเศษ",
  directorImageUrl: schoolInfo.director.imageUrl,
  directorMessage: schoolInfo.director.message,
};

export function useSchoolSettings() {
  const [settings, setSettings] = useState<SchoolSettingsData>(defaultSchoolSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      if (typeof window === "undefined") return;
      try {
        const saved = localStorage.getItem("nhm_school_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.facebook === "โรงเรียนบ้านหนองหัวหมู" || !parsed.facebook) {
            parsed.facebook = "https://www.facebook.com/profile.php?id=100071517975903";
          }
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error("Error reading nhm_school_settings from localStorage", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();

    const handleStorageChange = () => loadSettings();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nhm_settings_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nhm_settings_updated", handleStorageChange);
    };
  }, []);

  return { settings, isLoaded };
}
