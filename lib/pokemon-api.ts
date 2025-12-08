import type { Pokemon } from "./types"

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"

export class PokemonAPI {
  static async getPokemon(id: number): Promise<Pokemon> {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon with id ${id}`)
    }
    return response.json()
  }

  static async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name.toLowerCase()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${name}`)
    }
    return response.json()
  }

  static async getRandomPokemon(): Promise<Pokemon> {
    const randomId = Math.floor(Math.random() * 1010) + 1
    return this.getPokemon(randomId)
  }

  static async getPokemonList(
    limit = 20,
    offset = 0,
  ): Promise<{
    count: number
    results: Array<{ name: string; url: string }>
  }> {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon list")
    }
    return response.json()
  }

  static async getPokemonTypes(): Promise<Array<{ name: string; url: string }>> {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`)
    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon types")
    }
    const data = await response.json()
    return data.results
  }

  static getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    }
    return typeColors[type] || "#68A090"
  }
}
