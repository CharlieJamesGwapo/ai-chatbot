"use client";

import { Message } from "@/lib/types";
import MarkdownRenderer from "./MarkdownRenderer";
import CopyButton from "./CopyButton";

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

export default function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 mb-4 animate-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
          isUser
            ? "bg-blue-600"
            : "bg-emerald-600"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div className={`flex-1 max-w-2xl ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-lg px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {isAssistant && (
          <div className="flex gap-2 mt-2 ml-4">
            <CopyButton text={message.content} size="sm" />
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-2 py-1 text-xs bg-slate-700 dark:bg-slate-800 hover:bg-slate-600 dark:hover:bg-slate-700 text-slate-100 dark:text-slate-200 rounded transition-colors font-medium"
              >
                🔄 Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
