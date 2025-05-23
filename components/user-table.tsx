"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function UserTable() {
  const { getAllUsers, updateUsers, user: currentUser } = useAuth()
  const { toast } = useToast()
  const users = getAllUsers()

  const toggleApproval = (email: string) => {
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, approved: !user.approved }
      }
      return user
    })

    updateUsers(updatedUsers)

    toast({
      title: "User status updated",
      description: `User ${email} has been ${updatedUsers.find((u) => u.email === email)?.approved ? "approved" : "unapproved"}.`,
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
            <TableCell>{user.email}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
              <Badge variant={user.approved ? "default" : "destructive"}>
                {user.approved ? "Approved" : "Not Approved"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={user.approved}
                  onCheckedChange={() => toggleApproval(user.email)}
                  disabled={user.role === "admin" || user.email === currentUser?.email}
                />
                <span className="text-sm text-gray-500">{user.approved ? "Approved" : "Not Approved"}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
