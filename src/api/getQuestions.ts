// Run the server => json-server --watch db.json

export const getQuestions = async () => {
  const result = await fetch("http://localhost:3000/questions");
  const data = await result.json();
  return data;
};
