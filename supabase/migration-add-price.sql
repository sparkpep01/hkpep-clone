-- ============================================================
-- 给 products 表添加 price 列
-- 在 Supabase Dashboard → SQL Editor 中运行此文件
-- URL: https://supabase.com/dashboard/project/yryqnzdiexvynkjusvjr/sql/new
-- ============================================================

-- 1. 添加 price 列（numeric 类型，默认 0）
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0;

-- 2. 给所有现有产品设置默认价格（可根据需要修改）
UPDATE public.products SET price = 45.00 WHERE price = 0 OR price IS NULL;

-- 验证
SELECT slug, name, price FROM public.products ORDER BY name;
