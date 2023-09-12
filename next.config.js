/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"],
    optimizeCss: true,
  },
  webpack(config, { dev, isServer }) {
    // Code splitting
    config.optimization.splitChunks.cacheGroups = {
      default: false,
      vendors: false,
    };

    config.optimization.splitChunks.chunks = "async";
    config.optimization.splitChunks.minSize = 20000;
    config.optimization.splitChunks.maxAsyncRequests = 5;
    config.optimization.splitChunks.maxInitialRequests = 3;

    //Only minimize the bundle in production
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.concatenateModules = true;
      config.optimization.usedExports = true;
    }
    return config;
  },
};

module.export = nextConfig;
