import { useState } from "react";

interface CopyButtonProps {
  text: string;
  size?: "sm" | "md";
}

export default function CopyButton({ text, size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        ${
          size === "sm"
            ? "px-2 py-1 text-xs"
            : "px-3 py-2 text-sm"
        }
        bg-slate-700 dark:bg-slate-800 hover:bg-slate-600 dark:hover:bg-slate-700
        text-slate-100 dark:text-slate-200
        rounded transition-colors
        font-medium
      `}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
