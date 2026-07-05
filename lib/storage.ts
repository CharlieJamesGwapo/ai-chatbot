import { Conversation, Message, Settings } from "./types";
import { v4 as uuidv4 } from "uuid";

const CONVERSATIONS_KEY = "conversations";
const SETTINGS_KEY = "settings";

export const storage = {
  // Conversation methods
  getConversations: (): Conversation[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getConversation: (id: string): Conversation | null => {
    const conversations = storage.getConversations();
    return conversations.find((c) => c.id === id) || null;
  },

  saveConversation: (conversation: Conversation): void => {
    const conversations = storage.getConversations();
    const index = conversations.findIndex((c) => c.id === conversation.id);
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  },

  createConversation: (title: string = "New Conversation"): Conversation => {
    const now = Date.now();
    const conversation: Conversation = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    storage.saveConversation(conversation);
    return conversation;
  },

  deleteConversation: (id: string): void => {
    const conversations = storage.getConversations();
    const filtered = conversations.filter((c) => c.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
  },

  renameConversation: (id: string, newTitle: string): void => {
    const conversation = storage.getConversation(id);
    if (conversation) {
      conversation.title = newTitle;
      conversation.updatedAt = Date.now();
      storage.saveConversation(conversation);
    }
  },

  clearAllConversations: (): void => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([]));
  },

  // Message methods
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp">): Message => {
    const conversation = storage.getConversation(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = Date.now();
    storage.saveConversation(conversation);
    return newMessage;
  },

  updateMessage: (conversationId: string, messageId: string, content: string): void => {
    const conversation = storage.getConversation(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const message = conversation.messages.find((m) => m.id === messageId);
    if (!message) throw new Error("Message not found");

    message.content = content;
    conversation.updatedAt = Date.now();
    storage.saveConversation(conversation);
  },

  deleteMessage: (conversationId: string, messageId: string): void => {
    const conversation = storage.getConversation(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    conversation.messages = conversation.messages.filter((m) => m.id !== messageId);
    conversation.updatedAt = Date.now();
    storage.saveConversation(conversation);
  },

  // Settings methods
  getSettings: (): Settings => {
    if (typeof window === "undefined") {
      return getDefaultSettings();
    }
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...getDefaultSettings(), ...JSON.parse(data) } : getDefaultSettings();
  },

  saveSettings: (settings: Partial<Settings>): void => {
    const current = storage.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  },
};

export const getDefaultSettings = (): Settings => ({
  apiKey: "",
  model: "gpt-4",
  systemPrompt:
    "You are a helpful, harmless, and honest AI assistant. You provide accurate information and assist with a wide range of tasks.",
  temperature: 0.7,
  theme: "system",
});
