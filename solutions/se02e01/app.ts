import { LangfuseService } from "./LangfuseService";
import multer from "multer";
import { OpenAIService } from "./OpenAIService";
import fs from "fs/promises";
import { post } from "../post";
import * as path from "path";
import { getPrompt } from "./prompt";

const storage = multer.memoryStorage();

const langfuseService = new LangfuseService();
const openaiService = new OpenAIService();

const pathResolve = (filePath: string) => {
  return path.resolve(__dirname, filePath);
};

async function readFile(fileName: string): Promise<string> {
  try {
    const data = await fs.readFile(
      pathResolve(`./text/${fileName}.txt`),
      "utf-8"
    );
    return data;
  } catch (err) {
    return "";
  }
}

async function writeFile(fileName: string, content: string): Promise<void> {
  await fs.writeFile(pathResolve(`./text/${fileName}.txt`), content, "utf-8");
}

async function transcribe(fileName: string) {
  const audioFile = {
    buffer: await fs.readFile(pathResolve(`./mp3/${fileName}.m4a`)),
  };

  const transcription = await openaiService.transcribeGroq(audioFile.buffer);

  console.log("Transcription:", transcription);

  await writeFile(fileName, transcription);
}

async function connect() {
  const [adam, agnieszka, ardian, michal, monika, rafal] = await Promise.all([
    readFile("adam"),
    readFile("agnieszka"),
    readFile("ardian"),
    readFile("michal"),
    readFile("monika"),
    readFile("rafal"),
  ]);

  const connected = `
    Adam: ${adam}
    Agnieszka: ${agnieszka}
    Ardian: ${ardian}
    Michal: ${michal}
    Monika: ${monika}
    Rafal: ${rafal}
  `;

  await writeFile("connected", connected);
}

async function sendTask(data: string) {
  await post("mp3", data);
}

const askAi = async (text: string) => {
  const response = await openaiService.completion({
    messages: [
      {
        role: "user",
        content: getPrompt(text),
      },
    ],
  });
  console.log("AI Response:", response);

  const answer = response.choices[0].message.content;
  console.log("Answer:", answer);
  // await writeFile("answer", answer);
};

async function start() {
  const answer = await post("mp3", "Łojasiewicza 6");

  console.log("Answer:", answer);
}

start();
