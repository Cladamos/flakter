import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"

export type Character = {
  id: string
  name: string
  fatePoints: number
  physicalStress: number
  maxPhysicalStress: number
  mentalStress: number
  maxMentalStress: number
  consequences: { mild: string; moderate: string; severe: string; secondMild: string }
  aspects: { highConcept: string; trouble: string; relationship: string; otherAspect: string; secondOtherAspect: string }
  stunts: string[]
  skills: { name: string; bonus: number }[]
}

interface CharacterStore {
  characters: Character[]
  setCharacters: (characters: Character[]) => void
  currCharacter: Character | null
  setCurrCharacter: (character: Character | null) => void
  addCharacter: (name: string) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  removeCharacter: (id: string) => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      currCharacter: {
        id: "asdasd",
        name: "Geoff Jones",
        fatePoints: 3,
        physicalStress: 3,
        maxPhysicalStress: 3,
        mentalStress: 2,
        maxMentalStress: 7,
        consequences: { mild: "", moderate: "", severe: "", secondMild: "" },
        aspects: { highConcept: "", trouble: "", relationship: "", otherAspect: "", secondOtherAspect: "" },
        stunts: [],
        skills: [
          { name: "Academics", bonus: 2 },
          { name: "Athletics", bonus: 2 },
          { name: "Burglary", bonus: 2 },
          { name: "Contacts", bonus: 2 },
          { name: "Crafts", bonus: 2 },
          { name: "Deceive", bonus: 2 },
          { name: "Drive", bonus: 2 },
          { name: "Empathy", bonus: 2 },
          { name: "Fight", bonus: 2 },
          { name: "Investigate", bonus: 2 },
          { name: "Lore", bonus: 2 },
          { name: "Notice", bonus: 2 },
          { name: "Physique", bonus: 2 },
          { name: "Provoke", bonus: 2 },
          { name: "Rapport", bonus: 2 },
          { name: "Resources", bonus: 2 },
          { name: "Shoot", bonus: 2 },
          { name: "Stealth", bonus: 2 },
          { name: "Will", bonus: 2 },
        ],
      },
      setCharacters: (characters) => set({ characters }),
      setCurrCharacter: (character) => set({ currCharacter: character }),
      addCharacter: (name) =>
        set((state) => {
          const newCharacter: Character = {
            id: uuidv4(),
            name,
            fatePoints: 6,
            physicalStress: 0,
            maxPhysicalStress: 0,
            mentalStress: 0,
            maxMentalStress: 0,
            consequences: { mild: "", moderate: "", severe: "", secondMild: "" },
            aspects: { highConcept: "", trouble: "", relationship: "", otherAspect: "", secondOtherAspect: "" },
            skills: [],
            stunts: [],
          }
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
