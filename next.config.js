/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 配置 - 不使用 output: 'export'，使用 Functions
  images: {
    unoptimized: true, // Cloudflare Pages 不支持 Next.js Image Optimization
  },
  // 确保 API 路由使用 Edge Runtime
  experimental: {
    runtime: 'experimental-edge',
  },
}

module.exports = nextConfig

