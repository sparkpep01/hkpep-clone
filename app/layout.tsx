import type { Metadata } from "next";
import { Cabin, Geologica } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/lib/cart-context";

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cabin",
});

const geologica = Geologica({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geologica",
});

export const metadata: Metadata = {
  title: "Sparkpep",
  description: "Sparkpep — Your Trusted and Reliable Source for All Peptides",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cabin.variable} ${geologica.variable}`}>
      <body>
        <CartProvider>
          {children}
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}
