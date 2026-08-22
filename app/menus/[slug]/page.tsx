import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MenuView from "@/components/MenuView";
import { MENUS, getMenu } from "@/lib/data";

export function generateStaticParams() {
  return MENUS.map((menu) => ({ slug: menu.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const menu = getMenu(slug);
  if (!menu) return { title: "Menu introuvable" };
  return { title: menu.name, description: menu.intro };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const menu = getMenu(slug);
  if (!menu) notFound();

  return (
    <Suspense fallback={<div className="shell py-20" />}>
      <MenuView menu={menu} />
    </Suspense>
  );
}
