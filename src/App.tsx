import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"
import { HeroText } from "./HeroHeader/HeroText"
import CharacterSheet from "./CharacterSheet/CharacterSheet"
import Navbar from "./Navbar/Navbar"
import { Notifications } from "@mantine/notifications"

const theme = createTheme({ fontFamily: "Poppins, sans-serif", primaryColor: "indigo" })

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Navbar />
      <CharacterSheet />
    </MantineProvider>
  )
}

export default App
