import { AcademicExamData } from "@/types";

export const academicScoresData: AcademicExamData[] = [
  {
    exam: "RT",
    title: "การประเมินความสามารถด้านการอ่านของผู้เรียน (Reading Test: RT)",
    year: "2566",
    grade: "ชั้นประถมศึกษาปีที่ 1",
    summaryNote: "คะแนนเฉลี่ยรวม 82.45 สูงกว่าระดับประเทศ (+5.22)",
    subjects: [
      {
        name: "การอ่านออกเสียง",
        schoolScore: 84.10,
        nationalScore: 77.89,
        difference: 6.21,
        year: "2566"
      },
      {
        name: "การอ่านรู้เรื่อง",
        schoolScore: 80.80,
        nationalScore: 76.57,
        difference: 4.23,
        year: "2566"
      },
      {
        name: "รวม 2 ด้าน",
        schoolScore: 82.45,
        nationalScore: 77.23,
        difference: 5.22,
        year: "2566"
      }
    ]
  },
  {
    exam: "NT",
    title: "การประเมินคุณภาพผู้เรียนระดับชาติ (National Test: NT)",
    year: "2566",
    grade: "ชั้นประถมศึกษาปีที่ 3",
    summaryNote: "คะแนนเฉลี่ยรวม 68.90 สูงกว่าระดับประเทศ (+3.65)",
    subjects: [
      {
        name: "ความสามารถด้านคณิตศาสตร์",
        schoolScore: 66.45,
        nationalScore: 63.80,
        difference: 2.65,
        year: "2566"
      },
      {
        name: "ความสามารถด้านภาษาไทย",
        schoolScore: 71.35,
        nationalScore: 66.70,
        difference: 4.65,
        year: "2566"
      },
      {
        name: "รวมทั้ง 2 ด้าน",
        schoolScore: 68.90,
        nationalScore: 65.25,
        difference: 3.65,
        year: "2566"
      }
    ]
  },
  {
    exam: "O-NET",
    title: "การทดสอบทางการศึกษาระดับชาติขั้นพื้นฐาน (O-NET)",
    year: "2566",
    grade: "ชั้นประถมศึกษาปีที่ 6",
    summaryNote: "ผลการทดสอบมีคะแนนเฉลี่ยสูงกว่าระดับสังกัด สพฐ. ทุกรายวิชา",
    subjects: [
      {
        name: "ภาษาไทย",
        schoolScore: 59.80,
        nationalScore: 57.30,
        difference: 2.50,
        year: "2566"
      },
      {
        name: "ภาษาอังกฤษ",
        schoolScore: 42.15,
        nationalScore: 37.62,
        difference: 4.53,
        year: "2566"
      },
      {
        name: "คณิตศาสตร์",
        schoolScore: 38.60,
        nationalScore: 34.25,
        difference: 4.35,
        year: "2566"
      },
      {
        name: "วิทยาศาสตร์",
        schoolScore: 45.30,
        nationalScore: 41.50,
        difference: 3.80,
        year: "2566"
      }
    ]
  }
];

export const academicHighlights = [
  { label: "คะแนนเฉลี่ย RT (ป.1)", score: "82.45%", tag: "+5.22 สูงกว่าระดับประเทศ", status: "success" },
  { label: "คะแนนเฉลี่ย NT (ป.3)", score: "68.90%", tag: "+3.65 สูงกว่าระดับประเทศ", status: "success" },
  { label: "คะแนนเฉลี่ย O-NET (ป.6)", score: "46.46%", tag: "+3.79 สูงกว่าระดับประเทศ", status: "success" },
  { label: "อัตราการศึกษาต่อ ม.1", score: "100%", tag: "เข้าศึกษาต่อทุกคน", status: "accent" }
];
