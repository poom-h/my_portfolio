import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin — poom.dev',
  description: 'Portfolio admin panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-[#0d0d16]">
            {children}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#161625', color: '#e2e8f0', border: '1px solid #2d2d4a' },
          }}
        />
      </body>
    </html>
  )
}
