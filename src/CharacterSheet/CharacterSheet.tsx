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
  Title,
  Tooltip,
} from "@mantine/core"
import { IconCircle, IconCircleFilled, IconEdit, IconFile, IconMinus, IconNotebook, IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks"
import { useCharacterStore } from "../CharacterStore"
import "./CharacterSheet.css"
import { RollDice } from "./RollDice"

function CharacterSheet() {
  const [physicalStress, setPhysicalStress] = useState<boolean[]>([])
  const [animate, setAnimate] = useState(false)
  const [isNotesView, setIsNotesView] = useState<boolean>(false)
  const [diceRolls, setDiceRolls] = useState<number[]>([1, 0, -1, 0])
  const { currCharacter } = useCharacterStore()

  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)

  if (currCharacter) {
    const basicValues = [
      { text: "Fate Points", val: currCharacter.fatePoints },
      { text: "Physical Stress", val: currCharacter.physicalStress, maxVal: currCharacter.maxPhysicalStress },
      { text: "Mental Stress", val: currCharacter.mentalStress, maxVal: currCharacter.maxMentalStress },
    ]

    const consequences = [
      { text: "Mild", val: currCharacter.consequences.mild, stress: 2 },
      { text: "Moderate", val: currCharacter.consequences.moderate, stress: 4 },
      { text: "Severe", val: currCharacter.consequences.severe, stress: 6 },
      { text: "Mild", val: currCharacter.consequences.secondMild, stress: 2 },
    ]

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
      offset: 60,
      duration: 750,
    })

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

    function handleDiceRoll() {
      setDiceRolls(RollDice())
      setAnimate(true)
      setTimeout(() => {
        setAnimate(false)
      }, 250)
    }

    return (
      <Container size="lg" mt={80} mb={isMobile ? 25 : 0}>
        <Group gap="lg">
          <Stack w="100%" gap="xs">
            <Card withBorder shadow="sm" radius="md">
              <Group pb="sm" style={{ position: "relative", width: "100%" }}>
                <Title
                  className="title-hover"
                  style={isMobile ? { width: "100%", textAlign: "start", marginLeft: "auto" } : { width: "100%", textAlign: "center" }}
                  size="h2"
                  fw={900}
                  c="var(--mantine-color-anchor)"
                >
                  {currCharacter.name}
                </Title>
                <Group style={{ position: "absolute", right: 0 }} gap={0}>
                  <Tooltip label={isNotesView ? "Go sheet" : "Go notes"}>
                    <Button px="xs" size="xs" variant="transparent" onClick={handleNotesView}>
                      {isNotesView ? <IconFile /> : <IconNotebook />}
                    </Button>
                  </Tooltip>
                  <Tooltip label="Edit">
                    <Button px="xs" size="xs" variant="transparent">
                      <IconEdit />
                    </Button>
                  </Tooltip>
                </Group>
              </Group>
              <Card.Section withBorder inheritPadding py="sm">
                <Grid columns={36} style={{ textAlign: "center" }} align="center" grow>
                  {basicValues.map((b, index) =>
                    b.maxVal ? (
                      <Grid.Col key={b.text} span={{ base: 36, md: 12, lg: 12 }}>
                        <Text>{b.text}</Text>
                        <Paper py="xs" px="md" withBorder>
                          <Group justify="center">
                            {Array.from(Array(b.maxVal)).map((_, index) => (
                              <Checkbox
                                size={b.maxVal > 7 ? (b.maxVal > 10 ? "xs" : "sm") : "md"}
                                radius="xl"
                                key={index}
                                icon={IconCircleFilled}
                                onChange={() => setPhysicalStress((v) => v.map((val, i) => (i === index ? !val : val)))}
                              />
                            ))}
                          </Group>
                        </Paper>
                      </Grid.Col>
                    ) : (
                      <Grid.Col
                        pt={isMobile ? (index === 0 || index === 1 ? "xs" : 2) : "xs"}
                        pb={isMobile ? (index === 2 ? "xs" : 2) : "xs"}
                        span={{ base: 36, md: 1, lg: 1 }}
                        key={b.text}
                      >
                        <Text>{b.text}</Text>
                        <Paper pl="sm" withBorder>
                          <NumberInput
                            styles={{
                              input: { textAlign: "center" },
                            }}
                            value={b.val}
                            allowNegative={false}
                            allowDecimal={false}
                            variant="unstyled"
                            size="md"
                          />
                        </Paper>
                      </Grid.Col>
                    ),
                  )}
                </Grid>
              </Card.Section>
            </Card>
            {isNotesView ? (
              <>
                <Card withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>Your Stunts</Text>
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
                <Card h={350} ref={targetRef} withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>Notes</Text>
                  </CardSection>
                </Card>
              </>
            ) : (
              <>
                <Card withBorder shadow="sm" radius="md">
                  <Grid grow style={{ textAlign: "center" }} align="end">
                    {consequences.map((c, index) => (
                      <Grid.Col span={{ base: 12, md: 2, lg: 2 }} key={c.text + index}>
                        <Text>{c.text}</Text>
                        <Paper px="xs" withBorder>
                          <Group w="100%" gap="xs">
                            <Checkbox w="10%" size="md" radius="xl" icon={IconCircleFilled} />
                            <TextInput w="70%" variant="unstyled" />
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
                <Card style={isMobile ? { textAlign: "center" } : undefined} withBorder shadow="sm" radius="md">
                  {isMobile ? (
                    <Group w="100%" justify="center">
                      <Group className="paper-hover" onClick={handleDiceRoll}>
                        {diceRolls.map((d, index) => (
                          <Paper key={index} withBorder h={50} w={50} p="sm">
                            <span className={animate ? "dice-icon" : ""}>{d === 1 ? <IconPlus /> : d === -1 ? <IconMinus /> : null}</span>
                          </Paper>
                        ))}
                      </Group>
                      <Text w={isMobile ? "100%" : undefined} style={{ justifySelf: "end" }} size="lg" fw={700}>
                        Total: {(diceRolls.reduce((acc, val) => acc + val, 0) > 0 ? "+" : "") + diceRolls.reduce((acc, val) => acc + val, 0)}
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
                          onClick={handleDiceRoll}
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
                          Total: {(diceRolls.reduce((acc, val) => acc + val, 0) > 0 ? "+" : "") + diceRolls.reduce((acc, val) => acc + val, 0)}
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Card>

                <Card withBorder shadow="sm" radius="md">
                  <CardSection withBorder inheritPadding py="xs">
                    <Text>Skills</Text>
                  </CardSection>
                  <Grid mt="xs">
                    {currCharacter.skills.map((s) => (
                      <Grid.Col span={{ base: 12, md: 4, lg: 3 }} key={s.name}>
                        <Paper p="xs" withBorder className="paper-hover">
                          <Group>
                            <IconCircle />
                            <Text size="sm">{s.name + ": " + (s.bonus === 0 ? 0 : "+" + s.bonus)}</Text>
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
