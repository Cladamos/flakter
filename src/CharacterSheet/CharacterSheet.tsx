import { Button, Card, CardSection, Checkbox, Container, em, Grid, Group, Paper, Stack, Text, TextInput, Title, Tooltip } from "@mantine/core"
import { IconCircle, IconCircleFilled, IconEdit, IconFile, IconNotebook } from "@tabler/icons-react"
import { useState } from "react"
import { useMediaQuery, useScrollIntoView } from "@mantine/hooks"
import { useCharacterStore } from "../CharacterStore"
import "./CharacterSheet.css"

function CharacterSheet() {
  const [physicalStress, setPhysicalStress] = useState<boolean[]>([false, false, false, false, false, false])
  const [isNotesView, setIsNotesView] = useState<boolean>(false)
  const { currCharacter } = useCharacterStore()

  const isMobile = useMediaQuery(`(max-width: ${em(1200)})`)

  if (currCharacter) {
    const basicValues = [
      { text: "Fate Points", val: currCharacter.fatePoints },
      { text: "Physical Stress", val: currCharacter.physicalStress, maxVal: currCharacter.maxPhysicalStress },
      { text: "Mental Stress", val: currCharacter.mentalStress, maxVal: currCharacter.maxMentalStress },
    ]

    const consequences = [
      { text: "Mild", val: currCharacter.consequences.mild },
      { text: "Moderate", val: currCharacter.consequences.moderate },
      { text: "Severe", val: currCharacter.consequences.severe },
      { text: "Mild", val: currCharacter.consequences.secondMild },
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
                <Grid style={{ textAlign: "center" }} grow>
                  {basicValues.map((b, index) =>
                    b.maxVal ? (
                      <Grid.Col key={b.text} span={{ base: 12, md: 4, lg: 2 }}>
                        <Text>{b.text}</Text>
                        <Paper py="xs" px="md" withBorder>
                          <Group justify="center">
                            {Array.from(Array(6)).map((_, index) =>
                              index + 1 > b.maxVal ? (
                                <Tooltip key={index} label="Your character don't have that much stress box">
                                  <Checkbox size="md" radius="xl" icon={IconCircleFilled} disabled />
                                </Tooltip>
                              ) : (
                                <Checkbox
                                  size="md"
                                  radius="xl"
                                  key={index}
                                  icon={IconCircleFilled}
                                  onChange={() => setPhysicalStress((v) => v.map((val, i) => (i === index ? !val : val)))}
                                />
                              ),
                            )}
                          </Group>
                        </Paper>
                      </Grid.Col>
                    ) : (
                      <Grid.Col
                        pt={isMobile ? (index === 0 || index === 1 ? "xs" : 2) : "xs"}
                        pb={isMobile ? (index === 2 ? "xs" : 2) : "xs"}
                        span={{ base: 12, md: 4, lg: 2 }}
                        key={b.text}
                      >
                        <Text>{b.text}</Text>
                        <Paper withBorder py="xs">
                          <Text size="sm" truncate="end">
                            {b.text}
                          </Text>
                        </Paper>
                      </Grid.Col>
                    ),
                  )}
                </Grid>
              </Card.Section>
            </Card>
            {isNotesView ? (
              <Card h={600} ref={targetRef} withBorder shadow="sm" radius="md">
                <CardSection withBorder inheritPadding py="xs">
                  <Text>Notes</Text>
                </CardSection>
              </Card>
            ) : (
              <>
                <Card withBorder shadow="sm" radius="md">
                  <Grid grow style={{ textAlign: "center" }} align="end">
                    {consequences.map((c, index) => (
                      <Grid.Col span={{ base: 6, md: 6, lg: 2 }} key={c.text + index}>
                        <Text>{c.text}</Text>
                        <Paper py="4" px={isMobile ? "xs" : "md"} withBorder>
                          <Group w="100%">
                            <Checkbox w="10%" size="md" radius="xl" icon={IconCircleFilled} />
                            <TextInput w="70%" variant="unstyled" />
                          </Group>
                        </Paper>
                      </Grid.Col>
                    ))}
                  </Grid>
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
