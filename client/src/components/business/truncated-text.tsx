import React from "react";

const TruncatedText: React.FC<{ text: string; maxLength?: number }> = ({ text, maxLength = 20 }) => {
  if (!text) return null;

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const truncatedText = text.substring(0, maxLength) + "...";

  return <span title={text}>{truncatedText}</span>;
};

export default TruncatedText;
