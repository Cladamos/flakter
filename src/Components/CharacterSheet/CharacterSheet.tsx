import {
  Box,
  Button,
  Card,
  CardSection,
  Checkbox,
  Container,
  Divider,
  em,
  Grid,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { IconCircle, IconCircleFilled, IconEdit, IconFile, IconMinus, IconNotebook, IconPlus } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks"
import { useCharacterStore } from "../../Stores/CharacterStore"
import "./CharacterSheet.css"
import { RollDice } from "./RollDice"
import CharacterDetailsModal from "../Modals/CharacterDetailsModal"
import Notes from "../Notes"
import { useThemeStore } from "../../Stores/ThemeStore"
import CreateCharacterModal from "../Modals/CreateCharacterModal"
import { modals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

function CharacterSheet() {
  const [animate, setAnimate] = useState(false)
  const [animateCard, setAnimateCard] = useState(false)
  const [animateSkill, setAnimateSkill] = useState<number | null>(null)
  const [isNotesView, setIsNotesView] = useState<boolean>(false)
  const [diceRolls, setDiceRolls] = useState<number[]>([1, 0, -1, 0])
  const diceRollSum = diceRolls.reduce((acc, val) => acc + val, 0)
  const [modifier, setModifier] = useState<number>(0)
  const { currCharacter, updateCharacter } = useCharacterStore()
  const { setThemeColor } = useThemeStore()
  const { t } = useTranslation()

  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timeoutRefScroll = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeoutRefBorder = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (currCharacter) {
    const basicValues = [
      { text: t("character-sheet.physical-stress"), val: currCharacter.physicalStress, maxVal: currCharacter.maxPhysicalStress },
      { text: t("character-sheet.mental-stress"), val: currCharacter.mentalStress, maxVal: currCharacter.maxMentalStress },
    ]

    const consequences = [
      { text: t("character-sheet.mild"), val: currCharacter.consequences.mild, location: "mild", stress: 2 },
      { text: t("character-sheet.moderate"), val: currCharacter.consequences.moderate, location: "moderate", stress: 4 },
      { text: t("character-sheet.severe"), val: currCharacter.consequences.severe, location: "severe", stress: 6 },
      { text: t("character-sheet.mild"), val: currCharacter.consequences.secondMild, location: "secondMild", stress: 2 },
    ]

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
      offset: 60,
      duration: 750,
    })

    const { scrollIntoView: scrollIntoViewDice, targetRef: targetRefDice } = useScrollIntoView<HTMLDivElement>({
      offset: 60,
      duration: 500,
    })

    useEffect(() => {
      setThemeColor(currCharacter.theme)
    }, [currCharacter])

    function handleNotesView() {
      setIsNotesView((n) => !n)
      // TODO: Find better solution than setTimeout
      setTimeout(() => {
        if (isMobile && !isNotesView) {
          scrollIntoView({
            alignment: "start",
          })
        }
      }, 1)
    }

    function handleDiceRoll(modifer: number) {
      if (timeoutRefScroll.current) {
        clearTimeout(timeoutRefScroll.current)
      }
      setDiceRolls(RollDice())
      setModifier(modifer)
      handleDiceCardAnimation()
      setAnimate(true)
      if (isMobile) {
        scrollIntoViewDice({
          alignment: "start",
        })
      }
      timeoutRefScroll.current = setTimeout(() => {
        setAnimate(false)
        timeoutRefScroll.current = null
      }, 250)
    }

    function handleDiceCardAnimation() {
      if (timeoutRefBorder.current) {
        clearTimeout(timeoutRefBorder.current)
      }
      setAnimateCard(true)
      timeoutRefBorder.current = setTimeout(() => {
        setAnimateCard(false)
        setAnimateSkill(null)
        timeoutRefBorder.current = null
      }, 2000)
    }

    return (
      <Container size="lg" mt={80} mb={isMobile ? 25 : 0}>
        <Group gap="lg">
          <Stack w="100%" gap="xs">
            <Card withBorder shadow="sm" radius="md">
              <Group pb="sm" style={{ position: "relative", width: "100%" }}>
                <CharacterDetailsModal isMobile={isMobile} />
                <Group style={{ position: "absolute", right: 0 }} gap={0}>
                  <Tooltip label={isNotesView ? t("character-sheet.go-sheet") : t("character-sheet.go-notes")}>
                    <Button px="xs" size="xs" variant="transparent" onClick={handleNotesView}>
                      {isNotesView ? <IconFile /> : <IconNotebook />}
                    </Button>
                  </Tooltip>
                  <Tooltip label={t("character-sheet.edit")}>
                    <Button
                      px="xs"
                      size="xs"
                      variant="transparent"
                      onClick={() => {
                        modals.open({
                          title: "Create Your Own Character",
                          size: "xl",
                          padding: "lg",
                          radius: "md",
                          centered: true,
                          onClose() {
                            setThemeColor(currCharacter ? currCharacter.theme : "indigo")
                          },
                          children: <CreateCharacterModal type="editing" />,
                        })
                      }}
                    >
                      <IconEdit />
                    </Button>
                  </Tooltip>
                </Group>
              </Group>
              <Card.Section withBorder inheritPadding py="sm">
                <Grid columns={36} style={{ textAlign: "center" }} align="center" grow>
                  <Grid.Col span={{ base: 36, md: 12, lg: 8 }}>
                    <Group grow wrap="nowrap">
                      <Stack gap={0}>
                        <Text>Refresh</Text>
                        <Paper p={0} h={50} withBorder>
                          <Group h="100%" align="center" justify="center">
                            <Text>{currCharacter.refresh}</Text>
                          </Group>
                        </Paper>
                      </Stack>
                      <Stack gap={0}>
                        <Text>{t("character-sheet.fate-points")}</Text>
                        <Paper h={50} pl="sm" withBorder>
                          <Group h="100%" align="center" justify="center">
                            <NumberInput
                              styles={{
                                input: { textAlign: "center" },
                              }}
                              value={currCharacter.fatePoints}
                              onChange={(e) => updateCharacter(currCharacter.id, { ...currCharacter, fatePoints: Number(e) })}
                              allowNegative={false}
                              allowDecimal={false}
                              variant="unstyled"
                              size="md"
                              w="100%"
                            />
                          </Group>
                        </Paper>
                      </Stack>
                    </Group>
                  </Grid.Col>
                  {basicValues.map((b) => (
                    <Grid.Col key={b.text} span={{ base: 36, md: 12, lg: 12 }}>
                      <Text>{b.text}</Text>
                      <Paper h={50} px="md" withBorder>
                        <Group h="100%" justify="center">
                          {b.val.map((bool, index) => (
                            <Checkbox
                              size={b.maxVal! > 7 ? (b.maxVal! > 10 ? "xs" : "sm") : "md"}
                              radius="xl"
                              color="red"
                              key={index}
                              icon={IconCircleFilled}
                              checked={bool}
                              onChange={() =>
                                b.text === t("character-sheet.physical-stress")
                                  ? updateCharacter(currCharacter.id, {
                                      ...currCharacter,
                                      physicalStress: currCharacter.physicalStress.map((v, i) => (i === index ? !v : v)),
                                    })
                                  : updateCharacter(currCharacter.id, {
                                      ...currCharacter,
                                      mentalStress: currCharacter.mentalStress.map((v, i) => (i === index ? !v : v)),
                                    })
                              }
                            />
                          ))}
                        </Group>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Card.Section>
            </Card>
            {isNotesView ? (
              <>
                <Card withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>{t("character-sheet.stunts")}</Text>
                  </CardSection>
                  <SimpleGrid mt="sm" cols={{ base: 1, sm: 2, lg: 3 }}>
                    {currCharacter.stunts.map((s) => (
                      <Paper radius="md" h={100} p="md" withBorder>
                        <ScrollArea h={70}>
                          <Text>{s}</Text>
                        </ScrollArea>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Card>
                <Card h={isMobile ? 1150 : 350} ref={targetRef} withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>{t("character-sheet.notes")}</Text>
                  </CardSection>
                  <Notes />
                </Card>
              </>
            ) : (
              <>
                <Card withBorder shadow="sm" radius="md">
                  <Grid grow style={{ textAlign: "center" }} align="end">
                    {consequences.map((c, index) => (
                      <Grid.Col span={{ base: 12, md: 6, lg: 2 }} key={c.text + index}>
                        <Text>{c.text}</Text>
                        <Paper h={50} px="xs" withBorder>
                          <Group h="100%" w="100%" gap="xs">
                            <Checkbox
                              checked={c.val.check}
                              onChange={(e) => {
                                updateCharacter(currCharacter.id, {
                                  ...currCharacter,
                                  consequences: { ...currCharacter.consequences, [c.location]: { check: !c.val.check, text: "" } },
                                })
                                if (e.currentTarget.checked) {
                                  inputRefs.current[index]?.focus()
                                }
                              }}
                              w="10%"
                              size="md"
                              radius="xl"
                              icon={IconCircleFilled}
                            />
                            <TextInput
                              ref={(element) => {
                                inputRefs.current[index] = element
                              }}
                              value={c.val.text}
                              onChange={(e) =>
                                updateCharacter(currCharacter.id, {
                                  ...currCharacter,
                                  consequences: {
                                    ...currCharacter.consequences,
                                    [c.location]: {
                                      text: e.currentTarget.value,
                                      check: e.currentTarget.value === "" ? false : true,
                                    },
                                  },
                                })
                              }
                              w="70%"
                              variant="unstyled"
                            />
                            <Group justify="end" w="10%" gap="sm" p={0}>
                              <Divider orientation="vertical" />
                              <Text>{c.stress}</Text>
                            </Group>
                          </Group>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card>
                <Card
                  style={isMobile ? { textAlign: "center" } : undefined}
                  withBorder
                  shadow="sm"
                  radius="md"
                  bd={animateCard ? "1px solid var(--mantine-primary-color-filled)" : undefined}
                >
                  {isMobile ? (
                    <Group ref={targetRefDice} w="100%" justify="center">
                      <Group className="paper-hover" onClick={() => handleDiceRoll(0)}>
                        {diceRolls.map((d, index) => (
                          <Paper key={index} withBorder h={50} w={50} p="sm">
                            <span className={animate ? "dice-icon" : ""}>{d === 1 ? <IconPlus /> : d === -1 ? <IconMinus /> : null}</span>
                          </Paper>
                        ))}
                      </Group>
                      <Text w={isMobile ? "100%" : undefined} style={{ justifySelf: "end" }} size="lg" fw={700}>
                        {t("character-sheet.total")}:{" "}
                        {modifier === 0
                          ? diceRollSum > 0
                            ? "+" + diceRollSum
                            : "" + diceRollSum
                          : diceRollSum + (modifier > 0 ? "+" : "") + modifier + " = " + (diceRollSum + modifier)}
                      </Text>
                    </Group>
                  ) : (
                    <Box pos="relative" w="100%">
                      <Group h={50} w="100%">
                        <Group
                          style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                          className="paper-hover"
                          onClick={() => handleDiceRoll(0)}
                        >
                          {diceRolls.map((d, index) => (
                            <Paper key={index} withBorder h={50} w={50} p="sm">
                              <span className={animate ? "dice-icon" : ""}>{d === 1 ? <IconPlus /> : d === -1 ? <IconMinus /> : null}</span>
                            </Paper>
                          ))}
                        </Group>
                        <Text
                          w={isMobile ? "100%" : undefined}
                          style={{
                            position: "absolute",
                            right: "20%",
                            textAlign: "center",
                          }}
                          size="lg"
                          fw={700}
                        >
                          {t("character-sheet.total")}:{" "}
                          {modifier === 0
                            ? diceRollSum > 0
                              ? "+" + diceRollSum
                              : "" + diceRollSum
                            : diceRollSum + (modifier > 0 ? "+" : "") + modifier + " = " + (diceRollSum + modifier)}
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Card>

                <Card withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>{t("character-sheet.skills")}</Text>
                  </CardSection>
                  <Grid mt="xs">
                    {currCharacter.skills.map((s, index) => (
                      <Grid.Col span={{ base: 12, md: 4, lg: 3 }} key={s.name}>
                        <Paper
                          onClick={() => {
                            handleDiceRoll(s.bonus), setAnimateSkill(index)
                          }}
                          p="xs"
                          withBorder
                          bd={animateSkill === index ? "1px solid var(--mantine-primary-color-filled)" : undefined}
                          className="paper-hover"
                        >
                          <Group>
                            <IconCircle />
                            <Text size="sm">{s.name + ": " + (s.bonus === 0 || s.bonus < 0 ? s.bonus : "+" + s.bonus)}</Text>
                          </Group>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card>
              </>
            )}
          </Stack>
        </Group>
      </Container>
    )
  }
}
export default CharacterSheet
