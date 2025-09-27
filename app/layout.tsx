import Header from '@/app/_components/Header'

import { Josefin_Sans } from 'next/font/google'
import '@/app/_styles/globals.css'
import { ReservationProvider } from '@/app/_components/ReservationContext'

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  // title: "The Wild Oasis",

  title: {
    template: '%s | The Wild Oasis',
    default: 'The Wild Oasis',
  },
  description:
    'Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and and dark forests.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
