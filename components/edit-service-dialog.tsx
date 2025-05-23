"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { Service, ServiceStatus } from "@/lib/types"
import { updateService, canEditService } from "@/lib/service-store"
import { getAllWarehouseItems, hasStock } from "@/lib/warehouse-store"
import { formatCurrency } from "@/lib/utils"

interface EditServiceDialogProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceUpdated: () => void
}

interface ServiceUpdateData {
  status: ServiceStatus
  code?: string
  name?: string
  price?: number
  assignedUser?: string
  warehouseItemId?: string
}

const statusOptions: { value: ServiceStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export function EditServiceDialog({
  service,
  open,
  onOpenChange,
  onServiceUpdated,
}: EditServiceDialogProps) {
  const { user, getAllUsers } = useAuth()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [status, setStatus] = useState<ServiceStatus>("pending")

  useEffect(() => {
    if (service) {
      setCode(service.code)
      setName(service.name)
      setSelectedUser(service.assignedUser)
      setSelectedItem(service.warehouseItemId || "")
      setStatus(service.status)
    }
  }, [service])

  const users = getAllUsers()
    .filter((u) => u.role === "user" && u.approved)
    .map((u) => ({
      value: u.email,
      label: `${u.name} (${u.email})`,
    }))

  const warehouseItems = getAllWarehouseItems()
    .filter((item) => hasStock(item.id) || (service?.warehouseItemId === item.id))
    .map((item) => ({
      value: item.id,
      label: `${item.name} (${formatCurrency(item.price)})`,
      price: item.price,
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!service || !user) return

    const isAdmin = user.role === "admin"
    const updates: ServiceUpdateData = {
      status,
    }

    // Only admin can update these fields
    if (isAdmin) {
      const item = warehouseItems.find((i) => i.value === selectedItem)
      if (!item) return

      updates.code = code
      updates.name = name
      updates.price = item.price
      updates.assignedUser = selectedUser
      updates.warehouseItemId = selectedItem
    }

    updateService(service.id, updates)
    onServiceUpdated()
    onOpenChange(false)
  }

  if (!service || !user) return null

  const isAdmin = user.role === "admin"
  const canEdit = canEditService(user.email, user.role, service)

  if (!canEdit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            {isAdmin 
              ? "Modify service details and assignments" 
              : "Update service status"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Service Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Warehouse Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {warehouseItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No items available in stock. Please add items to the warehouse first.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Assign User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No approved users available. Users must be approved before they can be Di Kerjakan oleh services.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: ServiceStatus) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Service</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}