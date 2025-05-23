export type ServiceStatus = "pending" | "in_progress" | "completed";

export interface Service {
  id: string;
  code: string;
  name: string;
  price: number;
  assignedUser: string; // Single user email who can manage this service
  warehouseItemId?: string; // Optional for backward compatibility
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceUpdate {
  id: string;
  status: ServiceStatus;
  updatedAt: string;
}

export interface ServiceFormData {
  code: string;
  name: string;
  price: number;
  assignedUser: string;
  warehouseItemId?: string; // Optional for backward compatibility
}

export interface WarehouseItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseItemFormData {
  name: string;
  price: number;
  stock: number;
} 