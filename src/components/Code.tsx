import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/default-highlight";

export const Code = ({
  text,
  language,
}: {
  text: string;
  language: string;
}) => {
  return (
    <SyntaxHighlighter language={language} style={atomOneDark}>
      {text}
    </SyntaxHighlighter>
  );
};
