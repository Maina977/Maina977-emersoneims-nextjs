'use client';

/**
 * ADMIN REVIEW MODERATION DASHBOARD
 * Moderation workflow for customer reviews
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Review } from '@/lib/reviews/reviewService';

export default function ReviewModerationDashboard() {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch('/api/reviews/moderation/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setActionInProgress(true);
    try {
      const response = await fetch('/api/reviews/moderation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId })
      });

      if (response.ok) {
        setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!rejectionReason.trim()) return;

    setActionInProgress(true);
    try {
      const response = await fetch('/api/reviews/moderation/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, reason: rejectionReason })
      });

      if (response.ok) {
        setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        setSelectedReview(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading reviews...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">Review Moderation</h1>
          <p className="text-gray-400 mt-1">
            {pendingReviews.length} reviews pending approval
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Reviews List */}
        <div className="lg:col-span-2">
          {pendingReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-4xl mb-3">✅</p>
              <h3 className="text-xl font-bold text-green-400">All Caught Up!</h3>
              <p className="text-gray-400 mt-2">All pending reviews have been moderated.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedReview(review)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedReview?.id === review.id
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-bold">{review.title}</p>
                      <p className="text-xs text-gray-500">{review.partName}</p>
                    </div>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{review.body}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {review.customerName}
                    </span>
                    <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                      {new Date(review.createdAt).toLocaleDateString('en-KE')}
                    </span>
                  </div>

                  {/* Spam Indicators */}
                  {review.isSuspicious && (
                    <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs">
                      ⚠️ Flagged as potentially suspicious
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Review Detail & Actions */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 sticky top-6"
          >
            <div className="space-y-6">
              {/* Review Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{selectedReview.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-400">{'★'.repeat(selectedReview.rating)}</span>
                  <span className="text-gray-500 text-sm">({selectedReview.rating}/5)</span>
                </div>
                <p className="text-sm text-gray-300 mb-4">{selectedReview.body}</p>

                {/* Part & Customer Info */}
                <div className="bg-slate-800 rounded p-3 mb-4 text-sm">
                  <p className="text-gray-500">Part</p>
                  <p className="text-white font-semibold">{selectedReview.partName}</p>
                  <p className="text-xs text-gray-600">{selectedReview.partCode}</p>
                </div>

                <div className="bg-slate-800 rounded p-3 mb-4 text-sm">
                  <p className="text-gray-500">Reviewer</p>
                  <p className="text-white font-semibold">{selectedReview.customerName}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(selectedReview.createdAt).toLocaleString('en-KE')}
                  </p>
                </div>

                {/* Images */}
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Review Images</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedReview.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Review ${i + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Spam Analysis */}
                {selectedReview.isSuspicious && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded p-3 mb-4 text-red-400 text-sm">
                    <p className="font-semibold mb-2">Spam Detection Alert</p>
                    <ul className="space-y-1 text-xs">
                      {selectedReview.body.match(/[!?]{3,}/g) && <li>• Excessive punctuation detected</li>}
                      {selectedReview.body === selectedReview.body.toUpperCase() && <li>• All caps detected</li>}
                      {/\b(casino|bitcoin|poker|crypto)\b/i.test(selectedReview.body) && <li>• Suspicious keywords</li>}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rejection Reason (if rejecting) */}
              {actionInProgress === false && (
                <>
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleApprove(selectedReview.id)}
                      disabled={actionInProgress}
                      className="w-full py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition disabled:opacity-50"
                    >
                      ✓ Approve Review
                    </button>

                    <button
                      onClick={() => {
                        if (rejectionReason) {
                          handleReject(selectedReview.id);
                        }
                      }}
                      disabled={actionInProgress || !rejectionReason.trim()}
                      className="w-full py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition disabled:opacity-50"
                    >
                      ✕ Reject Review
                    </button>
                  </div>

                  {/* Rejection Reason Input */}
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (e.g., 'Spam', 'Inappropriate language', 'Fake review')"
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500">{rejectionReason.length}/200</p>
                </>
              )}

              {actionInProgress && (
                <div className="text-center py-4">
                  <p className="text-gray-400">Processing...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
