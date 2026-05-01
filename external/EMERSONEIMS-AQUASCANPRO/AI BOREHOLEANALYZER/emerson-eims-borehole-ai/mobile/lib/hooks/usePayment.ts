import { useState } from 'react';
import api from '../api/client';

export const usePayment = () => {
  const [processing, setProcessing] = useState(false);

  const initializeMpesaPayment = async (amount: number, phoneNumber: string) => {
    setProcessing(true);
    try {
      const response = await api.post('/api/v1/payments/initialize', {
        amount,
        payment_method: 'mpesa',
        phone_number: phoneNumber
      });
      return response.data;
    } finally {
      setProcessing(false);
    }
  };

  const initializeStripePayment = async (amount: number) => {
    setProcessing(true);
    try {
      const response = await api.post('/api/v1/payments/initialize', {
        amount,
        payment_method: 'stripe'
      });
      window.location.href = response.data.checkout_url;
      return response.data;
    } finally {
      setProcessing(false);
    }
  };

  return { initializeMpesaPayment, initializeStripePayment, processing };
};