import React from "react";
import Layout from "./containers/Layout";
import {
  Box,
  Text,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import QuestionSection from "./components/QuestionSection";
import OptionsSection from "./components/OptionsSection";
import TimerSection from "./components/TimerSection";
import StatisticSection from "./components/StatisticSection";
import { tryOutMachine } from "./machine/tryOutMachine";
import { useMachine } from "@xstate/react";

function App() {
  const [state, send, service] = useMachine(tryOutMachine);
  const {
    questions,
    selectedQuestion,
    elapsed,
    duration,
    correctAnswer,
    userAnswers,
  } = state.context;
  const isPassedTheTest = state.matches("passed");
  const isFailedTheTest = state.matches("failed");

  // Debugguing Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
  }, [service]);

  const [question, options]: [string, string[]] = [
    questions[selectedQuestion]?.title,
    questions[selectedQuestion]?.options,
  ];

  // TODO: Change this state into machine state
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

  const isAnsweredProps = {
    transform: "scale(0.98)",
    borderColor: "#bec3c9",
    border: "10px",
    bgGradient: "linear(to-r, red.500, yellow.500)",
    color: "white",
  };

  return (
    <Layout>
      <SimpleGrid
        columns={2}
        spacingX="20px"
        spacingY="20px"
        px={["6", "8", "10", "12", "32"]}
      >
        <Box py="12">
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
                      onClick={() => send({ type: "START_TEST" })}
                    >
                      Start
                    </Box>
                  </Center>
                </Box>
              )}

              <TimerSection elapsed={elapsed} />
            </Flex>
          </Center>

          {state.matches("doingTest") && (
            <>
              <Center>
                <Box
                  borderWidth="2px"
                  borderRadius="lg"
                  overflow="hidden"
                  p="4"
                  w="340px"
                  mt="8"
                >
                  <Stack direction="column">
                    <Wrap spacing={4}>
                      {questions.map((question, index) => (
                        <WrapItem key={question.title}>
                          <Button
                            color="red.400"
                            variant="outline"
                            _hover={{
                              bgGradient: "linear(to-r, blue.500, cyan.500)",
                            }}
                            {...(question.title ===
                              userAnswers[index]?.question && isAnsweredProps)}
                            onClick={() =>
                              send({
                                type: "CHOOSE_QUESTION",
                                questionNumber: index,
                              })
                            }
                          >
                            {index + 1}
                          </Button>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Stack>
                </Box>
              </Center>
              <Box>
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
                        onClick={() => send({ type: "PREV_QUESTION" })}
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
                        disabled={selectedQuestion === questions.length}
                        color="white"
                        fontWeight="bold"
                        borderRadius="md"
                        bgGradient="linear(to-r, blue.500, cyan.500)"
                        _hover={{
                          bgGradient: "linear(to-r, red.500, yellow.500)",
                        }}
                        onClick={() =>
                          send({
                            type: "NEXT_QUESTION",
                          })
                        }
                      >
                        <Heading size="md">Next</Heading>
                      </Box>
                    </Center>
                  </Flex>
                </Center>
              </Box>

              <Center>
                <Box
                  as="button"
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
                    send({ type: "PROCEED_TO_SUBMIT" });
                  }}
                >
                  <Heading size="md">Submit</Heading>
                </Box>
              </Center>
            </>
          )}
        </Box>

        <Box py="12">
          {/* TODO: Change this condition */}
          {selectedQuestion === questions.length ? (
            <Center>
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                width="xl"
                borderRadius="4"
                minH="xs"
                marginLeft="4"
              >
                <AlertIcon mt="4" boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Have you already answered all of the questions?
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  Please kindly check again all of your answer
                </AlertDescription>

                <Box
                  as="button"
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
                    send({ type: "SUBMIT_ANSWER" });
                    onOpen();
                  }}
                >
                  <Heading size="md">Submit</Heading>
                </Box>
              </Alert>
            </Center>
          ) : (
            <>
              <QuestionSection question={question} />
              <OptionsSection
                selectedQuestion={selectedQuestion}
                userAnswers={userAnswers}
                options={options}
                question={question}
                isDoingTestState={!state.matches("doingTest")}
                send={send}
              />
            </>
          )}
        </Box>
      </SimpleGrid>

      <Modal
        isCentered
        isOpen={isOpen || isFailedTheTest || isPassedTheTest}
        onClose={onClose}
        size="xl"
      >
        {isPassedTheTest} &&
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        {isFailedTheTest} &&
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
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
            <StatisticSection
              isFailedTheTest={isFailedTheTest}
              isPassedTheTest={isPassedTheTest}
              correctAnswer={correctAnswer}
              duration={duration}
              elapsed={elapsed}
            />
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
        isOpen={state.matches({ doingTest: "overtime" })}
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
                send({ type: "SEE_RESULT" });
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
