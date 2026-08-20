import fs from "fs";
import path from "path";

export interface Product {
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

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

export function readProducts(): Product[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function writeProducts(products: Product[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export function findProduct(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function upsertProduct(product: Product): Product[] {
  const products = readProducts();
  const idx = products.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.push(product);
  }
  writeProducts(products);
  return products;
}

export function deleteProduct(slug: string): boolean {
  const products = readProducts();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) return false;
  writeProducts(next);
  return true;
}
