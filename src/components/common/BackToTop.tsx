"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 400px or roughly half a screen
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="เลื่อนกลับด้านบนสุด"
      title="กลับสู่ด้านบน"
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-[#1E3A5F] hover:text-[#2F6FED] border border-[#D1DFF0] shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] active:scale-95 group ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5 duration-200" />
      <span className="sr-only">กลับสู่ด้านบน</span>
    </button>
  );
}
