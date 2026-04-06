'use client';

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - FUTURISTIC INTERFACE                                    ║
 * ║   AI-Powered Solar Design Platform - Better Than Aurora Solar               ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sun, Zap, Battery, Calculator, FileText, Download, Mic, MicOff,
  CheckCircle2, AlertTriangle, Play, ArrowRight, ChevronDown,
  Settings, Award, Shield, Clock, Activity, DollarSign, TrendingUp,
  MapPin, Thermometer, CloudSun, Grid, Cable, Gauge, BookOpen,
  BarChart3, PieChart, Cpu, Satellite, Wind, Globe, Sparkles,
  Building2, Eye, RotateCw, Box, Layers, Lock, Upload, Camera,
  Video, FileSpreadsheet, Leaf, Droplets, Home, Factory, Workflow
} from 'lucide-react';

// ============================================================================
// ANIMATED SOLAR WORLD BACKGROUND
// ============================================================================

const SolarWorldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; type: 'star' | 'energy' | 'sun';
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.9 ? 'sun' : Math.random() > 0.7 ? 'energy' : 'star'
      });
    }

    // Energy flow lines
    const energyLines: Array<{ x: number; y: number; angle: number; speed: number; length: number }> = [];
    for (let i = 0; i < 15; i++) {
      energyLines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        length: 50 + Math.random() * 100
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw central sun glow
      const centerX = canvas.width * 0.15;
      const centerY = canvas.height * 0.3;
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
      sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.15)');
      sunGlow.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        if (p.type === 'sun') {
          const pulse = Math.sin(frame * 0.05) * 2;
          ctx.arc(p.x, p.y, p.size + pulse + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + Math.sin(frame * 0.1) * 0.3})`;
        } else if (p.type === 'energy') {
          ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
        }
        ctx.fill();
      });

      // Draw energy flow lines
      energyLines.forEach(line => {
        const progress = (frame * line.speed) % (canvas.width + line.length);
        const startX = progress - line.length;
        const endX = progress;

        const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(startX, line.y);
        ctx.lineTo(endX, line.y);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

// ============================================================================
// 3D SOLAR PANEL COMPONENT
// ============================================================================

const SolarPanel3D: React.FC<{ active: boolean; index: number }> = ({ active, index }) => {
  return (
    <div
      style={{
        width: '60px',
        height: '90px',
        background: active
          ? 'linear-gradient(145deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)'
          : 'linear-gradient(145deg, #1e293b 0%, #334155 50%, #475569 100%)',
        borderRadius: '4px',
        border: active ? '2px solid #60a5fa' : '1px solid #475569',
        position: 'relative',
        transform: `perspective(500px) rotateX(15deg) rotateY(${-5 + index * 2}deg)`,
        boxShadow: active
          ? '0 20px 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255,255,255,0.1)'
          : '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: '4px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '2px' }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: active
                ? `rgba(96, 165, 250, ${0.3 + Math.random() * 0.3})`
                : 'rgba(71, 85, 105, 0.3)',
              borderRadius: '1px',
            }}
          />
        ))}
      </div>
      {/* Shine effect */}
      {active && (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '30%',
            height: '20%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4), transparent)',
            borderRadius: '2px',
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// 3D BATTERY COMPONENT
// ============================================================================

const Battery3D: React.FC<{ level: number }> = ({ level }) => {
  const getColor = () => {
    if (level > 60) return '#10b981';
    if (level > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '80px',
          height: '140px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '12px',
          border: '3px solid #334155',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
        }}
      >
        {/* Battery terminal */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '10px',
            background: '#475569',
            borderRadius: '4px 4px 0 0',
          }}
        />
        {/* Charge level */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            right: '4px',
            height: `${level}%`,
            background: `linear-gradient(180deg, ${getColor()}dd, ${getColor()}88)`,
            borderRadius: '8px',
            transition: 'height 1s ease, background 0.5s ease',
            boxShadow: `0 0 20px ${getColor()}66`,
          }}
        >
          {/* Bubbles animation */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  left: `${20 + i * 15}%`,
                  animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Percentage */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {level}%
        </div>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>BATTERY</div>
    </div>
  );
};

// ============================================================================
// ROTATING EARTH/GLOBE COMPONENT
// ============================================================================

const RotatingGlobe: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 30%, #0c4a6e 70%, #082f49 100%)',
        position: 'relative',
        boxShadow: '0 0 60px rgba(14, 165, 233, 0.4), inset -20px -20px 40px rgba(0,0,0,0.4)',
        transform: `rotateY(${rotation}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Continents (simplified) */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '35%',
          height: '30%',
          background: '#10b981',
          borderRadius: '40% 60% 50% 40%',
          opacity: 0.8,
          transform: `translateX(${Math.sin(rotation * Math.PI / 180) * 20}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '45%',
          width: '25%',
          height: '35%',
          background: '#10b981',
          borderRadius: '30% 70% 40% 60%',
          opacity: 0.8,
          transform: `translateX(${Math.sin(rotation * Math.PI / 180) * 20}px)`,
        }}
      />
      {/* Sun rays hitting earth */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      {/* Solar panels on earth */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '20px',
          height: '15px',
          background: '#3b82f6',
          transform: 'perspective(100px) rotateX(45deg)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)',
        }}
      />
    </div>
  );
};

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
  badge?: string;
}> = ({ icon: Icon, title, description, color, onClick, badge }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? `linear-gradient(135deg, ${color}30, ${color}10)`
          : 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? color : 'rgba(71, 85, 105, 0.5)'}`,
        borderRadius: '20px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'none',
        boxShadow: isHovered ? `0 20px 40px ${color}20` : '0 4px 20px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: color,
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '100px',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>
      )}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: `0 0 20px ${color}30`,
        }}
      >
        <Icon size={28} color={color} />
      </div>
      <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5 }}>
        {description}
      </p>
      {/* Animated corner accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, transparent 50%, ${color}20 50%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
};

// ============================================================================
// STATS DISPLAY COMPONENT
// ============================================================================

const StatsDisplay: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  trend?: 'up' | 'down';
}> = ({ icon: Icon, value, label, color, trend }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(71, 85, 105, 0.3)',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>{value}</span>
          {trend && (
            <span style={{ color: trend === 'up' ? '#10b981' : '#ef4444', fontSize: '14px' }}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
        <div style={{ color: '#64748b', fontSize: '14px' }}>{label}</div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SolarGeniusProFuturistic() {
  const [activeSection, setActiveSection] = useState<'home' | 'design' | 'quote' | 'analyze'>('home');
  const [isListening, setIsListening] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [panelsActive, setPanelsActive] = useState([true, true, true, true, false, false]);
  const [systemSize, setSystemSize] = useState(10);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Animate battery level
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(20, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle panels animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPanelsActive(prev => {
        const newState = [...prev];
        const idx = Math.floor(Math.random() * 6);
        newState[idx] = !newState[idx];
        return newState;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f172a 30%, #1e1b4b 70%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SolarWorldBackground />

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)',
              animation: 'glow 3s ease-in-out infinite',
            }}
          >
            <Sun size={28} color="#0f172a" />
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: 0 }}>
              SolarGenius Pro
            </h1>
            <p style={{ color: '#fbbf24', fontSize: '12px', margin: 0, fontWeight: 600 }}>
              AI-POWERED SOLAR DESIGN
            </p>
          </div>
        </div>

        {/* Voice Command Button */}
        <button
          onClick={() => setIsListening(!isListening)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '100px',
            border: 'none',
            background: isListening
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'rgba(71, 85, 105, 0.5)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            boxShadow: isListening ? '0 0 30px rgba(16, 185, 129, 0.5)' : 'none',
          }}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
          {isListening ? 'Listening...' : 'Voice Command'}
        </button>
      </header>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10, padding: '40px' }}>
        {/* Hero Section with Solar World */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            marginBottom: '60px',
            alignItems: 'center',
          }}
        >
          {/* Left - Text & CTAs */}
          <div style={{ animation: 'slideIn 0.8s ease' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '100px',
                padding: '8px 16px',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={16} color="#fbbf24" />
              <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 600 }}>
                162+ AI Features
              </span>
            </div>

            <h2
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '24px',
              }}
            >
              Design Solar Systems
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Like Never Before
              </span>
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.7, marginBottom: '32px' }}>
              Generate professional quotes in seconds using AI. Upload images, BOQs, or videos.
              Our neural engines optimize every panel placement for maximum energy harvest.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0f172a',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Zap size={20} />
                Start AI Quote
              </button>

              <a
                href="/solar-design-studio"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  borderRadius: '14px',
                  border: '2px solid rgba(16, 185, 129, 0.5)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  backdropFilter: 'blur(10px)',
                  color: '#10b981',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
              >
                <Grid size={20} />
                Design Studio
              </a>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '32px' }}>
              {[
                { value: '10,000+', label: 'Systems Designed' },
                { value: '50MW+', label: 'Total Capacity' },
                { value: '98%', label: 'Accuracy Rate' },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual Display */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
              animation: 'slideIn 1s ease',
            }}
          >
            {/* Earth with Solar Theme */}
            <RotatingGlobe />

            {/* Solar Panels Array */}
            <div style={{ display: 'flex', gap: '8px', perspective: '1000px' }}>
              {panelsActive.map((active, i) => (
                <SolarPanel3D key={i} active={active} index={i} />
              ))}
            </div>

            {/* Battery Display */}
            <Battery3D level={batteryLevel} />
          </div>
        </section>

        {/* Input Methods Section */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ color: 'white', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              Multiple Ways to Start
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              Upload any format - our AI handles the rest
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
            {[
              { icon: MapPin, title: 'GPS Coordinates', desc: 'Enter location', color: '#10b981' },
              { icon: Camera, title: 'Roof Photo', desc: 'Take a picture', color: '#3b82f6' },
              { icon: Video, title: 'Video Scan', desc: '30s walkaround', color: '#8b5cf6' },
              { icon: FileSpreadsheet, title: 'Upload BOQ', desc: 'PDF, Excel, CSV', color: '#f59e0b' },
              { icon: Satellite, title: 'Satellite', desc: 'Auto-detect roof', color: '#ec4899' },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => setShowUploadModal(true)}
                style={{
                  padding: '30px 20px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  borderRadius: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${item.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.3)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <item.icon size={28} color={item.color} />
                </div>
                <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '13px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Engines Section */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ color: 'white', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
              24 AI Engines Working in Parallel
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              Neural networks optimize every aspect of your solar system
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <FeatureCard
              icon={Satellite}
              title="Satellite Roof Analyzer"
              description="AI detects roof dimensions, pitch, azimuth, and obstructions from satellite imagery"
              color="#0ea5e9"
              badge="Core"
            />
            <FeatureCard
              icon={Cpu}
              title="Neural Panel Optimizer"
              description="Deep learning optimizes panel placement for maximum energy harvest"
              color="#8b5cf6"
              badge="AI"
            />
            <FeatureCard
              icon={CloudSun}
              title="Weather Analyzer"
              description="NASA POWER API integration for accurate irradiance and temperature data"
              color="#f59e0b"
            />
            <FeatureCard
              icon={Shield}
              title="Risk Predictor"
              description="Predicts fire, electrical, and structural risks before installation"
              color="#ef4444"
            />
            <FeatureCard
              icon={Calculator}
              title="Financial Genius"
              description="ROI, NPV, IRR, LCOE, P50/P75/P90 bankability calculations"
              color="#10b981"
            />
            <FeatureCard
              icon={Layers}
              title="8760-Hour Shading"
              description="Simulates shadows for every hour of the year"
              color="#ec4899"
            />
            <FeatureCard
              icon={FileText}
              title="Report Generator"
              description="Engineering, electrical, and financial reports in seconds"
              color="#6366f1"
            />
            <FeatureCard
              icon={Award}
              title="Permit AI"
              description="Auto-generates permit applications for any country"
              color="#14b8a6"
            />
          </div>
        </section>

        {/* System Size Slider */}
        <section
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '60px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '20px' }}>
                Instant System Sizing
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                Drag to adjust system size and see real-time production estimates
              </p>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b' }}>System Size</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '24px' }}>{systemSize} kWp</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={systemSize}
                  onChange={(e) => setSystemSize(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    appearance: 'none',
                    background: `linear-gradient(to right, #fbbf24 ${systemSize}%, #334155 ${systemSize}%)`,
                    cursor: 'pointer',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <StatsDisplay icon={Zap} value={`${(systemSize * 1500).toLocaleString()} kWh`} label="Annual Production" color="#fbbf24" trend="up" />
                <StatsDisplay icon={DollarSign} value={`KSh ${(systemSize * 85000).toLocaleString()}`} label="Estimated Cost" color="#10b981" />
                <StatsDisplay icon={TrendingUp} value="28%" label="ROI" color="#3b82f6" trend="up" />
                <StatsDisplay icon={Clock} value="3.5 years" label="Payback Period" color="#8b5cf6" />
              </div>
            </div>

            {/* Visual representation */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(Math.ceil(systemSize / 2), 10)}, 1fr)`,
                  gap: '4px',
                  padding: '20px',
                  background: 'rgba(30, 64, 175, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                {Array.from({ length: Math.min(systemSize * 2, 50) }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '20px',
                      height: '30px',
                      background: 'linear-gradient(145deg, #1e40af, #3b82f6)',
                      borderRadius: '2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                {Math.min(systemSize * 2, 50)} panels shown (scaled)
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Features */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <FeatureCard
            icon={BookOpen}
            title="Solar Academy"
            description="Complete training from beginner to master with certifications"
            color="#f59e0b"
            onClick={() => {}}
          />
          <FeatureCard
            icon={Globe}
            title="195 Countries"
            description="Global component database with local pricing and standards"
            color="#10b981"
            onClick={() => {}}
          />
          <FeatureCard
            icon={Workflow}
            title="Digital Twin"
            description="Real-time monitoring and predictive maintenance"
            color="#3b82f6"
            onClick={() => {}}
            badge="Live"
          />
          <FeatureCard
            icon={Building2}
            title="White Label"
            description="Custom branding for your solar business"
            color="#8b5cf6"
            onClick={() => {}}
          />
        </section>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '24px',
              padding: '40px',
              width: '600px',
              maxWidth: '90vw',
            }}
          >
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              Start Your AI Quote
            </h3>

            <div
              style={{
                border: '2px dashed rgba(251, 191, 36, 0.5)',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Upload size={48} color="#fbbf24" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Drop files here or click to upload
              </p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Images, Videos, PDF, Excel, Word - Any format works!
              </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px', color: '#64748b' }}>
              - OR -
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Enter GPS coordinates or address..."
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0f172a',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MapPin size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
