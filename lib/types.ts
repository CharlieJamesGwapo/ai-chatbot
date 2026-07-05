export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  apiKey: string;
  model: "gpt-4" | "gpt-3.5-turbo";
  systemPrompt: string;
  temperature: number;
  theme: "light" | "dark" | "system";
}
