import { Button, Stack } from "@mantine/core"
import { modals } from "@mantine/modals"
import CreateCharacterModal from "./CreateCharacterModal"

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
  return (
    <Stack>
      <Button size="md" fullWidth onClick={handleCreateCharacter}>
        Create your own character
      </Button>
      <Button variant="light" size="md" fullWidth onClick={() => {}}>
        Create from presets
      </Button>
      <Button variant="light" size="md" fullWidth onClick={() => {}}>
        Import from JSON
      </Button>
    </Stack>
  )
}
export default CreateCharacterSelectorModal
