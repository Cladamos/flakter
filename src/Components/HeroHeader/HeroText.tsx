import { Title, Text, Button, Container, em, Tooltip } from "@mantine/core"
import { Dots } from "./Dots"
import classes from "./HeroText.module.css"
import { useMediaQuery } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import CreateCharacterSelectorModal from "../Modals/CreateCharacterSelectorModal"

export function HeroText() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
  return (
    <>
      <Container className={classes.wrapper} size={1400} mt={isMobile ? 150 : 300}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
          <Title className={classes.title}>
            Create your character with{" "}
            <Text component="span" className={classes.highlight} inherit>
              Flakter
            </Text>
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" c="dimmed" className={classes.description}>
              Create your character and experience all great tools of Flakter
            </Text>
          </Container>

          <div className={classes.controls}>
            {/* {characterCtx.characters.length === 0 ? (
              <Tooltip label="You don't have any characters">
                <Button className={classes.control} size="lg" disabled>
                  Select Character
                </Button>
              </Tooltip>
            ) : (
              <Button className={classes.control} size="lg" onClick={open} variant="outline">
                Select Character
              </Button>
            )} */}
            <Tooltip label="You don't have any characters">
              <Button className={classes.control} size="lg" disabled>
                Select Character
              </Button>
            </Tooltip>
            <Button
              onClick={() =>
                modals.open({
                  title: "Which way do you want to create a character?",
                  size: "md",
                  padding: "xl",
                  radius: "md",
                  centered: true,
                  children: <CreateCharacterSelectorModal />,
                })
              }
              className={classes.control}
              size="lg"
            >
              Create Character
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}
