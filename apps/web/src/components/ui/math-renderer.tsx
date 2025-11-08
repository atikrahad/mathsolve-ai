'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';

interface MathRendererProps {
  math: string;
  displayMode?: boolean; // true for block math, false for inline
  className?: string;
  errorColor?: string;
}

export function MathRenderer({
  math,
  displayMode = false,
  className = '',
  errorColor = '#cc0000',
}: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const html = renderToString(math, {
        displayMode,
        errorColor,
        throwOnError: false,
        strict: 'warn',
        trust: false, // Don't allow dangerous commands for security
      });

      containerRef.current.innerHTML = html;
    } catch (error) {
      // Fallback to plain text if KaTeX fails
      if (containerRef.current) {
        containerRef.current.innerHTML = `<span style="color: ${errorColor};">${math}</span>`;
      }
    }
  }, [math, displayMode, errorColor]);

  return (
    <div
      ref={containerRef}
      className={`katex-container ${displayMode ? 'katex-display' : 'katex-inline'} ${className}`}
    />
  );
}

// Utility function to render math in text
export function renderMathInText(text?: string | null): string {
  const source = typeof text === 'string' ? text : '';
  // Replace inline math: $...$
  const inlineMathRegex = /\$([^$]+)\$/g;
  // Replace display math: $$...$$
  const displayMathRegex = /\$\$([^$]+)\$\$/g;

  let result = source;

  // First handle display math ($$...$$)
  result = result.replace(displayMathRegex, (match, mathContent) => {
    try {
      return `<div class="katex-display-block">${renderToString(mathContent.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: 'warn',
        trust: false,
      })}</div>`;
    } catch (error) {
      return `<span style="color: #cc0000;">${match}</span>`;
    }
  });

  // Then handle inline math ($...$)
  result = result.replace(inlineMathRegex, (match, mathContent) => {
    try {
      return renderToString(mathContent.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: 'warn',
        trust: false,
      });
    } catch (error) {
      return `<span style="color: #cc0000;">${match}</span>`;
    }
  });

  return result;
}

interface MathTextProps {
  children?: string | null;
  className?: string;
}

export function MathText({ children = '', className = '' }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderedHtml = renderMathInText(children);
    containerRef.current.innerHTML = renderedHtml;
  }, [children]);

  return <div ref={containerRef} className={`math-text ${className}`} />;
}

// Hook for checking if a string contains math expressions
export function useHasMath(text: string): boolean {
  const hasMath = /\$([^$]+)\$|\$\$([^$]+)\$\$/.test(text);
  return hasMath;
}

export default MathRenderer;
