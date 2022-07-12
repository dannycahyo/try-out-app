// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignQuestionsData: "SUCCESS";
    setDuration: "STARTTEST";
    startTimer: "TICK";
    chooseQuestion: "CHOOSEQUESTION";
    chooseAnswer: "CHOOSEQUESTION" | "NEXTQUESTION";
    chooseOption: "CHOOSEOPTION";
    procedToSubmit: "PROCEDTOSUBMIT";
    nextQuestion: "NEXTQUESTION";
    prevQuestion: "PREVQUESTION";
    restartTheTest: "RESET";
  };
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions:
      | "assignQuestionsData"
      | "setDuration"
      | "startTimer"
      | "chooseQuestion"
      | "chooseAnswer"
      | "chooseOption"
      | "procedToSubmit"
      | "nextQuestion"
      | "prevQuestion"
      | "restartTheTest";
    services: never;
    guards: "timerExpired" | "passTheKKM";
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    timerExpired: "";
    passTheKKM: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "idle"
    | "loading"
    | "questionError"
    | "questionsOK"
    | "doingTest"
    | "doingTest.normal"
    | "doingTest.overtime"
    | "evaluation"
    | "passed"
    | "failed"
    | { doingTest?: "normal" | "overtime" };
  tags: "questionsOK" | "evaluation";
}
