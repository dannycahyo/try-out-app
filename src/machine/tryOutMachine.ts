import { createMachine, assign } from "xstate";
import { QueryClient } from "react-query";

import { Context, MachineEvents, MachineService, MachineStates } from "./type";
import { getQuestions } from "../fetcher/getQuestions";
import { setTimer } from "./utils";

const queryClient = new QueryClient();

export const tryOutMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUBOBPA8gVwC4AIBBAB2IDoBLCAGzAGIAxAUWQGEAJASQDkBxAbQAMAXUShiAe1gVcFCQDsxIAB6IAzIIAsZAIwAOAOyaAnIL2G9AVisAaEOkR6ATDrIH9B4wDYdvgwa81AF8guzQsPCJSMmoJAEMICnkoOggFMEp5ADcJAGsM8JwCEnJYhKSoBCScgGM42QUhYSalSWkGxSQVRC9zN29zcxcdL0s7BwQvAz0yLy9NMz1jHScnLS8QsIwiqNL4xOS6MFRUCVQyYmp6gDMzgFsyQsiSmP2KquyJOo6mlq62mRyTqgVSTYwzTy9QbDUbjRyrXQ6AxONSmJxeZYrTYgJ7FaIAR2wcA6TBOZzoACUmMw2OwAPoARQAqkwAMrITiYbisv7iKSAhRKUEYiEDaG+WH2RD+Vw+ZFqSyaKxOEyWbG43ZkQnEoGwTAAaTo7MIFOQdOQbOQvJAAI6QsQllMukExksaj83ic7jhCC9rmMTmM7kElh0ljMAbVoRx22e0TSFWQxKNTCYdKprKZABkrSJWvy7V1QY7BM7Xe6kZ7vVKEJYvWRLF4nJZHTpBPolQZ1bG8eQE8kk7BcGR5Pc4tQ6BzWPrrbagfaEG2DLMVd5G4IAgYN8YfV4zGR0Y3NGpNFMK5puxFe2R+1BB8PR6g7uO6BxMJhWWnmZbOdxZwX5yLaUnB9UMnDId1m1PPRNGPHRT0vHYXlve8RzHCc3w-NNCG5AB1JgKX-dpAJBaVlyDUZYOMai9Hg3ofTUJYyFMJtrGPSx-CgxC4z7CRE2JNCnxfbgmAADTNb92V-IiBWBboEBgiCWMWIxAjUAwfUDNRmLdHQ1DmaiAhMLtow1ZC+IHATH2fCcAAUqQANUZFkpK5GTC1IhTLDLE81BVMDBB8H0dHBMhBHC9sTECAwOM0JxuOvFCrPQuh3JI+SvWMMLjHUxjXXMY8dxrYNmN6TwQxRd1BHi0ye01VA4GwahcEpNkWDSwUgMXVZS0g0ZPBi8xjE0UCtDIPQFQGHwTxWGqtiverGuasgwCycdsHqIFUrzf4AM6zzTG0gM1l8vS60C0C1gglZQy3HLO2MBLFtgJrh1W9bNoUVKdFEXbiP2+TDuYnrToVNYvFA6Zxpu8GFXgoMQmjUcIDgJQzNIfN-rk0EAFoVR9PHtAi4mScip6XioWhMdkhc4p9Aa3A8HKrE8ZYNlqhaXjKA4oGpjz5Ng1xUUChY1AVJtDHpoNGcMZmOOokZyYJIkhyBUlTlQPn0tBSMDxPOKfD0eZBD8n0JpmdF1gWJtOyV8htVVhQ9X1LWAdBPSrDcWiFnOlwlTUUCNAbVixfBcx1MejmkPjCy72JV3scQfGa0CBsIpCxsNFWQwo3m6PeP4odBJshOFxWbTjyMAwxZ9k8W3pl0DyZk2Rj86i7ZvWPUIkLJjlkO4wFLrrjy8WZGycZxFVPAM5gbrKXFllvAkDSO854sgGpe5qh885FR-cJY2yg6uTB9OCwtY1YR9Vdm1+vTfXpWtbqA2-m5zdsjtAP5ZqsVE+iomHWbQQZlgwXgnXLEUd14P2WsQOIsBYCQB3vJNsE006RRotRaqIEayhhmOPRUIVqJ4NzjGTm0QYHDmuHECgtAIDIPdmYbS4YMHgiwasSGy5Aqrl0qGawUYQhAA */
  createMachine<Context, MachineEvents, MachineStates, MachineService>({
    schema: {
      context: {} as Context,
      events: {} as MachineEvents,
      services: {} as MachineService,
    },
    id: "TryOut App",
    initial: "idle",
    context: {
      questions: [],
      userAnswers: [],
      selectedQuestion: 0,
      correctAnswer: 0,
      elapsed: 0,
      interval: 0.1,
      duration: 0,
    },
    states: {
      idle: {
        invoke: {
          src: "initMachineTransition",
        },
        on: {
          FETCHING: "loading",
        },
      },
      loading: {
        invoke: {
          src: "getQuestionsData",
          onDone: {
            target: "questionsOK",
            actions: assign({
              questions: (_, event) => event.data,
              userAnswers: (_, event) => new Array(event.data.length).fill({}),
            }),
          },
          onError: {
            target: "questionError",
            actions: assign({
              questionsErrorMessage: (_, event) => event.data,
            }),
          },
        },
      },
      questionError: {
        on: {
          REFETCH_QUESTIONS: "loading",
        },
      },
      questionsOK: {
        tags: ["questionsOK"],
        id: "questionsOK",
        on: {
          START_TEST: {
            actions: "setDuration",
            target: "doingTest",
          },
        },
      },
      doingTest: {
        invoke: {
          src: setTimer,
        },
        initial: "normal",
        states: {
          normal: {
            always: {
              target: "overtime",
              cond: "timerExpired",
            },
            on: {
              TICK: {
                actions: "startTimer",
              },
              CHOOSE_QUESTION: {
                actions: "chooseQuestion",
              },
              CHOOSE_ANSWER: {
                actions: ["chooseAnswer", "evaluateTheTest"],
              },
              NEXT_QUESTION: {
                actions: "nextQuestion",
              },
              PREV_QUESTION: {
                actions: "prevQuestion",
              },
            },
          },
          overtime: {},
        },
        on: {
          SEE_RESULT: {
            target: "#result",
          },
        },
      },
      result: {
        id: "result",
        initial: "evaluation",
        states: {
          evaluation: {
            always: [
              {
                cond: "passTheKKM",
                target: "passed",
              },
              {
                target: "failed",
              },
            ],
          },
          passed: {},
          failed: {},
        },
        on: {
          RESTART_TEST: {
            actions: "restartTheTest",
            target: "questionsOK",
          },
        },
      },
    },
  }).withConfig({
    services: {
      initMachineTransition: () => (send) => {
        send({ type: "FETCHING" });
      },
      getQuestionsData: () => queryClient.fetchQuery("questions", getQuestions),
    },
    actions: {
      startTimer: assign({
        elapsed: (ctx) => ctx.elapsed + ctx.interval,
      }),
      setDuration: assign({
        duration: (ctx, _) => ctx.questions.length * 6,
      }),
      nextQuestion: assign({
        selectedQuestion: (ctx) => ctx.selectedQuestion + 1,
      }),
      prevQuestion: assign({
        selectedQuestion: (ctx) => ctx.selectedQuestion - 1,
      }),
      chooseQuestion: assign({
        selectedQuestion: (ctx, event) =>
          event.type === "CHOOSE_QUESTION"
            ? event.questionNumber
            : ctx.selectedQuestion,
      }),
      chooseAnswer: assign({
        userAnswers: (ctx, event) => {
          if (event.type === "CHOOSE_ANSWER") {
            const newAnswers = [...ctx.userAnswers];
            newAnswers[ctx.selectedQuestion] = {
              question: event.question,
              answer: event.answer,
            };
            return newAnswers;
          } else {
            return ctx.userAnswers;
          }
        },
      }),
      evaluateTheTest: assign({
        correctAnswer: (ctx) => {
          let correct = 0;
          ctx.questions.forEach((question, index) => {
            if (ctx.userAnswers[index].answer === question.rightOption) {
              correct++;
            }
          });
          return correct;
        },
      }),
      restartTheTest: assign({
        selectedQuestion: (_) => 0,
        correctAnswer: (_) => 0,
        elapsed: (_) => 0,
        interval: (_) => 0.1,
        duration: (_) => 0,
        userAnswers: (ctx) => new Array(ctx.questions.length).fill({}),
      }),
    },
    guards: {
      passTheKKM: (ctx) => ctx.correctAnswer >= ctx.questions.length - 3,
      timerExpired: (ctx) => ctx.elapsed >= ctx.duration,
    },
  });
