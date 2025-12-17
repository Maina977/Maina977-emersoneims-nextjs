'use client';

/**
 * CUSTOMER REVIEWS SYSTEM
 * Reviews with photos/videos and ratings
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/media/OptimizedImage';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  photo?: string;
  video?: string;
  date: string;
  verified: boolean;
}

interface CustomerReviewsProps {
  reviews: Review[];
  productId?: string;
}

export default function CustomerReviews({ reviews, productId }: CustomerReviewsProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3'>('all');

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.rating >= parseInt(filter);
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="w-full">
      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 mb-8 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(averageRating)
                        ? 'text-brand-gold'
                        : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-white text-xl font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-400">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', '5', '4', '3'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-brand-gold text-black font-semibold'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : `${f}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-brand-gold/50 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedReview(review)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{review.name}</h3>
                  {review.verified && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{review.location}</p>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < review.rating ? 'text-brand-gold' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-white mb-4">{review.text}</p>

            {review.photo && (
              <div className="mb-4">
                <OptimizedImage
                  src={review.photo}
                  alt={`Review by ${review.name}`}
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            )}

            {review.video && (
              <div className="mb-4">
                <video
                  src={review.video}
                  controls
                  className="rounded-lg w-full"
                >
                  Your browser does not support video.
                </video>
              </div>
            )}

            <div className="text-xs text-gray-500">{review.date}</div>
          </motion.div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedReview(null)}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="float-right text-white text-2xl hover:text-gray-400"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">
              Review by {selectedReview.name}
            </h3>
            {/* Full review content */}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

