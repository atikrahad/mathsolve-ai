'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

const MONACO_CDN_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs';

interface MonacoCodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  height?: number | string;
  className?: string;
}

const languageMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  cpp: 'cpp',
  c: 'c',
};

declare global {
  interface Window {
    monaco?: any;
    require?: {
      config: (config: Record<string, unknown>) => void;
      (modules: string[], onLoad: (...args: unknown[]) => void): void;
    };
  }
}

const loadMonaco = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('Monaco can only be loaded in the browser');
  }

  if (window.monaco) {
    return window.monaco;
  }

  await new Promise<void>((resolve) => {
    const existingLoader = document.getElementById('monaco-loader');
    if (existingLoader) {
      existingLoader.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'monaco-loader';
    script.src = `${MONACO_CDN_BASE}/loader.min.js`;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  return new Promise((resolve) => {
    window.require?.config({ paths: { vs: MONACO_CDN_BASE } });
    window.require?.(['vs/editor/editor.main'], () => {
      resolve(window.monaco);
    });
  });
};

export default function MonacoCodeEditor({
  value,
  language,
  onChange,
  height = 360,
  className,
}: MonacoCodeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;

    const initEditor = async () => {
      const monaco = await loadMonaco();
      if (!containerRef.current || disposed) return;

      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language: languageMap[language] ?? 'javascript',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
        theme: 'vs-dark',
        smoothScrolling: true,
        scrollBeyondLastLine: false,
      });

      editorRef.current.onDidChangeModelContent(() => {
        if (onChange) {
          const next = editorRef.current?.getValue() ?? '';
          onChange(next);
        }
      });
    };

    initEditor();

    return () => {
      disposed = true;
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    const currentValue = editorRef.current.getValue();
    if (value !== currentValue) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!editorRef.current || !window.monaco) return;
    const model = editorRef.current.getModel();
    if (model) {
      window.monaco.editor.setModelLanguage(model, languageMap[language] ?? 'javascript');
    }
  }, [language]);

  return (
    <div
      ref={containerRef}
      className={clsx('rounded-2xl border border-slate-800 bg-slate-950', className)}
      style={{ height }}
    />
  );
}
