import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '../globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#0a0a0f] antialiased">
        {children}
      </body>
    </html>
  )
}
