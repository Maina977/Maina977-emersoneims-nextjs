/**
 * GENERATOR ORACLE - MEDIA SERVICE
 * Handles photo/video capture, storage, and retrieval
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface MediaFile {
  id: string;
  type: 'photo' | 'video';
  dataUrl: string;
  thumbnail?: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For video, in seconds
  capturedAt: string;
  diagnosisId?: string;
  metadata?: Record<string, unknown>;
}

export interface MediaUploadResult {
  success: boolean;
  id?: string;
  url?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface CameraConstraints {
  facingMode?: 'user' | 'environment';
  width?: { ideal: number };
  height?: { ideal: number };
  frameRate?: { ideal: number };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if camera is available
 */
export function isCameraAvailable(): boolean {
  return typeof navigator !== 'undefined' &&
         'mediaDevices' in navigator &&
         'getUserMedia' in navigator.mediaDevices;
}

/**
 * Get available cameras
 */
export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  if (!isCameraAvailable()) return [];

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch {
    return [];
  }
}

/**
 * Request camera access
 */
export async function requestCameraAccess(
  constraints: CameraConstraints = {}
): Promise<MediaStream | null> {
  if (!isCameraAvailable()) {
    console.error('Camera not available');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: constraints.facingMode || 'environment', // Back camera by default
        width: constraints.width || { ideal: 1920 },
        height: constraints.height || { ideal: 1080 },
        frameRate: constraints.frameRate || { ideal: 30 },
      },
      audio: false,
    });
    return stream;
  } catch (error) {
    console.error('Failed to access camera:', error);
    return null;
  }
}

/**
 * Request camera with audio (for video recording)
 */
export async function requestCameraWithAudio(
  constraints: CameraConstraints = {}
): Promise<MediaStream | null> {
  if (!isCameraAvailable()) return null;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: constraints.facingMode || 'environment',
        width: constraints.width || { ideal: 1280 },
        height: constraints.height || { ideal: 720 },
        frameRate: constraints.frameRate || { ideal: 30 },
      },
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error('Failed to access camera with audio:', error);
    return null;
  }
}

/**
 * Stop camera stream
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHOTO CAPTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Capture photo from video element
 */
export function capturePhotoFromVideo(
  video: HTMLVideoElement,
  quality: number = 0.9
): { dataUrl: string; blob: Blob } | null {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);

  // Convert to blob
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  return { dataUrl, blob };
}

/**
 * Generate thumbnail from image
 */
export function generateThumbnail(
  dataUrl: string,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate scaled dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO RECORDING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create video recorder
 */
export function createVideoRecorder(
  stream: MediaStream,
  onDataAvailable?: (blob: Blob) => void
): MediaRecorder | null {
  // Check supported mime types
  const mimeTypes = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];

  let selectedMimeType = '';
  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      selectedMimeType = mimeType;
      break;
    }
  }

  if (!selectedMimeType) {
    console.error('No supported video mime type found');
    return null;
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: selectedMimeType,
    videoBitsPerSecond: 2500000, // 2.5 Mbps
  });

  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: selectedMimeType });
    onDataAvailable?.(blob);
  };

  return recorder;
}

/**
 * Convert blob to data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE (IndexedDB)
// ═══════════════════════════════════════════════════════════════════════════════

const MEDIA_STORE = 'oracleMedia';
const MEDIA_DB_VERSION = 1;

let mediaDb: IDBDatabase | null = null;

async function getMediaDb(): Promise<IDBDatabase> {
  if (mediaDb) return mediaDb;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GeneratorOracleMedia', MEDIA_DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      mediaDb = request.result;
      resolve(mediaDb);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        const store = db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
        store.createIndex('diagnosisId', 'diagnosisId', { unique: false });
        store.createIndex('capturedAt', 'capturedAt', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

/**
 * Save media locally
 */
export async function saveMediaLocally(media: MediaFile): Promise<boolean> {
  try {
    const db = await getMediaDb();
    const transaction = db.transaction(MEDIA_STORE, 'readwrite');
    const store = transaction.objectStore(MEDIA_STORE);

    return new Promise((resolve, reject) => {
      const request = store.put(media);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save media locally:', error);
    return false;
  }
}

/**
 * Get media by ID
 */
export async function getMediaById(id: string): Promise<MediaFile | null> {
  try {
    const db = await getMediaDb();
    const transaction = db.transaction(MEDIA_STORE, 'readonly');
    const store = transaction.objectStore(MEDIA_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

/**
 * Get media by diagnosis ID
 */
export async function getMediaByDiagnosisId(diagnosisId: string): Promise<MediaFile[]> {
  try {
    const db = await getMediaDb();
    const transaction = db.transaction(MEDIA_STORE, 'readonly');
    const store = transaction.objectStore(MEDIA_STORE);
    const index = store.index('diagnosisId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(diagnosisId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Delete media by ID
 */
export async function deleteMediaById(id: string): Promise<boolean> {
  try {
    const db = await getMediaDb();
    const transaction = db.transaction(MEDIA_STORE, 'readwrite');
    const store = transaction.objectStore(MEDIA_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return false;
  }
}

/**
 * Get all local media
 */
export async function getAllLocalMedia(): Promise<MediaFile[]> {
  try {
    const db = await getMediaDb();
    const transaction = db.transaction(MEDIA_STORE, 'readonly');
    const store = transaction.objectStore(MEDIA_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD UPLOAD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Upload media to cloud
 */
export async function uploadMediaToCloud(media: MediaFile): Promise<MediaUploadResult> {
  try {
    const response = await fetch('/api/generator-oracle/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: media.id,
        type: media.type,
        dataUrl: media.dataUrl,
        thumbnail: media.thumbnail,
        filename: media.filename,
        mimeType: media.mimeType,
        diagnosisId: media.diagnosisId,
        metadata: media.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate unique media ID
 */
export function generateMediaId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `media-${timestamp}-${random}`;
}

/**
 * Get file extension from mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/webm': 'webm',
    'video/mp4': 'mp4',
  };
  return extensions[mimeType] || 'bin';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compress image
 */
export async function compressImage(
  dataUrl: string,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
