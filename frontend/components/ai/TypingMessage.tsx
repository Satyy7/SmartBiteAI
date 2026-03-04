"use client";

import { useEffect, useState } from "react";

interface Props {
  text: string;
}

export default function TypingMessage({ text }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  // Clean markdown ** from Gemini
  const cleanedText = text.replace(/\*\*/g, "");

  useEffect(() => {
    if (index < cleanedText.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + cleanedText[index]);
        setIndex(index + 1);
      }, 20); // speed control here

      return () => clearTimeout(timeout);
    }
  }, [index, cleanedText]);

  return (
    <div className="text-neutral-700 leading-relaxed text-lg whitespace-pre-line">
      {displayed}
      <span className="animate-pulse ml-1">|</span>
    </div>
  );
}