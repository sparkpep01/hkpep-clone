"use client";

import { useSiteImages } from "@/lib/use-site-images";

export default function Marquee() {
  const siteImages = useSiteImages("marquee");

  // Fallback defaults
  const defaultRow1 = [
    "/images/marquee/connect-1.png",
    "/images/marquee/connect-2.png",
    "/images/marquee/connect-3.png",
    "/images/marquee/connect-4.png",
  ];
  const defaultRow2 = [
    "/images/marquee/connect-5.png",
    "/images/marquee/connect-6.png",
    "/images/marquee/connect-7.png",
  ];

  // Images from API (slot 0-6), fallback to defaults
  const allImages = [];
  for (let i = 0; i < 7; i++) {
    const url = siteImages[i];
    if (url) allImages.push(url);
  }
  const marqueeRow1 = allImages.length > 0 ? allImages.slice(0, 4) : defaultRow1;
  const marqueeRow2 = allImages.length > 0 ? allImages.slice(4) : defaultRow2;

  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="container-wd">
        {/* Row 1 - scrolling left */}
        <div className="relative flex overflow-hidden mb-5">
          <div className="flex animate-marquee gap-5 shrink-0">
            {[...marqueeRow1, ...marqueeRow1].map((img, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                src={img}
                alt=""
                className="h-[100px] w-auto object-contain shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Row 2 - scrolling right */}
        {marqueeRow2.length > 0 && (
          <div className="relative flex overflow-hidden">
            <div className="flex animate-marquee-reverse gap-5 shrink-0">
              {[...marqueeRow2, ...marqueeRow2].map((img, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="h-[100px] w-auto object-contain shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
