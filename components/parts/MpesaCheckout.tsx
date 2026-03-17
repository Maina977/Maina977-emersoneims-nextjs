'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
  Smartphone,
  Shield,
  Clock
} from 'lucide-react';

interface CartItem {
  partNo: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
}

interface MpesaCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onClearCart: () => void;
}

type CheckoutStep = 'review' | 'phone' | 'processing' | 'success' | 'error';

export default function MpesaCheckout({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onClearCart
}: MpesaCheckoutProps) {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // M-Pesa business details
  const MPESA_PHONE = '0793573208';
  const MPESA_NAME = 'EmersonEIMS';

  // Validate Kenyan phone number
  const validatePhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    // Kenyan phone formats: 07XX, 01XX, 254...
    const kenyanRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    return kenyanRegex.test(cleaned);
  };

  // Format phone for M-Pesa
  const formatPhoneForMpesa = (phone: string): string => {
    const cleaned = phone.replace(/[\s-+]/g, '');
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    return '254' + cleaned;
  };

  // Handle phone input
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError('');
  };

  // Process to next step
  const handleProceedToPayment = () => {
    if (!customerName.trim()) {
      setPhoneError('Please enter your name');
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid Kenyan phone number');
      return;
    }
    if (!deliveryLocation.trim()) {
      setPhoneError('Please enter delivery location');
      return;
    }
    setStep('processing');

    // Simulate STK push initiation (in production, this would call your backend)
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  // Generate WhatsApp order message
  const generateOrderMessage = () => {
    const itemsList = cartItems.map(item =>
      `- ${item.name} (${item.partNo}) x${item.quantity} @ KES ${item.price.toLocaleString()}`
    ).join('\n');

    return encodeURIComponent(
`*NEW SPARE PARTS ORDER*

*Customer:* ${customerName}
*Phone:* ${formatPhoneForMpesa(phoneNumber)}
*Delivery Location:* ${deliveryLocation}
${orderNote ? `*Note:* ${orderNote}` : ''}

*ORDER ITEMS:*
${itemsList}

*TOTAL:* KES ${cartTotal.toLocaleString()}

*Payment Method:* M-Pesa
*M-Pesa Number:* ${MPESA_PHONE}

Please process this order. Customer will pay via M-Pesa to ${MPESA_PHONE}.`
    );
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('review');
        setPhoneError('');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <img
                    src="/images/mpesa-logo.png"
                    alt="M-Pesa"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Smartphone className="w-6 h-6 text-green-500 hidden" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">M-Pesa Checkout</h2>
                  <p className="text-sm text-gray-400">Secure mobile payment</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Review Order */}
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                  {/* Items List */}
                  <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-2">
                    {cartItems.map((item) => (
                      <div key={item.partNo} className="flex justify-between items-start bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs">{item.partNo} • {item.brand}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-green-400 font-semibold">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white">KES {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-300">Delivery</span>
                      <span className="text-gray-400 text-sm">Calculated at confirmation</span>
                    </div>
                    <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-2xl font-bold text-green-400">
                        KES {cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* M-Pesa Info */}
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">Secure M-Pesa Payment</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Pay directly to: <span className="text-green-400 font-mono">{MPESA_PHONE}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Business Name: {MPESA_NAME}
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('phone')}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Enter Phone & Details */}
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Your Details</h3>

                  {/* Customer Name */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">M-Pesa Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="0712 345 678"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          phoneError ? 'border-red-500' : 'border-gray-700 focus:border-green-500'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {phoneError}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      We&apos;ll send M-Pesa payment instructions to this number
                    </p>
                  </div>

                  {/* Delivery Location */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Delivery Location *</label>
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g., Westlands, Nairobi"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Order Note */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Order Note (Optional)</label>
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Any special instructions..."
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                    <h4 className="text-green-400 font-semibold mb-2">Payment Instructions</h4>
                    <ol className="text-gray-300 text-sm space-y-1">
                      <li>1. Go to M-Pesa on your phone</li>
                      <li>2. Select &quot;Send Money&quot;</li>
                      <li>3. Enter: <span className="text-green-400 font-mono">{MPESA_PHONE}</span></li>
                      <li>4. Amount: <span className="text-green-400">KES {cartTotal.toLocaleString()}</span></li>
                      <li>5. Complete payment & confirm below</li>
                    </ol>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center mb-4 p-3 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Order Total</span>
                    <span className="text-xl font-bold text-green-400">
                      KES {cartTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('review')}
                      className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <Loader2 className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing Order...</h3>
                  <p className="text-gray-400">Please complete M-Pesa payment</p>
                  <p className="text-green-400 font-mono text-lg mt-2">{MPESA_PHONE}</p>
                  <p className="text-gray-500 text-sm mt-4">
                    <Clock className="w-4 h-4 inline mr-1" />
                    This may take a moment
                  </p>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Order Placed!</h3>
                  <p className="text-gray-400 mb-4">
                    Your order has been received. Complete M-Pesa payment to confirm.
                  </p>

                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
                    <p className="text-gray-300 text-sm mb-2">
                      <strong>Customer:</strong> {customerName}
                    </p>
                    <p className="text-gray-300 text-sm mb-2">
                      <strong>Phone:</strong> {phoneNumber}
                    </p>
                    <p className="text-gray-300 text-sm mb-2">
                      <strong>Delivery:</strong> {deliveryLocation}
                    </p>
                    <p className="text-gray-300 text-sm">
                      <strong>Total:</strong> <span className="text-green-400">KES {cartTotal.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 mb-6">
                    <p className="text-green-400 font-semibold mb-2">Pay via M-Pesa:</p>
                    <p className="text-2xl font-mono text-white">{MPESA_PHONE}</p>
                    <p className="text-gray-400 text-sm mt-1">{MPESA_NAME}</p>
                  </div>

                  {/* WhatsApp Confirmation */}
                  <a
                    href={`https://wa.me/254${MPESA_PHONE.substring(1)}?text=${generateOrderMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all mb-3"
                  >
                    Confirm Order via WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      onClearCart();
                      onClose();
                    }}
                    className="w-full py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              )}

              {/* Step 5: Error */}
              {step === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
                  <p className="text-gray-400 mb-6">
                    Something went wrong. Please try again or contact support.
                  </p>
                  <button
                    onClick={() => setStep('phone')}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
