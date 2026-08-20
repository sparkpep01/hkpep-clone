"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";

const bestsellerSlugs = ["bpc157tb500", "reta", "glow", "tirz"];

export default function Bestsellers() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) =>
        setBestsellers(bestsellerSlugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Product[])
      );
  }, []);

  return (
    <section className="py-16">
      <div className="container-wd">
        <h2
          className="text-[36px] font-medium text-[#242424] mb-8"
          style={{ fontFamily: "var(--font-geologica)" }}
        >
          Bestsellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.slug}
              name={product.name}
              slug={product.slug}
              image={product.image}
              hoverImage={product.hoverImage}
              category={product.category}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
