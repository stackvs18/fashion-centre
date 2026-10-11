import type { Metadata } from "next";
import { CatalogLayout } from "@/components/product/CatalogLayout";

export const metadata: Metadata = {
  title: "Tops",
  description:
    "Shop FASHION's premium tops collection — tees, shirts, sweatshirts, and more. Crafted for everyday excellence.",
};

export default function TopsPage() {
  return (
    <CatalogLayout
      category="tops"
      title="Tops"
      subtitle="The FASHION Collection"
    />
  );
}
