"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { PokemonProvider } from "@/contexts/pokemon-context"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <PokemonProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex flex-col md:flex-row">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">
              <UserDashboard />
            </main>
          </div>
        </div>
      </PokemonProvider>
    </ProtectedRoute>
  )
}
