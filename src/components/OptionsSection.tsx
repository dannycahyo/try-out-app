import { Box, Button, Center, Text } from "@chakra-ui/react";
import type { MachineEvents, UserAnswer } from "../machine/tryOutMachine";

type OptionsSectionProps = {
  selectedQuestion: number;
  options: string[];
  question: string;
  userAnswers: UserAnswer[];
  isDoingTestState: boolean;
  send: (event: MachineEvents) => void;
};

const OptionsSection = ({
  selectedQuestion,
  options,
  question,
  userAnswers,
  isDoingTestState,
  send,
}: OptionsSectionProps) => {
  const isAnsweredProps = {
    transform: "scale(0.98)",
    borderColor: "#bec3c9",
    border: "10px",
    bgGradient: "linear(to-r, red.500, yellow.500)",
  };

  return (
    <Box py="2">
      <Center>
        <Box
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          minW="lg"
          p="4"
          display="flex"
          flexDir="column"
        >
          {options.map((option) => (
            <Button
              key={option}
              mt="4"
              py="10"
              {...(option === userAnswers[selectedQuestion]?.answer &&
                isAnsweredProps)}
              disabled={isDoingTestState}
              onClick={() => {
                send({ type: "CHOOSE_ANSWER", answer: option, question });
              }}
            >
              <Text
                bgGradient="linear(to-l, #1A365D, #065666)"
                bgClip="text"
                fontSize="2xl"
                fontWeight="extrabold"
                textAlign="center"
              >
                {option}
              </Text>
            </Button>
          ))}
        </Box>
      </Center>
    </Box>
  );
};

export default OptionsSection;
