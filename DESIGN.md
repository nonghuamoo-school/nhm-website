# Design System

## Theme Overview
- **Visual Style**: Modern Institutional Glassmorphism (สง่างาม ทันสมัย สะอาดตา ปลอดโปร่ง)
- **Palette Mode**: Light Theme with High Contrast & Layered Glass Surfaces
- **Identity Balance**: กรมท่าสุขุมเป็นสีหลัก (#1E3A5F), ฟ้าสดสำหรับการกระทำ (#2F6FED), สีแสดโรงเรียนแบบลดความสดเป็นจุดเน้น (#D96B34)

## Color Tokens

| Token Name | Hex Code | Role & Usage |
|---|---|---|
| `--color-primary-navy` | `#1E3A5F` | Header, Sidebar, หัวข้อหลัก (h1-h3), แบรนด์องค์กร |
| `--color-deep-navy` | `#0F2540` | Topbar, แถบข้อมูลท้ายสุด (Footer sub-bar) |
| `--color-bright-blue` | `#2F6FED` | ปุ่มหลัก (Primary Buttons), ลิงก์, Focus Rings, Badge สำคัญ |
| `--color-accent-orange` | `#D96B34` | สีประจำโรงเรียน (Accent เท่านั้น): ขีดใต้หัวข้อ, จุดแจ้งเตือน, Badge ข่าวใหม่ |
| `--color-bg-start` | `#EAF2FB` | พื้นหลังไล่เฉดด้านบน |
| `--color-bg-end` | `#FFFFFF` | พื้นหลังไล่เฉดด้านล่าง / พื้นหลังการ์ด Fallback |
| `--color-border-glass` | `#D1DFF0` | เส้นขอบแผ่นกระจก Glassmorphism |
| `--color-text-main` | `#0F2540` / `#1E3A5F` | ตัวหนังสือหลัก คมชัดตามเกณฑ์ WCAG AA |
| `--color-text-muted` | `#64748B` | คำอธิบายรอง วันที่ หมวดหมู่ |

## Surface & Glassmorphism System

### 1. Public Subtle Glass (`.glass-card`)
- Background: `rgba(255, 255, 255, 0.85)`
- Backdrop Filter: `blur(12px)`
- Border: `1px solid rgba(209, 223, 240, 0.8)`
- Box Shadow: `0 4px 20px -2px rgba(30, 58, 95, 0.06)`
- Radius: `16px` (`rounded-2xl`)

### 2. Admin Deep Glass (`.glass-card-admin`)
- Background: `rgba(255, 255, 255, 0.70)`
- Backdrop Filter: `blur(16px)`
- Border: `1px solid rgba(209, 223, 240, 0.9)`
- Box Shadow: `0 8px 32px 0 rgba(31, 58, 94, 0.10)`
- Radius: `16px` to `24px`

### 3. Admin Login Hero Glass
- Background: `rgba(255, 255, 255, 0.15)`
- Backdrop Filter: `blur(20px)`
- Border: `1px solid rgba(255, 255, 255, 0.35)`
- Box Shadow: `0 20px 50px rgba(15, 37, 64, 0.35)`
- Radius: `24px` (`rounded-3xl`)

## Typography & Thai Font Hierarchy
- **Font Family**: Sarabun (Google Font)
- **Fallback**: Tahoma, sans-serif (ห้ามใช้ Inter, Roboto, Arial)
- **Line Height**: `1.6` ถึง `1.8` สำหรับเนื้อหาภาษาไทย
- **Word Wrap Rules**:
  - `overflow-wrap: break-word`
  - `word-break: normal`
  - `hyphens: auto`
- **Dynamic Scale**:
  - Hero Heading: `clamp(1.75rem, 4vw, 2.75rem)`
  - Section Title: `clamp(1.25rem, 2.5vw, 1.875rem)`
  - Body Text: `0.875rem` (14px) - `1rem` (16px)

## Breakpoints & Responsive Strategy
- **Mobile (< 768px)**: Single Column, Hamburger Navigation Drawer, Horizontal scroll tables (`overflow-x: auto`), Touch targets ≥ 44px
- **Tablet (768px - 1024px)**: 2-Column Grids, Sidebar drawer / Collapsible layout
- **Desktop (> 1024px)**: 3 to 4-Column Grids, Permanent Glass Sidebar on Admin, Multi-column Analytics Charts
