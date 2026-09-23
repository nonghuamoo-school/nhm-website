import React from "react";
import EditNewsClientWrapper from "@/components/news/EditNewsClientWrapper";
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
  const initialNews = schoolNews.find((item) => item.id === id) || null;

  return <EditNewsClientWrapper id={id} initialNews={initialNews} />;
}
