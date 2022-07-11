import {
  Box,
  Text,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
const TimerSection = ({ elapsed }: { elapsed: number }) => {
  return (
    <Box borderWidth="2px" borderRadius="lg" overflow="hidden" p="4" width="40">
      <Text
        color="red.400"
        fontSize="2xl"
        fontWeight="extrabold"
        textAlign="center"
      >
        Timer
      </Text>
      <Center>
        <CircularProgress
          value={Math.floor(elapsed)}
          size="100px"
          thickness="6px"
        >
          <CircularProgressLabel color="white">
            {Math.floor(elapsed)}
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
    </Box>
  );
};

export default TimerSection;
