-- ============================================================
-- Sparkpep — 站点图片管理表（site_images）
-- 在 Supabase SQL Editor 运行此脚本
-- ============================================================

-- 1. 创建站点图片表
create table if not exists public.site_images (
  id          serial primary key,
  section     text not null,
  slot        integer not null default 0,
  url         text not null,
  label       text,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  unique(section, slot)
);

alter table public.site_images enable row level security;

-- 读取策略：所有人可读
drop policy if exists "site_images_read_all" on public.site_images;
create policy "site_images_read_all"
  on public.site_images for select
  using (true);

-- 写入策略：允许 anon 和 service_role
drop policy if exists "site_images_write_all" on public.site_images;
create policy "site_images_write_all"
  on public.site_images for all
  using (auth.role() in ('anon', 'service_role'))
  with check (auth.role() in ('anon', 'service_role'));

-- 2. 创建站点图片存储桶（与产品图分开）
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- 存储桶策略
drop policy if exists "site_bucket_read_all" on storage.objects;
create policy "site_bucket_read_all"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "site_bucket_write_all" on storage.objects;
create policy "site_bucket_write_all"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() in ('anon', 'service_role'));

drop policy if exists "site_bucket_update_all" on storage.objects;
create policy "site_bucket_update_all"
  on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() in ('anon', 'service_role'));

drop policy if exists "site_bucket_delete_all" on storage.objects;
create policy "site_bucket_delete_all"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() in ('anon', 'service_role'));

-- 3. 导入初始数据（当前网站所有硬编码图片）
insert into public.site_images (section, slot, url, label, sort_order) values
  -- 首页轮播背景图
  ('hero', 0, '/images/research1.jpg', '首页轮播背景图', 0),
  -- 网站 Logo
  ('logo', 0, '/images/sparkpep-logo.jpg', '网站 Logo', 0),
  -- 品牌跑马灯（7张）
  ('marquee', 0, '/images/marquee/connect-1.png', '跑马灯图片 1', 0),
  ('marquee', 1, '/images/marquee/connect-2.png', '跑马灯图片 2', 1),
  ('marquee', 2, '/images/marquee/connect-3.png', '跑马灯图片 3', 2),
  ('marquee', 3, '/images/marquee/connect-4.png', '跑马灯图片 4', 3),
  ('marquee', 4, '/images/marquee/connect-5.png', '跑马灯图片 5', 4),
  ('marquee', 5, '/images/marquee/connect-6.png', '跑马灯图片 6', 5),
  ('marquee', 6, '/images/marquee/connect-7.png', '跑马灯图片 7', 6),
  -- 用户评价头像（6张）
  ('testimonials', 0, '/images/testimonials/customer-1.jpg', 'Brooklyn Simmons', 0),
  ('testimonials', 1, '/images/testimonials/customer-2.jpg', 'Jerome Bell', 1),
  ('testimonials', 2, '/images/testimonials/customer-3.jpg', 'Kathryn Murphy', 2),
  ('testimonials', 3, '/images/testimonials/customer-4.jpg', 'Guy Hawkins', 3),
  ('testimonials', 4, '/images/testimonials/customer-5.jpg', 'Dianne Russell', 4),
  ('testimonials', 5, '/images/testimonials/customer-6.jpg', 'Ronald Richards', 5),
  -- Innovation 配图
  ('innovation-main', 0, '/images/innovation-img.webp', 'Innovation 配图', 0),
  -- Innovation 图标（4个）
  ('innovation-icons', 0, '/images/icons/inv-icon1.svg', 'Satisfaction Guaranteed', 0),
  ('innovation-icons', 1, '/images/icons/inv-icon2.svg', 'Customer Service', 1),
  ('innovation-icons', 2, '/images/icons/inv-icon3.svg', 'Fast Shipping', 2),
  ('innovation-icons', 3, '/images/icons/inv-icon4.svg', 'Quality Tested', 3),
  -- Simple Powerful 配图
  ('simple-powerful', 0, '/images/next-gen-img.webp', 'Simple Powerful 配图', 0),
  -- 关于我们背景图
  ('about-bg', 0, '/images/about-bg.jpg', '关于我们背景图', 0),
  -- 客服头像组图
  ('prefooter-avatars', 0, '/images/misc/avatars-help.png', '客服头像组图', 0)
on conflict (section, slot) do nothing;
