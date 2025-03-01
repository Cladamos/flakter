import { Button, Stack, JsonInput } from "@mantine/core"
import { useInputState } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { Character, useCharacterStore } from "../../Stores/CharacterStore"
import { useThemeStore } from "../../Stores/ThemeStore"
import { modals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

function ImportCharacterModal() {
  const [data, setData] = useInputState<string>("")
  const { addCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()
  const [isJsonParseError, setIsJsonParseError] = useState(false)

  const { t } = useTranslation()

  let character: Character

  useEffect(() => {
    if (data === "") {
      setIsJsonParseError(false)
      return
    }
    try {
      const parsed = JSON.parse(data)

      // Validate that the parsed object matches the Character structure
      const isValidCharacter =
        typeof parsed === "object" &&
        parsed !== null &&
        typeof parsed.id === "string" &&
        typeof parsed.name === "string" &&
        typeof parsed.fatePoints === "number" &&
        Array.isArray(parsed.physicalStress) &&
        parsed.physicalStress.every((v: unknown) => typeof v === "boolean") &&
        typeof parsed.maxPhysicalStress === "number" &&
        Array.isArray(parsed.mentalStress) &&
        parsed.mentalStress.every((v: unknown) => typeof v === "boolean") &&
        typeof parsed.maxMentalStress === "number" &&
        typeof parsed.consequences === "object" &&
        parsed.consequences !== null &&
        ["mild", "moderate", "severe", "secondMild"].every(
          (key) => typeof parsed.consequences[key]?.text === "string" && typeof parsed.consequences[key]?.check === "boolean",
        ) &&
        typeof parsed.aspects === "object" &&
        parsed.aspects !== null &&
        ["highConcept", "trouble", "relationship", "otherAspect", "secondOtherAspect"].every((key) => typeof parsed.aspects[key] === "string") &&
        Array.isArray(parsed.stunts) &&
        parsed.stunts.every((s: unknown) => typeof s === "string") &&
        Array.isArray(parsed.skills) &&
        parsed.skills.every(
          (skill: unknown) =>
            typeof skill === "object" &&
            skill !== null &&
            typeof (skill as { name: string }).name === "string" &&
            typeof (skill as { bonus: number }).bonus === "number",
        ) &&
        typeof parsed.theme === "string"

      if (isValidCharacter) {
        character = parsed as Character
        setIsJsonParseError(false)
      } else {
        setIsJsonParseError(true)
      }
    } catch (e) {
      setIsJsonParseError(true)
    }
  }, [data])

  function handleCreate() {
    character = JSON.parse(data)
    addCharacter(character)

    notifications.show({
      title: t("import-modal.created"),
      message: t("import-modal.created-desc") + character.name + ".",
    })
    setData("")
    setThemeColor(character.theme)
    modals.closeAll()
  }

  return (
    <Stack>
      <JsonInput
        error={isJsonParseError ? t("import-modal.json-error") : null}
        value={data}
        onChange={(val) => setData(val)}
        size="md"
        radius="md"
        autosize
        minRows={5}
        maxRows={5}
        formatOnBlur={true}
      ></JsonInput>

      <Button disabled={isJsonParseError} onClick={handleCreate}>
        {t("import-modal.create")}
      </Button>
    </Stack>
  )
}
export default ImportCharacterModal
