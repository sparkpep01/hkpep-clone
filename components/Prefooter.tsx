"use client";

import { useSiteImage } from "@/lib/use-site-images";

const WHATSAPP_MANAGER = "85247015439"; // Regional Manager WhatsApp number

export default function Prefooter() {
  const avatarsUrl = useSiteImage("prefooter-avatars", 0, "/images/misc/avatars-help.png");
  const expertChatLink = `https://wa.me/${WHATSAPP_MANAGER}?text=${encodeURIComponent("Hello, I would like to contact the Regional Manager")}`;

  return (
    <section className="py-16 bg-[rgb(247,247,247)]">
      <div className="container-wd">
        <div className="flex flex-col lg:flex-row items-start gap-8 p-8 bg-white rounded-[16px]">
          {/* Left: Need help */}
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarsUrl}
              alt=""
              className="mb-4 h-[42px] w-auto"
            />
            <h3
              className="text-[24px] font-medium text-[#242424] mb-4"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Need help choosing?
            </h3>
            <a
              href={expertChatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[rgb(221,51,51)] text-white px-8 py-3 rounded-[35px] text-[16px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Contact With Expert
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/arrow.svg" alt="arrow" className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Address */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/map-pointer.svg"
                alt=""
                className="w-[42px] h-[42px] shrink-0"
              />
              <div>
                <h4
                  className="text-[18px] font-medium text-[#242424] mb-2"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  25/F, Office 5, 308 Des Voeux Road Central, Sheung Wan
                </h4>
                <p className="text-[15px] text-[#777] mb-3">
                  sparkpep01@gmail.com
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[rgb(221,51,51)] text-[15px] font-medium capitalize hover:underline"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
