"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(async (r) => {
        if (r.status === 404) return null;
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoaded(true);
      });
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) => setRelatedProducts(all.filter((p) => p.slug !== slug).slice(0, 4)));
  }, [slug]);

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="py-24 text-center text-[#777]">Loading...</main>
        <Footer />
      </>
    );
  }

  if (!product) notFound();

  const specs = [
    { label: "Product Name", value: product.name },
    { label: "Specification", value: product.spec || "10mg per vial" },
    { label: "Purity", value: product.purity || ">= 99%" },
    { label: "Form", value: product.form || "Lyophilized powder" },
    { label: "Storage", value: product.storage || "Store at -20\u00b0C in a cool, dry place" },
    { label: "Category", value: product.category },
  ];

  return (
    <>
      <Header />
      <div className="bg-[rgb(247,247,247)] py-8">
        <div className="container-wd">
          <nav className="text-[14px] text-[#777]">
            <Link href="/" className="hover:text-[rgb(136,173,153)]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-[rgb(136,173,153)]">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-[#242424]">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="py-12">
        <div className="container-wd">
          {/* Product main section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product image */}
            <div className="bg-[rgb(247,247,247)] rounded-[16px] p-8 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md aspect-square object-cover rounded-[16px]"
              />
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-center">
              <div className="mb-3">
                <Link
                  href={`/product-category/${product.category}`}
                  className="text-[14px] text-[#777] capitalize hover:text-[rgb(136,173,153)]"
                >
                  {product.category}
                </Link>
              </div>
              <h1
                className="text-[36px] font-medium text-[#242424] mb-4"
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                {product.name}
              </h1>

              {product.price != null && product.price > 0 && (
                <p className="text-[28px] font-semibold text-[rgb(221,51,51)] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
                  {formatPrice(product.price)}
                </p>
              )}

              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#fbbc34">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-[14px] text-[#777]">(1 review)</span>
              </div>

              <p className="text-[16px] text-[#777] mb-6 leading-relaxed">
                {product.description || `High-purity ${product.name} peptide for research purposes. Laboratory use only. Not for human consumption.`}
              </p>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-[35px] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#777] hover:text-[#242424]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="w-12 text-center text-[16px] font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#777] hover:text-[#242424]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (product) {
                      addItem(
                        {
                          slug: product.slug,
                          name: product.name,
                          image: product.image,
                          price: product.price ?? 0,
                        },
                        quantity
                      );
                    }
                  }}
                  className="flex-1 bg-[rgb(221,51,51)] text-white px-8 py-3 rounded-[35px] text-[16px] font-medium capitalize hover:bg-[rgb(200,40,40)] transition-colors"
                  style={{ fontFamily: "var(--font-geologica)" }}
                >
                  Add to cart
                </button>
              </div>

              {/* Quick specs */}
              <div className="mt-8 p-5 bg-[rgb(247,247,247)] rounded-[16px]">
                <div className="grid grid-cols-2 gap-3">
                  {specs.slice(0, 4).map((spec) => (
                    <div key={spec.label}>
                      <span className="text-[12px] text-[#999]">{spec.label}</span>
                      <p className="text-[14px] text-[#333] font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-16">
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-[16px] font-medium transition-colors border-b-2 ${
                  activeTab === "description"
                    ? "border-[rgb(221,51,51)] text-[#242424]"
                    : "border-transparent text-[#777] hover:text-[#242424]"
                }`}
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-6 py-3 text-[16px] font-medium transition-colors border-b-2 ${
                  activeTab === "specs"
                    ? "border-[rgb(221,51,51)] text-[#242424]"
                    : "border-transparent text-[#777] hover:text-[#242424]"
                }`}
                style={{ fontFamily: "var(--font-geologica)" }}
              >
                Specifications
              </button>
            </div>

            {activeTab === "description" ? (
              <div className="prose max-w-3xl text-[#777] text-[15px] leading-relaxed">
                <h3 className="text-[20px] font-medium text-[#242424] mb-4" style={{ fontFamily: "var(--font-geologica)" }}>
                  Full Product Description
                </h3>
                <table className="w-full mb-4">
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={spec.label} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-[#242424]">{spec.label}:</td>
                        <td className="py-2">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {product.description && (
                  <>
                    <p className="mb-4">{product.description}</p>
                    <h4 className="text-[16px] font-medium text-[#242424] mt-4 mb-2">Typical Research Applications:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Soft tissue and joint recovery studies</li>
                      <li>Tendon and ligament healing models</li>
                      <li>Post-exercise recovery and muscle regeneration</li>
                      <li>Studies on collagen synthesis and tissue repair</li>
                      <li>Inflammation reduction research</li>
                    </ul>
                    <p className="mt-4 text-[14px] text-[#999]">
                      For laboratory research use only. Not for human consumption.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={spec.label} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-medium text-[#242424] w-[200px]">{spec.label}</td>
                        <td className="py-3 text-[#777]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Related products */}
          <div>
            <h2 className="text-[28px] font-medium text-[#242424] mb-8" style={{ fontFamily: "var(--font-geologica)" }}>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  name={p.name}
                  slug={p.slug}
                  image={p.image}
                  hoverImage={p.hoverImage}
                  category={p.category}
                  price={p.price}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Prefooter />
      <Footer />
    </>
  );
}
