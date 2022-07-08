import React from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";

const OptionsSection = ({ options }: { options: string[] }) => {
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
          {options.map((answer) => (
            <Button
              key={answer}
              mt="4"
              py="10"
              _focus={{
                transform: "scale(0.98)",
                borderColor: "#bec3c9",
                border: "10px",
                bgGradient: "linear(to-r, red.500, yellow.500)",
              }}
            >
              <Text
                bgGradient="linear(to-l, #1A365D, #065666)"
                bgClip="text"
                fontSize="2xl"
                fontWeight="extrabold"
                textAlign="center"
              >
                {answer}
              </Text>
            </Button>
          ))}
        </Box>
      </Center>
    </Box>
  );
};

export default OptionsSection;
