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

type MachineStates =
  | {
      value: "idle";
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: "loading";
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: "questionsError";
      context: Context & {
        questionsErrorMessage: string;
      };
    }
  | {
      value: "questionsOK";
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: "doingTest";
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: { doingTest: "normal" };
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: { doingTest: "overtime" };
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: "result";
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: { result: "evaluation" };
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: { result: "passed" };
      context: Context & {
        questionsErrorMessage: undefined;
      };
    }
  | {
      value: { result: "failed" };
      context: Context & {
        questionsErrorMessage: undefined;
      };
    };

type MachineEvents =
  | { type: "FETCHING" }
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
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "SEE_RESULT" }
  | { type: "TICK" }
  | { type: "RESTART_TEST" };

export type {
  Context,
  MachineEvents,
  MachineStates,
  MachineService,
  UserAnswer,
};
