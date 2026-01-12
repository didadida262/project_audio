import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '变声器 - 实时语音转换',
  description: '一个强大的实时语音转换应用，支持多种变音效果',
  keywords: '语音转换,变音,录音,音频处理,AI',
  authors: [{ name: 'Voice Transformer Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
