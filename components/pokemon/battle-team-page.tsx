"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, Trash2, Shuffle, TrendingUp, Shield, Zap } from "lucide-react"
import { PokemonCard } from "./pokemon-card"
import { usePokemon } from "@/contexts/pokemon-context"
import { PokemonAPI } from "@/lib/pokemon-api"

export function BattleTeamPage() {
  const { battleTeam, discoveredPokemon, removeFromBattleTeam, addToBattleTeam } = usePokemon()
  const [showAvailable, setShowAvailable] = useState(false)

  const availablePokemon = discoveredPokemon.filter((up) => !up.isInBattleTeam)
  const maxTeamSize = 6

  const clearTeam = () => {
    if (confirm("Tem certeza que deseja remover todos os Pokémon da equipe?")) {
      battleTeam.forEach((userPokemon) => {
        removeFromBattleTeam(userPokemon.pokemonId)
      })
    }
  }

  const addRandomToTeam = () => {
    if (battleTeam.length >= maxTeamSize || availablePokemon.length === 0) return

    const randomIndex = Math.floor(Math.random() * availablePokemon.length)
    const randomPokemon = availablePokemon[randomIndex]
    addToBattleTeam(randomPokemon.pokemonId)
  }

  const getTeamStats = () => {
    if (battleTeam.length === 0) return { avgHp: 0, avgAttack: 0, avgDefense: 0, totalPower: 0 }

    const stats = battleTeam.reduce(
      (acc, up) => {
        const hp = up.pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0
        const attack = up.pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0
        const defense = up.pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0

        return {
          hp: acc.hp + hp,
          attack: acc.attack + attack,
          defense: acc.defense + defense,
        }
      },
      { hp: 0, attack: 0, defense: 0 },
    )

    return {
      avgHp: Math.round(stats.hp / battleTeam.length),
      avgAttack: Math.round(stats.attack / battleTeam.length),
      avgDefense: Math.round(stats.defense / battleTeam.length),
      totalPower: Math.round((stats.hp + stats.attack + stats.defense) / battleTeam.length),
    }
  }

  const getTypeDistribution = () => {
    const typeCount: Record<string, number> = {}
    battleTeam.forEach((up) => {
      up.pokemon.types.forEach((type) => {
        typeCount[type.type.name] = (typeCount[type.type.name] || 0) + 1
      })
    })
    return Object.entries(typeCount).sort(([, a], [, b]) => b - a)
  }

  const teamStats = getTeamStats()
  const typeDistribution = getTypeDistribution()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Equipe de Batalha ({battleTeam.length}/{maxTeamSize})
            </CardTitle>
            <div className="flex gap-2">
              {battleTeam.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearTeam} className="text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Equipe
                </Button>
              )}
              {battleTeam.length < maxTeamSize && availablePokemon.length > 0 && (
                <Button variant="outline" size="sm" onClick={addRandomToTeam}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Adicionar Aleatório
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {battleTeam.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Equipe vazia</h3>
              <p className="text-muted-foreground mb-4">Adicione até {maxTeamSize} Pokémon à sua equipe de batalha</p>
              <Button variant="outline" onClick={() => setShowAvailable(true)} disabled={availablePokemon.length === 0}>
                {availablePokemon.length === 0 ? "Nenhum Pokémon disponível" : "Escolher Pokémon"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Team Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Team Members */}
                {battleTeam.map((userPokemon, index) => (
                  <div key={userPokemon.id} className="relative">
                    <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                      {index + 1}
                    </div>
                    <PokemonCard pokemon={userPokemon.pokemon} userPokemon={userPokemon} />
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: maxTeamSize - battleTeam.length }).map((_, index) => (
                  <Card
                    key={`empty-${index}`}
                    className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setShowAvailable(true)}
                  >
                    <CardContent className="p-4 h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-xs text-center">Slot {battleTeam.length + index + 1}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Team Actions */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAvailable(true)}
                  disabled={battleTeam.length >= maxTeamSize || availablePokemon.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {battleTeam.length >= maxTeamSize
                    ? "Equipe Completa"
                    : availablePokemon.length === 0
                      ? "Nenhum Pokémon Disponível"
                      : "Adicionar Pokémon"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {battleTeam.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estatísticas da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">HP Médio</span>
                  </div>
                  <div className="text-2xl font-bold text-red-500">{teamStats.avgHp}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-3 h-3 text-orange-500" />
                    <span className="text-sm font-medium">Ataque Médio</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-500">{teamStats.avgAttack}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span className="text-sm font-medium">Defesa Média</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">{teamStats.avgDefense}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-medium">Poder Total</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-500">{teamStats.totalPower}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Tipos</CardTitle>
            </CardHeader>
            <CardContent>
              {typeDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center">Nenhum tipo na equipe</p>
              ) : (
                <div className="space-y-3">
                  {typeDistribution.map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: PokemonAPI.getTypeColor(type) }}
                        />
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Pokemon */}
      {showAvailable && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pokémon Disponíveis ({availablePokemon.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAvailable(false)}>
                Ocultar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availablePokemon.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Todos os seus Pokémon já estão na equipe de batalha</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {availablePokemon.map((userPokemon) => (
                  <PokemonCard key={userPokemon.id} pokemon={userPokemon.pokemon} userPokemon={userPokemon} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
