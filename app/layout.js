export const metadata = { title: "FuelGuide", description: "Find the right fuel for your tools" }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}