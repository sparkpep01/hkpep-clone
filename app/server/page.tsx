"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ImageManager from "@/components/admin/ImageManager";
import MessageManager from "@/components/admin/MessageManager";

interface Product {
  name: string;
  slug: string;
  image: string;
  hoverImage?: string;
  category: string;
  price?: number;
  description?: string;
  spec?: string;
  purity?: string;
  form?: string;
  storage?: string;
}

type Mode = "list" | "edit" | "create";
type Tab = "products" | "images" | "messages";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<Tab>("products");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }, []);

  useEffect(() => {
    fetch("/api/login")
      .then((r) => r.json())
      .then(async (d) => {
        setAuthed(d.authed);
        if (d.authed) await loadProducts();
      });
  }, [loadProducts]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      await loadProducts();
    } else {
      const d = await res.json();
      setLoginError(d.error || "登录失败");
    }
  }

  async function handleLogout() {
    await fetch("/api/login", { method: "DELETE" });
    setAuthed(false);
    setProducts([]);
  }

  async function handleSave(product: Product, isNew: boolean) {
    const res = await fetch(isNew ? "/api/products" : `/api/products/${product.slug}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const d = await res.json();
    if (!res.ok) {
      showToast(`保存失败：${d.error}`);
      return false;
    }
    await loadProducts();
    setMode("list");
    setEditing(null);
    showToast(isNew ? "产品创建成功" : "产品已保存");
    return true;
  }

  async function handleDelete(slug: string) {
    if (!confirm(`确定要删除产品 ${slug} 吗？此操作无法撤销。`)) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    if (res.ok) {
      await loadProducts();
      showToast("产品已删除");
    } else {
      showToast("删除失败");
    }
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#777]">加载中...</div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[rgb(247,247,247)] flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[16px] p-8 w-full max-w-sm shadow-sm"
        >
          <h1 className="text-[24px] font-medium text-[#242424] mb-1" style={{ fontFamily: "var(--font-geologica)" }}>
            Sparkpep 后台管理
          </h1>
          <p className="text-[14px] text-[#777] mb-6">请输入管理密码登录</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理密码"
            className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] mb-4 focus:outline-none focus:border-[rgb(136,173,153)]"
            autoFocus
          />
          {loginError && <p className="text-[14px] text-[rgb(221,51,51)] mb-4">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-[rgb(221,51,51)] text-white py-3 rounded-[35px] font-medium hover:bg-[rgb(200,40,40)] transition-colors"
          >
            登 录
          </button>
          <Link href="/" className="block text-center text-[13px] text-[#999] mt-4 hover:text-[#777]">
            ← 返回网站
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(247,247,247)]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-[20px] font-medium text-[#242424]" style={{ fontFamily: "var(--font-geologica)" }}>
            Sparkpep 后台管理
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[14px] text-[#777] hover:text-[#242424]">查看网站</Link>
            <button
              onClick={handleLogout}
              className="text-[14px] text-[#777] hover:text-[rgb(221,51,51)] border border-gray-200 rounded-[35px] px-4 py-1.5"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Tab switch */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setTab("products")}
            className={`px-5 py-3 text-[15px] font-medium border-b-2 transition-colors ${
              tab === "products"
                ? "border-[rgb(221,51,51)] text-[rgb(221,51,51)]"
                : "border-transparent text-[#999] hover:text-[#242424]"
            }`}
          >
            产品管理 <span className="text-[13px] text-[#bbb]">({products.length})</span>
          </button>
          <button
            onClick={() => setTab("images")}
            className={`px-5 py-3 text-[15px] font-medium border-b-2 transition-colors ${
              tab === "images"
                ? "border-[rgb(221,51,51)] text-[rgb(221,51,51)]"
                : "border-transparent text-[#999] hover:text-[#242424]"
            }`}
          >
            图片管理
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`px-5 py-3 text-[15px] font-medium border-b-2 transition-colors ${
              tab === "messages"
                ? "border-[rgb(221,51,51)] text-[rgb(221,51,51)]"
                : "border-transparent text-[#999] hover:text-[#242424]"
            }`}
          >
            用户留言
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ===== Products ===== */}
        {tab === "products" && (
          <>
            {mode === "list" && (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-[14px] text-[#777]">管理网站产品，数据存储在 Supabase 数据库中。</p>
                  <button
                    onClick={() => { setEditing(null); setMode("create"); }}
                    className="bg-[rgb(136,173,153)] text-white px-6 py-2.5 rounded-[35px] text-[14px] font-medium hover:opacity-90"
                  >
                    + 添加产品
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.slug} className="bg-white rounded-[16px] p-4 flex gap-4 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-20 h-20 rounded-[12px] object-cover bg-[rgb(247,247,247)]" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-medium text-[#242424] truncate">{p.name}</h3>
                        <p className="text-[13px] text-[#999] truncate">{p.slug}</p>
                        <p className="text-[14px] font-semibold text-[rgb(221,51,51)]">
                          ${p.price != null ? p.price.toFixed(2) : "0.00"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => { setEditing(p); setMode("edit"); }}
                            className="text-[13px] text-[rgb(136,173,153)] hover:underline"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(p.slug)}
                            className="text-[13px] text-[rgb(221,51,51)] hover:underline"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {mode !== "list" && (
              <ProductForm
                initial={editing}
                isNew={mode === "create"}
                onCancel={() => { setMode("list"); setEditing(null); }}
                onSave={handleSave}
                showToast={showToast}
              />
            )}
          </>
        )}

        {/* ===== Images ===== */}
        {tab === "images" && (
          <ImageManager showToast={showToast} />
        )}

        {/* ===== Messages ===== */}
        {tab === "messages" && (
          <MessageManager showToast={showToast} />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#242424] text-white text-[14px] px-5 py-2.5 rounded-[35px] z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- Product Form ---------------- */

function ProductForm({
  initial,
  isNew,
  onCancel,
  onSave,
  showToast,
}: {
  initial: Product | null;
  isNew: boolean;
  onCancel: () => void;
  onSave: (p: Product, isNew: boolean) => Promise<boolean>;
  showToast: (msg: string) => void;
}) {
  const [product, setProduct] = useState<Product>(
    initial ?? { name: "", slug: "", image: "", category: "peptides", price: 0 }
  );
  const [saving, setSaving] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const hoverInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => ({ ...p, [key]: value }));
  }

  async function uploadImage(file: File, replacePath: string | undefined): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    if (replacePath) fd.append("replacePath", replacePath);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (!res.ok) {
      showToast(`上传失败：${d.error}`);
      return null;
    }
    return d.url as string;
  }

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast("正在上传图片...");
    const url = await uploadImage(file, isNew ? undefined : product.image);
    if (url) {
      set("image", url);
      showToast("产品图片已替换");
    }
    e.target.value = "";
  }

  async function handleHoverImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast("正在上传悬停图片...");
    const url = await uploadImage(file, isNew ? undefined : product.hoverImage);
    if (url) {
      set("hoverImage", url);
      showToast("悬停图片已替换");
    }
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product.name.trim() || !product.image) {
      showToast("请填写产品名称并上传产品图片");
      return;
    }
    if (isNew && !/^[a-z0-9-]+$/.test(product.slug)) {
      showToast("Slug 只能包含小写字母、数字和连字符");
      return;
    }
    setSaving(true);
    await onSave({ ...product, name: product.name.trim(), slug: product.slug.trim() }, isNew);
    setSaving(false);
  }

  const textFields: { key: keyof Product; label: string; textarea?: boolean }[] = [
    { key: "description", label: "产品描述", textarea: true },
    { key: "spec", label: "规格" },
    { key: "purity", label: "纯度" },
    { key: "form", label: "形态" },
    { key: "storage", label: "储存条件" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[16px] p-6 md:p-8 max-w-3xl">
      <h2 className="text-[22px] font-medium text-[#242424] mb-6" style={{ fontFamily: "var(--font-geologica)" }}>
        {isNew ? "新建产品" : `编辑：${initial?.name}`}
      </h2>

      {/* Image area */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-[14px] font-medium text-[#242424] mb-2">产品图片（必填）</p>
          <button
            type="button"
            onClick={() => mainInputRef.current?.click()}
            className="w-full aspect-square rounded-[12px] overflow-hidden border-2 border-dashed border-gray-200 hover:border-[rgb(136,173,153)] transition-colors bg-[rgb(247,247,247)] flex items-center justify-center"
          >
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="产品图片" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[14px] text-[#999]">点击上传图片</span>
            )}
          </button>
          <input ref={mainInputRef} type="file" accept="image/*" hidden onChange={handleMainImage} />
          <p className="text-[12px] text-[#999] mt-1.5">{isNew ? "新图片将保存到产品图片目录" : "上传后将直接替换原图片文件"}</p>
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#242424] mb-2">悬停图片（可选）</p>
          <button
            type="button"
            onClick={() => hoverInputRef.current?.click()}
            className="w-full aspect-square rounded-[12px] overflow-hidden border-2 border-dashed border-gray-200 hover:border-[rgb(136,173,153)] transition-colors bg-[rgb(247,247,247)] flex items-center justify-center"
          >
            {product.hoverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.hoverImage} alt="悬停图片" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[14px] text-[#999]">点击上传图片</span>
            )}
          </button>
          <input ref={hoverInputRef} type="file" accept="image/*" hidden onChange={handleHoverImage} />
        </div>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <span className="text-[14px] font-medium text-[#242424]">产品名称（必填）</span>
          <input
            value={product.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1.5 w-full border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]"
            required
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-[#242424]">Slug（URL 标识）</span>
          <input
            value={product.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            disabled={!isNew}
            placeholder="如 retatrutide"
            className="mt-1.5 w-full border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]] disabled:bg-gray-50 disabled:text-[#999]"
          />
        </label>
      </div>

      {/* 价格 */}
      <div className="mb-4">
        <label className="block">
          <span className="text-[14px] font-medium text-[#242424]">价格（美元）</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={product.price ?? 0}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="mt-1.5 w-full md:w-[200px] border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]"
            placeholder="0.00"
          />
        </label>
      </div>

      {textFields.map(({ key, label, textarea }) => (
        <label key={String(key)} className="block mb-4">
          <span className="text-[14px] font-medium text-[#242424]">{label}</span>
          {textarea ? (
            <textarea
              value={(product[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value as never)}
              rows={3}
              className="mt-1.5 w-full border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]"
            />
          ) : (
            <input
              value={(product[key] as string) ?? ""}
              onChange={(e) => set(key, e.target.value as never)}
              className="mt-1.5 w-full border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[rgb(136,173,153)]"
            />
          )}
        </label>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[rgb(221,51,51)] text-white px-8 py-2.5 rounded-[35px] text-[15px] font-medium hover:bg-[rgb(200,40,40)] disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#777] px-8 py-2.5 rounded-[35px] text-[15px] border border-gray-200 hover:border-gray-300"
        >
          取消
        </button>
      </div>
    </form>
  );
}
