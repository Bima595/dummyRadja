import { Service, ServiceFormData, ServiceStatus } from "./types"
import { updateStock, getWarehouseItem } from "./warehouse-store"

const SERVICES_STORAGE_KEY = "services"

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Initialize services in localStorage
export const initializeServices = () => {
  if (typeof window === "undefined") return
  
  if (!localStorage.getItem(SERVICES_STORAGE_KEY)) {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify([]))
  }
}

// Get all services
export const getAllServices = (): Service[] => {
  if (typeof window === "undefined") return []
  
  const services = localStorage.getItem(SERVICES_STORAGE_KEY)
  return services ? JSON.parse(services) : []
}

// Get services Di Kerjakan oleh a specific user
export const getUserServices = (userEmail: string): Service[] => {
  const services = getAllServices()
  return services.filter(service => service.assignedUser === userEmail)
}

// Check if user can edit service
export const canEditService = (userEmail: string, userRole: string, service: Service): boolean => {
  return userRole === "admin" || service.assignedUser === userEmail
}

// Add a new service
export const addService = (data: ServiceFormData): Service | null => {
  // Check if warehouse item has enough stock
  if (data.warehouseItemId) {
    const item = getWarehouseItem(data.warehouseItemId)
    if (!item || item.stock <= 0) {
      return null
    }
    
    // Decrease stock
    updateStock(data.warehouseItemId, -1)
  }
  
  const services = getAllServices()
  
  const newService: Service = {
    id: generateId(),
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  services.push(newService)
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services))
  
  return newService
}

// Update service status
export const updateServiceStatus = (serviceId: string, status: ServiceStatus): Service | null => {
  const services = getAllServices()
  const serviceIndex = services.findIndex(s => s.id === serviceId)
  
  if (serviceIndex === -1) return null
  
  services[serviceIndex] = {
    ...services[serviceIndex],
    status,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services))
  return services[serviceIndex]
}

// Update service details (admin only)
export const updateService = (serviceId: string, data: Partial<ServiceFormData>): Service | null => {
  const services = getAllServices()
  const serviceIndex = services.findIndex(s => s.id === serviceId)
  
  if (serviceIndex === -1) return null

  const oldService = services[serviceIndex]
  
  // If warehouse item is being changed
  if (data.warehouseItemId && data.warehouseItemId !== oldService.warehouseItemId) {
    // Return stock to old item
    if (oldService.warehouseItemId) {
      updateStock(oldService.warehouseItemId, 1)
    }
    
    // Check and decrease stock of new item
    const newItem = getWarehouseItem(data.warehouseItemId)
    if (!newItem || newItem.stock <= 0) {
      // If new item doesn't have stock, return stock to old item and return null
      if (oldService.warehouseItemId) {
        updateStock(oldService.warehouseItemId, -1)
      }
      return null
    }
    
    updateStock(data.warehouseItemId, -1)
  }
  
  services[serviceIndex] = {
    ...services[serviceIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services))
  return services[serviceIndex]
}

// Delete service (admin only)
export const deleteService = (serviceId: string): boolean => {
  const services = getAllServices()
  const service = services.find(s => s.id === serviceId)
  
  if (!service) return false
  
  // Return stock to warehouse item
  if (service.warehouseItemId) {
    updateStock(service.warehouseItemId, 1)
  }
  
  const filteredServices = services.filter(s => s.id !== serviceId)
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(filteredServices))
  return true
} 