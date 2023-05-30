export const getQuestions = async () => {
  const result = await fetch("https://try-out-app-api.vercel.app/questions");
  const data = await result.json();
  return data;
};
