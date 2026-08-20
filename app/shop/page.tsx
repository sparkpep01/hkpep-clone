"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";

export default function ShopPage() {
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  let filteredProducts = [...products];

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortBy === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <>
      <Header />
      {/* Page title banner */}
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777] mb-2">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">Shop</span>
          </nav>
          <h1
            className="text-[28px] font-medium text-[#242424]"
            style={{ fontFamily: "var(--font-geologica)" }}
          >
            Shop
          </h1>
        </div>
      </div>

      <main className="py-12">
        <div className="container-wd">
          {/* Shop toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <p className="text-[14px] text-[#777]">
              Showing all {filteredProducts.length} results
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-200 rounded-[35px] px-4 py-2 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)] w-[200px]"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-[35px] px-4 py-2 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)] bg-white"
              >
                <option value="default">Default sorting</option>
                <option value="name-asc">Sort by name: A to Z</option>
                <option value="name-desc">Sort by name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="text-center py-20">
              <p className="text-[18px] text-[#777] mb-4">No products found.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-[rgb(221,51,51)] font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
