"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SiteImageItem {
  section: string;
  slot: number;
  url: string;
  label: string | null;
}

interface SectionDef {
  id: string;
  label: string;
  description: string;
  multi: boolean;
}

const SECTIONS: SectionDef[] = [
  { id: "hero", label: "首页主横幅", description: "首页顶部横幅图片", multi: false },
  { id: "logo", label: "网站 Logo", description: "页眉和页脚显示的 Logo", multi: false },
  { id: "marquee", label: "品牌滚动图", description: "首页品牌跑马灯图片", multi: true },
  { id: "testimonials", label: "客户评价头像", description: "首页客户评价头像", multi: true },
  { id: "innovation-main", label: "创新板块主图", description: "创新板块的主图", multi: false },
  { id: "innovation-icons", label: "创新板块图标", description: "创新板块的四个功能图标", multi: true },
  { id: "simple-powerful", label: "Simple Powerful 配图", description: "Simple Powerful 板块的图片", multi: false },
  { id: "about-bg", label: "关于我们背景图", description: "关于我们页面的背景横幅", multi: false },
  { id: "prefooter-avatars", label: "页脚上方客服头像", description: "页脚上方的客服头像图", multi: false },
];

export default function ImageManager({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const [imagesBySection, setImagesBySection] = useState<Record<string, SiteImageItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-images");
      if (res.ok) {
        const all: SiteImageItem[] = await res.json();
        const grouped: Record<string, SiteImageItem[]> = {};
        for (const img of all) {
          if (!grouped[img.section]) grouped[img.section] = [];
          grouped[img.section].push(img);
        }
        // Sort by slot
        for (const key of Object.keys(grouped)) {
          grouped[key].sort((a, b) => a.slot - b.slot);
        }
        setImagesBySection(grouped);
      }
    } catch {
      showToast("图片加载失败");
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Replace image
  async function handleReplace(section: string, slot: number, file: File) {
    showToast(`正在上传到 ${section}...`);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("section", section);
    fd.append("slot", String(slot));

    const res = await fetch("/api/site-images", { method: "POST", body: fd });
    const d = await res.json();
    if (res.ok) {
      showToast("图片已替换，网站已更新");
      await loadAll();
    } else {
      showToast(`替换失败：${d.error}`);
    }
  }

  // Add new image (multi-image sections)
  async function handleAdd(section: string, file: File) {
    const existing = imagesBySection[section] || [];
    const newSlot = existing.length > 0 ? Math.max(...existing.map((i) => i.slot)) + 1 : 0;

    showToast(`正在上传到 ${section}...`);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("section", section);
    fd.append("slot", String(newSlot));

    const res = await fetch("/api/site-images", { method: "POST", body: fd });
    const d = await res.json();
    if (res.ok) {
      showToast("图片已添加");
      await loadAll();
    } else {
      showToast(`添加失败：${d.error}`);
    }
  }

  // Delete image
  async function handleDelete(section: string, slot: number) {
    if (!confirm("确定要删除这张图片吗？")) return;

    const res = await fetch("/api/site-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, slot }),
    });

    if (res.ok) {
      showToast("图片已删除");
      await loadAll();
    } else {
      showToast("删除失败");
    }
  }

  function onFileSelected(section: string, slot: number | null, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (slot !== null) {
      handleReplace(section, slot, file);
    } else {
      handleAdd(section, file);
    }
    e.target.value = "";
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-[14px] text-[#777]">按位置管理网站所有图片，修改后立即生效。</p>
        </div>
        <button
          onClick={loadAll}
          className="text-[14px] text-[#777] border border-gray-200 rounded-[35px] px-5 py-2.5 hover:border-gray-300"
        >
          刷新
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#999] text-[15px]">加载中...</div>
      ) : (
        <div className="space-y-4">
          {SECTIONS.map((section) => {
            const images = imagesBySection[section.id] || [];
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="bg-white rounded-[16px] overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100 shrink-0"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {images.length === 0 && (
                        <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-[#bbb] text-[12px]">
                          空
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[16px] font-medium text-[#242424]">{section.label}</h3>
                      <p className="text-[13px] text-[#999]">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#bbb]">{images.length} 张</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-[#999] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                      {images.map((img) => (
                        <div
                          key={`${img.section}-${img.slot}`}
                          className="bg-[rgb(247,247,247)] rounded-[12px] overflow-hidden group relative"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.label || ""}
                            className="w-full aspect-square object-cover bg-white"
                          />
                          <div className="p-2.5">
                            {img.label && (
                              <p className="text-[12px] font-medium text-[#242424] truncate">{img.label}</p>
                            )}
                            <p className="text-[11px] text-[#bbb]">位置 #{img.slot}</p>
                          </div>
                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                const refKey = `${img.section}-${img.slot}`;
                                uploadRefs.current[refKey]?.click();
                              }}
                              className="bg-white/90 text-[#242424] text-[13px] px-4 py-2 rounded-[35px] hover:bg-white whitespace-nowrap"
                            >
                              替换
                            </button>
                            {section.multi && (
                              <button
                                onClick={() => handleDelete(img.section, img.slot)}
                                className="bg-[rgb(221,51,51)] text-white text-[13px] px-4 py-2 rounded-[35px] hover:bg-[rgb(200,40,40)] whitespace-nowrap"
                              >
                                删除
                              </button>
                            )}
                          </div>
                          <input
                            ref={(el) => {
                              uploadRefs.current[`${img.section}-${img.slot}`] = el;
                            }}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => onFileSelected(img.section, img.slot, e)}
                          />
                        </div>
                      ))}

                      {/* Add new (multi-image sections) */}
                      {section.multi && (
                        <button
                          onClick={() => {
                            const refKey = `${section.id}-new`;
                            uploadRefs.current[refKey]?.click();
                          }}
                          className="aspect-square rounded-[12px] border-2 border-dashed border-gray-200 hover:border-[rgb(136,173,153)] transition-colors bg-[rgb(247,247,247)] flex flex-col items-center justify-center gap-2 text-[#999] hover:text-[rgb(136,173,153)]"
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          <span className="text-[13px]">添加图片</span>
                        </button>
                      )}
                    </div>

                    {images.length === 0 && !section.multi && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            const refKey = `${section.id}-new`;
                            uploadRefs.current[refKey]?.click();
                          }}
                          className="bg-[rgb(136,173,153)] text-white px-6 py-2.5 rounded-[35px] text-[14px] font-medium hover:opacity-90"
                        >
                          上传图片
                        </button>
                      </div>
                    )}

                    <input
                      ref={(el) => {
                        uploadRefs.current[`${section.id}-new`] = el;
                      }}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => onFileSelected(section.id, null, e)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
