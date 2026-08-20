"use client";

import Link from "next/link";
import { useSiteImage } from "@/lib/use-site-images";

export default function Footer() {
  const logoUrl = useSiteImage("logo", 0, "/images/sparkpep-logo.jpg");

  return (
    <footer className="bg-[rgb(15,15,15)] text-white">
      <div className="container-wd py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Column 1: Logo + disclaimer */}
          <div className="lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Sparkpep"
              className="h-[32px] w-auto mb-4"
              style={{ maxWidth: "200px" }}
            />
            <p className="text-[14px] text-white/60 leading-relaxed">
              Sparkpep&trade; products are for research purposes only. Not for human consumption or clinical use. The buyer is responsible for adhering to all local laws and regulations. Sparkpep&trade; is not a pharmacy and does not provide medical advice, prescriptions, or consultations.
            </p>
          </div>

          {/* Column 2: Popular */}
          <div className="lg:col-span-1">
            <h4
              className="text-[16px] font-medium text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              POPULAR
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61577634931973"
                  className="text-[14px] text-white/60 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="lg:col-span-1">
            <h4
              className="text-[16px] font-medium text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              USEFUL LINKS
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-[14px] text-white/60 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-[14px] text-white/60 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/10 my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-white/60">
            &copy;2012-2025 Sparkpep&trade;. All Rights Reserved.
          </p>
          <nav className="flex gap-6">
            <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">
              Store Refund Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
