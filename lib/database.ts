import type { User, UserPokemon, Pokemon } from "./types"

const USERS_KEY = "pokedex_users"
const USER_POKEMON_KEY = "pokedex_user_pokemon"
const CURRENT_USER_KEY = "pokedex_current_user"

export class LocalDatabase {
    static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  static createUser(user: Omit<User, "id" | "createdAt">): User {
    const users = this.getUsers()
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  static findUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.email === email) || null
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const currentUser = localStorage.getItem(CURRENT_USER_KEY)
    return currentUser ? JSON.parse(currentUser) : null
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  static getUserPokemon(userId: string): UserPokemon[] {
    if (typeof window === "undefined") return []
    const userPokemon = localStorage.getItem(`${USER_POKEMON_KEY}_${userId}`)
    return userPokemon ? JSON.parse(userPokemon) : []
  }

  static saveUserPokemon(userId: string, pokemon: UserPokemon[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`${USER_POKEMON_KEY}_${userId}`, JSON.stringify(pokemon))
  }

  static addUserPokemon(userId: string, pokemon: Pokemon): UserPokemon {
    const userPokemon = this.getUserPokemon(userId)
    const newUserPokemon: UserPokemon = {
      id: crypto.randomUUID(),
      userId,
      pokemonId: pokemon.id,
      pokemon,
      isFavorite: false,
      isInBattleTeam: false,
      discoveredAt: new Date().toISOString(),
    }

    const existingIndex = userPokemon.findIndex((up) => up.pokemonId === pokemon.id)
    if (existingIndex >= 0) {
      return userPokemon[existingIndex]
    }

    userPokemon.push(newUserPokemon)
    this.saveUserPokemon(userId, userPokemon)
    return newUserPokemon
  }

  static updateUserPokemon(userId: string, pokemonId: number, updates: Partial<UserPokemon>): void {
    const userPokemon = this.getUserPokemon(userId)
    const index = userPokemon.findIndex((up) => up.pokemonId === pokemonId)
    if (index >= 0) {
      userPokemon[index] = { ...userPokemon[index], ...updates }
      this.saveUserPokemon(userId, userPokemon)
    }
  }

  static getFavorites(userId: string): UserPokemon[] {
    return this.getUserPokemon(userId).filter((up) => up.isFavorite)
  }

  static getBattleTeam(userId: string): UserPokemon[] {
    return this.getUserPokemon(userId).filter((up) => up.isInBattleTeam)
  }
}
