import { WarehouseItem, WarehouseItemFormData } from "./types"

const WAREHOUSE_STORAGE_KEY = "warehouse_items"

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Initialize warehouse items in localStorage
export const initializeWarehouse = () => {
  if (typeof window === "undefined") return
  
  if (!localStorage.getItem(WAREHOUSE_STORAGE_KEY)) {
    localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify([]))
  }
}

// Get all warehouse items
export const getAllWarehouseItems = (): WarehouseItem[] => {
  if (typeof window === "undefined") return []
  
  const items = localStorage.getItem(WAREHOUSE_STORAGE_KEY)
  return items ? JSON.parse(items) : []
}

// Get a specific warehouse item
export const getWarehouseItem = (id: string): WarehouseItem | null => {
  const items = getAllWarehouseItems()
  return items.find(item => item.id === id) || null
}

// Add a new warehouse item
export const addWarehouseItem = (data: WarehouseItemFormData): WarehouseItem => {
  const items = getAllWarehouseItems()
  
  const newItem: WarehouseItem = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  items.push(newItem)
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(items))
  
  return newItem
}

// Update warehouse item
export const updateWarehouseItem = (id: string, data: Partial<WarehouseItemFormData>): WarehouseItem | null => {
  const items = getAllWarehouseItems()
  const itemIndex = items.findIndex(item => item.id === id)
  
  if (itemIndex === -1) return null
  
  items[itemIndex] = {
    ...items[itemIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(items))
  return items[itemIndex]
}

// Delete warehouse item
export const deleteWarehouseItem = (id: string): boolean => {
  const items = getAllWarehouseItems()
  const filteredItems = items.filter(item => item.id !== id)
  
  if (filteredItems.length === items.length) return false
  
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(filteredItems))
  return true
}

// Update stock
export const updateStock = (id: string, quantity: number): boolean => {
  const items = getAllWarehouseItems()
  const itemIndex = items.findIndex(item => item.id === id)
  
  if (itemIndex === -1) return false
  
  const newStock = items[itemIndex].stock + quantity
  if (newStock < 0) return false
  
  items[itemIndex] = {
    ...items[itemIndex],
    stock: newStock,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(WAREHOUSE_STORAGE_KEY, JSON.stringify(items))
  return true
}

// Check if item has enough stock
export const hasStock = (id: string): boolean => {
  const item = getWarehouseItem(id)
  return item ? item.stock > 0 : false
} 