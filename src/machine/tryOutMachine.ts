import { createMachine, assign } from "xstate";
import { raise } from "xstate/lib/actions";

type question = {
  title: string;
  rightOption: string;
  options: string[];
};

interface Context {
  questions: question[];
  selectedQuestion: number;
  selectedOption: number;
  correctAnswer: number;
  elapsed: number;
  interval: number;
  duration: number;
}

const setTimer = (ctx: Context) => (send: any) => {
  const interval = setInterval(() => {
    send("TICK");
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

// Todo => Find Proper Evaluation Mechanism Based On The Questions Length}
export const tryOutMachine = createMachine<Context>({
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
    // Todo => Remove the hacky way (99) once the alternative bug fixing is found
    selectedOption: 99,
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
            CHOOSEANSWER: {
              actions: "chooseAnswer",
            },
            NEXTQUESTION: {
              actions: "nextQuestion",
            },
            PREVQUESTION: {
              actions: "prevQuestion",
            },
          },
        },
        overtime: {
          on: {
            SEERESULT: {
              actions: raise("SUBMITANSWER"),
              target: "#evaluation",
            },
          },
        },
      },
      on: {
        TICK: {
          actions: assign({
            elapsed: (ctx) => ctx.elapsed + ctx.interval,
          }),
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
    setDuration: assign({
      duration: (ctx, event) => ctx.questions.length * 10,
    }),
    nextQuestion: assign({
      selectedQuestion: (ctx) => ctx.selectedQuestion + 1,
      correctAnswer: (ctx, event) =>
        event.rightOption === event.finalAnswer
          ? ctx.correctAnswer + 1
          : ctx.correctAnswer,
    }),
    prevQuestion: assign({
      selectedQuestion: (ctx) => ctx.selectedQuestion - 1,
    }),
    chooseAnswer: assign({
      selectedOption: (ctx, event) => event.index,
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
