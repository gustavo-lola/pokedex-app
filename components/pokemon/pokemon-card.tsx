"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Star } from "lucide-react";
import type { Pokemon, UserPokemon } from "@/lib/types";
import { PokemonAPI } from "@/lib/pokemon-api";
import { usePokemon } from "@/contexts/pokemon-context";

interface PokemonCardProps {
  pokemon: Pokemon;
  userPokemon?: UserPokemon;
  showActions?: boolean;
}

export function PokemonCard({
  pokemon,
  userPokemon,
  showActions = true,
}: PokemonCardProps) {
  const { toggleFavorite, addToBattleTeam, removeFromBattleTeam, battleTeam } =
    usePokemon();
  const [imageError, setImageError] = useState(false);

  const isInBattleTeam = userPokemon?.isInBattleTeam || false;
  const isFavorite = userPokemon?.isFavorite || false;
  const canAddToBattleTeam = battleTeam.length < 6 && !isInBattleTeam;

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon.id);
  };

  const handleToggleBattleTeam = () => {
    if (isInBattleTeam) {
      removeFromBattleTeam(pokemon.id);
    } else if (canAddToBattleTeam) {
      addToBattleTeam(pokemon.id);
    }
  };

  const getStatValue = (statName: string) => {
    const stat = pokemon.stats.find((s) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  const getStatPercentage = (value: number) => {
    return Math.min((value / 255) * 100, 100); // Max stat is typically around 255
  };

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeColor = PokemonAPI.getTypeColor(primaryType);

  return (
    <Card className="pokemon-card group">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          {/* Pokemon Image */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {!imageError ? (
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Pokemon Info */}
          <div className="text-center space-y-2 w-full">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
              {showActions && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={`h-6 w-6 p-0 ${isFavorite ? "text-red-500" : "text-muted-foreground"
                      }`}
                  >
                    <Heart
                      className={`h-3 w-3 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleBattleTeam}
                    disabled={!canAddToBattleTeam && !isInBattleTeam}
                    className={`h-6 w-6 p-0 ${isInBattleTeam
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                      }`}
                  >
                    {isInBattleTeam ? (
                      <Star className="h-3 w-3 fill-current" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-lg capitalize text-balance">
              {pokemon.name}
            </h3>

            {/* Types */}
            <div className="flex gap-1 justify-center flex-wrap">
              {pokemon.types.map((type) => (
                <Badge
                  key={type.type.name}
                  className="type-badge text-xs"
                  style={{
                    backgroundColor: PokemonAPI.getTypeColor(type.type.name),
                  }}
                >
                  {type.type.name}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 w-full">
              {["hp", "attack", "defense"].map((statName) => {
                const value = getStatValue(statName);
                const percentage = getStatPercentage(value);
                return (
                  <div key={statName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize font-medium">{statName}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                    <div className="stat-bar h-2">
                      <div
                        className="stat-fill h-full"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(to right, ${typeColor}, ${PokemonAPI.getTypeColor(
                            pokemon.types[1]?.type.name || primaryType
                          )})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
