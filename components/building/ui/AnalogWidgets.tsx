'use client';

/**
 * Analog Widgets - Clock, Calendar, and Weather Display
 * For use across all maintenance hub pages
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ================================
// ANALOG CLOCK
// ================================

export function AnalogClock({ size = 120, className = '' }: { size?: number; className?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  const center = size / 2;
  const radius = (size / 2) - 10;

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const innerRadius = radius - 8;
    const outerRadius = radius - 2;
    return {
      x1: center + innerRadius * Math.cos(angle),
      y1: center + innerRadius * Math.sin(angle),
      x2: center + outerRadius * Math.cos(angle),
      y2: center + outerRadius * Math.sin(angle),
    };
  });

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Clock face background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Hour markers */}
        {hourMarkers.map((marker, i) => (
          <line
            key={i}
            x1={marker.x1}
            y1={marker.y1}
            x2={marker.x2}
            y2={marker.y2}
            stroke={i % 3 === 0 ? '#f59e0b' : '#64748b'}
            strokeWidth={i % 3 === 0 ? 2 : 1}
          />
        ))}

        {/* Hour hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.5}
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transformOrigin: `${center}px ${center}px`,
            transform: `rotate(${hourDegrees}deg)`,
          }}
        />

        {/* Minute hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.7}
          stroke="#f8fafc"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transformOrigin: `${center}px ${center}px`,
            transform: `rotate(${minuteDegrees}deg)`,
          }}
        />

        {/* Second hand */}
        <motion.line
          x1={center}
          y1={center + 10}
          x2={center}
          y2={center - radius * 0.8}
          stroke="#ef4444"
          strokeWidth="1"
          strokeLinecap="round"
          style={{
            transformOrigin: `${center}px ${center}px`,
            transform: `rotate(${secondDegrees}deg)`,
          }}
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r="4" fill="#f59e0b" />
      </svg>

      {/* Digital time below */}
      <div className="text-center mt-1">
        <span className="text-slate-300 font-mono text-xs">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ================================
// ANALOG CALENDAR
// ================================

