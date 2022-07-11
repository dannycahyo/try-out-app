import React from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";

const OptionsSection = ({
  options,
  send,
  state,
}: {
  options: string[];
  state: any;
  send: any;
}) => {
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
          {options.map((option, index) => (
            <Button
              key={option}
              mt="4"
              py="10"
              _focusWithin={{
                transform: "scale(0.98)",
                borderColor: "#bec3c9",
                border: "10px",
                bgGradient: "linear(to-r, red.500, yellow.500)",
              }}
              disabled={!state.matches("doingTest")}
              onClick={() => {
                send({ type: "CHOOSEOPTION", index });
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
