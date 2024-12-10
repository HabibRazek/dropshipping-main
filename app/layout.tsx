import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import dynamic from 'next/dynamic'
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dropshipping Tunisia',
  description: 'First dropshipping platform in Tunisia.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const role = await currentRole();
  const user = await currentUser();


  const CrispWithNoSSR = dynamic(
    () => import('../components/chat/crisp')
  )

  return (
    <SessionProvider session={session}>
      <html lang="en">
      {(role !== UserRole.ADMIN || !user) && (
      <CrispWithNoSSR />
    )}
        <body className={inter.className + " h-screen "}>
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  )
}
