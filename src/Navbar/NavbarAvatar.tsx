import { IconChevronDown, IconPencil, IconTrash, IconSwitch2, IconPlus, IconFileArrowRight } from "@tabler/icons-react"
import { Group, Avatar, Text, Menu, rem } from "@mantine/core"
import { notifications } from "@mantine/notifications"

import { useCopyToClipboard } from "usehooks-ts"
import { useCharacterStore } from "../CharacterStore"

type NavbarAvatarProps = {
  size: string
}

function NavbarAvatar(props: NavbarAvatarProps) {
  const [_, copy] = useCopyToClipboard()
  const { currCharacter } = useCharacterStore()

  function handleSelectCharacterError() {
    notifications.show({
      title: "You have only one character",
      message: "You can create new characters with using menu",
      color: "red",
    })
  }

  function handleExportCharacter() {
    copy(JSON.stringify(currCharacter)).then(() =>
      notifications.show({
        title: "Character copied",
        message: "Your character successfully copied to clipboard",
      }),
    )
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
              <Text truncate="end" maw={100} size={props.size}>
                {currCharacter.name}
              </Text>
              <IconChevronDown style={{ width: rem(18), height: rem(18) }} />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}>Edit my character</Menu.Item>
            <Menu.Item leftSection={<IconSwitch2 style={{ width: rem(14), height: rem(14) }} />}>Change character</Menu.Item>
            <Menu.Item leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}>Create new character</Menu.Item>
            <Menu.Item leftSection={<IconFileArrowRight style={{ width: rem(14), height: rem(14) }} />} onClick={handleExportCharacter}>
              Export your character
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item color="red" leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}>
              Delete my character
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    )
  }
}

export default NavbarAvatar
