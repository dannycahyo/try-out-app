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
  Progress,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import QuestionSection from "./components/QuestionSection";
import OptionsSection from "./components/OptionsSection";
import { tryOutMachine } from "./machine/tryOutMachine";
import { useMachine } from "@xstate/react";
import { getQuestions } from "./api/getQuestions";
import { useQuery } from "react-query";

function App() {
  const { data, status } = useQuery("questions", getQuestions);
  const [state, send, service] = useMachine(tryOutMachine);
  const {
    selectedOption,
    questions,
    selectedQuestion,
    elapsed,
    duration,
    correctAnswer,
  } = state.context;

  const isPassedTheTest = state.matches("passed");
  const isFailedTheTest = state.matches("failed");

  // Init machine transititions
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

  // Debugguing Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
  }, [service]);

  const [question, options, rightOption, finalAnswer]: [
    string,
    string[],
    string,
    string
  ] = [
    questions[selectedQuestion]?.title,
    questions[selectedQuestion]?.options,
    questions[selectedQuestion]?.rightOption,
    questions[selectedQuestion]?.options[selectedOption],
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalTitle = isPassedTheTest
    ? "Congratulations"
    : isFailedTheTest
    ? "Upsss, Sorry. You Failed!"
    : "";

  const modalBody = isPassedTheTest
    ? "You've already pass the test"
    : isFailedTheTest
    ? "That's totally okay, Let's try again!"
    : "";

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
              {state.matches("questionsOK") && (
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
              )}

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
              {selectedQuestion === questions.length - 1 && (
                <Center>
                  <Box
                    as="button"
                    width="xs"
                    p={4}
                    mt="6"
                    color="white"
                    fontWeight="bold"
                    borderRadius="md"
                    bgGradient="linear(to-r, blue.500, cyan.500)"
                    _hover={{
                      bgGradient: "linear(to-r, red.500, yellow.500)",
                    }}
                    onClick={() => {
                      send({ type: "SUBMITANSWER" });
                      onOpen();
                    }}
                  >
                    <Heading size="md">Submit</Heading>
                  </Box>
                </Center>
              )}

              <Center mt="4">
                <Flex>
                  <Center>
                    <Box
                      as="button"
                      width="36"
                      mr={"8"}
                      p={4}
                      mt="6"
                      disabled={selectedQuestion === 0}
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
                      disabled={selectedQuestion === questions.length - 1}
                      color="white"
                      fontWeight="bold"
                      borderRadius="md"
                      bgGradient="linear(to-r, blue.500, cyan.500)"
                      _hover={{
                        bgGradient: "linear(to-r, red.500, yellow.500)",
                      }}
                      onClick={() =>
                        send({ type: "NEXTQUESTION", rightOption, finalAnswer })
                      }
                    >
                      <Heading size="md">Next</Heading>
                    </Box>
                  </Center>
                </Flex>
              </Center>
            </Box>
          )}

          {state.matches("doingTest") && (
            <Center>
              <Box
                mt="8"
                borderWidth="2px"
                borderRadius="lg"
                overflow="hidden"
                p="4"
                width="60"
              >
                <Text
                  color="red.400"
                  fontSize="2xl"
                  fontWeight="extrabold"
                  textAlign="center"
                  mb="4"
                >
                  Progress
                </Text>
                <Progress value={selectedOption * 10} />
              </Box>
            </Center>
          )}
        </GridItem>

        <GridItem colSpan={3}>
          <QuestionSection question={question} />
          <OptionsSection
            options={options}
            state={state}
            send={send}
            rightOption={rightOption}
          />
        </GridItem>
      </Grid>

      <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
        {isPassedTheTest} && (
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        ){isFailedTheTest} && (
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        )
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalBody>
            <Text>{modalBody}</Text>
            <Text
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="4xl"
              fontWeight="extrabold"
              textAlign="center"
              my="4"
            >
              Summary
            </Text>
            <StatGroup>
              <Stat>
                <StatLabel>Score</StatLabel>

                <StatNumber>{correctAnswer * 10}</StatNumber>
                <StatHelpText>
                  {isPassedTheTest ? (
                    <StatArrow type="increase" />
                  ) : isFailedTheTest ? (
                    <StatArrow type="decrease" />
                  ) : null}
                  KKM 70
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Time</StatLabel>
                <StatNumber>{Math.floor(elapsed)}</StatNumber>
                <StatHelpText>
                  {isPassedTheTest ? (
                    <StatArrow type="increase" />
                  ) : isFailedTheTest ? (
                    <StatArrow type="decrease" />
                  ) : null}
                  Duration {duration}
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Correct Answer</StatLabel>
                <StatNumber>{correctAnswer}</StatNumber>
                <StatHelpText>
                  {isPassedTheTest ? (
                    <StatArrow type="increase" />
                  ) : isFailedTheTest ? (
                    <StatArrow type="decrease" />
                  ) : null}
                  Minimum 7 Correct
                </StatHelpText>
              </Stat>
            </StatGroup>
          </ModalBody>
          <ModalFooter>
            {isPassedTheTest && (
              <Button
                onClick={() => {
                  send({ type: "RESET" });
                  onClose();
                }}
              >
                Close
              </Button>
            )}
            {isFailedTheTest && (
              <Button
                onClick={() => {
                  send({ type: "RESET" });
                  onClose();
                }}
              >
                RETEST
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isCentered
        isOpen={state.matches("doingTest.overtime")}
        onClose={onClose}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Times Up!!!</ModalHeader>
          <ModalBody>
            <Text>You've already passed the duration of this test</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                send({ type: "SEERESULT" });
                onOpen();
              }}
            >
              See Result
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default App;
