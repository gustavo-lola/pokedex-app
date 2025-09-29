
export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  height: number
  weight: number
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface UserPokemon {
  id: string
  userId: string
  pokemonId: number
  pokemon: Pokemon
  isFavorite: boolean
  isInBattleTeam: boolean
  discoveredAt: string
}

export interface PokemonType {
  id: number
  name: string
  description: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface PokemonContextType {
  discoveredPokemon: UserPokemon[]
  favorites: UserPokemon[]
  battleTeam: UserPokemon[]
  discoverPokemon: (pokemon: Pokemon) => void
  toggleFavorite: (pokemonId: number) => void
  addToBattleTeam: (pokemonId: number) => void
  removeFromBattleTeam: (pokemonId: number) => void
  isLoading: boolean
}
