import { ProtectedRoute } from "@/components/auth/protected-route"
import { PokemonProvider } from "@/contexts/pokemon-context"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { PokemonDiscovery } from "@/components/pokemon/pokemon-discovery"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <PokemonProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex flex-col md:flex-row">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">
              <PokemonDiscovery />
            </main>
          </div>
        </div>
      </PokemonProvider>
    </ProtectedRoute>
  )
}
