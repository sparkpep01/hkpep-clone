"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteImages } from "@/lib/use-site-images";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const siteImages = useSiteImages("hero");

  // Slide data (text is hardcoded, background images from API)
  const slideData = [
    {
      title: "Your Trusted and Reliable Source for All Peptides",
      subtitle: "Welcome to Sparkpep, the ultimate destination for peptides enthusiasts.",
      cta: "SHOP NOW",
      href: "/shop",
    },
  ];

  // Get background images from API, fallback to default
  const slides = slideData.map((s, idx) => ({
    ...s,
    bg: siteImages[idx] || "/images/research1.jpg",
  }));

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "min(800px, 100vh)" }}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ${
            idx === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.bg}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-wd">
              <div className="max-w-2xl text-white">
                <h1
                  className="text-[clamp(32px,5vw,56px)] font-semibold leading-tight mb-4"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  {slide.title}
                </h1>
                <p
                  className="text-[clamp(16px,2vw,20px)] mb-8 text-white/90"
                  style={{ fontFamily: "var(--font-cabin)" }}
                >
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href}
                  className="inline-flex items-center justify-center bg-[rgb(221,51,51)] text-white px-10 py-3 rounded-[35px] text-[16px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === currentSlide ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
