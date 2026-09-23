-- =========================================================================
-- BAN NONG HUA MOO SCHOOL - SUPABASE DATABASE SCHEMA
-- สคริปต์สร้างตารางฐานข้อมูลสำหรับเว็บไซต์โรงเรียนบ้านหนองหัวหมู
-- คัดลอกข้อความทั้งหมดไปวางใน Supabase SQL Editor แล้วกด "RUN" ได้ทันที
-- =========================================================================

-- 1. ตารางบุคลากร (Personnel)
CREATE TABLE IF NOT EXISTS public.personnel (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  academic_standing TEXT,
  subject_group TEXT,
  department TEXT,
  roles JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  is_executive BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางข่าวสารประชาสัมพันธ์ (News)
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  author TEXT,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางการตั้งค่าและสถิติโรงเรียน (School Settings)
CREATE TABLE IF NOT EXISTS public.school_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิด Row Level Security (RLS)
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- สร้าง Policy ให้อ่านข้อมูลได้แบบ Public (ทุกคนดูหน้าเว็บได้)
CREATE POLICY "Public read personnel" ON public.personnel FOR SELECT USING (true);
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read school_settings" ON public.school_settings FOR SELECT USING (true);

-- สร้าง Policy ให้อัปเดต/เพิ่ม/ลบข้อมูลได้
CREATE POLICY "Allow modify personnel" ON public.personnel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify news" ON public.news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow modify school_settings" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED DATA: ข้อมูลตั้งต้นบุคลากร 12 ท่าน
-- =========================================================================
INSERT INTO public.personnel (id, name, position, academic_standing, subject_group, department, roles, is_executive, order_index, image_url)
VALUES
  ('p-01', 'นายอดุลย์ วิกุล', 'ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู', 'ผู้อำนวยการชำนาญการพิเศษ', 'ผู้บริหารสถานศึกษา', 'บริหารงานบุคคล', '["ผู้อำนวยการโรงเรียนบ้านหนองหัวหมู", "ประธานคณะกรรมการบริหารสถานศึกษา"]'::jsonb, true, 1, '/images/school-emblem-doc.png'),
  ('p-02', 'นายธนาธิป คุณวงศ์', 'ครู คศ.1', 'หัวหน้ากลุ่มงานบริหารงานวิชาการ', 'ภาษาต่างประเทศ', 'บริหารงานวิชาการ', '["หัวหน้ากลุ่มงานบริหารงานวิชาการ", "หัวหน้ากลุ่มสาระการเรียนรู้ภาษาต่างประเทศ"]'::jsonb, false, 2, '/images/school-emblem-doc.png'),
  ('p-03', 'นายณัฏฐ์นริศ หอยสังข์', 'ครู คศ.1', 'หัวหน้ากลุ่มงานบริหารงานบุคคล', 'การงานอาชีพ', 'บริหารงานบุคคล', '["หัวหน้ากลุ่มงานบริหารงานบุคคล", "หัวหน้ากลุ่มสาระการเรียนรู้การงานอาชีพ"]'::jsonb, false, 3, '/images/school-emblem-doc.png'),
  ('p-04', 'นางเสาวณีย์ พูนสวัสดิ์', 'ครูชำนาญการพิเศษ', 'หัวหน้ากลุ่มงานบริหารงบประมาณ', 'ภาษาไทย', 'บริหารงานงบประมาณ', '["หัวหน้ากลุ่มงานบริหารงบประมาณ", "หัวหน้ากลุ่มสาระการเรียนรู้ภาษาไทย", "งานแนะแนวการศึกษา"]'::jsonb, false, 4, '/images/school-emblem-doc.png'),
  ('p-05', 'นางสาวโสภา ผลึกรุ่งโรจน์', 'ครูชำนาญการพิเศษ', 'หัวหน้ากลุ่มงานบริหารทั่วไป', 'วิทยาศาสตร์และเทคโนโลยี', 'บริหารงานทั่วไป', '["หัวหน้ากลุ่มงานบริหารทั่วไป", "หัวหน้ากลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี"]'::jsonb, false, 5, '/images/school-emblem-doc.png'),
  ('p-06', 'นางสาวอรทัย วงศ์จันทร์', 'ครูชำนาญการพิเศษ', 'หัวหน้าระดับการศึกษาปฐมวัย', 'การศึกษาปฐมวัย', 'บริหารงานวิชาการ', '["หัวหน้าระดับการศึกษาปฐมวัย", "หัวหน้างานวัดผลและประเมินผลการศึกษา"]'::jsonb, false, 6, '/images/school-emblem-doc.png'),
  ('p-07', 'นางสาวสุรีรัตน์ ฉิมจารย์', 'ครู คศ.1', 'หัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์', 'คณิตศาสตร์', 'บริหารงานวิชาการ', '["หัวหน้ากลุ่มสาระการเรียนรู้คณิตศาสตร์"]'::jsonb, false, 7, '/images/school-emblem-doc.png'),
  ('p-08', 'นางสาวเจนจิรา ปลั่งกลาง', 'ครู คศ.1', 'หัวหน้ากลุ่มสาระการเรียนรู้สังคมศึกษาฯ', 'สังคมศึกษา ศาสนา และวัฒนธรรม', 'บริหารงานวิชาการ', '["หัวหน้ากลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม"]'::jsonb, false, 8, '/images/school-emblem-doc.png'),
  ('p-09', 'นางสาวสุพิชชา ตาชูชาติ', 'ครู คศ.1', 'หัวหน้ากลุ่มสาระการเรียนรู้สุขศึกษาฯ', 'สุขศึกษาและพลศึกษา', 'บริหารงานวิชาการ', '["หัวหน้ากลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา"]'::jsonb, false, 9, '/images/school-emblem-doc.png'),
  ('p-10', 'นางสาวธัญญลักษณ์ กิ่งดี', 'ครู คศ.1', 'หัวหน้ากลุ่มสาระการเรียนรู้ศิลปะ', 'ศิลปะ', 'บริหารงานวิชาการ', '["หัวหน้ากลุ่มสาระการเรียนรู้ศิลปะ"]'::jsonb, false, 10, '/images/school-emblem-doc.png'),
  ('p-11', 'นางสาวสุภาภรณ์ สายธิไชย', 'เจ้าหน้าที่ธุรการโรงเรียน', 'เจ้าหน้าที่ธุรการโรงเรียน', 'ฝ่ายสนับสนุนการศึกษา / งานธุรการ', 'บริหารงานทั่วไป', '["เจ้าหน้าที่ธุรการโรงเรียน", "กรรมการฝ่ายบริหารทั่วไป", "กรรมการฝ่ายบริหารงบประมาณ"]'::jsonb, false, 11, '/images/school-emblem-doc.png'),
  ('p-12', 'นายวิเลตุ ศรีนาคา', 'นักการภารโรง', 'นักการภารโรง', 'ฝ่ายสนับสนุนการศึกษา / บริการอาคารสถานที่', 'บริหารงานทั่วไป', '["นักการภารโรง", "งานดูแลรักษาอาคารสถานที่และสิ่งแวดล้อม"]'::jsonb, false, 12, '/images/school-emblem-doc.png')
ON CONFLICT (id) DO NOTHING;
