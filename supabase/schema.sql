-- ============================================================
-- Sparkpep — Supabase 初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中运行此文件
-- ============================================================

-- 1. 创建产品表 --------------------------------------------------
create table if not exists public.products (
  slug          text primary key,
  name          text not null,
  image         text not null,
  hover_image   text,
  category      text not null default 'peptides',
  price         numeric(10,2) default 0,
  description   text,
  spec          text,
  purity        text,
  form          text,
  storage       text,
  created_at    timestamptz default now()
);

-- 如果表已存在，添加 price 列（幂等）
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0;

-- 启用行级安全（RLS）
alter table public.products enable row level security;

-- 公开读取策略（所有人可读产品列表）
drop policy if exists "products_read_all" on public.products;
create policy "products_read_all"
  on public.products for select
  using (true);

-- 写入策略：允许 anon + service_role（后端 API 使用 publishable key）
-- 安全由应用层管理后台登录保护，后续可升级为仅 service_role
drop policy if exists "products_write_all" on public.products;
create policy "products_write_all"
  on public.products for all
  using (auth.role() in ('anon', 'service_role'))
  with check (auth.role() in ('anon', 'service_role'));

-- 2. 创建存储桶 --------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 存储桶读取策略：所有人可读
drop policy if exists "bucket_read_all" on storage.objects;
create policy "bucket_read_all"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 存储桶写入策略：允许 anon + service_role
drop policy if exists "bucket_write_all" on storage.objects;
create policy "bucket_write_all"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() in ('anon', 'service_role'));

-- 存储桶删除/更新策略：允许 anon + service_role
drop policy if exists "bucket_update_all" on storage.objects;
create policy "bucket_update_all"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() in ('anon', 'service_role'));

drop policy if exists "bucket_delete_all" on storage.objects;
create policy "bucket_delete_all"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() in ('anon', 'service_role'));

-- 3. 导入初始产品数据 --------------------------------------------
insert into public.products (slug, name, image, hover_image, category, description, spec, purity, form, storage) values
  ('aod9604',          'AOD9604',          '/images/products/aod9604.jpg',          null, 'peptides', null, null, null, null, null),
  ('ara290',           'ARA290',           '/images/products/ara290.jpg',           null, 'peptides', null, null, null, null, null),
  ('bpc157',           'BPC157',           '/images/products/bpc157.jpg',           null, 'peptides', null, null, null, null, null),
  ('bpc157tb500',      'BPC157+TB500',     '/images/products/bpc157tb500.jpg',      '/images/products/bpc157tb500-hover.png', 'peptides', 'The combination of BPC-157 and TB500 peptides is widely used in recovery and regenerative research. BPC-157 is known for its potential in promoting tissue healing, while TB500 supports joint and tendon repair.', '10mg each vial (BPC-157 & TB500)', '>= 99%', 'Lyophilized powder', 'Store at -20°C in a cool, dry place'),
  ('cagrilin',         'Cagrilin',         '/images/products/cagrilin.jpg',         null, 'peptides', null, null, null, null, null),
  ('cjc-1295-dac',     'CJC-1295-DAC',     '/images/products/cjc1295-dac.jpg',     null, 'peptides', null, null, null, null, null),
  ('cjc-1295-no-dac',  'CJC-1295-NO-DAC',  '/images/products/cjc1295-nodac.jpg',   null, 'peptides', null, null, null, null, null),
  ('cjc1295-no-dacipa','CJC1295 NO DAC+IPA','/images/products/cjc1295-ipa.jpg',    null, 'peptides', null, null, null, null, null),
  ('dsip',             'DSIP',             '/images/products/dsip.jpg',             null, 'peptides', null, null, null, null, null),
  ('epithalon',        'Epithalon',        '/images/products/epithalon.jpg',        null, 'peptides', null, null, null, null, null),
  ('ghk-cu',           'GHK-CU',           '/images/products/ghkcu.jpg',            '/images/products/ghkcu-hover.png', 'peptides', null, null, null, null, null),
  ('glow',             'GLOW',             '/images/products/glow.jpg',             '/images/products/glow-hover.png', 'peptides', null, null, null, null, null),
  ('glutathione',      'Glutathione',      '/images/products/glutathione.jpg',      null, 'peptides', null, null, null, null, null),
  ('hcg',              'HCG',              '/images/products/hcg.jpg',              '/images/products/hcg-hover.png', 'peptides', null, null, null, null, null),
  ('hgh',              'HGH',              '/images/products/hgh.jpg',              null, 'peptides', null, null, null, null, null),
  ('hmg',              'HMG',              '/images/products/hmg.jpg',              null, 'peptides', null, null, null, null, null),
  ('igf-1lr3',         'IGF-1LR3',         '/images/products/igf1lr3.jpg',          null, 'peptides', null, null, null, null, null),
  ('ipamorelin',       'Ipamorelin',       '/images/products/ipamorelin.jpg',       '/images/products/ipamorelin-hover.png', 'peptides', null, null, null, null, null),
  ('klow',             'KLOW',             '/images/products/klow.jpg',             '/images/products/klow-hover.png', 'peptides', null, null, null, null, null),
  ('kpv',              'KPV',              '/images/products/kpv.jpg',              null, 'peptides', null, null, null, null, null),
  ('ll37',             'LL37',             '/images/products/ll37.jpg',             null, 'peptides', null, null, null, null, null),
  ('mots-c',           'MOTS-c',           '/images/products/motsc.jpg',            '/images/products/motsc-hover.png', 'peptides', null, null, null, null, null),
  ('mt-2',             'MT-2',             '/images/products/mt2.jpg',              null, 'peptides', null, null, null, null, null),
  ('nad',              'NAD+',             '/images/products/nad.jpg',              null, 'peptides', null, null, null, null, null),
  ('reta',             'Reta',             '/images/products/reta.jpg',             '/images/products/reta-hover.png', 'peptides', null, null, null, null, null),
  ('tirz',             'Tirz',             '/images/products/tirz.jpg',             '/images/products/tirz-hover.png', 'peptides', null, null, null, null, null)
on conflict (slug) do nothing;
