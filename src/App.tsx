import React from "react";
import {
  Box,
  Text,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import { match } from "ts-pattern";

import Layout from "./containers/Layout";
import { tryOutMachine } from "./machine/tryOutMachine";

import QuestionSection from "./components/QuestionSection";
import OptionsSection from "./components/OptionsSection";
import TimerSection from "./components/TimerSection";
import StatisticSection from "./components/StatisticSection";
import { LoadingSkeleton } from "./widgets/LoadingSkeleton";
import { ErrorModal } from "./widgets/ErrorModal";

import type { MachineStates } from "./machine/type";

function App() {
  const [state, send, service] = useMachine(tryOutMachine);

  // Debugguing Purposes
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state);
    });

    return subscription.unsubscribe;
  }, [service]);

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
        {match<MachineStates>(state as MachineStates)
          .with({ value: "idle" }, () => <LoadingSkeleton />)
          .with({ value: "loading" }, () => <LoadingSkeleton />)
          .with(
            { value: "questionsError" },
            ({ context: { questionsErrorMessage } }) => (
              <ErrorModal
                errorMessage={questionsErrorMessage}
                onRefetch={() => send({ type: "REFETCH_QUESTIONS" })}
              />
            )
          )
          .with({ value: "questionsOK" }, ({ context: { elapsed } }) => (
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

                  <TimerSection elapsed={elapsed} />
                </Flex>
              </Center>
            </Box>
          ))
          .with({ value: "doingTest" }, () => <LoadingSkeleton />)
          .with(
            { value: { doingTest: "normal" } },
            ({
              context: { questions, userAnswers, selectedQuestion, elapsed },
            }) => (
              <>
                <Box py="12">
                  <Center>
                    <TimerSection elapsed={elapsed} />
                  </Center>
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
                                  bgGradient:
                                    "linear(to-r, blue.500, cyan.500)",
                                }}
                                {...(question.title ===
                                  userAnswers[index]?.question &&
                                  isAnsweredProps)}
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
                        send({ type: "SEE_RESULT" });
                      }}
                    >
                      <Heading size="md">Submit</Heading>
                    </Box>
                  </Center>
                </Box>
                <Box py="12">
                  <QuestionSection
                    question={questions[selectedQuestion].title}
                  />
                  <OptionsSection
                    selectedQuestion={selectedQuestion}
                    userAnswers={userAnswers}
                    options={questions[selectedQuestion].options}
                    question={questions[selectedQuestion].title}
                    isDoingTestState={!state.matches("doingTest")}
                    send={send}
                  />
                </Box>
              </>
            )
          )
          .with({ value: { doingTest: "overtime" } }, () => (
            <Modal isCentered isOpen={true} onClose={() => {}}>
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
                    }}
                  >
                    See Result
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ))
          .with({ value: "result" }, () => <LoadingSkeleton />)
          .with({ value: { result: "evaluation" } }, () => <LoadingSkeleton />)
          .with(
            { value: { result: "passed" } },
            ({ context: { duration, correctAnswer, elapsed } }) => (
              <Modal isCentered isOpen={true} onClose={() => {}} size="xl">
                <ModalOverlay
                  bg="none"
                  backdropFilter="auto"
                  backdropInvert="80%"
                  backdropBlur="2px"
                />
                <ModalContent>
                  <ModalHeader>Congratulations! You nailed it!</ModalHeader>
                  <ModalBody>
                    <Text>You've already pass the test</Text>
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
                      isFailedTheTest={false}
                      isPassedTheTest={true}
                      correctAnswer={correctAnswer}
                      duration={duration}
                      elapsed={elapsed}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onClick={() => {
                        send({ type: "RESTART_TEST" });
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )
          )
          .with(
            { value: { result: "failed" } },
            ({ context: { correctAnswer, duration, elapsed } }) => (
              <Modal isCentered isOpen={true} onClose={() => {}} size="xl">
                <ModalOverlay
                  bg="none"
                  backdropFilter="auto"
                  backdropInvert="80%"
                  backdropBlur="2px"
                />
                <ModalContent>
                  <ModalHeader>Upss Sorry, You Failed!</ModalHeader>
                  <ModalBody>
                    <Text>That's totally okay, Let's try again!</Text>
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
                      isFailedTheTest={false}
                      isPassedTheTest={true}
                      correctAnswer={correctAnswer}
                      duration={duration}
                      elapsed={elapsed}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      onClick={() => {
                        send({ type: "RESTART_TEST" });
                      }}
                    >
                      Retest
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )
          )
          .exhaustive()}
      </SimpleGrid>
    </Layout>
  );
}

export default App;
