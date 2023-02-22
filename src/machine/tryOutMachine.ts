import { createMachine, assign, Sender } from "xstate";
import { QueryClient } from "react-query";
import { getQuestions } from "../api/getQuestions";

const queryClient = new QueryClient();

type question = {
  title: string;
  rightOption: string;
  options: string[];
};

type UserAnswer = {
  question: string;
  answer: string;
};

type Context = {
  questions: question[];
  userAnswers: UserAnswer[];
  questionsErrorMessage?: string;
  selectedQuestion: number;
  correctAnswer: number;
  elapsed: number;
  interval: number;
  duration: number;
};

type MachineService = {
  getQuestionsData: {
    data: question[];
  };
};

export type MachineStates =
  | {
      value: "idle";
      context: Context;
    }
  | {
      value: "loading";
      context: Context;
    }
  | {
      value: "questionsError";
      context: Context;
    }
  | {
      value: "questionsOK";
      context: Context & {
        questions: question[];
        selectedQuestion: number;
        selectedOption: number;
        correctAnswer: number;
        elapsed: number;
        interval: number;
        duration: number;
      };
    }
  | {
      value: "doingTest";
      context: Context;
    }
  | {
      value: { doingTest: "normal" };
      context: Context;
    }
  | {
      value: { doingTest: "overtime" };
      context: Context;
    }
  | {
      value: "evaluation";
      context: Context;
    }
  | {
      value: "passed";
      context: Context;
    }
  | {
      value: "failed";
      context: Context;
    };

type MachineEvents =
  | { type: "FETCHING" }
  | { type: "FETCHING_SUCCESS"; data: question[] }
  | { type: "FETCHING_ERROR"; error: string }
  | { type: "REFETCH_QUESTIONS" }
  | { type: "START_TEST" }
  | {
      type: "CHOOSE_QUESTION";
      questionNumber: number;
    }
  | {
      type: "CHOOSE_ANSWER";
      question: string;
      answer: string;
    }
  | { type: "PROCEED_TO_SUBMIT" }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "SEE_RESULT" }
  | { type: "TICK" }
  | { type: "SUBMIT_ANSWER" }
  | { type: "RESET" };

