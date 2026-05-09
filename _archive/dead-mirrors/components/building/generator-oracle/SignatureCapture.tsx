/**
 * GENERATOR ORACLE - SIGNATURE CAPTURE
 * Canvas-based signature capture for diagnostic reports
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pen, Eraser, Check, X, RotateCcw } from 'lucide-react';

interface SignatureCaptureProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

export default function SignatureCapture({
  onSave,
  onCancel,
  title = 'Sign Here',
  description = 'Use your finger or stylus to sign below',
  width = 400,
  height = 200,
}: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw signature line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();

    // Add "X" mark
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.fillText('X', 25, height - 45);
  }, [width, height]);

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  }, [getCoordinates, strokeColor, strokeWidth]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, getCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear and redraw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw signature line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();

    // Redraw "X" mark
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.fillText('X', 25, height - 45);

    setHasSignature(false);
  }, [width, height]);

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  }, [hasSignature, onSave]);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {/* Canvas */}
      <div className="relative bg-white rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none cursor-crosshair w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Stroke width */}
          <button
            onClick={() => setStrokeWidth(2)}
            className={`p-2 rounded ${strokeWidth === 2 ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            title="Thin stroke"
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStrokeWidth(4)}
            className={`p-2 rounded ${strokeWidth === 4 ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            title="Thick stroke"
          >
            <Pen className="w-5 h-5" />
          </button>

          {/* Color options */}
          <div className="flex gap-1 ml-2">
            {['#000000', '#1e40af', '#166534'].map(color => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  strokeColor === color ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Clear */}
          <button
            onClick={clearSignature}
            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-600 ml-2"
            title="Clear signature"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={saveSignature}
            disabled={!hasSignature}
            className={`flex items-center gap-1 px-3 py-2 rounded text-white ${
              hasSignature
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
