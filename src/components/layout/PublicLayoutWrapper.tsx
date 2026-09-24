"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Clean Facebook tracking parameters (?fbclid=...) from browser URL bar seamlessly
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("fbclid")) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("fbclid");
        url.searchParams.delete("fb_source");
        const cleanQuery = url.searchParams.toString();
        const cleanUrl = url.pathname + (cleanQuery ? `?${cleanQuery}` : "") + url.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.debug("Clean fbclid error:", e);
      }
    }
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16 sm:pb-8 space-y-8 sm:space-y-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
