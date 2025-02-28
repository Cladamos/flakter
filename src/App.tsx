import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { MantineProvider } from "@mantine/core"
import { HeroText } from "./Components/HeroHeader/HeroText"
import CharacterSheet from "./Components/CharacterSheet/CharacterSheet"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"
import { useCharacterStore } from "./Stores/CharacterStore"
import { useThemeStore } from "./Stores/ThemeStore"
import Navbar from "./Components/Navbar/Navbar"

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
