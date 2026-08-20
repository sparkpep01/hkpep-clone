"use client";

import Link from "next/link";
import { useSiteImage } from "@/lib/use-site-images";

export default function SimplePowerful() {
  const imgUrl = useSiteImage("simple-powerful", 0, "/images/next-gen-img.webp");

  return (
    <section className="py-16 bg-white">
      <div className="container-wd">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: text */}
          <div className="flex-1">
            <h2
              className="text-[36px] font-medium text-[#242424] leading-tight mb-4"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Simple<br />
              Powerful<br />
              Effective
            </h2>
            <p className="text-[16px] text-[#777] mb-6">
              Discover an intuitive way to elevate your research.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[rgb(221,51,51)] text-white px-8 py-3 rounded-[35px] text-[16px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              ALL PEPTIDES
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/arrow.svg" alt="arrow" className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: image */}
          <div className="flex-1 hidden lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt="next-gen-img"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
