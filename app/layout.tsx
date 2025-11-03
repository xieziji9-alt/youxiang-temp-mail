import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yu Mail - 临时邮箱接码平台',
  description: '免费的临时邮箱服务，保护您的隐私',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

