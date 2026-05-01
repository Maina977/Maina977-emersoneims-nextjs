'use client';

import React, { useState } from 'react';

interface ReportShareProps {
  reportId: string;
  reportUrl: string;
  onShareComplete?: () => void;
}

export const ReportShare: React.FC<ReportShareProps> = ({ reportId, reportUrl, onShareComplete }) => {
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMethod, setShareMethod] = useState<'email' | 'link' | 'social'>('link');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportUrl);
    alert('Link copied to clipboard!');
  };

  const shareViaEmail = async () => {
    if (!email) return;
    setIsSharing(true);
    try {
      // API call to send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Report sent to ${email}`);
      onShareComplete?.();
    } finally {
      setIsSharing(false);
    }
  };

  const shareSocial = (platform: string) => {
    const text = encodeURIComponent('Check out my borehole analysis report!');
    const url = encodeURIComponent(reportUrl);
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Share Report</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <button
          onClick={() => setShareMethod('link')}
          style={{
            padding: '8px 16px',
            backgroundColor: shareMethod === 'link' ? '#4CAF50' : '#f0f0f0',
            color: shareMethod === 'link' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔗 Link
        </button>
        <button
          onClick={() => setShareMethod('email')}
          style={{
            padding: '8px 16px',
            backgroundColor: shareMethod === 'email' ? '#4CAF50' : '#f0f0f0',
            color: shareMethod === 'email' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📧 Email
        </button>
        <button
          onClick={() => setShareMethod('social')}
          style={{
            padding: '8px 16px',
            backgroundColor: shareMethod === 'social' ? '#4CAF50' : '#f0f0f0',
            color: shareMethod === 'social' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🌐 Social
        </button>
      </div>
      
      {shareMethod === 'link' && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label>Shareable Link:</label>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '8px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={reportUrl}
                readOnly
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Anyone with this link can view the report
          </div>
        </div>
      )}
      
      {shareMethod === 'email' && (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              style={{ width: '100%', padding: '8px', marginTop: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button
            onClick={shareViaEmail}
            disabled={!email || isSharing}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSharing ? 'not-allowed' : 'pointer'
            }}
          >
            {isSharing ? 'Sending...' : 'Send Report'}
          </button>
        </div>
      )}
      
      {shareMethod === 'social' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => shareSocial('twitter')}
              style={{
                padding: '12px',
                backgroundColor: '#1DA1F2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              🐦 Twitter
            </button>
            <button
              onClick={() => shareSocial('linkedin')}
              style={{
                padding: '12px',
                backgroundColor: '#0077B5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              🔗 LinkedIn
            </button>
            <button
              onClick={() => shareSocial('whatsapp')}
              style={{
                padding: '12px',
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};