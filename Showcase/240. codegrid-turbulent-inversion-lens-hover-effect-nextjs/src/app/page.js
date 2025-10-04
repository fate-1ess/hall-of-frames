"use client";

import InversionLens from "@/components/InversionLens/InversionLens";
import { withAssetPrefix } from "@/utils/base-path";

export default function Home() {
  return <InversionLens src={withAssetPrefix("/portrait.jpeg")} />;
}
