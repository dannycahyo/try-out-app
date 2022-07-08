import { createMachine, assign } from "xstate";

type question = {
  title: string;
  correctAnswer: string;
  options: string[];
};

interface Context {
  questions: question[];
  selectedQuestion: number;
  chosenOption: number;
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

export const tryOutMachine = createMachine<Context>({
  id: "TryOut App",
  initial: "idle",
  context: {
    questions: [
      {
        correctAnswer: "",
        options: [],
        title: "",
      },
    ],
    selectedQuestion: 0,
    chosenOption: 0,
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
      always: {
        target: "timesUp",
        cond: "timerExpired",
      },
      on: {
        TICK: {
          actions: assign({
            elapsed: (ctx) => ctx.elapsed + ctx.interval,
          }),
        },
        CHOOSEANSWER: {
          actions: "chooseAnswer",
        },
        SUBMITANSWER: {
          target: "evaluation",
        },
        NEXTQUESTION: {
          actions: "nextQuestion",
        },
        PREVQUESTION: {
          actions: "prevQuestion",
        },
      },
    },
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
    timesUp: {
      type: "final",
      on: {
        RETEST: {
          actions: "resetAnswer",
          target: "questionsOK",
        },
      },
    },
    passed: {
      type: "final",
    },
    failed: {
      type: "final",
      on: {
        RETEST: {
          actions: "resetAnswer",
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
    }),
    prevQuestion: assign({
      selectedQuestion: (ctx) => ctx.selectedQuestion - 1,
    }),
  },
  guards: {
    passTheKKM: (ctx) => ctx.correctAnswer >= ctx.questions.length - 3,
    timerExpired: (ctx) => ctx.elapsed >= ctx.duration,
  },
});
