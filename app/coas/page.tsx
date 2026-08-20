"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import { coasList } from "@/lib/products";

export default function CoasPage() {
  const [search, setSearch] = useState("");

  const filtered = coasList.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777] mb-2">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">COAS</span>
          </nav>
          <h1 className="text-[28px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
            COAS
          </h1>
        </div>
      </div>

      <main className="py-16">
        <div className="container-wd max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-[36px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
              99% Purity Peptides With COAS
            </h2>
            <p className="text-[16px] text-[#777]">
              All Certificate of Analysis documents are available for download below.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder="Search COAS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-[35px] px-6 py-3 text-[15px] focus:outline-none focus:border-[rgb(136,173,153)] transition-colors text-center"
            />
          </div>

          {/* COAS grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center justify-between p-5 bg-[rgb(247,247,247)] rounded-[16px] hover:bg-white hover:shadow-md transition-all group"
              >
                <span className="text-[16px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
                  {item}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(136,173,153)" strokeWidth="2" className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[16px] text-[#777] py-12">No COAS found matching your search.</p>
          )}
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
