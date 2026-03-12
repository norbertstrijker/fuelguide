import './globals.css'

export const metadata = {
  title: 'FuelGuide — Juiste brandstof voor jouw machine',
  description: 'Voer je merk en modelnummer in en ontdek direct welke brandstof of accu jouw machine nodig heeft.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
