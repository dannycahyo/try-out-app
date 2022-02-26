import React from "react";
import { Box, Center, Heading } from "@chakra-ui/react";

const QuestionSection = () => {
  return (
    <Box py="6">
      <Center>
        <Box
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          minW="2xl"
          p="4"
        >
          <Heading size="lg" textAlign="center">
            Why we can't put If Statement on JSX?
          </Heading>
        </Box>
      </Center>
    </Box>
  );
};

export default QuestionSection;
