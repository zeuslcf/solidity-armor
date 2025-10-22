'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomDark}
      customStyle={{ 
        background: 'hsl(var(--muted) / 0.5)',
        borderRadius: 'var(--radius)',
        padding: '1rem',
        fontSize: '0.875rem',
      }}
      codeTagProps={{
        style: {
          fontFamily: 'var(--font-code)',
        }
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
