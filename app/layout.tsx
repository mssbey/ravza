import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Onun İçin Hazırlanmış Dijital Bir Evren',
  description: 'Bu site senin için hazırlandı.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@400;600;700&display=swap"
        />
      </head>
      <body className="min-h-full antialiased" style={{ background: '#050505' }}>
        {children}
      </body>
    </html>
  )
}
