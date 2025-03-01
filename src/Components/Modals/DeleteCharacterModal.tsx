import { Button, Group, Text, Stack } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useCharacterStore } from "../../Stores/CharacterStore"
import { modals } from "@mantine/modals"
import { useThemeStore } from "../../Stores/ThemeStore"
import { useTranslation } from "react-i18next"

function DeleteCharacterModal() {
  const { currCharacter, removeCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()

  const { t } = useTranslation()

  function handleDelete() {
    removeCharacter(currCharacter!.id)
    setThemeColor("indigo")
    modals.closeAll()
    notifications.show({
      title: t("delete-modal.title"),
      message: t("delete-modal.notfication-1") + currCharacter!.name + t("delete-modal.notfication-2"),
      color: "red",
    })
  }

  return (
    <Stack>
      <Text size="sm">
        {t("delete-modal.text-1")}
        <Text size="sm" c="red" inherit component="span">
          {" "}
          {t("delete-modal.delete")}{" "}
        </Text>
        {t("delete-modal.text-2")}
      </Text>
      <Group justify="flex-end">
        <Button variant="outline" onClick={modals.closeAll}>
          {t("delete-modal.cancel-button")}
        </Button>
        <Button color="red" onClick={handleDelete}>
          {t("delete-modal.delete-button")}
        </Button>
      </Group>
    </Stack>
  )
}
export default DeleteCharacterModal
