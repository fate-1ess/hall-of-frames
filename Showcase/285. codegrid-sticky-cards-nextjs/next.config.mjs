const basePath = process.env.NEXT_BASE_PATH || '';
const assetPrefix = process.env.NEXT_ASSET_PREFIX || basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: basePath || undefined,
  assetPrefix: assetPrefix ? assetPrefix : undefined,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
