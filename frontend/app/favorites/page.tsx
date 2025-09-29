import { ProtectedRoute } from "@/frontend/components/auth/protected-route";
import { PokemonProvider } from "@/backend/contexts/pokemon-context";
import { Header } from "@/frontend/components/layout/header";
import { Navigation } from "@/frontend/components/layout/navigation";
import { FavoritesPage } from "@/frontend/components/pokemon/favorites-page";

export default function Favorites() {
  return (
    <ProtectedRoute>
      <PokemonProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex flex-col md:flex-row">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">
              <FavoritesPage />
            </main>
          </div>
        </div>
      </PokemonProvider>
    </ProtectedRoute>
  );
}
