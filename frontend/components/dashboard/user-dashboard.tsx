"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Progress } from "@/frontend/components/ui/progress";
import {
  Search,
  Heart,
  Star,
  Trophy,
  TrendingUp,
  Shield,
  Target,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/backend/contexts/auth-context";
import { usePokemon } from "@/backend/contexts/pokemon-context";
import { PokemonAPI } from "@/backend/lib/pokemon-api";
import { PokemonCard } from "@/frontend/components/pokemon/pokemon-card";

export function UserDashboard() {
  const { user } = useAuth();
  const { discoveredPokemon, favorites, battleTeam } = usePokemon();

  const totalPokemon = 1010;
  const discoveryPercentage = (discoveredPokemon.length / totalPokemon) * 100;

  const recentDiscoveries = discoveredPokemon
    .sort(
      (a, b) =>
        new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime()
    )
    .slice(0, 6);

  const topFavorites = favorites.slice(0, 3);

  const getTypeDistribution = () => {
    const typeCount: Record<string, number> = {};
    discoveredPokemon.forEach((up) => {
      up.pokemon.types.forEach((type) => {
        typeCount[type.type.name] = (typeCount[type.type.name] || 0) + 1;
      });
    });
    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getAverageStats = () => {
    if (discoveredPokemon.length === 0) return { hp: 0, attack: 0, defense: 0 };

    const totals = discoveredPokemon.reduce(
      (acc, up) => {
        const hp =
          up.pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;
        const attack =
          up.pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat ||
          0;
        const defense =
          up.pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat ||
          0;

        return {
          hp: acc.hp + hp,
          attack: acc.attack + attack,
          defense: acc.defense + defense,
        };
      },
      { hp: 0, attack: 0, defense: 0 }
    );

    return {
      hp: Math.round(totals.hp / discoveredPokemon.length),
      attack: Math.round(totals.attack / discoveredPokemon.length),
      defense: Math.round(totals.defense / discoveredPokemon.length),
    };
  };

  const typeDistribution = getTypeDistribution();
  const averageStats = getAverageStats();

  const achievements = [
    {
      title: "Primeiro Pokémon",
      description: "Descobriu seu primeiro Pokémon",
      achieved: discoveredPokemon.length >= 1,
      icon: Target,
    },
    {
      title: "Colecionador",
      description: "Descobriu 10 Pokémon",
      achieved: discoveredPokemon.length >= 10,
      icon: Trophy,
    },
    {
      title: "Especialista",
      description: "Descobriu 50 Pokémon",
      achieved: discoveredPokemon.length >= 50,
      icon: Award,
    },
    {
      title: "Mestre Pokémon",
      description: "Descobriu 100 Pokémon",
      achieved: discoveredPokemon.length >= 100,
      icon: Star,
    },
    {
      title: "Equipe Completa",
      description: "Montou uma equipe de 6 Pokémon",
      achieved: battleTeam.length === 6,
      icon: Shield,
    },
  ];

  const achievedCount = achievements.filter((a) => a.achieved).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-balance">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo da sua jornada Pokémon
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{discoveredPokemon.length}</div>
            <div className="text-sm text-muted-foreground">Descobertos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{favorites.length}</div>
            <div className="text-sm text-muted-foreground">Favoritos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{battleTeam.length}/6</div>
            <div className="text-sm text-muted-foreground">Equipe</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievedCount}/5</div>
            <div className="text-sm text-muted-foreground">Conquistas</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso da Pokédex
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pokémon Descobertos</span>
              <span>
                {discoveredPokemon.length} / {totalPokemon} (
                {discoveryPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={discoveryPercentage} className="h-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-500">
                {averageStats.hp}
              </div>
              <div className="text-sm text-muted-foreground">HP Médio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-500">
                {averageStats.attack}
              </div>
              <div className="text-sm text-muted-foreground">Ataque Médio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-500">
                {averageStats.defense}
              </div>
              <div className="text-sm text-muted-foreground">Defesa Média</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Discoveries and Top Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Discoveries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Descobertas Recentes
              </CardTitle>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentDiscoveries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma descoberta ainda</p>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                  >
                    Começar a Descobrir
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recentDiscoveries.map((userPokemon) => (
                  <div key={userPokemon.id} className="scale-90">
                    <PokemonCard
                      pokemon={userPokemon.pokemon}
                      userPokemon={userPokemon}
                      showActions={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Favoritos
              </CardTitle>
              <Link href="/favorites">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topFavorites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum favorito ainda</p>
                <p className="text-sm">Marque Pokémon como favoritos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topFavorites.map((userPokemon) => (
                  <div key={userPokemon.id} className="scale-90">
                    <PokemonCard
                      pokemon={userPokemon.pokemon}
                      userPokemon={userPokemon}
                      showActions={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tipos Mais Coletados</CardTitle>
          </CardHeader>
          <CardContent>
            {typeDistribution.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Descubra Pokémon para ver a distribuição de tipos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {typeDistribution.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: PokemonAPI.getTypeColor(type),
                        }}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Conquistas ({achievedCount}/{achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.title}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      achievement.achieved
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-muted/50 border-muted text-muted-foreground"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        achievement.achieved
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm opacity-80">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.achieved && (
                      <Badge variant="secondary">✓</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard">
              <Button className="w-full h-16 flex flex-col gap-2">
                <Search className="h-5 w-5" />
                <span>Descobrir Pokémon</span>
              </Button>
            </Link>
            <Link href="/favorites">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col gap-2 bg-transparent"
              >
                <Heart className="h-5 w-5" />
                <span>Ver Favoritos</span>
              </Button>
            </Link>
            <Link href="/battle-team">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col gap-2 bg-transparent"
              >
                <Star className="h-5 w-5" />
                <span>Gerenciar Equipe</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
