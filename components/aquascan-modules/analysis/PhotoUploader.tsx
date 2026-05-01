'use client';

import React, { useState, useRef } from 'react';

interface PhotoUploaderProps {
  onImageSelected: (file: File) => void;
  isAnalyzing?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onImageSelected, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageSelected(file);
    }
  };

  return (
    <div className="photo-uploader">
      {!preview ? (
        <div 
          className="upload-area"
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#fafafa'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={isAnalyzing}
          />
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
          <p>Click to upload terrain image</p>
          <small>Supports: JPG, PNG (Max 10MB)</small>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
          />
          {!isAnalyzing && (
            <button 
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{ marginTop: '12px' }}
            >
              Change Image
            </button>
          )}
        </div>
      )}
    </div>
  );
};