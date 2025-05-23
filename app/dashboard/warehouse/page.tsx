"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { WarehouseTable } from "@/components/warehouse-table"
import { CreateWarehouseDialog } from "@/components/create-warehouse-dialog"
import { getAllWarehouseItems, initializeWarehouse } from "@/lib/warehouse-store"
import { WarehouseItem } from "@/lib/types"

export default function WarehousePage() {
  const [items, setItems] = useState<WarehouseItem[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  // Initialize and load warehouse items
  useEffect(() => {
    initializeWarehouse()
    loadItems()
  }, [])

  const loadItems = () => {
    setItems(getAllWarehouseItems())
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Warehouse Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add New Item
        </Button>
      </div>

      <WarehouseTable items={items} onUpdate={loadItems} />

      <CreateWarehouseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onItemCreated={loadItems}
      />
    </div>
  )
} 