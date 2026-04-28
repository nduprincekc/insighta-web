import './globals.css'

export const metadata = {
  title: 'Insighta Labs',
  description: 'Demographic Intelligence Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}