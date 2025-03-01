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
import { useEffect, useRef, useState } from "react"
import { useThemeStore } from "../../Stores/ThemeStore"
import { useMediaQuery } from "@mantine/hooks"
import { IconCircleFilled, IconInfoCircle } from "@tabler/icons-react"
import { modals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

const colors = ["gray", "red", "pink", "grape", "violet", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "orange"] // Comes here https://yeun.github.io/open-color/

type createCharacterModalProps = {
  type: "editing" | "creating"
}

function CreateCharacterModal(props: createCharacterModalProps) {
  const [active, setActive] = useState(0)
  const [creatableStuntCount, setCreatableStuntCount] = useState<number>(3)
  const [isCustomStress, setIsCustomStress] = useState<boolean[]>(props.type === "creating" ? [false, false] : [true, true])
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)
  const { themeColor, setThemeColor } = useThemeStore()
  const { currCharacter, addCharacter, updateCharacter } = useCharacterStore()

  const { t } = useTranslation()

  const basics = [
    { label: t("create-modal.name"), placeholder: "Geoff Jones", key: "name" },
    { label: t("create-modal.high-concept"), placeholder: "Noir Style hard punches and hard liquor detective", key: "aspects.highConcept" },
    { label: t("create-modal.trouble"), placeholder: "I can't run from my past life but I can watch him trying to catch me", key: "aspects.trouble" },
    { label: t("create-modal.relationship"), placeholder: "Knows all the cool car shops", key: "aspects.relationship" },
    { label: t("create-modal.other-aspects"), placeholder: "Liquor and revenge keep me going", key: "aspects.otherAspect" },
    { label: t("create-modal.other-aspects"), placeholder: "I won't die without revealing the truth", key: "aspects.secondOtherAspect" },
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
    { label: t("create-modal.physical-stress"), key: "maxPhysicalStress" },
    { label: t("create-modal.mental-stress"), key: "maxMentalStress" },
  ]

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
        { name: t("create-modal.skill-names.academics"), bonus: 0 },
        { name: t("create-modal.skill-names.athletics"), bonus: 0 },
        { name: t("create-modal.skill-names.burglary"), bonus: 0 },
        { name: t("create-modal.skill-names.contacts"), bonus: 0 },
        { name: t("create-modal.skill-names.crafts"), bonus: 0 },
        { name: t("create-modal.skill-names.deceive"), bonus: 0 },
        { name: t("create-modal.skill-names.drive"), bonus: 0 },
        { name: t("create-modal.skill-names.empathy"), bonus: 0 },
        { name: t("create-modal.skill-names.fight"), bonus: 0 },
        { name: t("create-modal.skill-names.investigate"), bonus: 0 },
        { name: t("create-modal.skill-names.lore"), bonus: 0 },
        { name: t("create-modal.skill-names.notice"), bonus: 0 },
        { name: t("create-modal.skill-names.physique"), bonus: 0 },
        { name: t("create-modal.skill-names.provoke"), bonus: 0 },
        { name: t("create-modal.skill-names.rapport"), bonus: 0 },
        { name: t("create-modal.skill-names.resources"), bonus: 0 },
        { name: t("create-modal.skill-names.shoot"), bonus: 0 },
        { name: t("create-modal.skill-names.stealth"), bonus: 0 },
        { name: t("create-modal.skill-names.will"), bonus: 0 },
      ],
      stunts: [],
      theme: "indigo",
      notes: [],
    },
    validate: { name: (value) => (value.length === 0 ? t("create-modal.validation-error") : null) },
  })

  form.watch("refresh", ({ value }) => {
    setCreatableStuntCount(6 - value)
  })

  const initialLoad = useRef(true)
  useEffect(() => {
    if (initialLoad.current) {
      if (props.type === "editing") {
        form.setValues(currCharacter!)
      }
      if (props.type === "creating") {
        form.reset()
      }
      initialLoad.current = false
    }
  }, [props.type, currCharacter, form])

  function handleSubmit(c: Character) {
    const newCharacter = calculateStressBoxes(c)
    if (props.type === "creating") {
      addCharacter(newCharacter)
    }
    if (props.type === "editing") {
      updateCharacter(currCharacter!.id, {
        ...newCharacter,
        stunts: newCharacter.stunts.filter((_, index) => (6 - newCharacter.refresh > index ? newCharacter : "")),
      })
    }
    setThemeColor(newCharacter.theme)
    modals.closeAll()
  }

  function calculateStressBoxes(c: Character): Character {
    let newCharacter = c
    let physicalStress = c.maxPhysicalStress
    let mentalStress = c.maxMentalStress

    if (!isCustomStress[0]) {
      physicalStress = 3
      console.log(c.skills[12]) // skills[12] = physique
      if (c.skills[12].bonus > 0) {
        physicalStress = 4
      }
      if (c.skills[12].bonus > 2) {
        physicalStress = 6
      }
    }
    if (!isCustomStress[1]) {
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
      fatePoints: props.type === "creating" ? c.refresh : c.fatePoints,
    }
    return newCharacter
  }

  function handleError() {
    setActive(0)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Stepper active={active} onStepClick={setActive} size="xs" mt="xs">
        <Stepper.Step label={t("create-modal.first-step")} description={t("create-modal.first-step-desc")}>
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
                      <Text fw={500}>{t("create-modal.theme")}</Text>
                      <Popover>
                        <Popover.Target>
                          <Button fullWidth size="md" radius="md">
                            <Text fw={500}>{themeColor[0].toUpperCase() + themeColor.substring(1)}</Text>
                          </Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Text style={{ textAlign: "center" }}>{t("create-modal.theme-colors")}</Text>
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
        <Stepper.Step label={t("create-modal.second-step")} description={t("create-modal.second-step-desc")}>
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
            {isMobile && <Text size="xs">{t("create-modal.stunt-info")}</Text>}
            <SimpleGrid mt="sm" cols={{ base: 1, sm: 1, lg: 2 }}>
              {stunts.map((s, index) =>
                index < creatableStuntCount ? (
                  <Paper key={index} radius="md" h={120} p="md" withBorder>
                    <Textarea
                      label={s.label}
                      placeholder={t("create-modal.stunt-placeholder")}
                      variant="unstyled"
                      key={form.key(s.key)}
                      {...form.getInputProps(s.key)}
                    />
                  </Paper>
                ) : (
                  <Paper opacity={0.3} key={index} radius="md" h={120} p="md" withBorder>
                    <Tooltip label={t("create-modal.stunt-info")}>
                      <Textarea disabled label={s.label} variant="unstyled"></Textarea>
                    </Tooltip>
                  </Paper>
                ),
              )}
            </SimpleGrid>
          </Stack>
        </Stepper.Step>
        <Stepper.Step label={t("create-modal.third-step")} description={t("create-modal.third-step-desc")}>
          <Stack mt="sm" gap="sm">
            <Alert variant="light" icon={<IconInfoCircle />}>
              {t("create-modal.skills-info")}
            </Alert>
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>{t("create-modal.skills")}</Text>
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
                {t("create-modal.stress-info")}
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
                      <Tooltip label={t("create-modal.stress-info")}>
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
              <Text size="xl">{t("create-modal.thanks")}</Text>
              <Button size="lg" type="submit" variant="gradient" gradient={{ from: "grape", to: "cyan", deg: 90 }}>
                {t("create-modal.create-button")}
              </Button>
            </Stack>
          </Container>
        </Stepper.Completed>
      </Stepper>
      {active !== 3 && (
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            {t("create-modal.back-button")}
          </Button>
          <Button onClick={nextStep}>{t("create-modal.next-button")}</Button>
        </Group>
      )}
    </form>
  )
}
export default CreateCharacterModal
