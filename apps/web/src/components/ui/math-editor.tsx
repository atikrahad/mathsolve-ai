'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MathText } from '@/components/ui/math-renderer';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  Eye,
  EyeOff,
  Keyboard,
  Info,
  Copy,
  X,
  Pen,
  Eraser,
  Square,
  Circle,
  Triangle,
  Minus,
  RotateCcw,
  Download,
  Upload,
  Palette,
  Type,
  MousePointer,
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
  {
    key: 'Ctrl+*',
    symbol: '×',
    latex: '\\times',
    description: 'Multiplication',
    category: 'basic',
  },
  {
    key: 'Ctrl+Shift+6',
    symbol: '^',
    latex: '^{}',
    description: 'Superscript/Power',
    category: 'basic',
  },
  { key: 'Ctrl+Shift+-', symbol: '₋', latex: '_{}', description: 'Subscript', category: 'basic' },
  {
    key: 'Ctrl+Shift+/',
    symbol: '√',
    latex: '\\sqrt{}',
    description: 'Square root',
    category: 'basic',
  },
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
  {
    key: 'Ctrl+Shift+=',
    symbol: '±',
    latex: '\\pm',
    description: 'Plus minus',
    category: 'operators',
  },
  {
    key: 'Ctrl+<',
    symbol: '≤',
    latex: '\\leq',
    description: 'Less than or equal',
    category: 'operators',
  },
  {
    key: 'Ctrl+>',
    symbol: '≥',
    latex: '\\geq',
    description: 'Greater than or equal',
    category: 'operators',
  },
  { key: 'Ctrl+=', symbol: '≠', latex: '\\neq', description: 'Not equal', category: 'operators' },
  {
    key: 'Ctrl+~',
    symbol: '≈',
    latex: '\\approx',
    description: 'Approximately equal',
    category: 'operators',
  },
  {
    key: 'Ctrl+Shift+8',
    symbol: '∞',
    latex: '\\infty',
    description: 'Infinity',
    category: 'operators',
  },

  // Functions
  { key: 'Ctrl+i', symbol: '∫', latex: '\\int', description: 'Integral', category: 'functions' },
  {
    key: 'Ctrl+Shift+s',
    symbol: 'sin',
    latex: '\\sin',
    description: 'Sine',
    category: 'functions',
  },
  {
    key: 'Ctrl+Shift+c',
    symbol: 'cos',
    latex: '\\cos',
    description: 'Cosine',
    category: 'functions',
  },
  {
    key: 'Ctrl+Shift+t',
    symbol: 'tan',
    latex: '\\tan',
    description: 'Tangent',
    category: 'functions',
  },
  { key: 'Ctrl+l', symbol: 'log', latex: '\\log', description: 'Logarithm', category: 'functions' },
  {
    key: 'Ctrl+Shift+l',
    symbol: 'ln',
    latex: '\\ln',
    description: 'Natural logarithm',
    category: 'functions',
  },

  // Symbols
  {
    key: 'Ctrl+Shift+d',
    symbol: '∂',
    latex: '\\partial',
    description: 'Partial derivative',
    category: 'symbols',
  },
  {
    key: 'Ctrl+Shift+n',
    symbol: '∇',
    latex: '\\nabla',
    description: 'Nabla/Gradient',
    category: 'symbols',
  },
  { key: 'Ctrl+Shift+a', symbol: '∠', latex: '\\angle', description: 'Angle', category: 'symbols' },
  {
    key: 'Ctrl+Shift+p',
    symbol: '∥',
    latex: '\\parallel',
    description: 'Parallel',
    category: 'symbols',
  },
  {
    key: 'Ctrl+Shift+x',
    symbol: '⊥',
    latex: '\\perp',
    description: 'Perpendicular',
    category: 'symbols',
  },
];

interface DrawingTool {
  type: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';
  color: string;
  size: number;
}

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  onDrawingChange?: (drawingData: string) => void;
  placeholder?: string;
  showPreview?: boolean;
  showShortcuts?: boolean;
  showDrawing?: boolean;
  className?: string;
  rows?: number;
}

