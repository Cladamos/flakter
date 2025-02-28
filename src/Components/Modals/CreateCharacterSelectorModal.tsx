import { Button, Stack } from "@mantine/core"
import { modals } from "@mantine/modals"
import CreateCharacterModal from "./CreateCharacterModal"
import ImportCharacterModal from "./ImportCharacterModal"

function CreateCharacterSelectorModal() {
  function handleCreateCharacter() {
    modals.closeAll()
    modals.open({
      title: "Create Your Own Character",
      size: "xl",
      padding: "lg",
      radius: "md",
      centered: true,
      children: <CreateCharacterModal />,
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
