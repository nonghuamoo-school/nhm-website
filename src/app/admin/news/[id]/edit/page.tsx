import React from "react";
import { notFound } from "next/navigation";
import NewsEditor from "@/components/news/NewsEditor";
import { schoolNews } from "@/data/news";

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return schoolNews.map((news) => ({
    id: news.id,
  }));
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const news = schoolNews.find((item) => item.id === id);

  if (!news) {
    notFound();
  }

  return <NewsEditor initialData={news} isEditMode={true} />;
}
