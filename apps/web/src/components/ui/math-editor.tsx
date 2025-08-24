'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MathText } from '@/components/ui/math-renderer';
import {
  Calculator,
  Eye,
  EyeOff,
  Keyboard,
  Info,
  Copy,
  X
} from 'lucide-react';

interface MathShortcut {
  key: string;
  symbol: string;
  latex: string;
  description: string;
  category: 'basic' | 'greek' | 'operators' | 'functions' | 'symbols';
}

const MATH_SHORTCUTS: MathShortcut[] = [
  // Basic Math
  { key: 'Ctrl+/', symbol: '÷', latex: '\\div', description: 'Division', category: 'basic' },
  { key: 'Ctrl+*', symbol: '×', latex: '\\times', description: 'Multiplication', category: 'basic' },
  { key: 'Ctrl+Shift+6', symbol: '^', latex: '^{}', description: 'Superscript/Power', category: 'basic' },
  { key: 'Ctrl+Shift+-', symbol: '₋', latex: '_{}', description: 'Subscript', category: 'basic' },
  { key: 'Ctrl+Shift+/', symbol: '√', latex: '\\sqrt{}', description: 'Square root', category: 'basic' },
  { key: 'Ctrl+f', symbol: '𝑓(𝑥)', latex: 'f(x)', description: 'Function', category: 'basic' },

  // Greek Letters
  { key: 'Alt+a', symbol: 'α', latex: '\\alpha', description: 'Alpha', category: 'greek' },
  { key: 'Alt+b', symbol: 'β', latex: '\\beta', description: 'Beta', category: 'greek' },
  { key: 'Alt+g', symbol: 'γ', latex: '\\gamma', description: 'Gamma', category: 'greek' },
  { key: 'Alt+d', symbol: 'δ', latex: '\\delta', description: 'Delta', category: 'greek' },
  { key: 'Alt+e', symbol: 'ε', latex: '\\epsilon', description: 'Epsilon', category: 'greek' },
  { key: 'Alt+t', symbol: 'θ', latex: '\\theta', description: 'Theta', category: 'greek' },
  { key: 'Alt+l', symbol: 'λ', latex: '\\lambda', description: 'Lambda', category: 'greek' },
  { key: 'Alt+m', symbol: 'μ', latex: '\\mu', description: 'Mu', category: 'greek' },
  { key: 'Alt+p', symbol: 'π', latex: '\\pi', description: 'Pi', category: 'greek' },
  { key: 'Alt+s', symbol: 'σ', latex: '\\sigma', description: 'Sigma', category: 'greek' },
  { key: 'Alt+o', symbol: 'ω', latex: '\\omega', description: 'Omega', category: 'greek' },

  // Operators
  { key: 'Ctrl+Shift+=', symbol: '±', latex: '\\pm', description: 'Plus minus', category: 'operators' },
  { key: 'Ctrl+<', symbol: '≤', latex: '\\leq', description: 'Less than or equal', category: 'operators' },
  { key: 'Ctrl+>', symbol: '≥', latex: '\\geq', description: 'Greater than or equal', category: 'operators' },
  { key: 'Ctrl+=', symbol: '≠', latex: '\\neq', description: 'Not equal', category: 'operators' },
  { key: 'Ctrl+~', symbol: '≈', latex: '\\approx', description: 'Approximately equal', category: 'operators' },
  { key: 'Ctrl+Shift+8', symbol: '∞', latex: '\\infty', description: 'Infinity', category: 'operators' },

  // Functions
  { key: 'Ctrl+i', symbol: '∫', latex: '\\int', description: 'Integral', category: 'functions' },
  { key: 'Ctrl+Shift+s', symbol: 'sin', latex: '\\sin', description: 'Sine', category: 'functions' },
  { key: 'Ctrl+Shift+c', symbol: 'cos', latex: '\\cos', description: 'Cosine', category: 'functions' },
  { key: 'Ctrl+Shift+t', symbol: 'tan', latex: '\\tan', description: 'Tangent', category: 'functions' },
  { key: 'Ctrl+l', symbol: 'log', latex: '\\log', description: 'Logarithm', category: 'functions' },
  { key: 'Ctrl+Shift+l', symbol: 'ln', latex: '\\ln', description: 'Natural logarithm', category: 'functions' },

  // Symbols
  { key: 'Ctrl+Shift+d', symbol: '∂', latex: '\\partial', description: 'Partial derivative', category: 'symbols' },
  { key: 'Ctrl+Shift+n', symbol: '∇', latex: '\\nabla', description: 'Nabla/Gradient', category: 'symbols' },
  { key: 'Ctrl+Shift+a', symbol: '∠', latex: '\\angle', description: 'Angle', category: 'symbols' },
  { key: 'Ctrl+Shift+p', symbol: '∥', latex: '\\parallel', description: 'Parallel', category: 'symbols' },
  { key: 'Ctrl+Shift+x', symbol: '⊥', latex: '\\perp', description: 'Perpendicular', category: 'symbols' },
];

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPreview?: boolean;
  showShortcuts?: boolean;
  className?: string;
  rows?: number;
}

export function MathEditor({
  value,
  onChange,
  placeholder = "Type your mathematical expression...",
  showPreview = true,
  showShortcuts = true,
  className = "",
  rows = 4
}: MathEditorProps) {
  const [showHints, setShowHints] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(showPreview);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const categories = ['all', 'basic', 'greek', 'operators', 'functions', 'symbols'];
  const filteredShortcuts = selectedCategory === 'all' 
    ? MATH_SHORTCUTS 
    : MATH_SHORTCUTS.filter(s => s.category === selectedCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = MATH_SHORTCUTS.find(s => {
        const keys = s.key.toLowerCase().split('+');
        const hasCtrl = keys.includes('ctrl') && e.ctrlKey;
        const hasAlt = keys.includes('alt') && e.altKey;
        const hasShift = keys.includes('shift') && e.shiftKey;
        const mainKey = keys[keys.length - 1];
        
        return (
          e.key.toLowerCase() === mainKey &&
          e.ctrlKey === hasCtrl &&
          e.altKey === hasAlt &&
          e.shiftKey === hasShift
        );
      });

      if (shortcut && textareaRef.current === document.activeElement) {
        e.preventDefault();
        insertText(shortcut.latex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      const cursorPos = start + text.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
      textarea.focus();
    }, 0);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Editor */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="w-5 h-5" />
              Math Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              {showShortcuts && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                >
                  <Keyboard className="w-4 h-4 mr-1" />
                  Shortcuts
                </Button>
              )}
              {showPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                >
                  {showPreviewPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Preview Panel */}
      {showPreview && showPreviewPanel && value.trim() && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[80px] flex items-center">
              <MathText className="text-lg">{value}</MathText>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && showHints && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" />
                Keyboard Shortcuts
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {filteredShortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => insertText(shortcut.latex)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-mono">{shortcut.symbol}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(shortcut.latex);
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{shortcut.description}</div>
                  <div className="text-xs text-gray-500 font-mono">{shortcut.key}</div>
                  <div className="text-xs text-blue-600 font-mono mt-1">{shortcut.latex}</div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Click any shortcut above to insert it, or use the keyboard combination while typing in the editor.
                You can also copy LaTeX code by clicking the copy icon.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MathEditor;