export function AnalogCalendar({ className = '' }: { className?: string }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-xl overflow-hidden ${className}`} style={{ width: 100 }}>
      {/* Month header */}
      <div className="bg-red-600 text-white text-center py-1 text-xs font-bold">
        {month} {year}
      </div>

      {/* Day of week */}
      <div className="bg-slate-800 text-slate-400 text-center py-1 text-[10px] font-medium">
        {dayOfWeek}
      </div>

      {/* Date number */}
      <div className="bg-slate-900 text-white text-center py-2">
        <span className="text-3xl font-bold">{dayOfMonth}</span>
      </div>

      {/* Day indicator dots */}
      <div className="flex justify-center gap-0.5 pb-2 bg-slate-900">
        {days.map((d, i) => (
          <div
            key={d}
            className={`w-2 h-2 rounded-full ${
              i === date.getDay() ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ================================
// WEATHER WIDGET
// ================================

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy' | 'partly-cloudy';
  humidity: number;
  windSpeed: number;
  location: string;
  forecast?: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

// Kenya weather data simulation (would be replaced with actual API)
const KENYA_WEATHER: Record<string, WeatherData> = {
  nairobi: { temperature: 22, condition: 'partly-cloudy', humidity: 65, windSpeed: 12, location: 'Nairobi' },
  mombasa: { temperature: 31, condition: 'sunny', humidity: 78, windSpeed: 18, location: 'Mombasa' },
  kisumu: { temperature: 28, condition: 'cloudy', humidity: 70, windSpeed: 10, location: 'Kisumu' },
  nakuru: { temperature: 20, condition: 'partly-cloudy', humidity: 60, windSpeed: 15, location: 'Nakuru' },
  eldoret: { temperature: 18, condition: 'cloudy', humidity: 72, windSpeed: 8, location: 'Eldoret' },
  malindi: { temperature: 32, condition: 'sunny', humidity: 75, windSpeed: 20, location: 'Malindi' },
  kilifi: { temperature: 30, condition: 'sunny', humidity: 76, windSpeed: 16, location: 'Kilifi' },
  karen: { temperature: 21, condition: 'partly-cloudy', humidity: 62, windSpeed: 10, location: 'Karen, Nairobi' },
  embakasi: { temperature: 23, condition: 'partly-cloudy', humidity: 64, windSpeed: 11, location: 'Embakasi, Nairobi' },
  default: { temperature: 25, condition: 'partly-cloudy', humidity: 65, windSpeed: 12, location: 'Kenya' },
};

export function WeatherWidget({
  location = 'nairobi',
  className = '',
}: {
  location?: string;
  className?: string;
}) {
  const [weather, setWeather] = useState<WeatherData>(KENYA_WEATHER.default);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    const timer = setTimeout(() => {
      const normalizedLocation = location.toLowerCase().replace(/[^a-z]/g, '');
      setWeather(KENYA_WEATHER[normalizedLocation] || { ...KENYA_WEATHER.default, location });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const weatherIcons: Record<string, string> = {
    sunny: '☀️',
    'partly-cloudy': '⛅',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    windy: '💨',
  };

  if (loading) {
    return (
      <div className={`bg-slate-900 border border-slate-700 rounded-xl p-3 ${className}`} style={{ width: 140 }}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-8 bg-slate-700 rounded" />
          <div className="h-3 bg-slate-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden ${className}`} style={{ width: 140 }}>
      {/* Location header */}
      <div className="bg-cyan-600/30 px-2 py-1 border-b border-slate-700">
        <span className="text-cyan-400 text-[10px] font-medium truncate block">
          📍 {weather.location}
        </span>
      </div>

      {/* Main weather display */}
      <div className="p-3 text-center">
        <div className="text-4xl mb-1">{weatherIcons[weather.condition]}</div>
        <div className="text-2xl font-bold text-white">{weather.temperature}°C</div>
        <div className="text-slate-400 text-xs capitalize">{weather.condition.replace('-', ' ')}</div>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-2 gap-1 px-2 pb-2">
        <div className="bg-slate-800/50 rounded p-1 text-center">
          <div className="text-[10px] text-slate-500">Humidity</div>
          <div className="text-xs text-slate-300">{weather.humidity}%</div>
        </div>
        <div className="bg-slate-800/50 rounded p-1 text-center">
          <div className="text-[10px] text-slate-500">Wind</div>
          <div className="text-xs text-slate-300">{weather.windSpeed} km/h</div>
        </div>
      </div>

      {/* Solar recommendation */}
      <div className={`px-2 pb-2 text-center text-[10px] ${
        weather.condition === 'sunny' ? 'text-green-400' :
        weather.condition === 'partly-cloudy' ? 'text-yellow-400' :
        'text-orange-400'
      }`}>
        {weather.condition === 'sunny' ? '☀️ Excellent solar' :
         weather.condition === 'partly-cloudy' ? '⛅ Good solar' :
         '☁️ Limited solar'}
      </div>
    </div>
  );
}

// ================================
// COMBINED WIDGET BAR
// ================================

export function WidgetBar({
  location = 'nairobi',
  className = '',
}: {
  location?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AnalogClock size={80} />
      <AnalogCalendar />
      <WeatherWidget location={location} />
    </div>
  );
}

// ================================
// FLOATING WIDGET PANEL
// ================================

export function FloatingWidgetPanel({
  location = 'nairobi',
  position = 'top-right',
}: {
  location?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}) {
  const [collapsed, setCollapsed] = useState(false);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-40`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="bg-slate-900/95 border border-slate-700 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden">
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-3 py-1 bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 transition-colors flex items-center justify-between"
        >
          <span>{collapsed ? 'Show Widgets' : 'Hide Widgets'}</span>
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }}>▼</motion.span>
        </button>

        {/* Widgets */}
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 flex flex-col gap-3 items-center"
          >
            <AnalogClock size={100} />
            <AnalogCalendar />
            <WeatherWidget location={location} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
