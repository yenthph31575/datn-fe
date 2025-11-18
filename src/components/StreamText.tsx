import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';

interface StreamTextProps {
  content: string;
  isComplete?: boolean;
  className?: string;
  speed?: number;
  htmlMode?: boolean;
}

const cleanHtmlContent = (raw: string): string => {
  // Remove markdown-style code block: ```html\n...\n```
  let cleaned = raw.trim();

  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/^```html\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }

  return cleaned.trim();
};

const StreamText: React.FC<StreamTextProps> = ({ content, isComplete = false, className = '', speed = 10, htmlMode = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const rawContent = cleanHtmlContent(content);
    const sanitized = htmlMode ? DOMPurify.sanitize(rawContent) : DOMPurify.sanitize(rawContent.replace(/<[^>]+>/g, ''));

    if (isComplete || !isStreaming) {
      setDisplayedContent(sanitized);
      setIsStreaming(false);
      return;
    }

    setDisplayedContent('');
    setIsStreaming(true);

    const stream = () => {
      if (index <= sanitized.length) {
        setDisplayedContent(sanitized.slice(0, index));
        index++;
        timeout = setTimeout(stream, speed);
      } else {
        setIsStreaming(false);
      }
    };

    stream();

    return () => clearTimeout(timeout);
  }, [content, isComplete, speed, htmlMode]);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: displayedContent }} />
      {isStreaming && <span className="animate-pulse">▌</span>}
    </div>
  );
};

export default StreamText;