export function MathEditor({
  value,
  onChange,
  onDrawingChange,
  placeholder = 'Enter your mathematical solution here...',
  showPreview = true,
  showShortcuts = true,
  showDrawing = true,
  className = '',
  rows = 4,
}: MathEditorProps) {
  const [showHints, setShowHints] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(showPreview);
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [activeTab, setActiveTab] = useState<string>('text');
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: 'pen',
    color: '#2563eb',
    size: 3,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const categories = ['basic', 'greek', 'operators', 'functions', 'symbols'];
  const filteredShortcuts = MATH_SHORTCUTS.filter((s) => s.category === selectedCategory);

  // Math templates for common expressions
  const mathTemplates = [
    { name: 'Fraction', latex: '\\frac{numerator}{denominator}', preview: '\\frac{a}{b}' },
    { name: 'Square Root', latex: '\\sqrt{expression}', preview: '\\sqrt{x}' },
    {
      name: 'Integral',
      latex: '\\int_{lower}^{upper} expression \\, dx',
      preview: '\\int_0^1 x^2 dx',
    },
    { name: 'Summation', latex: '\\sum_{i=1}^{n} expression', preview: '\\sum_{i=1}^{n} i' },
    {
      name: 'Limit',
      latex: '\\lim_{x \\to value} expression',
      preview: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
    },
    {
      name: 'Matrix',
      latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
      preview: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}',
    },
    { name: 'Derivative', latex: '\\frac{d}{dx} expression', preview: '\\frac{d}{dx} x^2' },
    { name: 'Binomial', latex: '\\binom{n}{k}', preview: '\\binom{n}{k}' },
  ];

  // Color palette for drawing
  const colorPalette = [
    '#2563eb',
    '#dc2626',
    '#16a34a',
    '#ca8a04',
    '#9333ea',
    '#c2410c',
    '#0891b2',
    '#be123c',
    '#4338ca',
    '#000000',
  ];

  // Drawing setup
  useEffect(() => {
    if (canvasRef.current && showDrawing) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = currentTool.color;
        context.lineWidth = currentTool.size;
        contextRef.current = context;
      }
    }
  }, [currentTool, showDrawing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = MATH_SHORTCUTS.find((s) => {
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

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  }, []);

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !contextRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentTool.type === 'eraser') {
        contextRef.current.globalCompositeOperation = 'destination-out';
        contextRef.current.lineWidth = currentTool.size * 2;
      } else {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.strokeStyle = currentTool.color;
        contextRef.current.lineWidth = currentTool.size;
      }

      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    },
    [isDrawing, currentTool]
  );

  const finishDrawing = useCallback(() => {
    if (!contextRef.current) return;

    setIsDrawing(false);
    contextRef.current.closePath();

    // Save drawing data
    if (canvasRef.current && onDrawingChange) {
      onDrawingChange(canvasRef.current.toDataURL());
    }
  }, [onDrawingChange]);

  const clearCanvas = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    if (onDrawingChange) {
      onDrawingChange('');
    }
  }, [onDrawingChange]);

  const downloadDrawing = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'math-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Professional Math Editor</h2>
              <p className="text-sm text-gray-600">
                Create mathematical expressions with LaTeX and draw diagrams
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showTemplates ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs"
            >
              <Type className="w-4 h-4 mr-1" />
              Templates
            </Button>
            {showShortcuts && (
              <Button
                variant={showHints ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-xs"
              >
                <Keyboard className="w-4 h-4 mr-1" />
                Shortcuts
              </Button>
            )}
            {showPreview && (
              <Button
                variant={showPreviewPanel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPreviewPanel(!showPreviewPanel)}
                className="text-xs"
              >
                {showPreviewPanel ? (
                  <EyeOff className="w-4 h-4 mr-1" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                Preview
              </Button>
            )}
          </div>
        </div>

        {/* Quick Templates */}
        {showTemplates && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Templates</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mathTemplates.map((template) => (
                <Button
                  key={template.name}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-start bg-white/80 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all"
                  onClick={() => insertText(template.latex)}
                >
                  <span className="text-xs font-medium text-gray-700">{template.name}</span>
                  <div className="text-sm text-blue-600 mt-1 font-mono">
                    <MathText className="text-xs">{template.preview}</MathText>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Editor */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4 bg-gray-50/50 border-b"></CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-12">
              <TabsTrigger
                value="text"
                className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Type className="w-4 h-4" />
                LaTeX Editor
              </TabsTrigger>
              {showDrawing && (
                <TabsTrigger
                  value="drawing"
                  className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Pen className="w-4 h-4" />
                  Visual Canvas
                </TabsTrigger>
              )}
            </TabsList>

            {/* Enhanced Text Editor Tab */}
            <TabsContent value="text" className="space-y-0 p-6">
              <div className="space-y-4">
                {/* Category Selector */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Symbol Categories:</span>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className="cursor-pointer text-xs px-3 py-1 bg-white hover:bg-blue-50 transition-colors"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Enhanced Math Symbol Toolbar */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Symbols
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Font Size:</span>
                      <input
                        type="range"
                        min="12"
                        max="18"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-16"
                      />
                      <span className="text-xs text-gray-600 w-8">{fontSize}px</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {filteredShortcuts.map((shortcut) => (
                      <Button
                        key={shortcut.key}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-lg hover:bg-blue-100 hover:scale-110 transition-all border border-gray-200 bg-white shadow-sm"
                        onClick={() => insertText(shortcut.latex)}
                        title={`${shortcut.description}\n${shortcut.key}\nLaTeX: ${shortcut.latex}`}
                      >
                        {shortcut.symbol}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Professional Text Area */}
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows + 2}
                    className={`font-mono resize-vertical border-2 border-gray-200 focus:border-blue-400 rounded-xl p-4 bg-white shadow-inner transition-all`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {value.length} characters
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Drawing Canvas Tab */}
            {showDrawing && (
              <TabsContent value="drawing" className="space-y-0 p-6">
                {/* Professional Drawing Toolbar */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Drawing Tools */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Tools:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant={currentTool.type === 'pen' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool((prev) => ({ ...prev, type: 'pen' }))}
                          className="h-9 px-3"
                        >
                          <Pen className="w-4 h-4 mr-1" />
                          Pen
                        </Button>
                        <Button
                          variant={currentTool.type === 'eraser' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentTool((prev) => ({ ...prev, type: 'eraser' }))}
                          className="h-9 px-3"
                        >
                          <Eraser className="w-4 h-4 mr-1" />
                          Eraser
                        </Button>
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-8" />

                    {/* Color Palette */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Colors:</span>
                      <div className="flex items-center gap-1">
                        {colorPalette.map((color) => (
                          <button
                            key={color}
                            onClick={() => setCurrentTool((prev) => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                              currentTool.color === color
                                ? 'border-gray-400 shadow-md'
                                : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        <input
                          type="color"
                          value={currentTool.color}
                          onChange={(e) =>
                            setCurrentTool((prev) => ({ ...prev, color: e.target.value }))
                          }
                          className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer ml-2"
                          title="Custom color"
                        />
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-8" />

                    {/* Brush Size */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Size:</span>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        value={currentTool.size}
                        onChange={(e) =>
                          setCurrentTool((prev) => ({ ...prev, size: parseInt(e.target.value) }))
                        }
                        className="w-24"
                      />
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-gray-200">
                        <div
                          className="rounded-full"
                          style={{
                            width: `${Math.min(currentTool.size, 20)}px`,
                            height: `${Math.min(currentTool.size, 20)}px`,
                            backgroundColor: currentTool.color,
                          }}
                        />
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-8" />

                    {/* Canvas Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCanvas}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadDrawing}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export PNG
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Professional Drawing Canvas */}
                <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white">
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none z-10" />
                  <canvas
                    ref={canvasRef}
                    width={900}
                    height={500}
                    className={`w-full bg-white ${
                      currentTool.type === 'pen' ? 'cursor-crosshair' : 'cursor-pointer'
                    } transition-all`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={finishDrawing}
                    onMouseLeave={finishDrawing}
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-600 font-medium">
                      💡 Draw mathematical diagrams, graphs, and geometric shapes
                    </p>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-600">
                      Tool: <span className="font-medium capitalize">{currentTool.type}</span> •
                      Size: <span className="font-medium">{currentTool.size}px</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced Live Preview Panel */}
      {showPreview && showPreviewPanel && value.trim() && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
                Live Math Preview
              </CardTitle>
              <Badge variant="secondary" className="bg-white/60 text-blue-700 border-blue-200">
                Real-time Rendering
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Rendered Output:</h4>
                  <div className="text-xs text-gray-500">LaTeX → Beautiful Math</div>
                </div>
                <div className="min-h-[100px] flex items-center justify-center bg-gray-50/50 rounded-lg p-6 border border-gray-100">
                  <MathText className="text-xl leading-relaxed text-center w-full">
                    {value}
                  </MathText>
                </div>
              </div>

              {/* LaTeX Source Display */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/60 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">LaTeX Source:</h4>
                <code className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded font-mono block overflow-x-auto">
                  {value}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Help Panel */}
      {showShortcuts && showHints && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <Info className="w-5 h-5" />
                </div>
                Professional Help & Shortcuts
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(false)}
                className="hover:bg-white/60"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="math" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/60 p-1 h-12">
                <TabsTrigger
                  value="math"
                  className="h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Math Shortcuts
                </TabsTrigger>
                <TabsTrigger
                  value="drawing"
                  className="h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Drawing Guide
                </TabsTrigger>
                <TabsTrigger
                  value="tips"
                  className="h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Pro Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="math" className="space-y-4 mt-6">
                {/* Enhanced Category Filter */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/60 p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Symbol Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className="cursor-pointer text-xs px-3 py-1 bg-white hover:bg-purple-50 transition-colors"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Professional Shortcuts Grid */}
                <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Symbols
                    Reference
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                    {filteredShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="bg-gradient-to-r from-white to-purple-50 p-4 border border-purple-100 rounded-lg hover:border-purple-200 cursor-pointer transition-all hover:shadow-md"
                        onClick={() => insertText(shortcut.latex)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl font-mono">
                              {shortcut.symbol}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">
                                {shortcut.description}
                              </div>
                              <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                                {shortcut.key}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-purple-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(shortcut.latex);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <code className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded font-mono block">
                          {shortcut.latex}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="drawing" className="space-y-6 mt-6">
                <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    Professional Drawing Guide
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 border-b border-purple-100 pb-2">
                        Essential Tools
                      </h5>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-white to-blue-50 p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Pen className="w-5 h-5 text-blue-600" />
                            <strong className="text-gray-800">Precision Pen</strong>
                          </div>
                          <p className="text-sm text-gray-600">
                            Create accurate mathematical diagrams with variable stroke width
                            (1-25px)
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-white to-red-50 p-3 rounded-lg border border-red-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Eraser className="w-5 h-5 text-red-600" />
                            <strong className="text-gray-800">Smart Eraser</strong>
                          </div>
                          <p className="text-sm text-gray-600">
                            Remove specific parts without affecting the rest of your drawing
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-white to-green-50 p-3 rounded-lg border border-green-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Palette className="w-5 h-5 text-green-600" />
                            <strong className="text-gray-800">Color System</strong>
                          </div>
                          <p className="text-sm text-gray-600">
                            10 pre-defined colors plus custom color picker for perfect diagrams
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 border-b border-purple-100 pb-2">
                        Best Practices
                      </h5>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            <strong>Graphs:</strong> Use blue for axes, red for functions, green for
                            regions
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            <strong>Geometry:</strong> Start with thin strokes for construction,
                            bold for final shapes
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            <strong>Annotations:</strong> Use different colors to highlight key
                            points and solutions
                          </span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>
                            <strong>Export:</strong> Save as PNG for high-quality documentation and
                            sharing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="space-y-6 mt-6">
                <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-600" />
                    Professional Mathematics Workflow
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 border-b border-purple-100 pb-2">
                        Expert Tips
                      </h5>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <strong className="text-green-800">LaTeX Mastery</strong>
                          </div>
                          <p className="text-sm text-green-700">
                            Use templates for complex expressions, then customize as needed
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <strong className="text-blue-800">Hybrid Solutions</strong>
                          </div>
                          <p className="text-sm text-blue-700">
                            Combine LaTeX equations with visual diagrams for comprehensive answers
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <strong className="text-purple-800">Quality Control</strong>
                          </div>
                          <p className="text-sm text-purple-700">
                            Always preview your work before submitting to catch any rendering issues
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <strong className="text-amber-800">Efficiency</strong>
                          </div>
                          <p className="text-sm text-amber-700">
                            Master keyboard shortcuts to input math symbols 3x faster
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-800 border-b border-purple-100 pb-2">
                        LaTeX Examples
                      </h5>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                LaTeX Code
                              </strong>
                              <code className="block mt-1 text-sm bg-white p-2 rounded border font-mono text-blue-600">
                                x^2 + y^2 = r^2
                              </code>
                            </div>
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                Rendered
                              </strong>
                              <div className="mt-1 p-2 bg-white rounded border">
                                <MathText className="text-sm">x^2 + y^2 = r^2</MathText>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                LaTeX Code
                              </strong>
                              <code className="block mt-1 text-sm bg-white p-2 rounded border font-mono text-blue-600">
                                \\frac{'{a + b}'}
                                {'{c - d}'}
                              </code>
                            </div>
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                Rendered
                              </strong>
                              <div className="mt-1 p-2 bg-white rounded border">
                                <MathText className="text-sm">
                                  \\frac{a + b}
                                  {c - d}
                                </MathText>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                LaTeX Code
                              </strong>
                              <code className="block mt-1 text-sm bg-white p-2 rounded border font-mono text-blue-600">
                                \\int_0^∞ e^{'{-x}'} dx
                              </code>
                            </div>
                            <div>
                              <strong className="text-xs text-gray-600 uppercase tracking-wide">
                                Rendered
                              </strong>
                              <div className="mt-1 p-2 bg-white rounded border">
                                <MathText className="text-sm">\\int_0^∞ e^{-x} dx</MathText>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MathEditor;
