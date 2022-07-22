import { createMachine, assign, Sender } from "xstate";
import { QueryClient } from "react-query";
import { getQuestions } from "../api/getQuestions";

const queryClient = new QueryClient();

type question = {
  title: string;
  rightOption: string;
  options: string[];
};

interface Context {
  questions: question[];
  errorMessage: string;
  selectedQuestion: number;
  selectedOption: number;
  correctAnswer: number;
  elapsed: number;
  interval: number;
  duration: number;
}

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
      context: Context &
        Context & {
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
  | { type: "REFETCH" }
  | { type: "STARTTEST" }
  | {
      type: "CHOOSEQUESTION";
      index: number;
      rightOption: string;
      finalAnswer: string;
    }
  | { type: "CHOOSEOPTION"; index: number }
  | { type: "PROCEDTOSUBMIT" }
  | { type: "NEXTQUESTION"; rightOption: string; finalAnswer: string }
  | { type: "PREVQUESTION" }
  | { type: "SEERESULT" }
  | { type: "TICK" }
  | { type: "SUBMITANSWER" }
  | { type: "RESET" };

type MachineActions =
  | { type: "assignQuestionsData" }
  | { type: "setDuration" }
  | { type: "chooseQuestion" }
  | { type: "chooseAnswer" }
  | { type: "chooseOption" }
  | { type: "procedToSubmit" }
  | { type: "nextQuestion" }
  | { type: "chooseAnswer" }
  | { type: "prevQuestion" }
  | { type: "startTimer" }
  | { type: "restartTheTest" };

const setTimer = (ctx: Context) => (send: Sender<MachineEvents>) => {
  const interval = setInterval(() => {
    send("TICK");
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

export const tryOutMachine = createMachine<
  Context,
  MachineEvents,
  MachineStates,
  MachineService
>({
  schema: {
    context: {} as Context,
    events: {} as MachineEvents,
    actions: {} as MachineActions,
    services: {} as MachineService,
  },
  id: "TryOut App",
  initial: "idle",
  context: {
    questions: [
      {
        rightOption: "",
        options: [],
        title: "",
      },
    ],
    errorMessage: "",
    selectedQuestion: 0,
    selectedOption: 0,
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
      },
      on: {
        FETCHING_SUCCESS: {
          target: "questionsOK",
          actions: "assignQuestionsData",
        },
        FETCHING_ERROR: {
          target: "questionError",
          actions: "assignErrorMessage",
        },
      },
    },
    questionError: {
      on: {
        REFETCH: "loading",
      },
    },
    questionsOK: {
      tags: ["questionsOK"],
      id: "questionsOK",
      on: {
        STARTTEST: {
          actions: "setDuration",
          target: "doingTest",
        },
      },
    },
    doingTest: {
      invoke: {
        id: "setTimer",
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
            CHOOSEQUESTION: {
              actions: ["chooseQuestion", "chooseAnswer"],
            },
            CHOOSEOPTION: {
              actions: "chooseOption",
            },
            PROCEDTOSUBMIT: {
              actions: "procedToSubmit",
            },
            NEXTQUESTION: {
              actions: ["nextQuestion", "chooseAnswer"],
            },
            PREVQUESTION: {
              actions: "prevQuestion",
            },
          },
        },
        overtime: {
          on: {
            SEERESULT: {
              target: "#evaluation",
            },
          },
        },
      },
      on: {
        TICK: {
          actions: "startTimer",
        },
        SUBMITANSWER: {
          target: "evaluation",
        },
      },
    },
    evaluation: {
      tags: ["evaluation"],
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
    getQuestionsData: () => (send) => {
      queryClient
        .fetchQuery("questions", getQuestions)
        .then((value) => send({ type: "FETCHING_SUCCESS", data: value }))
        .catch((error) => send({ type: "FETCHING_ERROR", error: error }));
    },
  },
  actions: {
    assignQuestionsData: assign({
      questions: (ctx, event) =>
        event.type === "FETCHING_SUCCESS" ? event.data : ctx.questions,
    }),
    assignErrorMessage: assign({
      errorMessage: (ctx, event) =>
        event.type === "FETCHING_ERROR" ? event.error : ctx.errorMessage,
    }),
    startTimer: assign({
      elapsed: (ctx) => ctx.elapsed + ctx.interval,
    }),
    setDuration: assign({
      duration: (ctx, event) => ctx.questions.length * 3,
    }),
    nextQuestion: assign({
      selectedQuestion: (ctx) => ctx.selectedQuestion + 1,
    }),
    prevQuestion: assign({
      selectedQuestion: (ctx) => ctx.selectedQuestion - 1,
    }),
    chooseQuestion: assign({
      selectedQuestion: (ctx, event) =>
        event.type === "CHOOSEQUESTION" ? event.index : ctx.selectedQuestion,
    }),
    procedToSubmit: assign({
      selectedQuestion: (ctx) => 10,
    }),
    chooseOption: assign({
      selectedOption: (ctx, event) =>
        event.type === "CHOOSEOPTION" ? event.index : ctx.selectedOption,
    }),
    chooseAnswer: assign({
      correctAnswer: (ctx, event) =>
        event.type === "CHOOSEQUESTION"
          ? event.rightOption === event.finalAnswer
            ? ctx.correctAnswer + 1
            : ctx.correctAnswer
          : ctx.correctAnswer,
    }),
    restartTheTest: assign({
      selectedQuestion: (ctx) => 0,
      selectedOption: (ctx) => 0,
      correctAnswer: (ctx) => 0,
      elapsed: (ctx) => 0,
      interval: (ctx) => 0.1,
      duration: (ctx) => 0,
    }),
  },
  guards: {
    passTheKKM: (ctx) => ctx.correctAnswer >= ctx.questions.length - 3,
    timerExpired: (ctx) => ctx.elapsed >= ctx.duration,
  },
});
