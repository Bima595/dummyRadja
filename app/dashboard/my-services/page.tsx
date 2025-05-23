"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Service } from "@/lib/types"
import { getUserServices, initializeServices } from "@/lib/service-store"
import { UserServiceTable } from "@/components/user-service-table"

export default function MyServicesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !isLoading) {
      router.push("/")
      return
    }

    // Initialize and load services
    initializeServices()
    if (user) {
      setServices(getUserServices(user.email))
    }
  }, [user, isLoading, router])

  const refreshServices = () => {
    if (user) {
      setServices(getUserServices(user.email))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Services</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Assigned Services</CardTitle>
          <CardDescription>View and update the status of services Di Kerjakan oleh you</CardDescription>
        </CardHeader>
        <CardContent>
          <UserServiceTable services={services} onUpdate={refreshServices} />
        </CardContent>
      </Card>
    </div>
  )
} 