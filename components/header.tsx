"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { InfoIcon, LogIn, LogOut } from "lucide-react"
import AboutModal from "./about-modal"

export default function Header() {
  const { user, login, logout } = useAuth()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <header className="w-full py-4 px-6 flex items-center justify-end border-b border-gray-800 bg-black/30 backdrop-blur-sm z-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="neon-text-teal" onClick={() => setIsAboutOpen(true)}>
          <InfoIcon className="mr-2 h-4 w-4" />
          ABOUT
        </Button>

        {user ? (
          <Button variant="outline" size="sm" onClick={logout} className="neon-button">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={login} className="neon-button">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        )}
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </header>
  )
}
