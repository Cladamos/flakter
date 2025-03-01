import { Avatar, Divider, Button, Stack, Text, Group, ScrollArea } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Character, useCharacterStore } from "../../Stores/CharacterStore"
import { useThemeStore } from "../../Stores/ThemeStore"
import { modals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

function SelectCharacterModal() {
  const { currCharacter, characters, setCurrCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()

  const { t } = useTranslation()

  function handleSetCharacter(character: Character) {
    setCurrCharacter(character)
    modals.closeAll()
    notifications.show({
      title: t("select-modal.successfull-title") + character.name,
      message: t("select-modal.successfull"),
    })
    setThemeColor(character.theme)
  }

  return (
    <ScrollArea h={300} scrollbars="y">
      <Stack>
        <Divider />
        {characters.map((c) => {
          if (currCharacter?.id !== c.id) {
            return (
              <Stack key={c.id}>
                <Button fullWidth variant="subtle" justify="flex-start" size="lg" key={c.id} onClick={() => handleSetCharacter(c)} color={c.theme}>
                  <Group gap="md">
                    <Avatar color={c.theme} alt={c.name}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Text maw={100} c={c.theme} truncate="end">
                      {c.name}
                    </Text>
                  </Group>
                </Button>
                <Divider />
              </Stack>
            )
          }
        })}
      </Stack>
    </ScrollArea>
  )
}

export default SelectCharacterModal
