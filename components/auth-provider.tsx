"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { signIn, signOut } from "@/lib/auth"

type User = {
  name: string | null
  email: string | null
  image: string | null
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async () => {
    try {
      // For demo purposes, we'll simulate a login
      const mockUser = {
        name: "Demo User",
        email: "demo@example.com",
        image: "/placeholder.svg?height=40&width=40",
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      await signIn()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem("user")
      await signOut()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
