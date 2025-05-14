import type OpenAI from "openai";
import { OpenAIService } from "../../websearch/OpenAIService";
import { promises as fs } from "fs";
import * as path from "path";

interface Message {
  text: string;
  msgID: string;
}

const post = async (data: Message): Promise<Message> => {
  const response = await fetch("https://xyz.ag3nts.org/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const startConversation = async (): Promise<Message> => {
  return await post({
    text: "READY",
    msgID: "0",
  });
};

const stateFilePath = path.resolve(__dirname, "state.json");

async function readState(): Promise<Message | undefined> {
  try {
    const data = await fs.readFile(stateFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
}

async function writeState(state: Message): Promise<void> {
  await fs.writeFile(stateFilePath, JSON.stringify(state), "utf-8");
}

async function getInitialState(): Promise<Message> {
  const state = await readState();

  if (!state) {
    const initialState = await startConversation();
    await writeState(initialState);
    return initialState;
  }

  return state;
}

async function start() {
  const state = await getInitialState();
  console.log("Initial State:", start);

  const question = state.text;
  console.log("Extracted Question:", question);

  const openaiService = new OpenAIService();
  const chatAnswer = (await openaiService.completion(
    [
      {
        role: "user",
        content: `
          <rules>
            - The capital of Poland is Kraków.
            - A well-known number from the book The Hitchhiker's Guide to the Galaxy is 69.
            - The current year is 1999.
          </rules>

          <objective>
            Answer the question,  
            Use rules section to answer the question. 
            I need the simplest answer, e.g., - Question: Please calculate the sum of 2+2? Answer: 4.  
            Respond in English.
          </objective>


          The question is '${question}'`,
      },
    ],
    "gpt-4o",
    false,
    false
  )) as OpenAI.Chat.Completions.ChatCompletion;

  const answer = await post({
    text: chatAnswer.choices[0].message.content || "",
    msgID: state.msgID,
  });

  console.log("Chat Answer:", chatAnswer.choices[0].message.content);
  console.log("Submit Response:", answer);

  writeState(answer);
}

start();
