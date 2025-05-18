import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  model: string;
  messages: Message[];
  stream?: boolean;
}

interface ChatResponse {
  message: Message;
  done: boolean;
}

export async function chatWithOllama(
  model: "llama3.2",
  messages: Message[]
): Promise<string> {
  const body: ChatRequest = {
    model,
    messages,
    stream: false,
  };

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat error: ${res.statusText} - ${errText}`);
  }

  const data: ChatResponse = await res.json();
  return data.message.content;
}
