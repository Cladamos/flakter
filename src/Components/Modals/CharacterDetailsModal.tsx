import { Paper, Stack, Text, Title } from "@mantine/core"
import { useCharacterStore } from "../../Stores/CharacterStore"
import "../CharacterSheet/CharacterSheet.css"
import { modals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

type CharacterDetailsModalProps = {
  isMobile: boolean | undefined
}

function CharacterDetailsModal(props: CharacterDetailsModalProps) {
  const { currCharacter } = useCharacterStore()
  const { t } = useTranslation()

  if (currCharacter) {
    const data: { val: string; message: string }[] = [
      { val: currCharacter.aspects.highConcept, message: t("character-details.high-concept") },
      { val: currCharacter.aspects.trouble, message: t("character-details.trouble") },
      { val: currCharacter.aspects.relationship, message: t("character-details.relationship") },
      { val: currCharacter.aspects.otherAspect, message: t("character-details.other-aspects") },
      { val: currCharacter.aspects.secondOtherAspect, message: t("character-details.other-aspects") },
    ]
    return (
      <Text
        className="title-hover"
        style={
          props.isMobile
            ? { width: "70%", textAlign: "start", marginRight: "auto" }
            : { width: "80%", textAlign: "center", marginRight: "auto", marginLeft: "auto" }
        }
        size="25px"
        truncate="end"
        fw={900}
        c="var(--mantine-color-anchor)"
        onClick={() => {
          modals.open({
            title: t("character-details.details"),
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
      </Text>
    )
  }
}
export default CharacterDetailsModal
