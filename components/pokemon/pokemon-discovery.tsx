"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@/components/ui/select";
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
import { Shuffle, Search, Filter } from "lucide-react";
import type { Pokemon } from "@/lib/types";
import { PokemonAPI } from "@/lib/pokemon-api";
import { PokemonCard } from "./pokemon-card";
import { usePokemon } from "@/contexts/pokemon-context";

export function PokemonDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [randomPokemon, setRandomPokemon] = useState<Pokemon | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const { discoverPokemon, discoveredPokemon } = usePokemon();

  useEffect(() => {
    loadPokemonTypes();
  }, []);

  const loadPokemonTypes = async () => {
    try {
      const types = await PokemonAPI.getPokemonTypes();
      setAvailableTypes(types.map((type) => type.name));
    } catch (error) {
      console.error("Failed to load Pokemon types:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const pokemon = await PokemonAPI.getPokemonByName(searchTerm.trim());
      setSearchResults([pokemon]);
      discoverPokemon(pokemon);
    } catch (error) {
      console.error("Pokemon not found:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRandomDiscover = async () => {
    setIsLoadingRandom(true);
    try {
      const pokemon = await PokemonAPI.getRandomPokemon();
      setRandomPokemon(pokemon);
      discoverPokemon(pokemon);
    } catch (error) {
      console.error("Failed to get random Pokemon:", error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const filteredDiscovered = discoveredPokemon.filter((userPokemon) => {
    const matchesType =
      selectedType === "all" ||
      userPokemon.pokemon.types.some((type) => type.type.name === selectedType);
    return matchesType;
  });

  const getUserPokemon = (pokemonId: number) => {
    return discoveredPokemon.find((up) => up.pokemonId === pokemonId);
  };

  return (
    <div className="space-y-6">
      {/* Discovery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Descobrir Pokémon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome do Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {/* Random Discovery */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleRandomDiscover}
              disabled={isLoadingRandom}
              className="flex items-center gap-2 bg-transparent"
            >
              <Shuffle className="h-4 w-4" />
              {isLoadingRandom ? "Descobrindo..." : "Descobrir Aleatório"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  userPokemon={getUserPokemon(pokemon.id)}
                />
              ))}
            </div>
          )}

          {/* Random Pokemon */}
          {randomPokemon && (
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <PokemonCard
                  pokemon={randomPokemon}
                  userPokemon={getUserPokemon(randomPokemon.id)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discovered Pokemon */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Pokémon Descobertos ({filteredDiscovered.length})
            </CardTitle>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDiscovered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum Pokémon descoberto ainda.</p>
              <p className="text-sm">
                Use a busca ou descoberta aleatória para começar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredDiscovered.map((userPokemon) => (
                <PokemonCard
                  key={userPokemon.id}
                  pokemon={userPokemon.pokemon}
                  userPokemon={userPokemon}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
