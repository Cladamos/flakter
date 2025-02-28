import { useForm } from "@mantine/form"
import { Character, useCharacterStore } from "../../Stores/CharacterStore"
import {
  Button,
  Group,
  Popover,
  Stack,
  Stepper,
  Textarea,
  TextInput,
  Text,
  Divider,
  SimpleGrid,
  Tooltip,
  NumberInput,
  Paper,
  em,
  Grid,
  Card,
  Alert,
  Container,
  Checkbox,
} from "@mantine/core"
import { useState } from "react"
import { useThemeStore } from "../../Stores/ThemeStore"
import { useMediaQuery } from "@mantine/hooks"
import { IconCircleFilled, IconInfoCircle } from "@tabler/icons-react"
import { modals } from "@mantine/modals"

const basics = [
  { label: "Name", placeholder: "Geoff Jones", key: "name" },
  { label: "High Concept", placeholder: "Noir Style hard punches and hard liquor detective", key: "aspects.highConcept" },
  { label: "Trouble", placeholder: "I can't run from my past life but I can watch him trying to catch me", key: "aspects.trouble" },
  { label: "Relationship", placeholder: "Knows all the cool car shops", key: "aspects.relationship" },
  { label: "Other Aspect", placeholder: "Liquor and revenge keep me going", key: "aspects.otherAspect" },
  { label: "Other Aspect", placeholder: "I won't die without revealing the truth", key: "aspects.secondOtherAspect" },
]

const stunts = [
  { label: "Stunt 1", key: "stunts.0" },
  { label: "Stunt 2", key: "stunts.1" },
  { label: "Stunt 3", key: "stunts.2" },
  { label: "Stunt 4", key: "stunts.3" },
  { label: "Stunt 5", key: "stunts.4" },
  { label: "Stunt 6", key: "stunts.5" },
]

const stressBoxes = [
  { label: "Physical stress", key: "maxPhysicalStress" },
  { label: "Mental stress", key: "maxMentalStress" },
]

const colors = ["gray", "red", "pink", "grape", "violet", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "orange"] // Comes here https://yeun.github.io/open-color/

