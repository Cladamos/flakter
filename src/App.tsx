import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { MantineProvider } from "@mantine/core"
import { HeroText } from "./HeroHeader/HeroText"
import CharacterSheet from "./CharacterSheet/CharacterSheet"
import Navbar from "./Navbar/Navbar"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"
import { useCharacterStore } from "./Stores/CharacterStore"
import { useThemeStore } from "./Stores/ThemeStore"

function App() {
  const { currCharacter } = useCharacterStore()
  const { theme } = useThemeStore()

  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <Navbar />
        {currCharacter ? <CharacterSheet /> : <HeroText />}
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
