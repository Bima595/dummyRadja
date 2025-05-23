"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Users, Briefcase, Package2, DollarSign } from "lucide-react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useAuth } from "@/components/auth-provider"

interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const isMobile = useIsMobile()
  const { user, logout, isLoading } = useAuth()

  const NavItems = () => (
    <>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          {user?.role === "admin" && (
            <>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/users">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/warehouse">
                  <Package2 className="mr-2 h-4 w-4" />
                  Warehouse
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/services">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Service Management
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/payments">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payments
                </Link>
              </Button>
            </>
          )}
          {user?.role === "user" && (
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/my-services">
                <Briefcase className="mr-2 h-4 w-4" />
                My Services
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button variant="outline" className="w-full" onClick={logout}>
          Logout
        </Button>
      </div>
    </>
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      {/* Mobile Navigation */}
      {isMobile ? (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white px-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-2 py-4">
                  <NavItems />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center text-lg font-semibold">Dashboard</div>
        </header>
      ) : (
        /* Desktop Navigation */
        <div className="hidden w-64 flex-col border-r bg-white lg:flex">
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col py-4">
              <NavItems />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
