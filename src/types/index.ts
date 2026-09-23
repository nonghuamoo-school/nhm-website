export interface SchoolInfo {
  name: string;
  nameEn: string;
  affiliation: string;
  subAffiliation: string;
  province: string;
  district: string;
  subDistrict: string;
  villageNo: string;
  postalCode: string;
  phone: string;
  email: string;
  facebook: string;
  schoolCode: string;
  establishedYear: string;
  motto: string;
  vision: string;
  mission: string[];
  director: DirectorInfo;
  logoUrl?: string;
  emblemType?: 'vector' | 'obec' | 'moe' | 'custom';
  primaryColor?: string;
  accentColor?: string;
  identity?: string;
  uniqueness?: string;
  lineOfficial?: string;
  mapsUrl?: string;
  currentAcademicYear?: string;
  currentSemester?: string;
  schoolCode10?: string;
  smisCode8?: string;
  obecCode6?: string;
  schoolLevels?: string;
  schoolGroup?: string;
  localGov?: string;
  distanceFromOffice?: string;
  distanceFromDistrict?: string;
  colors?: string;
  philosophy?: string;
}

export interface DirectorInfo {
  name: string;
  title: string;
  position: string;
  academicStanding: string;
  message: string;
  imageUrl: string;
  phone: string;
  email: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  change?: string;
  description: string;
  icon: string;
  colorClass: string;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  badge?: string;
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'ประชาสัมพันธ์' | 'กิจกรรม' | 'วิชาการ' | 'จัดซื้อจัดจ้าง';
  date: string;
  author: string;
  imageUrl: string;
  views: number;
  isFeatured?: boolean;
  status?: 'เผยแพร่แล้ว' | 'ฉบับร่าง';
  facebookUrl?: string;
  externalUrl?: string;
  galleryImages?: string[];
  attachments?: {
    name: string;
    size: string;
    url: string;
    type?: 'PDF' | 'XLSX' | 'DOCX' | 'LINK' | 'IMAGE';
    driveUrl?: string;
  }[];
}

export interface PersonnelMember {
  id: string;
  name: string;
  position: string;
  department: string;
  academicDegree?: string;
  subjectGroup?: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  order: number;
  roles?: string[];
}

export interface AcademicScore {
  name: string;
  schoolScore: number;
  nationalScore: number;
  difference: number;
  year: string;
}

export interface AcademicExamData {
  exam: 'O-NET' | 'NT' | 'RT';
  title: string;
  year: string;
  grade: string;
  subjects: AcademicScore[];
  summaryNote: string;
}

export interface DownloadDoc {
  id: string;
  title: string;
  category: 'แบบฟอร์มคำร้อง' | 'งานวิชาการ' | 'งานบุคคลและงบประมาณ' | 'สำหรับนักเรียน/ผู้ปกครอง';
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  date: string;
  downloads: number;
  downloadUrl: string;
  driveUrl?: string;
  previewUrl?: string;
  description?: string;
}

export interface InventoryAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  fiscalYear: string;
  quantity: number;
  unit: string;
  location: string;
  status: 'ใช้งานได้ปกติ' | 'รอซ่อมบำรุง' | 'ชำรุด/จำหน่าย';
  note?: string;
}

export interface StudentGradeStat {
  grade: string;
  male: number;
  female: number;
  total: number;
  classrooms: number;
}

export interface StudentYearStat {
  academicYear: string;
  updatedDate: string;
  grades: StudentGradeStat[];
  summary: {
    totalMale: number;
    totalFemale: number;
    totalStudents: number;
    totalClassrooms: number;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: 'กิจกรรมโรงเรียน' | 'สอบ/วิชาการ' | 'วันหยุดราชการ' | 'ประชุม/อบรม';
  location: string;
  time: string;
  description?: string;
}

export interface EServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'พร้อมใช้งาน' | 'ปรับปรุงระบบ' | 'เร็วๆ นี้';
  targetAudience: 'นักเรียน' | 'ผู้ปกครอง' | 'ครูและบุคลากร' | 'ประชาชนทั่วไป';
  href: string;
}
