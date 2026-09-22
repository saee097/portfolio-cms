import { ReactNode } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}