import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"
import { HeroText } from "./HeroHeader/HeroText"
import CharacterSheet from "./CharacterSheet/CharacterSheet"
import Navbar from "./Navbar/Navbar"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"
import { useCharacterStore } from "./CharacterStore"

const theme = createTheme({ fontFamily: "Poppins, sans-serif", primaryColor: "indigo" })

function App() {
  const { currCharacter } = useCharacterStore()

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
