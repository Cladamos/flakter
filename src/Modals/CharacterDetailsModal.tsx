import { Paper, Stack, Text, Title } from "@mantine/core"
import { useCharacterStore } from "../Stores/CharacterStore"
import "../CharacterSheet/CharacterSheet.css"
import { modals } from "@mantine/modals"

type CharacterDetailsModalProps = {
  isMobile: boolean | undefined
}

function CharacterDetailsModal(props: CharacterDetailsModalProps) {
  const { currCharacter } = useCharacterStore()
  if (currCharacter) {
    const data: { val: string; message: string }[] = [
      { val: currCharacter.aspects.highConcept, message: "High Concept: " },
      { val: currCharacter.aspects.trouble, message: "Trouble: " },
      { val: currCharacter.aspects.relationship, message: "Relationship: " },
      { val: currCharacter.aspects.otherAspect, message: "Other Aspect: " },
      { val: currCharacter.aspects.secondOtherAspect, message: "Other Aspect: " },
    ]
    return (
      <Title
        className="title-hover"
        style={props.isMobile ? { width: "100%", textAlign: "start", marginLeft: "auto" } : { width: "100%", textAlign: "center" }}
        size="h2"
        fw={900}
        c="var(--mantine-color-anchor)"
        onClick={() => {
          modals.open({
            title: "Character Details",
            size: "lg",
            padding: "lg",
            radius: "md",
            centered: true,
            children: (
              <Stack>
                {data.map((d) => (
                  <Paper withBorder py="xs" px="xl" key={d.val}>
                    <Text>
                      <Text inherit fw={700}>
                        {d.message}
                      </Text>
                      {d.val}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            ),
          })
        }}
      >
        {currCharacter.name}
      </Title>
    )
  }
}
export default CharacterDetailsModal
