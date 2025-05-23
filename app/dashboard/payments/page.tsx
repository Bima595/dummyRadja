"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Service } from "@/lib/types"
import { getAllServices } from "@/lib/service-store"
import { formatCurrency } from "@/lib/utils"

export default function PaymentsPage() {
  const [services, setServices] = useState<Service[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Load completed services
  useEffect(() => {
    const allServices = getAllServices()
    const completedServices = allServices.filter(
      (service) => service.status === "completed"
    )
    setServices(completedServices)
  }, [])

  // Calculate total revenue
  const totalRevenue = services.reduce((sum, service) => sum + service.price, 0)

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {services.length} completed services
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Di Kerjakan oleh</TableHead>
              <TableHead>Completion Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.code}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{formatCurrency(service.price)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {service.assignedUser}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(service.updatedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No completed services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 