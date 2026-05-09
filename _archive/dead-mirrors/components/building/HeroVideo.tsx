'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './HeroVideo.css';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video load events
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    const handlePlaying = () => {
      setIsVideoPlaying(true);
    };

    const handleWaiting = () => {
      // Video is buffering - could show loading indicator
    };

    const handleError = () => {
      console.error('Video failed to load');
      // Gracefully degrade - poster image will show
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('error', handleError);

    // Attempt to play video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsVideoPlaying(true))
        .catch(() => {
          // Autoplay was prevented, user interaction required
          console.log('Autoplay prevented');
        });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="video-container">
          {/* Loading State - Shows until video is ready */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-amber-400 text-sm font-mono tracking-wider">LOADING...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            id="heroVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/og-image.jpg"
            className={`hero-video transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <source
              src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4"
              type="video/mp4"
            />
            {/* Fallback message for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>

          {/* Cinematic overlays (defined in HeroVideo.css) */}
          <div className="cinematic-effects" aria-hidden="true">
            <div className="noise" />
            <div className="scanlines" />
          </div>
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="badge-container">
              <span className="badge">PREMIUM ENERGY SOLUTIONS</span>
            </div>

            <h1 className="hero-title">
              <span className="block text-white">RELIABLE POWER</span>
              <span className="block text-gradient">WITHOUT LIMITS</span>
            </h1>

            <p className="hero-description">
              Engineering excellence for East Africa's most critical infrastructure.
              <br className="hidden md:block" />
              From industrial generators to advanced solar grids.
            </p>

            <div className="cta-group">
              <Link href="/contact#assessment" className="btn-primary group">
                <span className="relative z-10">REQUEST SITE ASSESSMENT</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Link>
              <Link href="/contact#technical" className="btn-secondary group">
                <span className="relative z-10">SPEAK TO TECHNICAL TEAM</span>
                <span className="arrow group-hover:translate-x-1 transition-transform inline-block ml-2">→</span>
              </Link>
            </div>

            <div>
              <Link href="/brands" className="inline-flex items-center text-xs tracking-[0.24em] text-white/70 hover:text-white transition uppercase">
                Explore Brands
              </Link>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>SCROLL</span>
        </div>
      </section>
    </>
  );
}
