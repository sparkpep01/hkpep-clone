"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to send");
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitError("Sorry, your message could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Address",
      lines: [
        "25/F, Office 5, 308 Des Voeux Road Central, Sheung Wan",
        "Monday – Tuesday 10.00am – 4.00pm (By Appointment Only)",
        "Wednesday – Saturday, 10.00am – 4.00pm",
        "Sunday, Closed",
      ],
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Phone",
      lines: ["Ms. Zhang: +852 5649 9168"],
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      title: "Email",
      lines: ["sparkpep01@gmail.com"],
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777] mb-2">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">Contact Us</span>
          </nav>
          <h1 className="text-[28px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
            Contact Us
          </h1>
        </div>
      </div>

      <main className="py-16">
        <div className="container-wd">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-[28px] font-medium text-[#242424] mb-8" style={{ fontFamily: "var(--font-geologica)" }}>
                Get in Touch
              </h2>
              <div className="space-y-8">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-[rgb(247,247,247)] text-[rgb(136,173,153)] flex items-center justify-center">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-[18px] font-medium text-[#242424] mb-2" style={{ fontFamily: "var(--font-geologica)" }}>
                        {info.title}
                      </h3>
                      {info.lines.map((line, idx) => (
                        <p key={idx} className="text-[15px] text-[#777]">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-[28px] font-medium text-[#242424] mb-8" style={{ fontFamily: "var(--font-geologica)" }}>
                Send Us a Message
              </h2>
              {submitted && (
                <div className="mb-6 p-4 bg-[rgb(136,173,153)] text-white rounded-[16px] text-[15px]">
                  Thank you for your message. We will get back to you shortly.
                </div>
              )}
              {submitError && (
                <div className="mb-6 p-4 bg-[rgb(221,51,51)] text-white rounded-[16px] text-[15px]">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[14px] text-[#242424] mb-2 font-medium" style={{ fontFamily: "var(--font-geologica)" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:border-[rgb(136,173,153)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#242424] mb-2 font-medium" style={{ fontFamily: "var(--font-geologica)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:border-[rgb(136,173,153)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#242424] mb-2 font-medium" style={{ fontFamily: "var(--font-geologica)" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:border-[rgb(136,173,153)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] text-[#242424] mb-2 font-medium" style={{ fontFamily: "var(--font-geologica)" }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:border-[rgb(136,173,153)] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[rgb(221,51,51)] text-white px-8 py-3 rounded-[35px] text-[16px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
