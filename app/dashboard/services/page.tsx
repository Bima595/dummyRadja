"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Service } from "@/lib/types"
import { getAllServices, initializeServices } from "@/lib/service-store"
import { ServiceTable } from "@/components/service-table"
import { CreateServiceDialog } from "@/components/create-service-dialog"

export default function ServicesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    // Redirect non-admin users
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }

    // Initialize services
    initializeServices()
    setServices(getAllServices())
  }, [user, router])

  const refreshServices = () => {
    setServices(getAllServices())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage your services and assign them to users</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceTable services={services} onUpdate={refreshServices} />
        </CardContent>
      </Card>

      <CreateServiceDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onServiceCreated={refreshServices}
      />
    </div>
  )
} 