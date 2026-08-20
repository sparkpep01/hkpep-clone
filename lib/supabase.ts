import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 客户端初始化
 *
 * 需要环境变量：
 *   SUPABASE_URL             — Project URL (https://xxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY — 后端专用管理员密钥（绝不暴露到前端）
 *
 * 如果环境变量未设置（如本地开发），返回 null，调用方降级到 JSON 文件。
 */

let _client: SupabaseClient | null = null;

// publishable key 是公开密钥（设计用于前端），作为默认值安全无碍
const DEFAULT_URL = "https://yryqnzdiexvynkjusvjr.supabase.co";
const DEFAULT_KEY = "sb_publishable_fUOe6Uz8J-mbz5WZHbNlXw_Ev5Xj4Lb";

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL || DEFAULT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_KEY;

  if (!url || !key) return null;

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
