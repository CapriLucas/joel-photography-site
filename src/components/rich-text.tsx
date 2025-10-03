import React from "react";

interface RichTextProps {
  text: string;
  className?: string;
}

export default function RichText({ text, className = "" }: RichTextProps) {
  // Simple markdown-like parsing for basic formatting
  const formatText = (input: string) => {
    // Split by paragraphs (double newlines)
    const paragraphs = input.split("\n\n").filter((p) => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Process inline formatting
      const formattedText = paragraph
        // Bold: **text** -> <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic: *text* -> <em>text</em>
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Underline: <u>text</u> stays as is
        .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
        // Code: `text` -> <code>text</code>
        .replace(
          /`(.*?)`/g,
          '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
        );

      return (
        <p
          key={index}
          className={index > 0 ? "mt-4" : ""}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  return <div className={className}>{formatText(text)}</div>;
}
