"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Cookies from 'js-cookie'

// Define proper types
interface UserData {
  email: string
  name: string
  password: string
  role: "admin" | "user"
  approved: boolean
}

interface UserProfile {
  email: string
  name: string
  role: "admin" | "user"
  approved: boolean
}

// Dummy user data
export const users: UserData[] = [
  { 
    email: "admin@admin.com", 
    name: "Administrator",
    password: "admin", 
    role: "admin", 
    approved: true 
  },
  { 
    email: "user1@example.com", 
    name: "User One",
    password: "user123", 
    role: "user", 
    approved: true 
  },
  { 
    email: "user2@example.com", 
    name: "User Two",
    password: "user123", 
    role: "user", 
    approved: false 
  },
  { 
    email: "user3@example.com", 
    name: "User Three",
    password: "user123", 
    role: "user", 
    approved: false 
  },
]

type AuthContextType = {
  user: UserProfile | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUsers: (updatedUsers: UserData[]) => void
  getAllUsers: () => UserData[]
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Initialize users in localStorage if not already set
    if (typeof window !== "undefined") {
      // Always reset users in localStorage for testing
      localStorage.setItem("users", JSON.stringify(users))
      console.log("Initialized users:", users)

      // Check if user is already logged in
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from localStorage
    const storedUsers = localStorage.getItem("users")
    const allUsers: UserData[] = storedUsers ? JSON.parse(storedUsers) : users
    
    console.log("Login attempt:", { email, password })
    console.log("Available users:", allUsers)

    // Find user
    const foundUser = allUsers.find((u) => u.email === email && u.password === password)
    console.log("Found user:", foundUser)

    if (foundUser) {
      if (foundUser.approved) {
        // Store user without password
        const { email, name, role, approved } = foundUser
        const userProfile = { email, name, role, approved }
        setUser(userProfile)
        
        // Set both localStorage and cookie
        localStorage.setItem("currentUser", JSON.stringify(userProfile))
        Cookies.set("currentUser", JSON.stringify(userProfile), { path: '/' })

        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        })

        // Add a small delay before redirecting
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/dashboard")
        return true
      } else {
        toast({
          title: "Account not approved",
          description: "Your account is pending approval by an admin.",
          variant: "destructive",
        })
        return false
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    Cookies.remove("currentUser", { path: '/' })
    router.push("/")
  }

  const updateUsers = (updatedUsers: UserData[]) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // If the current user was updated, update the current user as well
    if (user) {
      const updatedCurrentUser = updatedUsers.find((u) => u.email === user.email)
      if (updatedCurrentUser) {
        const { email, name, role, approved } = updatedCurrentUser
        const userProfile = { email, name, role, approved }
        setUser(userProfile)
        localStorage.setItem("currentUser", JSON.stringify(userProfile))
        Cookies.set("currentUser", JSON.stringify(userProfile), { path: '/' })
      }
    }
  }

  const getAllUsers = (): UserData[] => {
    const storedUsers = localStorage.getItem("users")
    return storedUsers ? JSON.parse(storedUsers) : users
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUsers, getAllUsers, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
