import { Message } from "./types";

export const countTokens = (text: string): number => {
  // Approximate token counting: 1 token ≈ 4 characters
  // This is a rough estimate; real token counting requires the tokenizer
  return Math.ceil(text.length / 4);
};

export const calculateTotalTokens = (messages: Message[]): number => {
  return messages.reduce((total, msg) => total + countTokens(msg.content), 0);
};

export interface StreamOptions {
  apiKey: string;
  model: "gpt-4" | "gpt-3.5-turbo";
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  temperature: number;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export const streamOpenAIResponse = async ({
  apiKey,
  model,
  messages,
  temperature,
  onChunk,
  onComplete,
  onError,
}: StreamOptions): Promise<void> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API Error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              onChunk(content);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      buffer = lines[lines.length - 1];
    }

    if (buffer.trim()) {
      const line = buffer.trim();
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data !== "[DONE]") {
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || "";
            if (content) {
              onChunk(content);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error.message : "An error occurred");
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};
