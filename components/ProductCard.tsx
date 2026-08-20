"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  name: string;
  slug: string;
  image: string;
  hoverImage?: string;
  category: string;
  price?: number;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ProductCard({ name, slug, image, hoverImage, category, price }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      slug,
      name,
      image,
      price: price ?? 0,
    });
  }

  return (
    <div
      className="group bg-[rgb(247,247,247)] rounded-[16px] overflow-hidden transition-shadow hover:shadow-lg relative"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden p-4">
        <Link href={`/product/${slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-[16px] transition-opacity duration-300 group-hover:opacity-0"
          />
          {hoverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={hoverImage}
              alt={name}
              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-[16px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Hover action button */}
        {showQuickView && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 animate-fade-in">
            <Link
              href={`/product/${slug}`}
              className="flex-1 bg-white/90 backdrop-blur text-[#333] text-[12px] font-medium py-2 rounded-[20px] capitalize hover:bg-[rgb(136,173,153)] hover:text-white transition-colors text-center"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Quick view
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-[rgb(221,51,51)] text-white text-[12px] font-medium py-2 px-4 rounded-[20px] capitalize hover:bg-[rgb(200,40,40)] transition-colors"
              style={{ fontFamily: "var(--font-geologica)" }}
            >
              Add to cart
            </button>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="px-4 pb-6 text-center">
        <h3
          className="text-[20px] font-medium text-[#333] mb-1"
          style={{ fontFamily: "var(--font-geologica)" }}
        >
          <Link href={`/product/${slug}`} className="hover:text-[rgb(136,173,153)] transition-colors">
            {name}
          </Link>
        </h3>
        <div className="mb-2">
          <Link
            href={`/product-category/${category}`}
            className="text-[14px] text-[#777] capitalize hover:text-[rgb(136,173,153)]"
          >
            {category}
          </Link>
        </div>
        {price != null && price > 0 && (
          <p className="text-[18px] font-semibold text-[rgb(221,51,51)] mb-3" style={{ fontFamily: "var(--font-geologica)" }}>
            {formatPrice(price)}
          </p>
        )}
        <Link
          href={`/product/${slug}`}
          className="inline-block bg-[rgb(221,51,51)] text-white px-6 py-2.5 rounded-[35px] text-[14px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors"
          style={{ fontFamily: "var(--font-geologica)" }}
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
