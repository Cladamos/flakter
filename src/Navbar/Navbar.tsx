import { AppShell, Burger, Group, Text, useMantineColorScheme, Button, Container, Paper, em } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconSun, IconMoon } from "@tabler/icons-react"
import NavbarAvatar from "./NavbarAvatar"

function Navbar() {
  const [opened, { toggle }] = useDisclosure()

  const { colorScheme, setColorScheme } = useMantineColorScheme()

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
              <Button onClick={toggleColorScheme} px={6} radius={8}>
                {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Navbar py="md" px="sm">
        <Paper m="lg">
          <NavbarAvatar size="md" />
        </Paper>
      </AppShell.Navbar>
    </AppShell>
  )
}

export default Navbar
