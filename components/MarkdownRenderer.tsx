"use client";

import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code(props: any) {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "plaintext";
            const code = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code
                  className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-slate-900 dark:text-slate-100"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock code={code} language={language} />;
          },
          p(props: any) {
            return <p className="mb-4 leading-relaxed">{props.children}</p>;
          },
          h1(props: any) {
            return <h1 className="text-2xl font-bold mt-6 mb-4">{props.children}</h1>;
          },
          h2(props: any) {
            return <h2 className="text-xl font-bold mt-5 mb-3">{props.children}</h2>;
          },
          h3(props: any) {
            return <h3 className="text-lg font-bold mt-4 mb-2">{props.children}</h3>;
          },
          ul(props: any) {
            return <ul className="list-disc list-inside ml-4 mb-4 space-y-2">{props.children}</ul>;
          },
          ol(props: any) {
            return <ol className="list-decimal list-inside ml-4 mb-4 space-y-2">{props.children}</ol>;
          },
          li(props: any) {
            return <li className="leading-relaxed">{props.children}</li>;
          },
          a(props: any) {
            return (
              <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {props.children}
              </a>
            );
          },
          blockquote(props: any) {
            return (
              <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-700 dark:text-slate-300 my-4">
                {props.children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
