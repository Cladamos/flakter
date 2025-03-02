import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useCharacterStore } from "../Stores/CharacterStore"

export const officialSkills = [
  "academics",
  "athletics",
  "burglary",
  "contacts",
  "crafts",
  "deceive",
  "drive",
  "empathy",
  "fight",
  "investigate",
  "lore",
  "notice",
  "physique",
  "provoke",
  "rapport",
  "resources",
  "shoot",
  "stealth",
  "will",
]

const useUpdateSkillsOnLangChange = () => {
  const { t, i18n } = useTranslation()
  const { characters, setCharacters, currCharacter, setCurrCharacter } = useCharacterStore()

  useEffect(() => {
    const updateCharacterSkills = (characterSkills: { id: string; name: string; bonus: number }[]) => {
      // Separate official and custom skills
      const official = characterSkills
        .filter((skill) => officialSkills.includes(skill.id)) // Only translate official skills
        .map((skill) => ({ ...skill, name: t(`create-modal.skill-names.${skill.id}`) }))

      const custom = characterSkills.filter((skill) => !skill.id || !officialSkills.includes(skill.id)) // Keep custom skills as is
      // Sort official skills alphabetically after translation
      official.sort((a, b) => a.name.localeCompare(b.name))

      return [...official, ...custom] // Keep order: translated first, then custom
    }

    // Update all characters
    setCharacters(characters.map((c) => ({ ...c, skills: updateCharacterSkills(c.skills) })))

    // Update current character separately
    if (currCharacter) {
      setCurrCharacter({ ...currCharacter, skills: updateCharacterSkills(currCharacter.skills) })
    }
  }, [i18n.language])
}

export default useUpdateSkillsOnLangChange
