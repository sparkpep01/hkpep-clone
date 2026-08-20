const ALLOWED_PREFIXES = ["medutest/", "peptidemeter/", "vendorinvestigate/", "janoshik/", "images/factory/"];

function isValidPath(path: string): boolean {
  if (!path || path.includes("..") || path.startsWith("/") || path.startsWith("http")) return false;
  if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) return false;
  if (!path.toLowerCase().endsWith(".png")) return false;
  // Only allow safe filename characters
  return /^[A-Za-z0-9/+,_\-.\s()]+$/.test(path);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "";

  if (!isValidPath(path)) {
    return new Response("Bad request", { status: 400 });
  }

  const base = path.startsWith("images/")
    ? "https://qyaobiopeptides.com/"
    : "https://qyaobiopeptides.com/reports/";

  try {
    const upstream = await fetch(base + path, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Not found", { status: 404 });
    }

    const res = new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=2592000",
      },
    });
    return res;
  } catch {
    return new Response("Upstream error", { status: 502 });
  }
}
