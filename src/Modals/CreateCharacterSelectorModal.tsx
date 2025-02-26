import { Button, Stack } from "@mantine/core"

function CreateCharacterSelectorModal() {
  return (
    <Stack>
      <Button size="md" fullWidth onClick={() => {}}>
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
