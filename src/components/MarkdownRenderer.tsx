"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useTheme } from "next-themes";

/**
 * Markdown renderer. Can render markdown and LaTex and has syntax highlighting for code.
 */
export default function MarkdownRenderer({
  children,
}: {
  children: string | undefined;
}) {
  const { theme } = useTheme();

  // Dynamically import the correct Highlight.js theme css
  if (theme === "dark") {
    import("highlight.js/styles/github-dark.css");
  } else {
    import("highlight.js/styles/github.css");
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
    >
      {children}
    </Markdown>
  );
}
