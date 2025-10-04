"use client";
import { useEffect, useMemo, useState } from "react";
import { withAssetPath } from "@/utils/basePath";

const BasePathImage = ({ src, ...rest }) => {
  const assetSrc = useMemo(() => withAssetPath(src), [src]);
  const [resolvedSrc, setResolvedSrc] = useState("");

  useEffect(() => {
    setResolvedSrc(assetSrc);
  }, [assetSrc]);

  return <img src={resolvedSrc || undefined} data-src={assetSrc} {...rest} />;
};

export default BasePathImage;
