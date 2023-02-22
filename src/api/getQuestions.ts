export const getQuestions = async () => {
  const result = await fetch("http://localhost:3001/questions");
  const data = await result.json();
  return data;
};
