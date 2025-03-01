import { Button, Stack } from "@mantine/core"
import { modals } from "@mantine/modals"
import CreateCharacterModal from "./CreateCharacterModal"
import ImportCharacterModal from "./ImportCharacterModal"
import { useCharacterStore } from "../../Stores/CharacterStore"
import { useThemeStore } from "../../Stores/ThemeStore"
import { useTranslation } from "react-i18next"

function CreateCharacterSelectorModal() {
  const { currCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()

  const { t } = useTranslation()

  function handleCreateCharacter() {
    modals.closeAll()
    modals.open({
      title: t("create-modal.modal-title"),
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
      title: t("import-modal.modal-title"),
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
        {t("create-selector-modal.create-button")}
      </Button>
      <Button variant="light" size="md" fullWidth onClick={handleImportCharacter}>
        {t("create-selector-modal.json-button")}
      </Button>
    </Stack>
  )
}
export default CreateCharacterSelectorModal
