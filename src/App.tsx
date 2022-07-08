import React from "react";
import Layout from "./containers/Layout";
import {
  Box,
  Text,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import QuestionSection from "./components/QuestionSection";
import OptionsSection from "./components/OptionsSection";
import { tryOutMachine } from "./machine/tryOutMachine";
import { useMachine } from "@xstate/react";
import { getQuestions } from "./api/getQuestions";
import { useQuery } from "react-query";

function App() {
  const { data, status } = useQuery("questions", getQuestions);
  const [state, send] = useMachine(tryOutMachine);
  const { chosenOption, questions, selectedQuestion, elapsed, duration } =
    state.context;

  React.useEffect(() => {
    send({ type: "FETCHING" });
  }, [send]);

  React.useEffect(() => {
    if (status === "loading") {
      send({ type: "FETCHING" });
    } else if (status === "success") {
      send({ type: "SUCCESS", data });
    } else if (status === "error") {
      send({ type: "ERROR" });
    }
  }, [data, send, status]);

  console.log(state.value);
  console.log("SEE THE DURATION", duration);
  console.log("SEE THE TIMER", elapsed);

  const [question, options]: [string, string[]] = [
    questions[selectedQuestion]?.title,
    questions[selectedQuestion]?.options,
  ];

  return (
    <Layout>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        py="8"
      >
        <GridItem rowSpan={2} colSpan={2} pl="40">
          <Text
            bgGradient="linear(to-l, #90CDF4, #0BC5EA)"
            bgClip="text"
            fontSize="4xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Let's Get Started
          </Text>
          <Center mt="4">
            <Flex>
              <Box
                borderWidth="2px"
                borderRadius="lg"
                overflow="hidden"
                p="4"
                width="40"
                mr="8"
              >
                <Text
                  color="red.400"
                  fontSize="2xl"
                  fontWeight="extrabold"
                  textAlign="center"
                >
                  Ready?
                </Text>
                <Center>
                  <Box
                    as="button"
                    p={4}
                    w="24"
                    mt="6"
                    color="white"
                    fontWeight="bold"
                    borderRadius="md"
                    bgGradient="linear(to-r, blue.500, cyan.500)"
                    _hover={{
                      bgGradient: "linear(to-r, red.500, yellow.500)",
                    }}
                    onClick={() => send({ type: "STARTTEST" })}
                  >
                    Start
                  </Box>
                </Center>
              </Box>

              <Box
                borderWidth="2px"
                borderRadius="lg"
                overflow="hidden"
                p="4"
                width="40"
              >
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
            </Flex>
          </Center>
          {state.matches("doingTest") && (
            <Box>
              {chosenOption === questions.length ? (
                <Center>
                  <Box
                    as="button"
                    width="xs"
                    mr={"8"}
                    p={4}
                    mt="6"
                    color="white"
                    fontWeight="bold"
                    borderRadius="md"
                    bgGradient="linear(to-r, blue.500, cyan.500)"
                    _hover={{
                      bgGradient: "linear(to-r, red.500, yellow.500)",
                    }}
                  >
                    <Heading size="md">Submit</Heading>
                  </Box>
                </Center>
              ) : (
                <Center mt="4">
                  <Flex>
                    <Center>
                      <Box
                        as="button"
                        width="36"
                        mr={"8"}
                        p={4}
                        mt="6"
                        color="white"
                        fontWeight="bold"
                        borderRadius="md"
                        bgGradient="linear(to-r, blue.500, cyan.500)"
                        _hover={{
                          bgGradient: "linear(to-r, red.500, yellow.500)",
                        }}
                        onClick={() => send({ type: "PREVQUESTION" })}
                      >
                        <Heading size="md">Prev</Heading>
                      </Box>
                    </Center>

                    <Center>
                      <Box
                        as="button"
                        width="36"
                        p={4}
                        mt="6"
                        color="white"
                        fontWeight="bold"
                        borderRadius="md"
                        bgGradient="linear(to-r, blue.500, cyan.500)"
                        _hover={{
                          bgGradient: "linear(to-r, red.500, yellow.500)",
                        }}
                        onClick={() => send({ type: "NEXTQUESTION" })}
                      >
                        <Heading size="md">Next</Heading>
                      </Box>
                    </Center>
                  </Flex>
                </Center>
              )}
            </Box>
          )}
        </GridItem>

        <GridItem colSpan={3}>
          <QuestionSection question={question} />
          <OptionsSection options={options} />
        </GridItem>
      </Grid>
    </Layout>
  );
}

export default App;
