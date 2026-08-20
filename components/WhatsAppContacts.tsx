"use client";

const WHATSAPP_MANAGER = "85247015439"; // Regional Manager WhatsApp number
const WHATSAPP_SERVICE = "85247083254"; // After-Sales Support WhatsApp number

function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.99 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppContacts() {
  const managerLink = `https://wa.me/${WHATSAPP_MANAGER}?text=${encodeURIComponent("Hello, I would like to contact the Regional Manager")}`;
  const serviceLink = `https://wa.me/${WHATSAPP_SERVICE}?text=${encodeURIComponent("Hello, I need after-sales support")}`;

  return (
    <section className="py-16 bg-white">
      <div className="container-wd">
        <div className="text-center mb-10">
          <h2
            className="text-[36px] font-medium text-[#242424] mb-2"
            style={{ fontFamily: "var(--font-geologica)" }}
          >
            Contact Us on WhatsApp
          </h2>
          <p className="text-[16px] text-[#777]">
            Reach out to us directly — we&apos;re here to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Regional Manager */}
          <a
            href={managerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-[rgb(247,247,247)] hover:bg-[#25D366]/10 border border-gray-100 rounded-[16px] p-6 transition-all hover:shadow-lg"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <WhatsAppIcon size={32} />
            </div>
            <div>
              <h3
                className="text-[20px] font-medium text-[#242424] mb-1"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                Regional Manager
              </h3>
              <p className="text-[14px] text-[#777]">
                Regional Manager — Sales &amp; Inquiries
              </p>
            </div>
          </a>

          {/* After-Sales Support */}
          <a
            href={serviceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-[rgb(247,247,247)] hover:bg-[#25D366]/10 border border-gray-100 rounded-[16px] p-6 transition-all hover:shadow-lg"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <WhatsAppIcon size={32} />
            </div>
            <div>
              <h3
                className="text-[20px] font-medium text-[#242424] mb-1"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                After-Sales Support
              </h3>
              <p className="text-[14px] text-[#777]">
                After-Sales Support — Service &amp; Follow-up
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
