import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createTheme, MantineThemeOverride } from "@mantine/core"

interface ThemeStore {
  theme: MantineThemeOverride
  themeColor: string
  setThemeColor: (color: string) => void
}

export const useThemeStore = create(
  persist<ThemeStore>(
    (set) => ({
      themeColor: "indigo",
      theme: createTheme({
        fontFamily: "Poppins, sans-serif",
        primaryColor: "indigo",
      }),
      setThemeColor: (color) => {
        set({
          themeColor: color,
          theme: createTheme({
            fontFamily: "Poppins, sans-serif",
            primaryColor: color,
          }),
        })
      },
    }),
    { name: "theme-storage" }, // Key name in localStorage
  ),
)
