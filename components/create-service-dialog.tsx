"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { addService } from "@/lib/service-store"
import { getAllWarehouseItems, hasStock } from "@/lib/warehouse-store"
import { formatCurrency } from "@/lib/utils"

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceCreated: () => void
}

export function CreateServiceDialog({
  open,
  onOpenChange,
  onServiceCreated,
}: CreateServiceDialogProps) {
  const { getAllUsers } = useAuth()
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [items, setItems] = useState<Array<{
    value: string
    label: string
    price: number
    stock: number
  }>>([])

  // Fetch and update items whenever dialog opens
  useEffect(() => {
    if (open) {
      const warehouseItems = getAllWarehouseItems()
        .filter((item) => hasStock(item.id))
        .map((item) => ({
          value: item.id,
          label: item.name,
          price: item.price,
          stock: item.stock
        }))
      setItems(warehouseItems)
    }
  }, [open])

  const users = getAllUsers()
    .filter((user) => user.role === "user" && user.approved)
    .map((user) => ({
      value: user.email,
      label: `${user.name} (${user.email})`,
    }))

  // Update name when warehouse item is selected
  useEffect(() => {
    if (selectedItem) {
      const item = items.find((i) => i.value === selectedItem)
      if (item) {
        setName(item.label)
      }
    }
  }, [selectedItem, items])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const item = items.find((i) => i.value === selectedItem)
    if (!item) return

    const service = addService({
      code,
      name,
      price: item.price,
      assignedUser: selectedUser,
      warehouseItemId: selectedItem,
    })

    if (!service) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This item is out of stock. Please refresh and try again.",
      })
      // Refresh items list to get updated stock
      const warehouseItems = getAllWarehouseItems()
        .filter((item) => hasStock(item.id))
        .map((item) => ({
          value: item.id,
          label: item.name,
          price: item.price,
          stock: item.stock
        }))
      setItems(warehouseItems)
      return
    }

    toast({
      title: "Success",
      description: "Service created successfully",
    })

    // Reset form
    setCode("")
    setName("")
    setSelectedUser("")
    setSelectedItem("")
    
    onServiceCreated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Create a new service and assign it to a user
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label} ({formatCurrency(item.price)}) - Stock: {item.stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {items.length === 0 && (
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Service</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 