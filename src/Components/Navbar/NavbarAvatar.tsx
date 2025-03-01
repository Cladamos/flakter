import { IconChevronDown, IconPencil, IconSwitch2, IconPlus, IconFileArrowRight, IconTrash } from "@tabler/icons-react"
import { Group, Avatar, Text, Menu, rem } from "@mantine/core"
import { notifications } from "@mantine/notifications"

import { useCopyToClipboard } from "usehooks-ts"
import { useCharacterStore } from "../../Stores/CharacterStore"
import DeleteCharacterModal from "../../Components/Modals/DeleteCharacterModal"
import { modals } from "@mantine/modals"
import CreateCharacterSelectorModal from "../../Components/Modals/CreateCharacterSelectorModal"
import SelectCharacterModal from "../Modals/SelectCharacterModal"
import CreateCharacterModal from "../Modals/CreateCharacterModal"
import { useThemeStore } from "../../Stores/ThemeStore"
import { useTranslation } from "react-i18next"

type NavbarAvatarProps = {
  size: string
}

function NavbarAvatar(props: NavbarAvatarProps) {
  const [_, copy] = useCopyToClipboard()
  const { currCharacter, characters } = useCharacterStore()
  const { setThemeColor } = useThemeStore()

  const { t } = useTranslation()

  function handleExportCharacter() {
    copy(JSON.stringify(currCharacter)).then(() =>
      notifications.show({
        title: t("navbar-avatar.copied"),
        message: t("navbar-avatar.copied-desc"),
      }),
    )
  }

  function handleSelectCharacterError() {
    notifications.show({
      title: t("select-modal.error-title"),
      message: t("select-modal.error"),
      color: "red",
    })
  }

  if (currCharacter) {
    return (
      <>
        <Menu withArrow offset={20} position="bottom-start">
          <Menu.Target>
            <Group>
              <Avatar size={props.size} alt={currCharacter.name} color="var(--mantine-color-anchor)">
                {currCharacter.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <Text truncate="end" maw={80} size={props.size}>
                {currCharacter.name}
              </Text>
              <IconChevronDown style={{ width: rem(18), height: rem(18) }} />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{t("navbar-avatar.actions")}</Menu.Label>
            <Menu.Item
              leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => {
                modals.open({
                  title: t("navbar-avatar.edit-title"),
                  size: "xl",
                  padding: "lg",
                  radius: "md",
                  centered: true,
                  onClose() {
                    setThemeColor(currCharacter ? currCharacter.theme : "indigo")
                  },
                  children: <CreateCharacterModal type="editing" />,
                })
              }}
            >
              {t("navbar-avatar.edit")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSwitch2 style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => {
                if (characters.length === 1) {
                  handleSelectCharacterError()
                } else {
                  modals.open({
                    title: t("navbar-avatar.change-title"),
                    size: "sm",
                    padding: "md",
                    radius: "md",
                    centered: true,
                    children: <SelectCharacterModal />,
                  })
                }
              }}
            >
              {t("navbar-avatar.change")}
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                modals.open({
                  title: t("navbar-avatar.create-title"),
                  size: "md",
                  padding: "xl",
                  radius: "md",
                  centered: true,
                  children: <CreateCharacterSelectorModal />,
                })
              }
              leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}
            >
              {t("navbar-avatar.create")}
            </Menu.Item>
            <Menu.Item leftSection={<IconFileArrowRight style={{ width: rem(14), height: rem(14) }} />} onClick={handleExportCharacter}>
              {t("navbar-avatar.export")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>{t("navbar-avatar.danger-zone")}</Menu.Label>
            <Menu.Item
              onClick={() =>
                modals.open({
                  title: t("navbar-avatar.delete-title"),
                  size: "sm",
                  radius: "md",
                  centered: true,
                  padding: "md",
                  children: <DeleteCharacterModal />,
                })
              }
              color="red"
              leftSection={<IconTrash style={{ width: 14, height: 14 }} />}
            >
              {t("navbar-avatar.delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    )
  }
}

export default NavbarAvatar
