import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type {
  ChatCompletion,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import { OpenAIService } from "./OpenAIService";
import { getPrompt, getPromptPl } from "./prompt";
import { chatWithOllama } from "./ollamaChat";

const openAIService = new OpenAIService();

async function processMap(
  file: string
): Promise<{ file: string; response: string }> {
  const mapFolder = join(__dirname, "maps");
  const filePath = join(mapFolder, file);
  const fileData = await readFile(filePath);
  const base64Image = fileData.toString("base64");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${base64Image}`,
            detail: "high",
          },
        } as ChatCompletionContentPartImage,
        {
          type: "text",
          text: getPromptPl(),
        } as ChatCompletionContentPartText,
      ],
    },
  ];

  const chatCompletion = (await openAIService.completion(
    messages,
    "gpt-4o",
    false,
    false,
    1024
  )) as ChatCompletion;
  const text = chatCompletion.choices[0].message.content || "";

  return {
    file,
    response: text,
  };
}

const processData = async (mapFragmentInformation: string) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: getPrompt(mapFragmentInformation),
        } as ChatCompletionContentPartText,
      ],
    },
  ];

  const chatCompletion = (await openAIService.completion(
    messages,
    "gpt-4o",
    false,
    false,
    1024
  )) as ChatCompletion;
  const text = chatCompletion.choices[0].message.content || "";

  console.log("text", text);
};

async function processMaps(): Promise<void> {
  const avatarFolder = join(__dirname, "maps");
  const files = await readdir(avatarFolder);
  const pngFiles = files.filter((file) => file.endsWith(".png"));

  const results = await Promise.all(pngFiles.map((file) => processMap(file)));
  console.log("results", results);

  const resultsWithData = await Promise.all(
    results.map(async (result) => processData(result.response))
  );
}

await processMaps();
