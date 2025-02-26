import { useForm } from "@mantine/form"
import { Character } from "../Stores/CharacterStore"
import { Button, Group, Popover, Stack, Stepper, Textarea, TextInput, Text, Divider, SimpleGrid, Tooltip } from "@mantine/core"
import { useState } from "react"
import { useThemeStore } from "../Stores/ThemeStore"

const basics = [
  { label: "Name", placeholder: "Geoff Jones", key: "name" },
  { label: "High Concept", placeholder: "Noir Style hard punches and hard liquor detective", key: "aspects.highConcept" },
  { label: "Trouble", placeholder: "I can't run from my past life but I can watch him trying to catch me", key: "aspects.trouble" },
  { label: "Relationship", placeholder: "Knows all the cool car shops", key: "aspects.relationship" },
  { label: "Other Aspect", placeholder: "Liquor and revenge keep me going", key: "aspects.otherAspect" },
  { label: "Other Aspect", placeholder: "I won't die without revealing the truth", key: "aspects.secondOtherAspect" },
]

const colors = ["gray", "red", "pink", "grape", "violet", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "orange"] // Comes here https://yeun.github.io/open-color/

function CreateCharacterModal() {
  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  const { themeColor, setThemeColor } = useThemeStore()

  const form = useForm<Character>({
    mode: "uncontrolled",
    initialValues: {
      id: "",
      name: "",
      fatePoints: 6,
      physicalStress: [],
      maxPhysicalStress: 0,
      mentalStress: [],
      maxMentalStress: 0,
      consequences: {
        mild: { text: "", check: false },
        moderate: { text: "", check: false },
        severe: { text: "", check: false },
        secondMild: { text: "", check: false },
      },
      aspects: { highConcept: "", trouble: "", relationship: "", otherAspect: "", secondOtherAspect: "" },
      skills: [],
      stunts: [],
      theme: "",
    },
  })
  return (
    <form>
      <Stepper active={active} onStepClick={setActive} size="xs" mt="xs">
        <Stepper.Step label="First Step" description="Determine basics">
          <Stack>
            {basics.map((b) =>
              b.key === "name" ? (
                <Group wrap="nowrap">
                  <TextInput
                    size="md"
                    radius="md"
                    label={b.label}
                    placeholder={b.placeholder}
                    key={form.key(b.key)}
                    {...form.getInputProps(b.key)}
                  ></TextInput>
                  <Stack w="50%" gap={2}>
                    <Text fw={500}> Character Theme</Text>
                    <Popover>
                      <Popover.Target>
                        <Button fullWidth size="md" radius="md">
                          <Text fw={500}>{themeColor[0].toUpperCase() + themeColor.substring(1)}</Text>
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text style={{ textAlign: "center" }}>Theme Colors</Text>
                        <Divider />
                        <SimpleGrid cols={4} pt="xs">
                          {colors.map((color) => (
                            <Tooltip label={color} key={color}>
                              <Button
                                size="xs"
                                key={color}
                                color={color}
                                onClick={() => {
                                  setThemeColor(color)
                                  form.setValues({ theme: color })
                                }}
                              ></Button>
                            </Tooltip>
                          ))}
                        </SimpleGrid>
                      </Popover.Dropdown>
                    </Popover>
                  </Stack>
                </Group>
              ) : (
                <Textarea
                  size="md"
                  radius="md"
                  label={b.label}
                  placeholder={b.placeholder}
                  autosize
                  minRows={2}
                  maxRows={5}
                  key={form.key(b.key)}
                  {...form.getInputProps(b.key)}
                ></Textarea>
              ),
            )}
          </Stack>
        </Stepper.Step>
      </Stepper>
      {active !== 4 && (
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next Step</Button>
        </Group>
      )}
    </form>
  )
}
export default CreateCharacterModal
