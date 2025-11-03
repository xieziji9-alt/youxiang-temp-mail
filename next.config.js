/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 静态导出模式
  // Cloudflare Pages 配置
  images: {
    unoptimized: true, // Cloudflare Pages 不支持 Next.js Image Optimization
  },
}

