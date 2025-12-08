"use client";

import { useState } from "react";
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Heart, Filter, Trash2 } from "lucide-react";
import { PokemonCard } from "./pokemon-card";
import { usePokemon } from "@/contexts/pokemon-context";
import { PokemonAPI } from "@/lib/pokemon-api";

export function FavoritesPage() {
  const { favorites, toggleFavorite } = usePokemon();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filteredFavorites = favorites
    .filter((userPokemon) => {
      const matchesType =
        selectedType === "all" ||
        userPokemon.pokemon.types.some(
          (type) => type.type.name === selectedType
        );
      return matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.pokemon.name.localeCompare(b.pokemon.name);
        case "id":
          return a.pokemon.id - b.pokemon.id;
        case "date":
          return (
            new Date(b.discoveredAt).getTime() -
            new Date(a.discoveredAt).getTime()
          );
        default:
          return 0;
      }
    });

  const availableTypes = Array.from(
    new Set(
      favorites.flatMap((userPokemon) =>
        userPokemon.pokemon.types.map((type) => type.type.name)
      )
    )
  ).sort();

  const clearAllFavorites = () => {
    if (
      confirm("Tem certeza que deseja remover todos os Pokémon dos favoritos?")
    ) {
      favorites.forEach((userPokemon) => {
        toggleFavorite(userPokemon.pokemonId);
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Meus Favoritos ({favorites.length})
            </CardTitle>
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFavorites}
                className="text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Adicione Pokémon aos seus favoritos clicando no coração nos
                cards
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Voltar para Descobrir
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {availableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: PokemonAPI.getTypeColor(type),
                              }}
                            />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="id">Número</SelectItem>
                      <SelectItem value="date">Data de descoberta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                  {filteredFavorites.length} de {favorites.length} favoritos
                </div>
              </div>

              {/* Favorites Grid */}
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum favorito encontrado com os filtros aplicados
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredFavorites.map((userPokemon) => (
                    <PokemonCard
                      key={userPokemon.id}
                      pokemon={userPokemon.pokemon}
                      userPokemon={userPokemon}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas dos Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {favorites.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de Favoritos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {availableTypes.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tipos Diferentes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(
                    favorites.reduce(
                      (sum, up) =>
                        sum +
                        up.pokemon.stats.find((s) => s.stat.name === "hp")!
                          .base_stat,
                      0
                    ) / favorites.length
                  )}
                </div>
                <div className="text-sm text-muted-foreground">HP Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">
                  {Math.round(
                    favorites.reduce(
                      (sum, up) =>
                        sum +
                        up.pokemon.stats.find((s) => s.stat.name === "attack")!
                          .base_stat,
                      0
                    ) / favorites.length
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ataque Médio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
