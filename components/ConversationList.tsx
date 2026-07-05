"use client";

import { Conversation } from "@/lib/types";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface ConversationListProps {
  conversations: Conversation[];
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onNew: () => void;
}

export default function ConversationList({
  conversations,
  currentId,
  onSelect,
  onDelete,
  onRename,
  onNew,
}: ConversationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEditing = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveEditing(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700">
      <div className="p-4 border-b border-slate-300 dark:border-slate-700">
        <button
          onClick={onNew}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedConversations.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No conversations yet
          </p>
        ) : (
          sortedConversations.map((conv) => (
            <div
              key={conv.id}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group rounded-lg transition-colors ${
                currentId === conv.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
              }`}
            >
              {editingId === conv.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveEditing(conv.id)}
                  onKeyDown={(e) => handleKeyDown(e, conv.id)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-blue-600 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  onClick={() => onSelect(conv.id)}
                  className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className={`text-xs ${
                      currentId === conv.id
                        ? "text-blue-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}>
                      {conv.messages.length} messages
                    </p>
                  </div>

                  {(hoveredId === conv.id || currentId === conv.id) && (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conv.id, conv.title);
                        }}
                        className={`p-1 rounded transition-colors ${
                          currentId === conv.id
                            ? "hover:bg-blue-700"
                            : "hover:bg-slate-300 dark:hover:bg-slate-700"
                        }`}
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this conversation?")) {
                            onDelete(conv.id);
                          }
                        }}
                        className={`p-1 rounded transition-colors ${
                          currentId === conv.id
                            ? "hover:bg-blue-700"
                            : "hover:bg-slate-300 dark:hover:bg-slate-700"
                        }`}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-300 dark:border-slate-700 space-y-2">
        <Link
          href="/settings"
          className="block w-full px-4 py-2 text-center text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg transition-colors"
        >
          ⚙️ Settings
        </Link>
      </div>
    </div>
  );
}
