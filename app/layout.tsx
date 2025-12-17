import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'The Gathering - Scripture of the Day',
  description: 'Daily encouraging scripture with community comments and reflection',
  keywords: ['scripture', 'daily', 'NLT', 'bible', 'encouragement'],
  authors: [{ name: 'The Gathering' }],
  creator: 'The Gathering',
  publisher: 'The Gathering',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 px-4">
          <div className="container mx-auto text-center">
            <p className="mb-2">&copy; 2025 The Gathering. All rights reserved.</p>
            <p className="text-sm text-gray-400">
              Scripture quotations are taken from the Holy Bible, New Living Translation (NLT)
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
