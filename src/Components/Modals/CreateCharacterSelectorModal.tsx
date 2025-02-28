import { Button, Stack } from "@mantine/core"
import { modals } from "@mantine/modals"
import CreateCharacterModal from "./CreateCharacterModal"
import ImportCharacterModal from "./ImportCharacterModal"
import { useCharacterStore } from "../../Stores/CharacterStore"
import { useThemeStore } from "../../Stores/ThemeStore"

function CreateCharacterSelectorModal() {
  const { currCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()
  function handleCreateCharacter() {
    modals.closeAll()
    modals.open({
      title: "Create Your Own Character",
      size: "xl",
      padding: "lg",
      radius: "md",
      centered: true,
      onClose() {
        setThemeColor(currCharacter ? currCharacter.theme : "indigo")
      },
      children: <CreateCharacterModal type="creating" />,
    })
  }
  function handleImportCharacter() {
    modals.closeAll()
    modals.open({
      title: "Paste your character JSON",
      size: "md",
      padding: "xl",
      radius: "md",
      centered: true,
      children: <ImportCharacterModal />,
    })
  }
  return (
    <Stack>
      <Button size="md" fullWidth onClick={handleCreateCharacter}>
        Create your own character
      </Button>
      <Button variant="light" size="md" fullWidth onClick={handleImportCharacter}>
        Import from JSON
      </Button>
    </Stack>
  )
}
export default CreateCharacterSelectorModal
