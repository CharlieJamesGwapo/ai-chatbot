"use client";

import { useEffect, useState } from "react";
import { Conversation, Message } from "@/lib/types";
import { storage } from "@/lib/storage";
import { streamOpenAIResponse } from "@/lib/openai";
import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = storage.getConversations();
    setConversations(saved);
    if (saved.length > 0) {
      setCurrentConversationId(saved[0].id);
    }
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;
  const settings = storage.getSettings();

  const handleNewConversation = () => {
    const newConv = storage.createConversation();
    setConversations([...conversations, newConv]);
    setCurrentConversationId(newConv.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    storage.deleteConversation(id);
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (currentConversationId === id) {
      setCurrentConversationId(updated[0]?.id || null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    storage.renameConversation(id, newTitle);
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    setConversations(updated);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return;
    if (!settings.apiKey) {
      alert("Please set your OpenAI API key in settings");
      return;
    }

    // Add user message
    const userMessage = storage.addMessage(currentConversation.id, {
      role: "user",
      content,
    });

    // Update title if this is the first message
    if (currentConversation.messages.length === 1) {
      const title = content.split("\n")[0].slice(0, 50);
      storage.renameConversation(currentConversation.id, title);
      const updated = conversations.map((c) =>
        c.id === currentConversation.id ? { ...c, title } : c
      );
      setConversations(updated);
    } else {
      setConversations(
        conversations.map((c) =>
          c.id === currentConversation.id
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      );
    }

    setIsLoading(true);

    // Add empty assistant message for streaming
    const emptyAssistantMsg = storage.addMessage(currentConversation.id, {
      role: "assistant",
      content: "",
    });

    setConversations(
      conversations.map((c) =>
        c.id === currentConversation.id
          ? { ...c, messages: [...c.messages, emptyAssistantMsg] }
          : c
      )
    );

    // Prepare messages for API
    const messages = [
      { role: "system" as const, content: settings.systemPrompt },
      ...currentConversation.messages
        .concat(userMessage)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    let assistantMessage = "";

    await streamOpenAIResponse({
      apiKey: settings.apiKey,
      model: settings.model,
      messages,
      temperature: settings.temperature,
      onChunk: (chunk) => {
        assistantMessage += chunk;
        setConversations((prevConversations) =>
          prevConversations.map((c) => {
            if (c.id === currentConversation.id) {
              const lastMsg = c.messages[c.messages.length - 1];
              if (lastMsg && lastMsg.role === "assistant") {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === lastMsg.id ? { ...m, content: assistantMessage } : m
                  ),
                };
              }
            }
            return c;
          })
        );
      },
      onComplete: () => {
        // Update the message in storage with final content
        storage.updateMessage(currentConversation.id, emptyAssistantMsg.id, assistantMessage);
        setIsLoading(false);
        // Refresh conversations from storage
        const updated = storage.getConversations();
        setConversations(updated);
      },
      onError: (error) => {
        // Remove the empty message on error
        storage.deleteMessage(currentConversation.id, emptyAssistantMsg.id);
        const updated = storage.getConversations();
        setConversations(updated);
        alert(`Error: ${error}`);
        setIsLoading(false);
      },
    });
  };

  const handleRegenerate = async () => {
    if (!currentConversation || !currentConversation.messages.length) return;

    // Remove last assistant message
    const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      storage.deleteMessage(currentConversation.id, lastMessage.id);
    }

    // Get previous user message
    const previousUserMessage = currentConversation.messages[
      currentConversation.messages.length - 2
    ];
    if (previousUserMessage && previousUserMessage.role === "user") {
      setConversations(
        conversations.map((c) =>
          c.id === currentConversation.id
            ? { ...c, messages: c.messages.slice(0, -1) }
            : c
        )
      );
      await handleSendMessage(previousUserMessage.content);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-64 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          currentId={currentConversationId || undefined}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onRename={handleRenameConversation}
          onNew={handleNewConversation}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4 border-b border-slate-300 dark:border-slate-700">
          <DarkModeToggle />
        </div>

        <div className="flex-1">
          <ChatWindow
            conversation={currentConversation}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
          />
        </div>
      </div>
    </div>
  );
}
