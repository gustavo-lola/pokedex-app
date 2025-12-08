"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type {UserPokemon,Pokemon,PokemonContextType,} from "@/lib/types";
import { LocalDatabase } from "@/lib/database";
import { useAuth } from "./auth-context";

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [discoveredPokemon, setDiscoveredPokemon] = useState<UserPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPokemon();
    } else {
      setDiscoveredPokemon([]);
    }
  }, [user]);

  const loadUserPokemon = () => {
    if (!user) return;
    const userPokemon = LocalDatabase.getUserPokemon(user.id);
    setDiscoveredPokemon(userPokemon);
  };

  const discoverPokemon = (pokemon: Pokemon) => {
    if (!user) return;

    const userPokemon = LocalDatabase.addUserPokemon(user.id, pokemon);
    setDiscoveredPokemon((prev) => {
      const exists = prev.find((up) => up.pokemonId === pokemon.id);
      if (exists) return prev;
      return [...prev, userPokemon];
    });
  };

  const toggleFavorite = (pokemonId: number) => {
    if (!user) return;

    const pokemon = discoveredPokemon.find((up) => up.pokemonId === pokemonId);
    if (!pokemon) return;

    LocalDatabase.updateUserPokemon(user.id, pokemonId, {
      isFavorite: !pokemon.isFavorite,
    });
    loadUserPokemon();
  };

  const addToBattleTeam = (pokemonId: number) => {
    if (!user) return;

    const battleTeam = discoveredPokemon.filter((up) => up.isInBattleTeam);
    if (battleTeam.length >= 6) return; // Max 6 Pokemon in battle team

    LocalDatabase.updateUserPokemon(user.id, pokemonId, {
      isInBattleTeam: true,
    });
    loadUserPokemon();
  };

  const removeFromBattleTeam = (pokemonId: number) => {
    if (!user) return;

    LocalDatabase.updateUserPokemon(user.id, pokemonId, {
      isInBattleTeam: false,
    });
    loadUserPokemon();
  };

  const favorites = discoveredPokemon.filter((up) => up.isFavorite);
  const battleTeam = discoveredPokemon.filter((up) => up.isInBattleTeam);

  const value: PokemonContextType = {
    discoveredPokemon,
    favorites,
    battleTeam,
    discoverPokemon,
    toggleFavorite,
    addToBattleTeam,
    removeFromBattleTeam,
    isLoading,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
}
