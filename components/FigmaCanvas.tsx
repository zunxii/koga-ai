'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Move, Square, Type, Circle, Download, Play, RotateCcw } from 'lucide-react';

interface FigmaNode {
  id: string;
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'ELLIPSE' | 'GROUP';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: Array<{ type: 'SOLID'; color: { r: number; g: number; b: number; a?: number } }>;
  children?: FigmaNode[];
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT';
  cornerRadius?: number;
  strokeWeight?: number;
  strokes?: Array<{ type: 'SOLID'; color: { r: number; g: number; b: number; a?: number } }>;
}

interface FigmaCanvasProps {
  onCodeExecute?: (code: string) => void;
  generatedCode?: string;
}

export default function FigmaCanvas({ onCodeExecute, generatedCode }: FigmaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<FigmaNode[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [isExecuting, setIsExecuting] = useState(false);

  // Mock Figma API implementation
  const createFigmaAPI = () => {
    const api = {
      currentPage: {
        children: nodes,
        appendChild: (node: FigmaNode) => {
          setNodes(prev => [...prev, node]);
        },
        findOne: (callback: (node: FigmaNode) => boolean) => {
          return nodes.find(callback);
        },
        findAll: (callback: (node: FigmaNode) => boolean) => {
          return nodes.filter(callback);
        }
      },
        
      createFrame: () => ({
        id: `frame_${Date.now()}`,
        type: 'FRAME' as const,
        name: 'Frame',
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        fills: [{ type: 'SOLID' as const, color: { r: 1, g: 1, b: 1, a: 1 } }],
        children: [],
        cornerRadius: 0,
        strokeWeight: 1,
        strokes: [{ type: 'SOLID' as const, color: { r: 0.8, g: 0.8, b: 0.8, a: 1 } }]
      }),

      createRectangle: () => ({
        id: `rect_${Date.now()}`,
        type: 'RECTANGLE' as const,
        name: 'Rectangle',
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fills: [{ type: 'SOLID' as const, color: { r: 0.2, g: 0.4, b: 0.8, a: 1 } }],
        cornerRadius: 0,
        strokeWeight: 0,
        strokes: []
      }),

      createEllipse: () => ({
        id: `ellipse_${Date.now()}`,
        type: 'ELLIPSE' as const,
        name: 'Ellipse',
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fills: [{ type: 'SOLID' as const, color: { r: 0.8, g: 0.2, b: 0.4, a: 1 } }],
        strokeWeight: 0,
        strokes: []
      }),

      createText: () => ({
        id: `text_${Date.now()}`,
        type: 'TEXT' as const,
        name: 'Text',
        x: 150,
        y: 150,
        width: 100,
        height: 30,
        characters: 'Hello World',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: '400',
        textAlignHorizontal: 'LEFT' as const,
        fills: [{ type: 'SOLID' as const, color: { r: 0, g: 0, b: 0, a: 1 } }]
      }),

      group: (nodes: FigmaNode[], parent?: FigmaNode) => ({
        id: `group_${Date.now()}`,
        type: 'GROUP' as const,
        name: 'Group',
        x: Math.min(...nodes.map(n => n.x)),
        y: Math.min(...nodes.map(n => n.y)),
        width: Math.max(...nodes.map(n => n.x + n.width)) - Math.min(...nodes.map(n => n.x)),
        height: Math.max(...nodes.map(n => n.y + n.height)) - Math.min(...nodes.map(n => n.y)),
        children: nodes
      }),

      notify: (message: string) => {
        console.log('Figma notification:', message);
      },

      closePlugin: () => {
        console.log('Plugin closed');
      }
    };

    return api;
  };

  const executeCode = async (code: string) => {
    setIsExecuting(true);
    try {
      // Create a mock figma API
      const figma = createFigmaAPI();
      
      // Create a sandboxed execution environment
      const executeInSandbox = new Function('figma', code);
      
      // Execute the code
      executeInSandbox(figma);
      
      // Update the canvas
      renderCanvas();
      
    } catch (error) {
      console.error('Error executing code:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw grid
    drawGrid(ctx);

    // Draw nodes
    nodes.forEach(node => drawNode(ctx, node));

    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

    for (let x = 0; x < 2000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2000);
      ctx.stroke();
    }

    for (let y = 0; y < 2000; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2000, y);
      ctx.stroke();
    }
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: FigmaNode) => {
    ctx.save();

    switch (node.type) {
      case 'FRAME':
      case 'RECTANGLE':
        if (node.fills && node.fills[0]) {
          const fill = node.fills[0];
          ctx.fillStyle = `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.color.a || 1})`;
          
          if (node.cornerRadius) {
            drawRoundedRect(ctx, node.x, node.y, node.width, node.height, node.cornerRadius);
          } else {
            ctx.fillRect(node.x, node.y, node.width, node.height);
          }
        }
        
        if (node.strokes && node.strokes[0] && node.strokeWeight) {
          const stroke = node.strokes[0];
          ctx.strokeStyle = `rgba(${stroke.color.r * 255}, ${stroke.color.g * 255}, ${stroke.color.b * 255}, ${stroke.color.a || 1})`;
          ctx.lineWidth = node.strokeWeight;
          ctx.strokeRect(node.x, node.y, node.width, node.height);
        }
        break;

      case 'ELLIPSE':
        if (node.fills && node.fills[0]) {
          const fill = node.fills[0];
          ctx.fillStyle = `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.color.a || 1})`;
          ctx.beginPath();
          ctx.ellipse(node.x + node.width/2, node.y + node.height/2, node.width/2, node.height/2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'TEXT':
        if (node.characters) {
          ctx.font = `${node.fontWeight || '400'} ${node.fontSize || 16}px ${node.fontFamily || 'Inter'}`;
          if (node.fills && node.fills[0]) {
            const fill = node.fills[0];
            ctx.fillStyle = `rgba(${fill.color.r * 255}, ${fill.color.g * 255}, ${fill.color.b * 255}, ${fill.color.a || 1})`;
          }
          ctx.textAlign = node.textAlignHorizontal?.toLowerCase() as CanvasTextAlign || 'left';
          ctx.fillText(node.characters, node.x, node.y + (node.fontSize || 16));
        }
        break;
    }

    // Draw children
    if (node.children) {
      node.children.forEach(child => drawNode(ctx, child));
    }

    ctx.restore();
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    renderCanvas();
  }, [nodes, zoom, pan]);

  useEffect(() => {
    if (generatedCode) {
      executeCode(generatedCode);
    }
  }, [generatedCode]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetCanvas = () => {
    setNodes([]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const tools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'frame', icon: Square, label: 'Frame' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <button
            onClick={handleResetCanvas}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Reset Canvas"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          {generatedCode && (
            <button
              onClick={() => executeCode(generatedCode)}
              disabled={isExecuting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isExecuting ? 'Executing...' : 'Run Code'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="absolute inset-0 cursor-crosshair"
          style={{ 
            width: '100%', 
            height: '100%',
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Loading overlay */}
        {isExecuting && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Executing code...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between p-2 bg-white border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{nodes.length} objects</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Canvas: 1200 × 800</span>
          <span>KOGA AI Canvas</span>
        </div>
      </div>
    </div>
  );
}