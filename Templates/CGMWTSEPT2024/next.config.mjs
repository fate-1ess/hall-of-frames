const sanitizePath = (value) => {
  if (!value) return '';
  if (value === '/') return '';
  return value.replace(/\/+$/, '');
};

const envBasePath = sanitizePath(
  process.env.NEXT_BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? ''
);

const envAssetPrefix = sanitizePath(
  process.env.NEXT_ASSET_PREFIX ?? process.env.NEXT_PUBLIC_ASSET_PREFIX ?? envBasePath
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: envBasePath || undefined,
  assetPrefix: envAssetPrefix || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
