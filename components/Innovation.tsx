"use client";

import { useSiteImages } from "@/lib/use-site-images";

const featureData = [
  { title: "Satisfaction Guaranteed", desc: "High-purity peptides" },
  { title: "Customer Service", desc: "Chat, phone and e-mail" },
  { title: "Fast Shipping", desc: "Priority shipping" },
  { title: "Quality Tested", desc: "3rd party tested" },
];

const defaultIcons = [
  "/images/icons/inv-icon1.svg",
  "/images/icons/inv-icon2.svg",
  "/images/icons/inv-icon3.svg",
  "/images/icons/inv-icon4.svg",
];

export default function Innovation() {
  const mainImages = useSiteImages("innovation-main");
  const iconImages = useSiteImages("innovation-icons");

  const mainImg = mainImages[0] || "/images/innovation-img.webp";

  const features = featureData.map((f, idx) => ({
    ...f,
    icon: iconImages[idx] || defaultIcons[idx],
  }));

  return (
    <section className="py-16 bg-[rgb(247,247,247)]">
      <div className="container-wd">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: image */}
          <div className="flex-1 hidden lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImg}
              alt="innovation-img"
              className="w-full h-auto"
            />
          </div>

          {/* Right: content */}
          <div className="flex-1">
            <h2
              className="text-[36px] font-medium text-[#242424] mb-4"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Innovation Meets Purity
            </h2>
            <p className="text-[16px] text-[#777] mb-8">
              Discover an intuitive way to elevate your research.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-[42px] h-[42px]"
                  />
                  <div>
                    <h3
                      className="text-[18px] font-medium text-[#242424] mb-1"
                      style={{ fontFamily: "var(--font-geologica)" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[14px] text-[#777]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