function CreateCharacterModal() {
  const [active, setActive] = useState(0)
  const [creatableStuntCount, setCreatableStuntCount] = useState<number>(3)
  const [isCustomStress, setIsCustomStress] = useState<boolean[]>([false, false])
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)
  const { themeColor, setThemeColor } = useThemeStore()
  const { addCharacter } = useCharacterStore()

  const form = useForm<Character>({
    mode: "uncontrolled",
    initialValues: {
      id: "",
      name: "",
      fatePoints: 3,
      refresh: 3,
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
      skills: [
        { name: "Academics", bonus: 0 },
        { name: "Athletics", bonus: 0 },
        { name: "Burglary", bonus: 0 },
        { name: "Contacts", bonus: 0 },
        { name: "Crafts", bonus: 0 },
        { name: "Deceive", bonus: 0 },
        { name: "Drive", bonus: 0 },
        { name: "Empathy", bonus: 0 },
        { name: "Fight", bonus: 0 },
        { name: "Investigate", bonus: 0 },
        { name: "Lore", bonus: 0 },
        { name: "Notice", bonus: 0 },
        { name: "Physique", bonus: 0 },
        { name: "Provoke", bonus: 0 },
        { name: "Rapport", bonus: 0 },
        { name: "Resources", bonus: 0 },
        { name: "Shoot", bonus: 0 },
        { name: "Stealth", bonus: 0 },
        { name: "Will", bonus: 0 },
      ],
      stunts: [],
      theme: "indigo",
      notes: [],
    },
    validate: { name: (value) => (value.length === 0 ? "Your character must have a name" : null) },
  })

  form.watch("refresh", ({ value }) => {
    setCreatableStuntCount(6 - value)
  })

  function handleSubmit(c: Character) {
    let newCharacter = c
    let physicalStress = c.maxPhysicalStress
    let mentalStress = c.maxMentalStress

    if (c.maxPhysicalStress === 0) {
      physicalStress = 3
      console.log(c.skills[12]) // skills[12] = physique
      if (c.skills[12].bonus > 0) {
        physicalStress = 4
      }
      if (c.skills[12].bonus > 2) {
        physicalStress = 6
      }
    }
    if (c.maxMentalStress === 0) {
      mentalStress = 3
      console.log(c.skills[18]) // skills[18] = will
      if (c.skills[18].bonus > 0) {
        mentalStress = 4
      }
      if (c.skills[18].bonus > 2) {
        mentalStress = 6
      }
    }
    newCharacter = {
      ...c,
      maxMentalStress: mentalStress,
      maxPhysicalStress: physicalStress,
      mentalStress: Array(mentalStress).fill(false),
      physicalStress: Array(physicalStress).fill(false),
      fatePoints: c.refresh,
    }
    setThemeColor(c.theme)
    addCharacter(newCharacter)
    modals.closeAll()
  }

  function handleError() {
    setActive(0)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Stepper active={active} onStepClick={setActive} size="xs" mt="xs">
        <Stepper.Step label="First Step" description="Determine basics">
          <Stack>
            {basics.map((b) =>
              b.key === "name" ? (
                <Grid key={b.key}>
                  <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <TextInput
                      required
                      size="md"
                      radius="md"
                      label={b.label}
                      placeholder={b.placeholder}
                      key={form.key(b.key)}
                      {...form.getInputProps(b.key)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <Stack gap={2}>
                      <Text fw={500}> Theme</Text>
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
                  </Grid.Col>
                </Grid>
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
                />
              ),
            )}
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Second Step" description="Create Your stunts">
          <Stack gap="sm">
            <NumberInput
              allowNegative={false}
              allowDecimal={false}
              size="md"
              radius="md"
              label="Refresh"
              key={form.key("refresh")}
              {...form.getInputProps("refresh")}
            />
            {isMobile && <Text size="xs">You can create '6 - refresh' amount of stunts</Text>}
            <SimpleGrid mt="sm" cols={{ base: 1, sm: 1, lg: 2 }}>
              {stunts.map((s, index) =>
                index < creatableStuntCount ? (
                  <Paper key={index} radius="md" h={120} p="md" withBorder>
                    <Textarea
                      label={s.label}
                      placeholder="Write your stunt"
                      variant="unstyled"
                      key={form.key(s.key)}
                      {...form.getInputProps(s.key)}
                    />
                  </Paper>
                ) : (
                  <Paper opacity={0.3} key={index} radius="md" h={120} p="md" withBorder>
                    <Tooltip label="You can create '6 - refresh' amount of stunts">
                      <Textarea disabled label={s.label} placeholder="Write your stunt" variant="unstyled"></Textarea>
                    </Tooltip>
                  </Paper>
                ),
              )}
            </SimpleGrid>
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Third Step" description="Determine your skills">
          <Stack mt="sm" gap="sm">
            <Alert variant="light" icon={<IconInfoCircle />}>
              You can select one +4, two +3, three +2, four +1 skills
            </Alert>
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>Skills</Text>
                </Group>
              </Card.Section>

              <Grid mt="sm">
                {form.getValues().skills.map((s, index) => (
                  <Grid.Col span={{ base: 12, md: 4, lg: 3 }} key={index}>
                    <NumberInput
                      allowDecimal={false}
                      size="sm"
                      radius="md"
                      prefix={s.bonus > 0 ? "+" : undefined}
                      label={s.name}
                      key={form.key("skills." + index + ".bonus")}
                      {...form.getInputProps("skills." + index + ".bonus")}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Card>
            {isMobile && (
              <Alert mt="md" variant="light" icon={<IconInfoCircle />}>
                Stress boxes will calculated automaticly if you don't want to customize leave it unchecked
              </Alert>
            )}

            <Grid>
              {stressBoxes.map((s, index) => (
                <Grid.Col key={s.key} span={{ base: 12, sm: 12, lg: 6 }}>
                  <Group wrap="nowrap">
                    <Checkbox
                      mt="lg"
                      size="md"
                      radius="xl"
                      checked={isCustomStress[index]}
                      onChange={() => setIsCustomStress((v) => [...v.map((val, i) => (i === index ? !val : val))])}
                      icon={IconCircleFilled}
                    />
                    {isCustomStress[index] ? (
                      <NumberInput
                        allowNegative={false}
                        allowDecimal={false}
                        size="md"
                        radius="md"
                        label={s.label}
                        key={form.key(s.key)}
                        {...form.getInputProps(s.key)}
                      />
                    ) : (
                      <Tooltip label="They will calculated automaticly if you don't want to customize leave it unchecked">
                        <NumberInput disabled size="md" radius="md" label={s.label} />
                      </Tooltip>
                    )}
                  </Group>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Stepper.Step>
        <Stepper.Completed>
          <Container size="xs" my="lg" p="xl">
            <Stack justify="center">
              <Text size="xl">Thanks for using Flakter for creating your character. I hope you will like it.</Text>
              <Button size="lg" type="submit" variant="gradient" gradient={{ from: "grape", to: "cyan", deg: 90 }}>
                Create
              </Button>
            </Stack>
          </Container>
        </Stepper.Completed>
      </Stepper>
      {active !== 3 && (
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
