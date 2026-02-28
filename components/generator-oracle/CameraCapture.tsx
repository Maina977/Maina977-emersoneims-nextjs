/**
 * GENERATOR ORACLE - CAMERA CAPTURE
 * Photo and video capture component for diagnostics
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Video,
  X,
  RotateCcw,
  Check,
  Trash2,
  Download,
  Play,
  Pause,
  StopCircle,
  SwitchCamera,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
} from 'lucide-react';
import {
  isCameraAvailable,
  requestCameraAccess,
  requestCameraWithAudio,
  stopCameraStream,
  capturePhotoFromVideo,
  generateThumbnail,
  createVideoRecorder,
  blobToDataUrl,
  generateMediaId,
  getExtensionFromMimeType,
  formatFileSize,
  compressImage,
  type MediaFile,
} from '@/lib/generator-oracle/mediaService';

interface CameraCaptureProps {
  onCapture: (media: MediaFile) => void;
  onClose: () => void;
  diagnosisId?: string;
  mode?: 'photo' | 'video' | 'both';
  maxVideoDuration?: number; // seconds
}

export default function CameraCapture({
  onCapture,
  onClose,
  diagnosisId,
  mode = 'both',
  maxVideoDuration = 60,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<MediaFile | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Video recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      if (!isCameraAvailable()) {
        setError('Camera not available on this device');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const mediaStream = mode === 'video' || mode === 'both'
        ? await requestCameraWithAudio({ facingMode })
        : await requestCameraAccess({ facingMode });

      if (!mounted) {
        stopCameraStream(mediaStream);
        return;
      }

      if (mediaStream) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setError('Failed to access camera. Please check permissions.');
      }

      setIsLoading(false);
    }

    initCamera();

    return () => {
      mounted = false;
      stopCameraStream(stream);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [facingMode]);

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCameraStream(stream);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;

    const result = capturePhotoFromVideo(videoRef.current);
    if (!result) {
      setError('Failed to capture photo');
      return;
    }

    // Compress and generate thumbnail
    const compressed = await compressImage(result.dataUrl, 1920, 0.85);
    const thumbnail = await generateThumbnail(compressed);

    const media: MediaFile = {
      id: generateMediaId(),
      type: 'photo',
      dataUrl: compressed,
      thumbnail,
      filename: `photo-${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
      size: Math.round(compressed.length * 0.75), // Approximate size
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
      capturedAt: new Date().toISOString(),
      diagnosisId,
    };

    setCapturedMedia(media);
    stopCameraStream(stream);
  }, [stream, diagnosisId]);

  // Start video recording
  const startRecording = useCallback(() => {
    if (!stream) return;

    const mediaRecorder = createVideoRecorder(stream, async (blob) => {
      const dataUrl = await blobToDataUrl(blob);
      const thumbnail = videoRef.current
        ? capturePhotoFromVideo(videoRef.current)?.dataUrl || ''
        : '';

      const media: MediaFile = {
        id: generateMediaId(),
        type: 'video',
        dataUrl,
        thumbnail: thumbnail ? await generateThumbnail(thumbnail) : undefined,
        filename: `video-${Date.now()}.${getExtensionFromMimeType(blob.type)}`,
        mimeType: blob.type,
        size: blob.size,
        duration: recordingTime,
        capturedAt: new Date().toISOString(),
        diagnosisId,
      };

      setCapturedMedia(media);
      stopCameraStream(stream);
    });

    if (!mediaRecorder) {
      setError('Video recording not supported');
      return;
    }

    mediaRecorder.start(1000); // Collect data every second
    setRecorder(mediaRecorder);
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxVideoDuration - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [stream, diagnosisId, maxVideoDuration]);

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  }, [recorder]);

  // Retake
  const retake = useCallback(() => {
    setCapturedMedia(null);
    setFacingMode('environment');
  }, []);

  // Confirm capture
  const confirmCapture = useCallback(() => {
    if (capturedMedia) {
      onCapture(capturedMedia);
    }
  }, [capturedMedia, onCapture]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-lg">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-medium">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              {formatTime(recordingTime)} / {formatTime(maxVideoDuration)}
            </span>
          ) : capturedMedia ? (
            'Preview'
          ) : (
            mode === 'both' ? 'Photo / Video' : mode === 'photo' ? 'Photo' : 'Video'
          )}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">{error}</p>
              <button
                onClick={() => setFacingMode('environment')}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Camera preview */}
        {!capturedMedia && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* Captured media preview */}
        {capturedMedia && (
          <div className="w-full h-full flex items-center justify-center bg-black">
            {capturedMedia.type === 'photo' ? (
              <img
                src={capturedMedia.dataUrl}
                alt="Captured"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={capturedMedia.dataUrl}
                controls
                className="max-w-full max-h-full"
              />
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/50">
        {!capturedMedia ? (
          // Capture controls
          <div className="flex items-center justify-center gap-8">
            {/* Switch camera */}
            <button
              onClick={switchCamera}
              disabled={isRecording}
              className="p-3 text-white hover:bg-white/10 rounded-full disabled:opacity-50"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>

            {/* Capture button */}
            {mode !== 'video' && !isRecording && (
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <div className="w-14 h-14 border-2 border-black rounded-full" />
              </button>
            )}

            {/* Record button */}
            {mode !== 'photo' && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {isRecording ? (
                  <StopCircle className="w-8 h-8 text-white" />
                ) : (
                  <Video className="w-8 h-8 text-white" />
                )}
              </button>
            )}

            {/* Placeholder for symmetry */}
            <div className="w-12" />
          </div>
        ) : (
          // Preview controls
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retake}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </button>
            <button
              onClick={confirmCapture}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-500"
            >
              <Check className="w-5 h-5" />
              Use {capturedMedia.type === 'photo' ? 'Photo' : 'Video'}
            </button>
          </div>
        )}

        {/* File info */}
        {capturedMedia && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            {capturedMedia.type === 'photo' ? (
              <span>{capturedMedia.width} x {capturedMedia.height}</span>
            ) : (
              <span>{formatTime(capturedMedia.duration || 0)}</span>
            )}
            {' • '}
            <span>{formatFileSize(capturedMedia.size)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
