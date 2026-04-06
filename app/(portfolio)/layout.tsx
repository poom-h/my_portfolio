import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'
import ChatBubble from '@/components/portfolio/ChatBubble'
import Navbar from '@/components/portfolio/Navbar'
import { getProfile } from '@/lib/actions/profile'
import { profile as staticProfile } from '@/lib/data/portfolio'
import TrackPageView from '@/components/portfolio/TrackPageView'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => staticProfile)
  return {
    title: `${profile.name} — ${profile.tagline}`,
    description: `Portfolio of ${profile.name} — ${profile.tagline} based in ${profile.location}.`,
  }
}

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile().catch(() => staticProfile)

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <TrackPageView />
        <Navbar email={profile.email} />
        {children}
        <ChatBubble />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: '#161625',
              color: '#e2e8f0',
              border: '1px solid #2d2d4a',
            },
          }}
        />
      </body>
    </html>
  )
}
