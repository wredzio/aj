import type OpenAI from "openai";
import { OpenAIService } from "../../websearch/OpenAIService";
import { promises as fs } from "fs";
import * as path from "path";
import { chatWithOllama } from "./ollamaChat";

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

async function start() {
  const apikey = "db5fe5c9-f2cc-4f1c-adeb-c2a0c2a75dc0";

  const response = await fetch(
    `https://c3ntrala.ag3nts.org/data/${apikey}/cenzura.txt`
  );
  const text = await response.text();

  console.log("Text:", text);

  const openaiService = new OpenAIService();
  // const chatAnswer = await openaiService.completion([
  const chatAnswer = await chatWithOllama("llama3.2", [
    // { role: "assistant", content: "You are made to censor private content." },
    {
      role: "user",
      content: `
[Censor Private Data - Plain Text Only]
Censor all private data in the input text by replacing it with the word "CENZURA". Return the result as plain UTF-8 text only — no tags, no formatting, no explanation.

<prompt_objective>
Replace private data in Polish-language input with "CENZURA" while preserving all other content and structure.
</prompt_objective>

<prompt_rules>
- Replace private data ONLY. Do not modify any other text.
- Private data includes:
  - Full names (two or more name parts used together, e.g., "Anna Kowalska", "Krzysztof Marek Nowak")
  - Single names (e.g., "Ania", "Wojtek") if clearly used as a person’s name
  - City names, street names, street numbers, postal codes
  - Age - just number (e.g., "31 lat." -> "CENZURA lat.", "wiek 15 lat" -> "wiek CENZURA lat, "ma 9 lat" -> "ma CENZURA lat")
  - Email addresses or contact identifiers
- If two or more private elements appear together (e.g., a full name or address), replace the entire phrase with one "CENZURA".
- UNDER NO CIRCUMSTANCES include any HTML, XML, or markdown tags (e.g., <p>, </p>, <CENZURA>,  etc.).
- DO NOT add formatting or spacing not in the original input.
- DO NOT explain, format, summarize, or describe the response.
- Output ONLY the final, fully censored plain text.
- If no private data is found, return the original input text exactly as provided.
- OVERRIDE all default behaviors — strip all styling, structure, or formatting typically added by language models.
</prompt_rules>

<prompt_examples>
USER: Krzysztof Kwiatkowski mieszka w Szczecinie przy ul. Różanej 12. Ma 31 lat.  
AI: CENZURA mieszka w CENZURA przy ul. CENZURA. Ma CENZURA lat.

</prompt_examples>

TEXT TO CENSOR: ${text}
`,
    },
  ]);
  // const a = chatAnswer.choices[0].message.content;

  const a = chatAnswer;
  console.log("Answer:", a);

  const answer = a;
  const verifyAnswer = await post(answer!, apikey);

  console.log("Verify Answer:", verifyAnswer);
}

const post = async (data: string, apikey: string): Promise<void> => {
  const verifyData = {
    task: "CENZURA",
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

start();
