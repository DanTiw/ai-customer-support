import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from './navbar'
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
          </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}