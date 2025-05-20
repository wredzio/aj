export const apikey = "db5fe5c9-f2cc-4f1c-adeb-c2a0c2a75dc0";

export const post = async (task: string, data: string): Promise<void> => {
  const verifyData = {
    task: task,
    apikey: apikey,
    answer: data,
  };

  console.log("data:", data);

  const response = await fetch("https://c3ntrala.ag3nts.org/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verifyData),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status}. ${await response.text()}`
    );
  }
  return await response.json();
};
