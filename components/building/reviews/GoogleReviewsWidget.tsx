'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

// Sample reviews - In production, these would come from Google Places API
const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'John Kamau',
    rating: 5,
    text: 'Excellent service! They installed our 100kVA generator and the team was professional throughout. Highly recommend their services.',
    date: '2024-12-15',
    avatar: ''
  },
  {
    id: '2',
    author: 'Mary Wanjiku',
    rating: 5,
    text: 'Very knowledgeable team. They helped us choose the right solar system for our factory and the installation was flawless.',
    date: '2024-11-28',
    avatar: ''
  },
  {
    id: '3',
    author: 'Ahmed Hassan',
    rating: 5,
    text: 'Fast response time for emergency repair. Our generator broke down on a weekend and they had it running within hours.',
    date: '2024-11-15',
    avatar: ''
  },
  {
    id: '4',
    author: 'Sarah Ochieng',
    rating: 4,
    text: 'Good service overall. The maintenance contract has saved us a lot of money compared to reactive repairs.',
    date: '2024-10-20',
    avatar: ''
  },
  {
    id: '5',
    author: 'Peter Njoroge',
    rating: 5,
    text: 'Professional installation of our UPS system. They also trained our staff on proper usage. Great experience!',
    date: '2024-10-05',
    avatar: ''
  },
  {
    id: '6',
    author: 'Grace Muthoni',
    rating: 5,
    text: 'The solar installation has cut our electricity bill by 70%. Very happy with the results!',
    date: '2024-09-18',
    avatar: ''
  }
];

interface GoogleReviewsWidgetProps {
  showHeader?: boolean;
  maxReviews?: number;
  compact?: boolean;
}

export default function GoogleReviewsWidget({ 
  showHeader = true, 
  maxReviews = 6,
  compact = false 
}: GoogleReviewsWidgetProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Simulate loading reviews
    // In production, this would fetch from Google Places API
    const timer = setTimeout(() => {
      const displayReviews = SAMPLE_REVIEWS.slice(0, maxReviews);
      setReviews(displayReviews);
      const avg = displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length;
      setAverageRating(avg);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [maxReviews]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className={`${compact ? '' : 'py-8'}`}>
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Reviews
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
              <span className="text-gray-400">({reviews.length} reviews)</span>
            </div>
          </div>
          <a
            href="https://g.page/r/emersoneims/review"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Write a Review
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      <div className={`grid ${compact ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-yellow-500/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {getInitials(review.author)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white truncate">{review.author}</h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(review.date)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>

            <p className="text-gray-300 mt-4 text-sm leading-relaxed">
              "{review.text}"
            </p>

            {/* Google Icon */}
            <div className="flex items-center justify-end mt-4">
              <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      {!compact && (
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/place/Emerson+EIMS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-2"
          >
            View All Reviews on Google
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
