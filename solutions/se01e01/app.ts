import type OpenAI from "openai";
import { OpenAIService } from "../../websearch/OpenAIService";

async function start() {
  const response = await fetch("https://xyz.ag3nts.org");
  const html = await response.text();
  const bodyTextMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText = bodyTextMatch ? bodyTextMatch[1] : "";
  const pMatch = bodyText.match(
    /<p[^>]*id=["']human-question["'][^>]*>([\s\S]*?)<\/p>/i
  );
  const question = pMatch
    ? pMatch[1]
        .replace(/<br\s*\/?>/gi, " ") // Replace <br /> with a space
        .replace(/<[^>]+>/g, " ") // Remove other HTML tags
        .trim()
    : "";

  console.log("Extracted Question:", question);

  const openaiService = new OpenAIService();

  const chatAnswer = (await openaiService.completion(
    [
      {
        role: "user",
        content: `Odpowiedz na pytanie, potrzebuje najprostrzej odpowiedzi np. - Pytanie:Rok lądowania na Księżycu? Odpowiedź: 1969. Pytanie to '${question}'`,
      },
    ],
    "gpt-4o",
    false,
    false
  )) as OpenAI.Chat.Completions.ChatCompletion;

  console.log("Chat Answer:", chatAnswer.choices[0].message.content);
  const params = new URLSearchParams();
  params.append("username", "tester");
  params.append("password", "574e112a");
  params.append("answer", chatAnswer.choices[0].message.content || "");

  const submitResponse = await fetch("https://xyz.ag3nts.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const submitHtml = await submitResponse.text();

  console.log("Submit Response:", submitHtml);

  return question;
}

start();
