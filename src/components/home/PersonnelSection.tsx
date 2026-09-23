import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import PersonnelCard from "./PersonnelCard";
import { schoolPersonnel } from "@/data/personnel";

export default function PersonnelSection() {
  // Show first 4-6 staff cards on homepage
  const previewPersonnel = schoolPersonnel.slice(0, 4);

  return (
    <section>
      <SectionTitle
        title="คณะครูและบุคลากรทางการศึกษา"
        subtitle="ผู้บริหาร ครูผู้สอน และบุคลากรผู้ร่วมขับเคลื่อนการศึกษาโรงเรียนบ้านหนองหัวหมู"
        actionText="ดูทำเนียบบุคลากรทั้งหมด"
        actionHref="/personnel"
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {previewPersonnel.map((person) => (
          <PersonnelCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
