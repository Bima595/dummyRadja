"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Service } from "@/lib/types"
import { deleteService, canEditService } from "@/lib/service-store"
import { getWarehouseItem } from "@/lib/warehouse-store"
import { EditServiceDialog } from "@/components/edit-service-dialog"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

interface ServiceTableProps {
  services: Service[]
  onUpdate: () => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
}

export function ServiceTable({ services, onUpdate }: ServiceTableProps) {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const { user, getAllUsers } = useAuth()

  const handleDelete = (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(serviceId)
      onUpdate()
    }
  }

  const getUserName = (email: string) => {
    const foundUser = getAllUsers().find(u => u.email === email)
    return foundUser ? foundUser.name : email
  }

  const getWarehouseInfo = (service: Service) => {
    if (!service.warehouseItemId) return null
    const item = getWarehouseItem(service.warehouseItemId)
    return item ? `${item.name} (Stock: ${item.stock})` : null
  }

  if (!user) return null

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Warehouse Item</TableHead>
              <TableHead>Di Kerjakan oleh</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.code}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{formatCurrency(service.price)}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getWarehouseInfo(service) || "No item linked"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="cursor-help" title={service.assignedUser}>
                    {getUserName(service.assignedUser)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[service.status]}>
                    {service.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {canEditService(user.email, user.role, service) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingService(service)}
                      >
                        Edit
                      </Button>
                    )}
                    {user.role === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditServiceDialog
        service={editingService}
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        onServiceUpdated={onUpdate}
      />
    </>
  )
} 