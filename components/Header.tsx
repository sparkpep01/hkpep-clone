"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteImage } from "@/lib/use-site-images";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Verify", href: "/verify" },
  { label: "Reports", href: "/reports" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoUrl = useSiteImage("logo", 0, "/images/sparkpep-logo.jpg");
  const { items, itemCount, totalPrice, isOpen, openCart, closeCart, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen, searchOpen, isOpen]);

  return (
    <>
      {/* Main header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{ minHeight: "82px" }}
      >
        <div className="container-wd flex items-center justify-between h-[82px]">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Sparkpep"
                className="h-[36px] w-auto"
                style={{ maxWidth: "220px" }}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[20px] font-normal capitalize text-[#242424] hover:text-[rgb(136,173,153)] transition-colors"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right tools */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-[#242424] hover:text-[rgb(136,173,153)] transition-colors"
              style={{ fontFamily: "var(--font-geologica)", fontSize: "20px" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search</span>
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-[#242424] hover:text-[rgb(136,173,153)] transition-colors"
            >
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[rgb(221,51,51)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-[16px]">
                <span className="block text-[11px] text-[#777]">{itemCount} items</span>
                <span className="block font-semibold">{formatPrice(totalPrice)}</span>
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex flex-col gap-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="w-6 h-0.5 bg-[#242424]"></span>
              <span className="w-6 h-0.5 bg-[#242424]"></span>
              <span className="w-6 h-0.5 bg-[#242424]"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center pt-[15vh] animate-fade-in">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full max-w-2xl px-6">
            <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); }}>
              <input
                type="text"
                placeholder="Search for products"
                autoFocus
                className="flex-1 bg-transparent border-b-2 border-white/30 text-white text-[24px] py-3 focus:outline-none focus:border-[rgb(136,173,153)]"
                style={{ fontFamily: "var(--font-geologica)" }}
              />
              <button type="submit" className="text-white text-[16px] font-medium capitalize hover:text-[rgb(136,173,153)]" style={{ fontFamily: "var(--font-geologica)" }}>
                Search
              </button>
            </form>
            <p className="text-white/40 text-[14px] mt-4">Start typing to see products you are looking for.</p>
          </div>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Sparkpep" className="h-[30px] w-auto" style={{ maxWidth: "180px" }} />
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#777] hover:text-[#242424]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Mobile search */}
              <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search for products"
                  className="flex-1 border border-gray-200 rounded-[35px] px-4 py-2 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]"
                />
                <button type="submit" className="bg-[rgb(221,51,51)] text-white px-4 rounded-[35px] text-[14px]">Go</button>
              </form>
              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[18px] text-[#242424] capitalize py-3 border-b border-gray-100 hover:text-[rgb(136,173,153)]"
                    style={{ fontFamily: "var(--font-geologica)" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={closeCart} />
          <div className="absolute right-0 top-0 bottom-0 w-[400px] max-w-full bg-white shadow-2xl flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-[18px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
                Shopping cart
              </h3>
              <button onClick={closeCart} className="text-[#777] hover:text-[#242424]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" className="mx-auto mb-4">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <p className="text-[16px] text-[#777] mb-4">No products in the cart.</p>
                  <button
                    onClick={closeCart}
                    className="text-[14px] text-[rgb(221,51,51)] font-medium capitalize hover:underline"
                    style={{ fontFamily: "var(--font-geologica)" }}
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Cart items list */}
                <div className="flex-1 overflow-y-auto p-4">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-3 p-3 border-b border-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-[8px] object-cover bg-[rgb(247,247,247)] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-medium text-[#242424] truncate">
                          <Link href={`/product/${item.slug}`} onClick={closeCart}>
                            {item.name}
                          </Link>
                        </h4>
                        <p className="text-[13px] text-[rgb(221,51,51)] font-medium">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-[20px] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#242424] text-[14px]"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[13px] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#777] hover:text-[#242424] text-[14px]"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="flex items-center gap-1 text-[12px] text-[#999] hover:text-[rgb(221,51,51)] transition-colors"
                            title="Remove from cart"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-semibold text-[#242424]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart footer */}
                <div className="border-t border-gray-100 p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-[16px] text-[#242424]">Total</span>
                    <span className="text-[20px] font-semibold text-[rgb(221,51,51)]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    className="w-full bg-[rgb(221,51,51)] text-white py-3 rounded-[35px] text-[15px] font-medium hover:bg-[rgb(200,40,40)] transition-colors mb-2"
                    style={{ fontFamily: "var(--font-geologica)" }}
                  >
                    Checkout
                  </button>
                  <button
                    onClick={closeCart}
                    className="w-full text-[14px] text-[#777] hover:text-[#242424] py-2"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
