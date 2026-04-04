'use client';

import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  currency: string;
  reportId: string;
  analysisId: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  reportId,
  analysisId,
  customerEmail,
  customerPhone,
  customerName
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'mpesa' | 'flutterwave' | 'paystack'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const providers = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: '📱',
      description: 'Pay with M-Pesa - Instant mobile money',
      countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda']
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: '🌊',
      description: 'Card, Bank Transfer, Mobile Money',
      countries: ['Nigeria', 'Ghana', 'Kenya', 'South Africa']
    },
    {
      id: 'paystack',
      name: 'Paystack',
      icon: '💰',
      description: 'Card, Bank Transfer, USSD',
      countries: ['Nigeria', 'Ghana']
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/v1/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          amount: amount,
          currency: currency,
          report_id: reportId,
          analysis_id: analysisId,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName
        })
      });
      
      const data = await response.json();
      
      if (data.checkout_url) {
        // For Flutterwave/Paystack - redirect to hosted page
        window.location.href = data.checkout_url;
      } else if (data.checkout_request_id) {
        // For M-Pesa - show STK push prompt
        alert('Please check your phone to complete the M-Pesa payment');
        
        // Poll for payment status
        const pollInterval = setInterval(async () => {
          const statusRes = await fetch(`/api/v1/payments/verify/${data.payment_id}`);
          const statusData = await statusRes.json();
          
          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            onSuccess();
            onClose();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Unlock Full Report</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ecc71' }}>
            {currency} {amount.toLocaleString()}
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>
            One-time payment - Lifetime access to full report
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>Select Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {providers.map(provider => (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id as any)}
                style={{
                  padding: '16px',
                  border: selectedProvider === provider.id ? '2px solid #2ecc71' : '1px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedProvider === provider.id ? '#e8f5e9' : 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{provider.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{provider.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{provider.description}</div>
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                      Available in: {provider.countries.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>What you'll get:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>✅ Complete drilling recommendations</li>
            <li>✅ Full water quality treatment plan</li>
            <li>✅ Contamination mitigation strategy</li>
            <li>✅ Financial ROI analysis with payback period</li>
            <li>✅ Professional PDF report download</li>
            <li>✅ Printable quotation document</li>
            <li>✅ 5-year yield projection charts</li>
          </ul>
        </div>
        
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1
          }}
        >
          {isProcessing ? 'Processing...' : `Pay ${currency} ${amount.toLocaleString()} - Unlock Full Report`}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#999' }}>
          Secure payment powered by {selectedProvider.toUpperCase()}
        </div>
      </div>
    </div>
  );
};