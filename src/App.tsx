import React from "react";
import Layout from "./containers/Layout";
import { Box } from "@chakra-ui/react";
import QuestionSection from "./components/QuestionSection";
import AnswerSection from "./components/AnswerSection";

function App() {
  return (
    <Layout>
      <Box minH="2xl">
        <QuestionSection />
        <AnswerSection />
      </Box>
    </Layout>
  );
}

export default App;
