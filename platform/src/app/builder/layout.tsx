import React from 'react'

import '../(frontend)/blocks.css'

export const metadata = {
  title: 'Visual Builder',
}

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
