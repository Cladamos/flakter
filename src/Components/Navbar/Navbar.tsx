import { AppShell, Burger, Group, Text, useMantineColorScheme, Button, Container, Paper, em, Stack, Popover } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconSun, IconMoon, IconLanguage } from "@tabler/icons-react"
import NavbarAvatar from "./NavbarAvatar"
import { useTranslation } from "react-i18next"
import { useState } from "react"

function Navbar() {
  const [opened, { toggle }] = useDisclosure()
  const [openedPopover, setOpenedPopover] = useState<boolean>(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const { i18n } = useTranslation()

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark")
  }

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "lg",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" w={isMobile ? 100 : 300} />
            <Text size="xl" fw={900} w={{ lg: "400" }}>
              Flakter
            </Text>
            <Group justify="flex-end" w={isMobile ? 100 : 300} gap="xl">
              <Paper visibleFrom="lg">
                <NavbarAvatar size="md" />
              </Paper>
              <Group>
                {!isMobile && (
                  <Popover opened={openedPopover} onDismiss={() => setOpenedPopover(false)}>
                    <Popover.Target>
                      <Button px={6} radius={8} variant="outline" onClick={() => setOpenedPopover((o) => !o)}>
                        <IconLanguage />
                      </Button>
                    </Popover.Target>
                    <Popover.Dropdown p="xs">
                      <Stack gap="xs">
                        <Button
                          variant="light"
                          onClick={() => {
                            i18n.changeLanguage("tr"), setOpenedPopover(false)
                          }}
                        >
                          Turkish
                        </Button>
                        <Button
                          onClick={() => {
                            i18n.changeLanguage("en"), setOpenedPopover(false)
                          }}
                        >
                          English
                        </Button>
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                )}
                <Button onClick={toggleColorScheme} px={6} radius={8}>
                  {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
                </Button>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Navbar py="md" px="sm">
        <Stack gap={0} justify="space-between">
          <Paper m="lg">
            <NavbarAvatar size="md" />
          </Paper>
          {isMobile && (
            <Popover opened={openedPopover} onDismiss={() => setOpenedPopover(false)} offset={10} withArrow arrowSize={12}>
              <Popover.Target>
                <Button m="lg" px={6} radius={8} variant="outline" onClick={() => setOpenedPopover((o) => !o)}>
                  <Group gap="xs">
                    <IconLanguage />
                    <Text>Language</Text>
                  </Group>
                </Button>
              </Popover.Target>
              <Popover.Dropdown w="85%" p="xs">
                <Stack gap="xs">
                  <Button
                    variant="light"
                    onClick={() => {
                      i18n.changeLanguage("tr"), setOpenedPopover(false)
                    }}
                  >
                    Turkish
                  </Button>
                  <Button
                    onClick={() => {
                      i18n.changeLanguage("en"), setOpenedPopover(false)
                    }}
                  >
                    English
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          )}
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  )
}

export default Navbar