const setTimer = (ctx: Context) => (send: Sender<MachineEvents>) => {
  const interval = setInterval(() => {
    send("TICK");
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

export const tryOutMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUBOBPA8gVwC4AIBBAB2IDoBLCAGzAGIAxAUWQGEAJASQDkBxAbQAMAXUShiAe1gVcFCQDsxIAB6IAjGoBMAdjIAOAKwBOAMzaALObV7NJkwBoQ6ROaNqyBgGzbtez5oNXI01NTwBfMMc0LDwiUjJqCQBDCAp5KDoIBTBKeQA3CQBrHOicAhJyRJS0qAQ0goBjJNkFIWE2pUlpFsUkFXUDNXMyc08-YLcjMfM9R2cEEyM9Mk8h41cZzXMDEwiojDK4yuTU9LowVFQJVDJiamaAM2uAWzJS2IqEk5q6-IkmnptDp9LoyOS9UCqBBqQbDUbjTSTaazJyIQKaMiCbw+Ax6KYmPF7EDvcrxACO2DgPSYl2udAASkxmGx2AB9ACKAFUmABlZCcTDcHnA8RSMEKJRQmFDEZjTwTNRTPQzOYuNwebGKkxjNTeNREklHMgUqng2CYADSdD5hHpyFZyF5yBFIFBPUlaM0qoQencBkEAcEJkEuO0ahM5l2kWJBw+8SyNWQVLo-NYFpdbvBHoQOkEKxMmj0glG5gCgm0nk83pCJjIRgrXmCgj0i1CegNsdJ5AT6STsFw1s5ACEALKce2EIUAdSY9IzYvdfShnhMBjIakEpgrrkEIQM2m9LeGnlDfjD20VHZiXbIPagfdwZHkLyS1DoHEwmB5TA53L5Au4eduizJd1HLb1sTIQsjCDAsKyMSNzCvQ5PjvB8nxfN8Py-H9Jx5Gc5xEToFxAyF1C0OsGzDYJK20LxvVxdw7GMAN6zowxkLjbsJETKkMNQZ5XzoAAFelMFYJgmAAEQdTBWR5Ycx2dIiQRIiVQIQFc1w3LdPB3PcD1RBBfGGGE9G0YNrH8et9WjQ1UJ43s+OfAShO4JgAA17S5J0AKA8UIX6aFFTIRYsTUMMC2CAxEW9GY1wJHQ5V8EIVyQuzOyNNDnMwkTGQANV-XzBX8xcyOhTQ8x0xKjAMQJ-ACb0CSMEZERXFdfDPHxOJvbL+34wS31K0igpMGVNzMHYdVXPwIO8ddQwsMNDD0Vaeqyxz7z4iQ8guWRnnob8f0ZBSABllNEVTgPU8q9O0ibtxggzqy2SiT3lSqWxo9sMuvI0wDyV9sGacE6GGm6gqMKH9AsetKuDUti2rMaVmVcyrEsbwrHWz4AaBkGFDBtRLtFa7AqhKGWvRuGg2LSrzCanR8yLCy7GbfdtBx+JiCSWBYEgBleRYcHyfUQtPCgk9BnCzc9IZozKol7RmzZiNasLTQufIB4kgoWgIEF78LuIsnsy0Lx9BgsYln3PStia3cVlWUZQhmVbvAMCJo2fCA4CUezSBNgLs3l+YAFpwl+lD4ioWgg7KoK-DXPU-ACBCntDlwxg1Hxd1sMNEVs-Y-s+KpTigeORqlUJdCxLYLHlEMzAcIz4Rz5WawLtwteNSl+3BGkrlQSuIalCw8yt83cVXTcDAYgMFo3fwtELZXKx7k1+4Uc0LRH0XoQs4ZlTMYsrB1MZvQ0Fqkrq7QnosFse763A9+zYwHfcCZKyLPS7DPJ-NroRcoNV+GkzIjDMK4QwzV2Yt3mD4ZYWxKpLGtuYCsnMo5cVvIA7au1UD7TAKA8qaD3DvTLPKX0ixM6aRPCMZsFZVqbkEBoTWmCbx42oMDBOmZR6IHMnmFO-h1gZ2RhLVcMJKyrHRlZHuPM+aQCIUFDQd8Rg7A3EGLQ1gvQK0RHWNWzDvCGE3EXGMJd4g6z1goq6wcwG6gxMtX0phww4moQWNcq0ix2DYmeSOEQgA */
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
              CHOOSE_QUESTION: {
                actions: "chooseQuestion",
              },
              CHOOSE_ANSWER: {
                actions: ["chooseAnswer", "evaluateTheTest"],
              },
              PROCEED_TO_SUBMIT: {
                target: "#evaluation",
              },
              NEXT_QUESTION: {
                actions: "nextQuestion",
              },
              PREV_QUESTION: {
                actions: "prevQuestion",
              },
            },
          },
          overtime: {
            on: {
              SEE_RESULT: {
                target: "#evaluation",
              },
            },
          },
        },
        on: {
          TICK: {
            actions: "startTimer",
          },
          SUBMIT_ANSWER: {
            target: "evaluation",
          },
        },
      },
      evaluation: {
        id: "evaluation",
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
      passed: {
        on: {
          RESET: {
            actions: "restartTheTest",
            target: "questionsOK",
          },
        },
      },
      failed: {
        on: {
          RESET: {
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
        duration: (ctx, _) => ctx.questions.length * 3,
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
        duration: (ctx) => 0,
      }),
    },
    guards: {
      passTheKKM: (ctx) => ctx.correctAnswer >= ctx.questions.length - 3,
      timerExpired: (ctx) => ctx.elapsed >= ctx.duration,
    },
  });

export type { MachineEvents, UserAnswer };
