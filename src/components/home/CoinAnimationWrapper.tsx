"use client";

import dynamic from "next/dynamic";

const CoinAnimation = dynamic(
  () => import("@/components/home/CoinAnimation").then((m) => m.CoinAnimation),
  { ssr: false }
);

export function CoinAnimationWrapper() {
  return <CoinAnimation />;
}
