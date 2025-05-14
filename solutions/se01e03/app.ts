import type OpenAI from "openai";
import { OpenAIService } from "../../websearch/OpenAIService";
import { promises as fs } from "fs";
import * as path from "path";

type Test = {
  q: string;
  a: string;
};

type QuestionData = {
  question: string;
  answer: number;
  test?: Test;
};

type CalibrationData = {
  apikey: string;
  description: string;
  copyright: string;
  "test-data": QuestionData[];
};

function calculateString(expr: string): number {
  try {
    // Split by '+' and process each part
    return expr
      .split("+")
      .map((part) => part.trim()) // Remove extra spaces
      .map((part) => parseFloat(part)) // Convert to numbers
      .reduce((sum, num) => sum + num, 0); // Sum up the numbers
  } catch {
    return 0; // Return 0 if any error occurs
  }
}

const jsonFilePath = path.resolve(__dirname, "json.json");

async function readJson(): Promise<CalibrationData> {
  const data = await fs.readFile(jsonFilePath, "utf-8");
  return JSON.parse(data);
}

async function writeJson(data: CalibrationData): Promise<void> {
  await fs.writeFile(jsonFilePath, JSON.stringify(data), "utf-8");
}

async function start() {
  const json = await readJson();

  json.apikey = "db5fe5c9-f2cc-4f1c-adeb-c2a0c2a75dc0";

  json["test-data"] = json["test-data"].map((item) => {
    return {
      ...item,
      answer: calculateString(item.question),
    };
  });

  writeJson(json);

  const questions = json["test-data"]
    .map((item, index) =>
      item.test !== undefined ? `${index}-${item.test?.q}` : null
    )
    .filter((item) => item !== null)
    .join(" ");

  const openaiService = new OpenAIService();
  const chatAnswer = (await openaiService.completion(
    [
      {
        role: "user",
        content: `
          <objective>
            Answer the list of questions,
            I need the simplest answer possible, and answers should be separated by ','
            Questions will have a index number, and the answer should be in the same order as the questions.
          </objective>

          <examples>
            USER: 10-What is the capital of France? 23-What is the capital of Germany?
            AI: 10-Paris, 23-Berlin

          </examples>

          The list of questions is '${questions}'`,
      },
    ],
    "gpt-4o",
    false,
    false
  )) as OpenAI.Chat.Completions.ChatCompletion;

  console.log("questions", questions);
  console.log("Chat Answer:", chatAnswer);

  const answer = chatAnswer.choices[0].message.content || "";
  const answers = answer.split(",").map((item) => {
    const [index, value] = item.split("-");
    return {
      index: parseInt(index),
      value: value.trim(),
    };
  });

  answers.forEach((item) => {
    const question = json["test-data"][item.index];

    json["test-data"][item.index] = {
      ...question,
      test: {
        q: question.test?.q!,
        a: item.value,
      },
    };
  });

  await writeJson(json);

  const verifyAnswer = await post(json);

  console.log("Verify Answer:", verifyAnswer);
}

const post = async (data: CalibrationData): Promise<void> => {
  const verifyData = {
    task: "JSON",
    apikey: data.apikey,
    answer: data,
  };
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

start();
