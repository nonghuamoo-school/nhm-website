import React from "react";
import NewsDetailClient from "@/components/news/NewsDetailClient";
import { schoolNews } from "@/data/news";

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return schoolNews.map((news) => ({
    id: news.id,
  }));
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const initialNews = schoolNews.find((item) => item.id === id) || null;

  return <NewsDetailClient id={id} initialNews={initialNews} />;
}
