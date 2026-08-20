"use client";

import { useState } from "react";
import { useSiteImages } from "@/lib/use-site-images";

const testimonialData = [
  {
    name: "Brooklyn Simmons",
    text: "I've sourced peptides from multiple places, but Sparkpep consistently delivers unmatched purity. Every batch is reliable, and exactly what I need.",
  },
  {
    name: "Jerome Bell",
    text: "Excellent customer service! The staff is knowledgeable and always ready to help me find products.",
  },
  {
    name: "Kathryn Murphy",
    text: "Affordable prices and high-quality products. I never have to worry about breaking the bank.",
  },
  {
    name: "Guy Hawkins",
    text: "Wide range of organic and natural options. I appreciate their commitment to providing.",
  },
  {
    name: "Dianne Russell",
    text: "Trustworthy and reliable. I can rely on this store for genuine and safe products structure of the page.",
  },
  {
    name: "Ronald Richards",
    text: "Impressive variety for specific dietary needs. They cater to various lifestyles, including vegan.",
  },
];

const defaultAvatars = [
  "/images/testimonials/customer-1.jpg",
  "/images/testimonials/customer-2.jpg",
  "/images/testimonials/customer-3.jpg",
  "/images/testimonials/customer-4.jpg",
  "/images/testimonials/customer-5.jpg",
  "/images/testimonials/customer-6.jpg",
];

export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const siteImages = useSiteImages("testimonials");
  const visibleCount = 3;

  const testimonials = testimonialData.map((t, idx) => ({
    ...t,
    avatar: siteImages[idx] || defaultAvatars[idx],
  }));

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(testimonials.length - visibleCount, prev + 1));
  };

  const visible = testimonials.slice(startIndex, startIndex + visibleCount);
  const canPrev = startIndex > 0;
  const canNext = startIndex < testimonials.length - visibleCount;

  return (
    <section className="py-16 bg-white">
      <div className="container-wd">
        <h2
          className="text-[36px] font-medium text-[#242424] mb-8"
          style={{ fontFamily: "var(--font-geologica)" }}
        >
          Feedback From Real Customers
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-[rgb(247,247,247)] rounded-[16px] p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#fbbc34"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="text-[15px] text-[#777] leading-relaxed flex-1">
                  {testimonial.text}
                </p>

                <footer
                  className="text-[16px] font-medium text-[#242424]"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  {testimonial.name}
                </footer>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={handlePrev}
              disabled={!canPrev}
              className="w-11 h-11 rounded-full bg-[rgb(247,247,247)] flex items-center justify-center hover:bg-[rgb(136,173,153)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              className="w-11 h-11 rounded-full bg-[rgb(247,247,247)] flex items-center justify-center hover:bg-[rgb(136,173,153)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
