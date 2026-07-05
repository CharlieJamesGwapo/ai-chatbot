"use client";

import { useEffect, useRef } from "react";
import { Conversation, Message } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import { calculateTotalTokens } from "@/lib/openai";

interface ChatWindowProps {
  conversation: Conversation | null;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onRegenerate?: () => void;
}

export default function ChatWindow({
  conversation,
  isLoading,
  onSendMessage,
  onRegenerate,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            AI Chatbot
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Select a conversation or create a new one to get started
          </p>
        </div>
      </div>
    );
  }

  const totalTokens = calculateTotalTokens(conversation.messages);
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const canRegenerate = lastMessage && lastMessage.role === "assistant";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Start a new conversation by typing a message below
              </p>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onRegenerate={
                  index === conversation.messages.length - 1 && canRegenerate
                    ? onRegenerate
                    : undefined
                }
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4 animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-emerald-600">
                  AI
                </div>
                <div className="bg-slate-200 dark:bg-slate-800 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-6 border-t border-slate-300 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span>
            {conversation.messages.length} message{conversation.messages.length !== 1 ? "s" : ""}
          </span>
          <span>Tokens: {totalTokens}</span>
        </div>
        <InputBar onSend={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
