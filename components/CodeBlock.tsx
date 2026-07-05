import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import CopyButton from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "plaintext" }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-slate-900 dark:bg-slate-950 border border-slate-700 dark:border-slate-800">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <div className="text-xs text-slate-400 bg-slate-800 dark:bg-slate-900 px-2 py-1 rounded">
          {language}
        </div>
        <CopyButton text={code} size="sm" />
      </div>
      <pre className="!bg-transparent !border-0 !m-0 pt-8 pb-4">
        <code
          ref={codeRef}
          className={`language-${language} text-sm leading-relaxed`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
