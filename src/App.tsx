import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"
import { HeroText } from "./HeroHeader/HeroText"

const theme = createTheme({ fontFamily: "Poppins, sans-serif", primaryColor: "indigo" })

function App() {
  return (
    <MantineProvider theme={theme}>
      <HeroText />
    </MantineProvider>
  )
}

export default App
