// ─────────────────────────────────────────────────────────────────────────────
// Chaque page vit sous /fr ou /en.
//
// Deux adresses distinctes plutôt qu'un même URL qui change de langue : c'est
// ce qui permet à Google d'indexer les deux versions, et à un client de
// partager un lien qui s'ouvrira dans la bonne langue.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;

function preferred(req: NextRequest) {
  // Le choix déjà fait par le visiteur prime sur celui de son navigateur.
  const saved = req.cookies.get("blj-locale")?.value;
  if (saved && isLocale(saved)) return saved;

  const header = req.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(tag)) return tag;
  }
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
