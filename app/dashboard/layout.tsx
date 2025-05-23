"use client"

import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/toaster"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar>{children}</Sidebar>
      <Toaster />
    </div>
  )
} 