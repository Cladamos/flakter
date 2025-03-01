import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import { Note } from "../Components/Notes"

export type Character = {
  id: string
  name: string
  fatePoints: number
  refresh: number
  physicalStress: boolean[]
  maxPhysicalStress: number
  mentalStress: boolean[]
  maxMentalStress: number
  consequences: {
    mild: { text: string; check: boolean }
    moderate: { text: string; check: boolean }
    severe: { text: string; check: boolean }
    secondMild: { text: string; check: boolean }
  }
  aspects: { highConcept: string; trouble: string; relationship: string; otherAspect: string; secondOtherAspect: string }
  stunts: string[]
  skills: { id: string; name: string; bonus: number }[]
  theme: string
  notes: Note[]
}

interface CharacterStore {
  characters: Character[]
  setCharacters: (characters: Character[]) => void
  currCharacter: Character | null
  setCurrCharacter: (character: Character | null) => void
  addCharacter: (character: Character) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  removeCharacter: (id: string) => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      currCharacter: null,
      setCharacters: (characters) => set({ characters }),
      setCurrCharacter: (character) => set({ currCharacter: character }),
      addCharacter: (character) =>
        set((state) => {
          const newCharacter: Character = { ...character, id: uuidv4() }
          return {
            characters: [...state.characters, newCharacter],
            currCharacter: newCharacter,
          }
        }),
      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((char) => (char.id === id ? { ...char, ...updates } : char)),
          currCharacter: state.currCharacter?.id === id ? { ...state.currCharacter, ...updates } : state.currCharacter,
        })),
      removeCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== id),
          currCharacter: state.currCharacter?.id === id ? null : state.currCharacter,
        })),
    }),
    { name: "character-storage" },
  ),
)
