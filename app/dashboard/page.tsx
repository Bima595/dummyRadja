"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Email:</div>
              <div>{user.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Role:</div>
              <div className="capitalize">{user.role}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Status:</div>
              <div>
                {user.approved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-red-600">Not Approved</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 