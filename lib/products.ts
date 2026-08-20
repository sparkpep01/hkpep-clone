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

export const products: Product[] = [
  { name: "AOD9604", slug: "aod9604", image: "/images/products/aod9604.jpg", category: "peptides" },
  { name: "ARA290", slug: "ara290", image: "/images/products/ara290.jpg", category: "peptides" },
  { name: "BPC157", slug: "bpc157", image: "/images/products/bpc157.jpg", category: "peptides" },
  { name: "BPC157+TB500", slug: "bpc157tb500", image: "/images/products/bpc157tb500.jpg", hoverImage: "/images/products/bpc157tb500-hover.png", category: "peptides",
    description: "The combination of BPC-157 and TB500 peptides is widely used in recovery and regenerative research. BPC-157 is known for its potential in promoting tissue healing, while TB500 supports joint and tendon repair.",
    spec: "10mg each vial (BPC-157 & TB500)", purity: ">= 99%", form: "Lyophilized powder", storage: "Store at -20°C in a cool, dry place"
  },
  { name: "Cagrilin", slug: "cagrilin", image: "/images/products/cagrilin.jpg", category: "peptides" },
  { name: "CJC-1295-DAC", slug: "cjc-1295-dac", image: "/images/products/cjc1295-dac.jpg", category: "peptides" },
  { name: "CJC-1295-NO-DAC", slug: "cjc-1295-no-dac", image: "/images/products/cjc1295-nodac.jpg", category: "peptides" },
  { name: "CJC1295 NO DAC+IPA", slug: "cjc1295-no-dacipa", image: "/images/products/cjc1295-ipa.jpg", category: "peptides" },
  { name: "DSIP", slug: "dsip", image: "/images/products/dsip.jpg", category: "peptides" },
  { name: "Epithalon", slug: "epithalon", image: "/images/products/epithalon.jpg", category: "peptides" },
  { name: "GHK-CU", slug: "ghk-cu", image: "/images/products/ghkcu.jpg", hoverImage: "/images/products/ghkcu-hover.png", category: "peptides" },
  { name: "GLOW", slug: "glow", image: "/images/products/glow.jpg", hoverImage: "/images/products/glow-hover.png", category: "peptides" },
  { name: "Glutathione", slug: "glutathione", image: "/images/products/glutathione.jpg", category: "peptides" },
  { name: "HCG", slug: "hcg", image: "/images/products/hcg.jpg", hoverImage: "/images/products/hcg-hover.png", category: "peptides" },
  { name: "HGH", slug: "hgh", image: "/images/products/hgh.jpg", category: "peptides" },
  { name: "HMG", slug: "hmg", image: "/images/products/hmg.jpg", category: "peptides" },
  { name: "IGF-1LR3", slug: "igf-1lr3", image: "/images/products/igf1lr3.jpg", category: "peptides" },
  { name: "Ipamorelin", slug: "ipamorelin", image: "/images/products/ipamorelin.jpg", hoverImage: "/images/products/ipamorelin-hover.png", category: "peptides" },
  { name: "KLOW", slug: "klow", image: "/images/products/klow.jpg", hoverImage: "/images/products/klow-hover.png", category: "peptides" },
  { name: "KPV", slug: "kpv", image: "/images/products/kpv.jpg", category: "peptides" },
  { name: "LL37", slug: "ll37", image: "/images/products/ll37.jpg", category: "peptides" },
  { name: "MOTS-c", slug: "mots-c", image: "/images/products/motsc.jpg", hoverImage: "/images/products/motsc-hover.png", category: "peptides" },
  { name: "MT-2", slug: "mt-2", image: "/images/products/mt2.jpg", category: "peptides" },
  { name: "NAD+", slug: "nad", image: "/images/products/nad.jpg", category: "peptides" },
  { name: "Reta", slug: "reta", image: "/images/products/reta.jpg", hoverImage: "/images/products/reta-hover.png", category: "peptides" },
  { name: "Tirz", slug: "tirz", image: "/images/products/tirz.jpg", hoverImage: "/images/products/tirz-hover.png", category: "peptides" },
];

export const coasList: string[] = [];

export const testimonials = [
  { name: "Brooklyn Simmons", avatar: "/images/testimonials/customer-1.jpg", text: "I’ve sourced peptides from multiple places, but Sparkpep consistently delivers unmatched purity. Every batch is reliable, and exactly what I need." },
  { name: "Jerome Bell", avatar: "/images/testimonials/customer-2.jpg", text: "Excellent customer service! The staff is knowledgeable and always ready to help me find products." },
  { name: "Kathryn Murphy", avatar: "/images/testimonials/customer-3.jpg", text: "Affordable prices and high-quality products. I never have to worry about breaking the bank." },
  { name: "Guy Hawkins", avatar: "/images/testimonials/customer-4.jpg", text: "Wide range of organic and natural options. I appreciate their commitment to providing." },
  { name: "Dianne Russell", avatar: "/images/testimonials/customer-5.jpg", text: "Trustworthy and reliable. I can rely on this store for genuine and safe products structure of the page." },
  { name: "Ronald Richards", avatar: "/images/testimonials/customer-6.jpg", text: "Impressive variety for specific dietary needs. They cater to various lifestyles, including vegan." },
];
