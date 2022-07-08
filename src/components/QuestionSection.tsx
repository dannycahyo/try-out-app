import { Box, Center, Text } from "@chakra-ui/react";

const QuestionSection = ({ question }: { question: string }) => {
  return (
    <Center pb="4">
      <Box
        borderWidth="2px"
        borderRadius="lg"
        overflow="hidden"
        minW="lg"
        p="4"
      >
        <Text
          bgGradient="linear(to-l, #FBD38D, #0BC5EA)"
          bgClip="text"
          fontSize="3xl"
          fontWeight="extrabold"
          textAlign="center"
        >
          {question}
        </Text>
      </Box>
    </Center>
  );
};

export default QuestionSection;
