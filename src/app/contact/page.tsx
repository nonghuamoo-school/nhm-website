import React from "react";
import type { Metadata } from "next";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import Contact from "@/components/home/Contact";
import { schoolInfo } from "@/data/schoolInfo";

export const metadata: Metadata = {
  title: "ติดต่อโรงเรียนและแผนที่การเดินทาง",
  description: `ช่องทางการติดต่อโรงเรียนบ้านหนองหัวหมู ${schoolInfo.subAffiliation} จังหวัด${schoolInfo.province} แผนที่และข้อมูลการติดต่อ`,
};

export default function ContactPage() {
  return (
    <InnerPageLayout
      breadcrumbs={[{ label: "ติดต่อโรงเรียน" }]}
      title="ติดต่อโรงเรียนบ้านหนองหัวหมู"
      description={`${schoolInfo.subAffiliation} จังหวัด${schoolInfo.province} ยินดีต้อนรับผู้ปกครองและผู้มาติดต่อราชการทุกท่าน`}
    >
      <div className="space-y-8">
        <Contact />
      </div>
    </InnerPageLayout>
  );
}
