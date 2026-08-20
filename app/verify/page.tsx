import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";

export default function VerifyPage() {
  return (
    <>
      <Header />
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777] mb-2">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">Verify</span>
          </nav>
          <h1 className="text-[28px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
            Verify
          </h1>
        </div>
      </div>

      <main className="py-20">
        <div className="container-wd max-w-2xl">
          <div className="bg-white rounded-[16px] p-10 text-center shadow-sm">
            {/* WhatsApp icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>

            <h2 className="text-[28px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
              Verify Official WhatsApp Accounts
            </h2>

            <p className="text-[16px] text-[#777] mb-8 leading-relaxed">
              Please verify all representatives before making payment.
            </p>

            {/* Regional Manager */}
            <div className="inline-block p-6 bg-[rgb(247,247,247)] rounded-[16px] mb-6 w-full max-w-md">
              <p className="text-[14px] text-[#777] mb-1">Regional Manager</p>
              <p className="text-[14px] text-[#999] mb-2">Sales &amp; Inquiries</p>
              <p className="text-[24px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
                +852 4701 5439
              </p>
              <a
                href="https://wa.me/85247015439"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-[35px] text-[15px] font-medium hover:bg-[#1da851] transition-colors"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* After-Sales Support */}
            <div className="inline-block p-6 bg-[rgb(247,247,247)] rounded-[16px] mb-8 w-full max-w-md">
              <p className="text-[14px] text-[#777] mb-1">After-Sales Support</p>
              <p className="text-[14px] text-[#999] mb-2">Service &amp; Follow-up</p>
              <p className="text-[24px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
                +852 4708 3254
              </p>
              <a
                href="https://wa.me/85247083254"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-[35px] text-[15px] font-medium hover:bg-[#1da851] transition-colors"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Warning notice */}
          <div className="mt-8 p-6 bg-[#fff8e1] rounded-[16px] border border-[#ffe082]">
            <div className="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="shrink-0 mt-0.5">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              <div>
                <h4 className="text-[16px] font-medium text-[#242424] mb-1" style={{ fontFamily: "var(--font-geologica)" }}>
                  Important Notice
                </h4>
                <p className="text-[14px] text-[#777]">
                  Always verify the WhatsApp numbers above before making any payment. Sparkpep will not be responsible for payments made to unauthorized accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
