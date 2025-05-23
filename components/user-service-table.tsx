"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Service, ServiceStatus } from "@/lib/types"
import { updateServiceStatus } from "@/lib/service-store"
import { formatCurrency } from "@/lib/utils"

interface UserServiceTableProps {
  services: Service[]
  onUpdate: () => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
}

const statusOptions: { value: ServiceStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export function UserServiceTable({ services, onUpdate }: UserServiceTableProps) {
  const handleStatusChange = (serviceId: string, status: ServiceStatus) => {
    updateServiceStatus(serviceId, status)
    onUpdate()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.code}</TableCell>
              <TableCell>{service.name}</TableCell>
              <TableCell>{formatCurrency(service.price)}</TableCell>
              <TableCell>
                <Select
                  value={service.status}
                  onValueChange={(value: ServiceStatus) =>
                    handleStatusChange(service.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <Badge className={statusColors[service.status]}>
                        {service.status.replace("_", " ")}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <Badge className={statusColors[option.value]}>
                          {option.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No services Di Kerjakan oleh you
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 