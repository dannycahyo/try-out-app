import { createMachine, assign, Sender } from "xstate";

type question = {
  title: string;
  rightOption: string;
  options: string[];
};

type Context = {
  questions: question[];
  selectedQuestion: number;
  selectedOption: number;
  correctAnswer: number;
  elapsed: number;
  interval: number;
  duration: number;
};

type TryOutMachineEvents =
  | { type: "FETCHING" }
  | { type: "SUCCESS"; data: question[] }
  | { type: "REFETCH" }
  | { type: "ERROR" }
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

const setTimer = (ctx: Context) => (send: Sender<TryOutMachineEvents>) => {
  const interval = setInterval(() => {
    send("TICK");
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

export const tryOutMachine = createMachine({
  tsTypes: {} as import("./tryOutMachine.typegen").Typegen0,
  schema: {
    context: {} as Context,
    events: {} as TryOutMachineEvents,
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
    selectedQuestion: 0,
    selectedOption: 0,
    correctAnswer: 0,
    elapsed: 0,
    interval: 0.1,
    duration: 0,
  },
  states: {
    idle: {
      on: {
        FETCHING: "loading",
      },
    },
    loading: {
      on: {
        SUCCESS: {
          actions: "assignQuestionsData",
          target: "questionsOK",
        },
        ERROR: "questionError",
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
  actions: {
    assignQuestionsData: assign({
      questions: (ctx, event) => event.data,
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
      selectedQuestion: (ctx, event) => event.index,
    }),
    procedToSubmit: assign({
      selectedQuestion: (ctx) => 10,
    }),
    chooseOption: assign({
      selectedOption: (ctx, event) => event.index,
    }),
    chooseAnswer: assign({
      correctAnswer: (ctx, event) =>
        event.rightOption === event.finalAnswer
          ? ctx.correctAnswer + 1
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
