"use client";

import { useEffect } from "react";
import ImageTrail from "@/components/ImageTrail";

import ReactLenis from "@/components/ReactLenis";

export default function Home() {
  const assetPrefix =
    process.env.NEXT_PUBLIC_ASSET_PREFIX ??
    process.env.NEXT_PUBLIC_BASE_PATH ??
    "";

  const sanitizedPrefix = assetPrefix.endsWith("/")
    ? assetPrefix.slice(0, -1)
    : assetPrefix;

  const withAssetPrefix = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return sanitizedPrefix ? `${sanitizedPrefix}${normalizedPath}` : normalizedPath;
  };

  const images = Array.from({ length: 35 }, (_, i) =>
    withAssetPrefix(`/assets/img${i + 1}.jpeg`)
  );

  return (
    <ReactLenis root>
      <main>
        <section className="intro">
          <h1>Dynamic Cursor Trail Animation</h1>
        </section>

        <section className="trail-container">
          <p>( Move your cursor around and see the magic unfold )</p>
          <ImageTrail images={images} />
        </section>

        <section className="outro">
          <h1>Wrapping Up</h1>
        </section>
      </main>
    </ReactLenis>
  );
}
