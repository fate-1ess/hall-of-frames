const basePath = process.env.NEXT_BASE_PATH || '';
const assetPrefix = process.env.NEXT_ASSET_PREFIX || basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: assetPrefix ? assetPrefix : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
