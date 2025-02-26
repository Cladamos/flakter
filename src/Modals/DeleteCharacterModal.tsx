import { Button, Group, Text, Stack, Menu } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useCharacterStore } from "../Stores/CharacterStore"
import { IconTrash } from "@tabler/icons-react"
import { modals } from "@mantine/modals"

function DeleteCharacterModal() {
  const { currCharacter, removeCharacter } = useCharacterStore()

  function handleDelete() {
    removeCharacter(currCharacter!.id)
    modals.closeAll()
    notifications.show({
      title: "Your character succesfuly deleted",
      message: "Your " + currCharacter!.name + "gone to void D:",
      color: "red",
    })
  }

  return (
    <Menu.Item
      onClick={() =>
        modals.open({
          title: "Delete your character",
          size: "sm",
          radius: "md",
          centered: true,
          padding: "md",
          children: (
            <Stack>
              <Text size="sm">
                Are you sure you want to
                <Text size="sm" c="red" inherit component="span">
                  {" "}
                  delete{" "}
                </Text>
                your character? This action is destructive and can't be turn back.
              </Text>
              <Group justify="flex-end">
                <Button variant="outline" onClick={modals.closeAll}>
                  Cancel
                </Button>
                <Button color="red" onClick={handleDelete}>
                  Delete
                </Button>
              </Group>
            </Stack>
          ),
        })
      }
      color="red"
      leftSection={<IconTrash style={{ width: 14, height: 14 }} />}
    >
      Delete my character
    </Menu.Item>
  )
}
export default DeleteCharacterModal
