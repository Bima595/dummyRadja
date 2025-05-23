"use client"

import "./globals.css"
import type React from "react"
import { AuthProvider } from "@/components/auth-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
