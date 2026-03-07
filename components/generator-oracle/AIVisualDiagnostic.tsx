/**
 * GENERATOR ORACLE - AI VISUAL DIAGNOSTIC CAMERA
 * Captures photos and uses AI vision to analyze and provide solutions
 *
 * CAPABILITIES:
 * - Analyze fault code displays (reads code from controller screen)
 * - Identify damaged components (burnt wires, corroded terminals, etc.)
 * - Read equipment nameplates (extract model, serial, specs)
 * - Diagnose visual symptoms (oil leaks, overheating signs, etc.)
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  RotateCcw,
  Loader2,
  SwitchCamera,
  Zap,
  AlertTriangle,
  CheckCircle,
  Wrench,
  FileText,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

// Analysis result types
interface VisualAnalysisResult {
  success: boolean;
  analysisType: 'fault_code' | 'damaged_component' | 'nameplate' | 'symptom' | 'general';
  confidence: number;

  // What was detected
  detected: {
    description: string;
    items: string[];
  };

  // Fault code analysis (if detected)
  faultCode?: {
    code: string;
    title: string;
    severity: 'warning' | 'critical' | 'shutdown';
    description: string;
  };

  // Equipment info (if nameplate detected)
  equipment?: {
    brand?: string;
    model?: string;
    serial?: string;
    specs?: Record<string, string>;
  };

  // Damage assessment
  damage?: {
    component: string;
    condition: string;
    severity: 'minor' | 'moderate' | 'severe';
  };

  // AI Diagnosis
  diagnosis: {
    summary: string;
    possibleCauses: string[];
    affectedSystems: string[];
  };

  // Solutions - THE MOST IMPORTANT PART
  solutions: {
    immediate: {
      title: string;
      steps: string[];
      priority: 'high' | 'medium' | 'low';
    }[];
    repair: {
      title: string;
      steps: string[];
      tools: string[];
      estimatedTime: string;
      skillLevel: 'basic' | 'intermediate' | 'advanced';
    }[];
    preventive: string[];
  };

  // Parts needed
  partsNeeded?: {
    name: string;
    partNumber?: string;
    quantity: number;
    estimated_cost?: string;
  }[];

  // Safety warnings
  safetyWarnings: string[];
}

interface AIVisualDiagnosticProps {
  onAnalysisComplete?: (result: VisualAnalysisResult) => void;
  onClose?: () => void;
}

export default function AIVisualDiagnostic({ onAnalysisComplete, onClose }: AIVisualDiagnosticProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    diagnosis: true,
    solutions: true,
    parts: false,
  });

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
      } catch (err) {
        if (mounted) {
          setError('Camera access denied. Please enable camera permissions or upload an image.');
        }
      }
      setIsLoading(false);
    }

    initCamera();

    return () => {
      mounted = false;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  // Switch camera
  const switchCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stream]);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Stop camera after capture
    stream?.getTracks().forEach(track => track.stop());
  }, [stream]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCapturedImage(dataUrl);
      stream?.getTracks().forEach(track => track.stop());
    };
    reader.readAsDataURL(file);
  }, [stream]);

  // Analyze captured image with AI
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/generator-oracle/ai-visual-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.result);
        onAnalysisComplete?.(data.result);
      } else {
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to analyze image. Please check your connection.');
    }

    setIsAnalyzing(false);
  }, [capturedImage, onAnalysisComplete]);

  // Retake photo
  const retake = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setFacingMode('environment');
  }, []);

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Severity colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'shutdown':
      case 'severe':
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'critical':
      case 'moderate':
      case 'medium':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      default:
        return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Visual Diagnostic</h2>
            <p className="text-xs text-slate-400">Capture & Analyze - Get Instant Solutions</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Instructions */}
        {!capturedImage && !analysisResult && (
          <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <p className="text-sm text-cyan-300 font-medium mb-2">What can AI analyze?</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>- Controller display showing fault codes</li>
              <li>- Damaged components (burnt wires, corroded terminals)</li>
              <li>- Equipment nameplates (model, serial, specs)</li>
              <li>- Visual symptoms (oil leaks, overheating, smoke damage)</li>
            </ul>
          </div>
        )}

        {/* Camera/Image View */}
        {!analysisResult && (
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <canvas ref={canvasRef} className="hidden" />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            )}

            {error && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Camera className="w-12 h-12 text-slate-500 mb-3" />
                <p className="text-slate-400 mb-4">{error}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image Instead
                </button>
              </div>
            )}

            {!capturedImage && !error && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
            )}

            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            )}

            {/* Analyzing overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 mb-4"
                />
                <p className="text-cyan-400 font-medium">AI Analyzing Image...</p>
                <p className="text-slate-400 text-sm mt-1">Identifying faults and generating solutions</p>
              </div>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Camera Controls */}
        {!capturedImage && !analysisResult && !error && (
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={switchCamera}
              className="p-3 bg-slate-700 rounded-full text-white hover:bg-slate-600"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Camera className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-slate-700 rounded-full text-white hover:bg-slate-600"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Captured Image Controls */}
        {capturedImage && !analysisResult && !isAnalyzing && (
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={retake}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <motion.button
              onClick={analyzeImage}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-5 h-5" />
              Analyze with AI
            </motion.button>
          </div>
        )}

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Detection Summary */}
              <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">Analysis Complete ({analysisResult.confidence}% confidence)</p>
                    <p className="text-slate-300 text-sm mt-1">{analysisResult.detected.description}</p>
                  </div>
                </div>
              </div>

              {/* Fault Code Detected */}
              {analysisResult.faultCode && (
                <div className={`p-4 rounded-xl border ${getSeverityColor(analysisResult.faultCode.severity)}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-mono font-bold text-lg">{analysisResult.faultCode.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded uppercase">{analysisResult.faultCode.severity}</span>
                  </div>
                  <p className="font-medium mb-1">{analysisResult.faultCode.title}</p>
                  <p className="text-sm opacity-80">{analysisResult.faultCode.description}</p>
                </div>
              )}

              {/* Diagnosis Section */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <button
                  onClick={() => toggleSection('diagnosis')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Diagnosis</span>
                  </div>
                  {expandedSections.diagnosis ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedSections.diagnosis && (
                  <div className="p-4 pt-0 space-y-3">
                    <p className="text-slate-300">{analysisResult.diagnosis.summary}</p>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Possible Causes:</p>
                      <ul className="space-y-1">
                        {analysisResult.diagnosis.possibleCauses.map((cause, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-amber-400 mt-1">-</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Solutions Section - THE MOST IMPORTANT */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30 overflow-hidden">
                <button
                  onClick={() => toggleSection('solutions')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30"
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">Solutions & Repair Steps</span>
                  </div>
                  {expandedSections.solutions ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedSections.solutions && (
                  <div className="p-4 pt-0 space-y-4">
                    {/* Immediate Actions */}
                    {analysisResult.solutions.immediate.map((action, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(action.priority)}`}>
                        <p className="font-medium mb-2">{action.title}</p>
                        <ol className="space-y-1">
                          {action.steps.map((step, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">{j + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}

                    {/* Repair Procedures */}
                    {analysisResult.solutions.repair.map((repair, i) => (
                      <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-white">{repair.title}</p>
                          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                            {repair.estimatedTime} - {repair.skillLevel}
                          </span>
                        </div>
                        <ol className="space-y-2 mb-3">
                          {repair.steps.map((step, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="font-mono text-xs bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">{j + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        {repair.tools.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-slate-400">Tools:</span>
                            {repair.tools.map((tool, j) => (
                              <span key={j} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">{tool}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Parts Needed */}
              {analysisResult.partsNeeded && analysisResult.partsNeeded.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('parts')}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🛒</span>
                      <span className="font-medium text-white">Parts Needed ({analysisResult.partsNeeded.length})</span>
                    </div>
                    {expandedSections.parts ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.parts && (
                    <div className="p-4 pt-0">
                      <div className="space-y-2">
                        {analysisResult.partsNeeded.map((part, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{part.name}</p>
                              {part.partNumber && <p className="text-xs text-slate-400">P/N: {part.partNumber}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-cyan-400">Qty: {part.quantity}</p>
                              {part.estimated_cost && <p className="text-xs text-slate-400">{part.estimated_cost}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Safety Warnings */}
              {analysisResult.safetyWarnings.length > 0 && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-red-400">Safety Warnings</span>
                  </div>
                  <ul className="space-y-1">
                    {analysisResult.safetyWarnings.map((warning, i) => (
                      <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                        <span className="text-red-400">!</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* New Analysis Button */}
              <button
                onClick={retake}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600"
              >
                <Camera className="w-5 h-5" />
                Analyze Another Image
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
