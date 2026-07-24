'use client';

/**
 * Product Review Submission Form
 * Collects verified purchase reviews with images
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  orderId: string;
  partCode: string;
  partName: string;
  customerId: string;
  customerName: string;
}

export default function ReviewForm({
  orderId,
  partCode,
  partName,
  customerId,
  customerName
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In production, upload to cloud storage (S3, Firebase, etc)
    // For now, use data URLs
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setImages(prev => [...prev, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          partCode,
          partName,
          customerId,
          customerName,
          rating: parseInt(rating.toString()),
          title,
          body,
          images
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmitted(true);
      setTimeout(() => {
        // Reset form
        setRating(5);
        setTitle('');
        setBody('');
        setImages([]);
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-bold text-green-400 mb-2">Thank You!</h3>
        <p className="text-gray-300">Your review has been submitted and will appear after moderation.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Part Info */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
        <p className="text-gray-500 text-sm">Reviewing</p>
        <p className="text-white font-bold">{partName}</p>
        <p className="text-xs text-gray-600 mt-1">{partCode}</p>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-white font-semibold mb-3">Rating</label>
        <div className="flex gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-gray-500'}`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-white font-semibold mb-2">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience in 5-100 characters"
          maxLength={100}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
      </div>

      {/* Review Body */}
      <div>
        <label className="block text-white font-semibold mb-2">Your Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience (10-2000 characters). What did you like? What could be improved?"
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{body.length}/2000</p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-white font-semibold mb-2">Add Photos (Optional)</label>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-slate-600 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-white font-semibold">Click to upload photos</p>
            <p className="text-xs text-gray-500 mt-1">Max 3 images, 5MB each</p>
          </label>
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`Review ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || title.length < 5 || body.length < 10}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your review will appear after moderation (usually within 24 hours)
      </p>
    </form>
  );
}
