import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import rehypeRaw from "rehype-raw";

/**
 * Markdown renderer. Can render markdown and LaTex and has syntax highlighting for code.
 */
export default function MarkdownRenderer({
  children,
}: {
  children: string | undefined;
}) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
    >
      {children}
    </Markdown>
  );
}
