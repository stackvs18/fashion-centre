import type { Metadata } from "next";
import { CatalogLayout } from "@/components/product/CatalogLayout";

export const metadata: Metadata = {
  title: "Bottoms",
  description:
    "Shop FASHION's premium bottoms collection — cargo pants, trousers, joggers, denim and more.",
};

export default function BottomsPage() {
  return (
    <CatalogLayout
      category="bottoms"
      title="Bottoms"
      subtitle="The FASHION Collection"
    />
  );
}
