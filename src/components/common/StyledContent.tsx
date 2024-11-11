"use client";

import { CheckIcon, ClipboardIcon } from "@heroicons/react/16/solid";

import {
  HTMLReactParserOptions,
  Element,
  domToReact,
  DOMNode,
} from "html-react-parser";

import parse from "html-react-parser";
import { marked } from "marked";
import Image from "next/image";
import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface StyledContentProps {
  content: string;
}

const StyledContent = ({ content }: StyledContentProps) => {
  const CodeBlock = ({
    code,
    language,
  }: {
    code: string;
    language: string;
  }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    };

    return (
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </button>

        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: "0.5rem",
            overflow: "auto",
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        switch (domNode.name) {
          case "h1":
            return (
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-12 text-gray-800 leading-tight">
                {domToReact(domNode.children as DOMNode[], options)}
              </h1>
            );

          case "h2":
            return (
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-10 text-gray-800 leading-snug">
                {domToReact(domNode.children as DOMNode[], options)}
              </h2>
            );

          case "h3":
            return (
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 mt-8 text-gray-700">
                {domToReact(domNode.children as DOMNode[], options)}
              </h3>
            );

          case "p":
            // p要素の子要素にimgが含まれているかチェック
            const hasImageChild = (domNode.children as Element[]).some(
              (child) => child.name === "img"
            );

            // imgを含む場合は、pタグをスキップして子要素を直接処理
            if (hasImageChild) {
              return <>{domToReact(domNode.children as DOMNode[], options)}</>;
            }

            // blockquoteの中のpタグかどうかをチェック
            const isInsideBlockquote =
              (domNode.parent as Element)?.name === "blockquote";

            return (
              <p
                className={`text-base sm:text-lg leading-relaxed text-gray-600 ${
                  isInsideBlockquote ? "" : "mb-8"
                }`}
              >
                {domToReact(domNode.children as DOMNode[], options)}
              </p>
            );

          case "ul":
            return (
              <ul className="mb-6 ml-6 space-y-2 list-disc list-outside text-gray-600">
                {domToReact(domNode.children as DOMNode[], options)}
              </ul>
            );

          case "ol":
            return (
              <ol className="mb-6 ml-6 space-y-2 list-decimal list-outside text-gray-600">
                {domToReact(domNode.children as DOMNode[], options)}
              </ol>
            );

          case "li":
            return (
              <li className="text-base sm:text-lg leading-relaxed pl-2">
                {domToReact(domNode.children as DOMNode[], options)}
              </li>
            );

          case "a":
            return (
              <a
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors duration-200 break-words"
                href={domNode.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {domToReact(domNode.children as DOMNode[], options)}
              </a>
            );

          case "blockquote":
            return (
              <blockquote className="my-8 pl-6 border-l-4 border-blue-500 bg-blue-50 py-4 px-4 rounded-r-lg italic text-gray-700">
                {domToReact(domNode.children as DOMNode[], options)}
              </blockquote>
            );

          case "code":
            if ((domNode.parent as Element)?.name !== "pre") {
              return (
                <code className="px-2 py-1 bg-gray-100 text-red-600 rounded font-mono text-xs sm:text-sm break-words">
                  {domToReact(domNode.children as DOMNode[], options)}
                </code>
              );
            }
            const language =
              domNode.attribs.class?.replace("language-", "") || "plaintext";
            const code = (domNode.children[0] as unknown as { data: string })
              .data;
            return (
              <div className="px-4 sm:px-0">
                <CodeBlock code={code} language={language} />
              </div>
            );

          case "pre":
            return (
              <div className="my-8 -mx-4 sm:mx-0">
                {domToReact(domNode.children as DOMNode[], options)}
              </div>
            );

          case "img":
            const { src, alt } = domNode.attribs;

            // figure要素を使用して画像をラップ
            if (src?.startsWith("http")) {
              return (
                <figure className="my-8">
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={src}
                      alt={alt || ""}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      priority={false}
                      quality={75}
                    />
                  </div>
                </figure>
              );
            }

          case "hr":
            return <hr className="my-12 border-t-2 border-gray-200" />;

          case "table":
            return (
              <div className="my-8 overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    {domToReact(domNode.children as DOMNode[], options)}
                  </table>
                </div>
              </div>
            );

          case "th":
            return (
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {domToReact(domNode.children as DOMNode[], options)}
              </th>
            );

          case "td":
            return (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {domToReact(domNode.children as DOMNode[], options)}
              </td>
            );
        }
      }
    },
  };

  const htmlContent = marked.parse(content) as string;

  return (
    <div className="w-full md:max-w-3xl mx-auto">
      {parse(htmlContent, options)}
    </div>
  );
};

export default StyledContent;
