"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import { useSiteImage } from "@/lib/use-site-images";

const steps = [
  {
    num: "1",
    title: "High-Purity Water Usage",
    desc: "The process begins with the dissolution of peptides in WFI (Water for Injection) grade water, the highest purity standard available. This ensures a clean and contamination-free foundation for our products.",
  },
  {
    num: "2",
    title: "Excipients for Stability",
    desc: "To enhance stability, mannitol and sucrose are added as excipients. Mannitol serves as a bulking agent, while sucrose acts as a lyoprotectant, preventing degradation and aggregation throughout the freeze-drying and storage process.",
  },
  {
    num: "3",
    title: "Electrospray Ionization (ESI) and Sodium Introduction",
    desc: "During the Electrospray Ionization (ESI) process, the peptide solution is sprayed into a fine mist. At this stage, sodium ions are introduced and readily attach to the peptide molecules, facilitating ionization. This controlled ionization process plays a crucial role in enhancing the stability and characterization of the peptides.",
  },
  {
    num: "4",
    title: "Sterile Filtration",
    desc: "Following ionization, the peptide solution undergoes sterile filtration through a 0.22 \u00b5m PES (polyethersulfone) filter membrane to remove any potential contaminants and ensure a high level of purity.",
  },
  {
    num: "5",
    title: "Precise Vialing and Freeze-Drying",
    desc: "Once filtered, the solution is precisely dispensed into 3 mL vials. The vials are partially stoppered and placed into a freeze-dryer for a carefully controlled 36-hour lyophilization cycle, which consists of freezing at -40\u00b0C, primary drying via sublimation, and secondary drying via desorption.",
  },
];

const bulletPoints = [
  "Cooperation with well-known companies.",
  "Many years of consumer trust.",
  "A database of peptides is available.",
];

export default function AboutUsPage() {
  const aboutBgUrl = useSiteImage("about-bg", 0, "/images/about-bg.jpg");

  return (
    <>
      <Header />
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777] mb-2">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">About Us</span>
          </nav>
          <h1 className="text-[28px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
            About Us
          </h1>
        </div>
      </div>

      {/* Factory background banner */}
      <section
        className="relative w-full h-[420px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${aboutBgUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-white text-[42px] md:text-[52px] font-medium leading-tight mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
            Our Manufacturing Facility
          </h2>
          <p className="text-white/85 text-[18px] md:text-[20px] max-w-3xl leading-relaxed">
            State-of-the-art production lines powering the quality, purity and consistency of every Sparkpep product.
          </p>
        </div>
      </section>

      <main className="py-16">
        <div className="container-wd max-w-4xl">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
              Trusted Peptide Manufacturer with 16+ Years of Experience
            </h2>
            <p className="text-[16px] text-[#777] mb-8">
              Delivering high-purity, custom and bulk peptides to clients worldwide.
            </p>
            <div className="flex flex-col gap-3 items-center">
              {bulletPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icons/dots.svg" alt="" className="w-3 h-3" />
                  <span className="text-[16px] text-[#333]">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About section */}
          <div className="mb-12">
            <h3 className="text-[24px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
              About US
            </h3>
            <p className="text-[16px] text-[#777] leading-relaxed mb-4">
              <strong className="text-[#242424]">Manufacturing Process of Sparkpep Research-Grade Peptides</strong>
            </p>
            <p className="text-[16px] text-[#777] leading-relaxed">
              At Sparkpep, we are dedicated to producing high-quality research-grade peptides with exceptional purity and consistency. We ensuring stringent quality control at every stage.
            </p>
          </div>

          {/* Manufacturing steps */}
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[rgb(136,173,153)] text-white flex items-center justify-center text-[20px] font-semibold" style={{ fontFamily: "var(--font-geologica)" }}>
                  {step.num}
                </div>
                <div className="flex-1">
                  <h4 className="text-[20px] font-medium text-[#242424] mb-3" style={{ fontFamily: "var(--font-geologica)" }}>
                    {step.title}
                  </h4>
                  <p className="text-[15px] text-[#777] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing statement */}
          <div className="mt-16 p-8 bg-[rgb(247,247,247)] rounded-[16px] text-center">
            <p className="text-[16px] text-[#333] leading-relaxed">
              At <strong className="text-[#242424]">Sparkpep</strong>, we are committed to delivering{" "}
              <strong className="text-[#242424]">research-grade peptides</strong> that meet the highest standards of quality and reliability.
            </p>
          </div>
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
