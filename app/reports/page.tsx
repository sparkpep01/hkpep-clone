"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";

const QYAO_ORIGIN = "https://qyaobiopeptides.com";

// Proxy report images through our own domain for reliable loading
function proxyImg(path: string): string {
  return `/api/report-image?path=${encodeURIComponent(path)}`;
}

interface ReportItem {
  c: string; // cat_no
  n: string; // name
  s: string; // spec
  cat: string; // category
  file: string;
  thumb: string;
  cells: Record<string, string>; // "lab|type" -> verify link
  jf?: string; // janoshik image file
}

const LABS = [
  { k: "medutest", n: "Medutest", v: "Medutest", c: "#16523C" },
  { k: "peptidemeter", n: "PeptideMeter", v: "PeptideMeter", c: "#e2580a" },
  { k: "vendorinvestigate", n: "VendorInvestigate", v: "VendorInvestigate", c: "#bc1a20" },
  { k: "janoshik", n: "Janoshik", v: "Janoshik", c: "#0a1628" },
];

const TYPES = [
  { k: "purity", l: "Purity", i: "M9 3h6v2H9zM7 5h10v2H7zM5 7h14v14H5z" },
  { k: "heavy-metals", l: "Heavy Metals", i: "M12 2a4 4 0 0 1 4 4c0 1.1-.45 2.1-1.17 2.83A6 6 0 0 1 18 14v6h-2v2h-2v-2h-4v2H8v-2H6v-6a6 6 0 0 1 3.17-5.17A4 4 0 0 1 12 2z" },
  { k: "endotoxin", l: "Endotoxin", i: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" },
  { k: "sterility", l: "Sterility", i: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" },
];

const CATEGORIES = [
  { k: "all", label: "All" },
  { k: "peptides", label: "Peptides" },
  { k: "oral_tablets", label: "Oral Tablets" },
  { k: "injectable_oils", label: "Injectable Oils" },
  { k: "raw_materials", label: "Raw Materials" },
];

function imgFor(lab: string, type: string, file: string, item: ReportItem): string {
  if (lab === "janoshik") return item.jf ? proxyImg(item.jf) : "";
  return type === "purity"
    ? proxyImg(`${lab}/${file}`)
    : proxyImg(`${lab}/${type}/${file}`);
}

function countReports(item: ReportItem): number {
  return Object.keys(item.cells).filter((k) => item.cells[k] !== "").length;
}

interface LightboxState {
  img: string;
  title: string;
  verify: string;
  vname: string;
}

export default function ReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [visibleCount, setVisibleCount] = useState(40);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/reports-data.json")
      .then((r) => r.json())
      .then((data: ReportItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalReports = useMemo(() => {
    return items.reduce((sum, it) => sum + countReports(it), 0);
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== "all") {
      list = list.filter((it) => it.cat === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((it) => it.n.toLowerCase().includes(q) || it.s.toLowerCase().includes(q));
    }
    return list;
  }, [items, category, search]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((c) => Math.min(c + 40, filtered.length));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  useEffect(() => {
    setVisibleCount(40);
  }, [category, search]);

  const visibleItems = filtered.slice(0, visibleCount);

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const openLightbox = (img: string, title: string, verify: string, vname: string) => {
    setLightbox({ img, title, verify, vname });
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-[#f0f7f2] to-[#e3efe6] py-12 border-b border-gray-100 text-center">
        <div className="container-wd">
          <h1
            className="text-[32px] md:text-[36px] font-extrabold text-[#242424] mb-3 tracking-tight flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-geologica)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgb(136,173,153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.5a5.5 5.5 0 1 0 4 0V2z" />
              <path d="M8 2h8" />
            </svg>
            Independent Test Reports
          </h1>
          <p className="text-[16px] text-[#777] max-w-2xl mx-auto leading-relaxed">
            Every batch independently tested by Medutest, PeptideMeter &amp; VendorInvestigate — purity, heavy
            metals, endotoxin and sterility — plus{" "}
            <a href="https://janoshik.com" target="_blank" rel="noopener noreferrer" className="text-[rgb(136,173,153)] font-semibold hover:underline">
              Janoshik Analytical
            </a>{" "}
            HPLC purity. 99.5%+ purity confirmed across our entire product range. Open any report below to view
            all four laboratories.
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center items-center flex-wrap gap-0 mt-8">
            {[
              { num: totalReports.toLocaleString(), label: "Reports" },
              { num: "99.5%+", label: "Purity" },
              { num: "Independent", label: "Lab Tested" },
              { num: "4 Labs", label: "Independent" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center px-6 md:px-8 relative ${i < 3 ? "after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-gray-300" : ""}`}>
                <span className="text-[24px] md:text-[28px] font-extrabold text-[rgb(136,173,153)] tracking-tight" style={{ fontFamily: "var(--font-geologica)" }}>
                  {stat.num}
                </span>
                <span className="text-[12px] font-medium text-[#777] uppercase tracking-wider mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Verified Labs Badges */}
          <div className="mt-8">
            <div className="text-[13px] font-semibold text-[#555] mb-4 flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>
              Cross-verified by four independent laboratories
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Medutest", sub: "Maison d'Analyse", color: "#16523C", url: "https://medutest.com/vendors/qyaobio-peptides/" },
                { name: "PeptideMeter", sub: "Independent testing", color: "#e2580a", url: "https://peptidemeter.com/vendors/qyaobio-peptides/" },
                { name: "VendorInvestigate", sub: "Testing bureau", color: "#bc1a20", url: "https://vendorinvestigate.com/vendors/qyaobio-peptides/" },
                { name: "Janoshik", sub: "HPLC + Mass Spec", color: "#0a1628", url: "https://janoshik.com" },
              ].map((lab) => (
                <a
                  key={lab.name}
                  href={lab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-full pl-3 pr-4 py-2 hover:shadow-md transition-shadow"
                  style={{ borderLeft: `3px solid ${lab.color}` }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: lab.color }} />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] text-[#999] uppercase tracking-wide">Verified on</span>
                    <span className="text-[14px] font-semibold text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
                      {lab.name}
                    </span>
                    <span className="text-[11px] text-[#999]">{lab.sub}</span>
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={lab.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lab Equipment Strip */}
      <section className="py-5 bg-white border-b border-gray-100">
        <div className="container-wd">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { src: proxyImg("images/factory/hplc-analysis.png"), label: "HPLC Analysis Equipment", alt: "HPLC analysis equipment" },
              { src: proxyImg("images/factory/spectrometry.png"), label: "Mass Spectrometry", alt: "Mass spectrometry equipment" },
              { src: proxyImg("images/factory/finished-vials.png"), label: "Tested & Verified Product", alt: "Tested and verified finished product" },
            ].map((card) => (
              <div key={card.label} className="relative rounded-xl overflow-hidden border border-gray-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt={card.alt} loading="lazy" decoding="async" className="w-full h-auto block rounded-xl object-cover" />
                <div className="absolute bottom-0 left-0 right-0 px-3.5 py-2.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[12px] font-semibold">
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-[82px] z-40">
        <div className="container-wd">
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products... e.g. BPC-157, Testosterone, Semaglutide"
                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg text-[15px] text-[#242424] bg-[#f7f7f7] outline-none focus:border-[rgb(136,173,153)] focus:bg-white focus:ring-3 focus:ring-[rgb(136,173,153)]/10 transition-all"
              />
            </div>
            <div className="text-[13px] text-[#777] whitespace-nowrap font-medium">
              <span className="text-[rgb(136,173,153)] font-bold">{filtered.length}</span> products
            </div>
          </div>
          <div className="flex gap-2 justify-center flex-wrap mt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.k}
                onClick={() => setCategory(cat.k)}
                className={`px-3.5 py-1.5 border rounded-full text-[13px] font-medium transition-all ${
                  category === cat.k
                    ? "bg-[rgb(136,173,153)] text-white border-[rgb(136,173,153)]"
                    : "bg-white text-[#555] border-gray-200 hover:border-[rgb(136,173,153)] hover:text-[rgb(136,173,153)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-8 bg-[#fafafa] min-h-[400px]">
        <div className="container-wd">
          {loading ? (
            <div className="text-center py-20 text-[#777]">Loading reports…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="mx-auto mb-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-[16px] text-[#777] font-medium">No products found</p>
              <p className="text-[13px] text-[#999] mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {visibleItems.map((it) => {
                  const idx = items.indexOf(it);
                  const total = countReports(it);
                  const leadImg = it.thumb ? proxyImg(it.thumb) : "";
                  const vendorCount = LABS.filter((L) =>
                    TYPES.some((T) => (L.k + "|" + T.k) in it.cells && it.cells[L.k + "|" + T.k] !== "")
                  ).length;
                  const isExpanded = expanded.has(idx);

                  return (
                    <div
                      key={it.c}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col transition-all hover:border-[rgb(136,173,153)] hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => toggleExpand(idx)}
                      >
                        {leadImg && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={leadImg} loading="lazy" alt={`${it.n} report`} className="w-full h-full object-cover object-top" />
                        )}
                        <span className="absolute top-2 right-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          {vendorCount} {vendorCount === 1 ? "vendor" : "vendors"}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          {total} reports
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-3 flex-1 flex flex-col">
                        <div className="text-[14px] font-semibold text-[#242424] leading-snug">{it.n}</div>
                        {it.s && <div className="text-[12px] text-[#999] mt-0.5">{it.s}</div>}
                        <button
                          onClick={() => toggleExpand(idx)}
                          className="mt-2.5 flex items-center justify-center gap-1.5 w-full border border-gray-200 rounded-md py-1.5 text-[12px] font-medium text-[#555] hover:border-[rgb(136,173,153)] hover:text-[rgb(136,173,153)] transition-colors"
                        >
                          View {total} reports
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>

                        {/* Expandable vendor blocks */}
                        {isExpanded && (
                          <div className="mt-3 flex flex-col gap-2.5">
                            {LABS.map((L) => {
                              const labTypes = TYPES.filter((T) => (L.k + "|" + T.k) in it.cells && it.cells[L.k + "|" + T.k] !== "");
                              if (labTypes.length === 0) return null;
                              return (
                                <div key={L.k} className="border-l-2 pl-2.5" style={{ borderColor: L.c }}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: L.c }} />
                                    <span className="text-[12px] font-semibold text-[#242424]">{L.n}</span>
                                    <span className="text-[10px] text-[#999]">
                                      {labTypes.length}/{TYPES.length} reports
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {TYPES.map((T) => {
                                      const key = L.k + "|" + T.k;
                                      const verify = it.cells[key];
                                      if (!verify) return null;
                                      return (
                                        <button
                                          key={key}
                                          onClick={() =>
                                            openLightbox(
                                              imgFor(L.k, T.k, it.file, it),
                                              `${it.n} — ${L.n} · ${T.l}`,
                                              verify ? `${QYAO_ORIGIN}${verify}` : "",
                                              L.v
                                            )
                                          }
                                          className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#555] hover:border-[rgb(136,173,153)] hover:text-[rgb(136,173,153)] transition-colors"
                                        >
                                          {T.l}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {visibleCount < filtered.length && (
                <div ref={sentinelRef} className="text-center py-6 text-[13px] text-[#999]">
                  Loading more…
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container-wd">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "What Is HPLC Testing?",
                text: "High-Performance Liquid Chromatography (HPLC) is the gold standard for compound analysis. It separates, identifies, and quantifies each component in a sample, providing precise purity percentages. Our reports consistently show 99.5%+ purity across all product lines.",
              },
              {
                title: "Four Independent Laboratories",
                text: "Every batch is cross-verified by four fully independent third-party labs — Medutest, PeptideMeter, VendorInvestigate and Janoshik Analytical. None have financial ties to us, so every result is unbiased and verifiable. Pick a product, choose a lab, and open the report — the Medutest, PeptideMeter and VendorInvestigate reports each carry their own verification link.",
              },
              {
                title: "Our Testing Process",
                text: "Every manufactured batch is sampled and shipped directly to Janoshik for analysis. Reports cover compound identity confirmation and purity percentage via HPLC with mass spectrometry verification. Only batches that pass are released for sale.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-[#fafafa] border border-gray-100 rounded-xl p-7 text-center hover:border-[rgb(136,173,153)] hover:shadow-md transition-all"
              >
                <h3 className="text-[18px] font-semibold text-[#242424] mb-3" style={{ fontFamily: "var(--font-geologica)" }}>
                  {card.title}
                </h3>
                <p className="text-[14px] text-[#777] leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[15px] text-[#777] mb-5">
              Need a specific certificate of analysis? Contact our team for batch-specific documentation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[rgb(136,173,153)] text-white px-7 py-3 rounded-[35px] text-[15px] font-medium hover:bg-[rgb(120,158,138)] transition-colors"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                Browse Products
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 border-2 border-[rgb(136,173,153)] text-[rgb(136,173,153)] px-7 py-3 rounded-[35px] text-[15px] font-medium hover:bg-[rgb(136,173,153)] hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[110] bg-black/85 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-[32px] leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-t-xl overflow-hidden max-h-[75vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox.img} alt={lightbox.title} className="max-h-[75vh] w-auto object-contain" />
            </div>
            <div className="bg-white rounded-b-xl px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-[14px] font-semibold text-[#242424]">{lightbox.title}</div>
              {lightbox.verify && (
                <a
                  href={lightbox.verify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[rgb(136,173,153)] hover:underline"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                  </svg>
                  Verify on {lightbox.vname}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <Prefooter />
      <Footer />
    </>
  );
}
