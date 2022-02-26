import React from "react";
import { Box, Button, Center, Heading } from "@chakra-ui/react";

const AnswerSection = () => {
  const answers = ["Lalala", "Lilili", "Lululu", "Lololo", "Lelele"];
  return (
    <Box py="4">
      <Center>
        <Box
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          minW="2xl"
          p="4"
          display="flex"
          flexDir="column"
        >
          {answers.map((answer) => (
            <Button mt="4" py="10">
              <Heading>{answer}</Heading>
            </Button>
          ))}
        </Box>
      </Center>
    </Box>
  );
};

export default AnswerSection;
