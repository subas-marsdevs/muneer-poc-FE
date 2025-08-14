import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MemoizedReactMarkdown } from "./markdown";
import "katex/dist/katex.min.css";
import CustomParagraph from "./custom-paragraph";
export function BotMessage({
  message,
  sources,
}: {
  message: string;
  sources?: any;
}) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    message || ""
  );

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(message || "");

  if (containsLaTeX) {
    return (
      <MemoizedReactMarkdown
        rehypePlugins={[
          [rehypeExternalLinks, { target: "_blank" }],
          [rehypeKatex],
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
      >
        {processedData}
      </MemoizedReactMarkdown>
    );
  }

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[
        [rehypeExternalLinks, { target: "_blank" }],
        [rehypeKatex],
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p: ({ children }) => (
          <CustomParagraph children={children} sources={sources} />
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-4 leading-normal">{children}</ol>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-4 leading-normal">{children}</ul>
        ),
        li: ({ children }) => <li className="mb-2">{children}</li>,
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium mb-2">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-4 italic text-gray-600">
            {children}
          </blockquote>
        ),
        td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
        th: ({ children }) => (
          <th className="border px-2 py-1 font-bold">{children}</th>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline !text-white`}
            style={{ color: "white !important" }}
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 p-1 rounded text-sm font-mono">
            {children}
          </code>
        ),
      }}
      skipHtml={false}
    >
      {message}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
