"use client";

import { useCallback, useEffect, useState } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function MessageManager({ showToast }: { showToast: (msg: string) => void }) {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) {
        setMessages([]);
        showToast("留言加载失败");
        return;
      }
      setMessages(await res.json());
    } catch {
      setMessages([]);
      showToast("留言加载失败");
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("确定要删除这条留言吗？此操作无法撤销。")) return;
    const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      showToast("留言已删除");
    } else {
      const d = await res.json().catch(() => ({}));
      showToast(`删除失败：${d.error || "未知错误"}`);
    }
  }

  function formatTime(iso: string): string {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString("zh-CN", { hour12: false });
    } catch {
      return iso;
    }
  }

  if (messages === null) {
    return <div className="text-center py-20 text-[#999] text-[15px]">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-[14px] text-[#777]">
          用户通过 Contact Us 页面 &quot;Send Us a Message&quot; 表单提交的留言。
        </p>
        <button
          onClick={load}
          className="text-[14px] text-[#777] border border-gray-200 rounded-[35px] px-5 py-2.5 hover:border-gray-300"
        >
          刷新
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-[16px] p-12 text-center text-[#999] text-[15px]">
          暂无留言
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => {
            const expanded = expandedId === m.id;
            return (
              <div key={m.id} className="bg-white rounded-[16px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-[16px] font-medium text-[#242424]">{m.name}</span>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-[13px] text-[rgb(136,173,153)] hover:underline"
                      >
                        {m.email}
                      </a>
                    </div>
                    <p className="text-[14px] text-[#242424] mt-1 font-medium">{m.subject}</p>
                    <p className={`text-[13px] text-[#999] mt-0.5`}>{formatTime(m.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(expanded ? null : m.id)}
                      className="text-[13px] text-[rgb(136,173,153)] hover:underline"
                    >
                      {expanded ? "收起" : "查看"}
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-[13px] text-[rgb(221,51,51)] hover:underline"
                    >
                      删除
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[15px] text-[#242424] leading-relaxed whitespace-pre-wrap">
                      {m.message}
                    </p>
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
