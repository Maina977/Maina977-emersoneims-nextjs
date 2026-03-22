'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== CUSTOMER PORTAL ====================

interface SavedDesign {
  id: string;
  name: string;
  systemSize: number;
  panelCount: number;
  location: string;
  roofType: string;
  estimatedCost: number;
  monthlyProduction: number;
  monthlySavings: number;
  paybackYears: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'quoted' | 'approved' | 'installing' | 'completed';
  thumbnail?: string;
}

interface Project {
  id: string;
  designId: string;
  name: string;
  status: 'planning' | 'procurement' | 'installation' | 'testing' | 'completed';
  progress: number;
  startDate: Date;
  estimatedCompletion: Date;
  installer: string;
  installerPhone: string;
  milestones: { name: string; completed: boolean; date?: Date }[];
}

interface ProductionData {
  date: string;
  production: number;
  consumption: number;
  gridExport: number;
  gridImport: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: Date;
}

// Sample data
const sampleDesigns: SavedDesign[] = [
  {
    id: 'D001',
    name: 'Home Solar System',
    systemSize: 5,
    panelCount: 10,
    location: 'Karen, Nairobi',
    roofType: 'Gabled Roof',
    estimatedCost: 720000,
    monthlyProduction: 650,
    monthlySavings: 16250,
    paybackYears: 3.7,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'approved',
  },
  {
    id: 'D002',
    name: 'Office Expansion',
    systemSize: 15,
    panelCount: 28,
    location: 'Westlands, Nairobi',
    roofType: 'Flat Roof',
    estimatedCost: 1850000,
    monthlyProduction: 1950,
    monthlySavings: 48750,
    paybackYears: 3.2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'quoted',
  },
];

const sampleProject: Project = {
  id: 'P001',
  designId: 'D001',
  name: 'Home Solar System',
  status: 'installation',
  progress: 65,
  startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  installer: 'James Omondi',
  installerPhone: '+254 722 123 456',
  milestones: [
    { name: 'Site Survey', completed: true, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { name: 'Materials Delivery', completed: true, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { name: 'Panel Installation', completed: true, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { name: 'Inverter & Wiring', completed: false },
    { name: 'Testing & Commissioning', completed: false },
    { name: 'Handover', completed: false },
  ],
};

const sampleProduction: ProductionData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  production: 15 + Math.random() * 10,
  consumption: 12 + Math.random() * 8,
  gridExport: Math.random() * 5,
  gridImport: Math.random() * 3,
}));

const sampleNotifications: Notification[] = [
  {
    id: 'N001',
    title: 'Installation Progress',
    message: 'Your solar panels have been installed. Inverter installation scheduled for tomorrow.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'N002',
    title: 'Quote Ready',
    message: 'Your quotation for the Office Expansion project is ready for review.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'N003',
    title: 'Production Alert',
    message: 'Your system produced 25kWh today - 15% above average!',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// ==================== MAIN COMPONENT ====================

const CustomerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'designs' | 'projects' | 'monitoring' | 'support'>('dashboard');
  const [designs, setDesigns] = useState<SavedDesign[]>(sampleDesigns);
  const [project, setProject] = useState<Project | null>(sampleProject);
  const [production, setProduction] = useState<ProductionData[]>(sampleProduction);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      quoted: 'bg-blue-500',
      approved: 'bg-green-500',
      installing: 'bg-amber-500',
      completed: 'bg-emerald-500',
      planning: 'bg-blue-500',
      procurement: 'bg-purple-500',
      installation: 'bg-amber-500',
      testing: 'bg-cyan-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  // Login simulation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
    }
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/80 rounded-2xl p-8 max-w-md w-full border border-slate-700"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">☀️</div>
            <h2 className="text-2xl font-bold text-white">Customer Portal</h2>
            <p className="text-slate-400 mt-2">Track your solar projects and monitor production</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>Demo: Enter any email and password to login</p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <button className="text-amber-400 hover:text-amber-300">Sign Up</button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            Welcome Back!
          </h2>
          <p className="text-slate-400 mt-1">
            Manage your solar designs and track your projects
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all relative"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50"
                >
                  <div className="p-3 border-b border-slate-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer ${
                          !notif.read ? 'bg-slate-700/30' : ''
                        }`}
                        onClick={() => {
                          setNotifications(notifications.map(n =>
                            n.id === notif.id ? { ...n, read: true } : n
                          ));
                        }}
                      >
                        <div className="flex gap-2">
                          <span className={`text-lg ${
                            notif.type === 'success' ? 'text-green-400' :
                            notif.type === 'warning' ? 'text-yellow-400' :
                            notif.type === 'alert' ? 'text-red-400' : 'text-blue-400'
                          }`}>
                            {notif.type === 'success' ? '✓' :
                             notif.type === 'warning' ? '⚠️' :
                             notif.type === 'alert' ? '🚨' : 'ℹ️'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">{notif.title}</div>
                            <div className="text-xs text-slate-400 mt-1">{notif.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-white">John</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
          { id: 'designs', label: 'My Designs', icon: '📐' },
          { id: 'projects', label: 'Projects', icon: '🔨' },
          { id: 'monitoring', label: 'Monitoring', icon: '📊' },
          { id: 'support', label: 'Support', icon: '💬' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Projects', value: '1', icon: '🔨', color: 'amber' },
              { label: 'Saved Designs', value: designs.length.toString(), icon: '📐', color: 'blue' },
              { label: 'Total Savings', value: 'KES 48K', icon: '💰', color: 'green' },
              { label: "This Month's Production", value: '485 kWh', icon: '⚡', color: 'cyan' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Active Project */}
          {project && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                  <p className="text-slate-400">Installation in Progress</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)} text-white capitalize`}>
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                {project.milestones.map((milestone, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500' : 'bg-slate-600'
                    }`}>
                      {milestone.completed ? '✓' : (i + 1)}
                    </div>
                    <div className="flex-1">
                      <div className={milestone.completed ? 'text-white' : 'text-slate-400'}>
                        {milestone.name}
                      </div>
                    </div>
                    {milestone.date && (
                      <div className="text-sm text-slate-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Installer Contact */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Your Installer</div>
                    <div className="text-white font-medium">{project.installer}</div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 flex items-center gap-2">
                    <span>📞</span> Call
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {notifications.slice(0, 5).map(notif => (
                <div key={notif.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">
                    {notif.type === 'success' ? '✅' :
                     notif.type === 'warning' ? '⚠️' :
                     notif.type === 'alert' ? '🚨' : 'ℹ️'}
                  </span>
                  <div className="flex-1">
                    <div className="text-white">{notif.title}</div>
                    <div className="text-sm text-slate-400">{notif.message}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Designs Tab */}
      {activeTab === 'designs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Design Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border-2 border-dashed border-amber-500/30 cursor-pointer hover:border-amber-500/50 transition-all flex flex-col items-center justify-center min-h-[250px]"
            >
              <div className="text-5xl mb-4">➕</div>
              <div className="text-lg font-semibold text-amber-400">Create New Design</div>
              <div className="text-sm text-slate-400 text-center mt-2">
                Use our 3D Design Studio to create your perfect solar system
              </div>
            </motion.div>

            {/* Saved Designs */}
            {designs.map(design => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 cursor-pointer"
                onClick={() => setSelectedDesign(design)}
              >
                {/* Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                  <div className="text-6xl opacity-50">☀️</div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{design.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(design.status)} text-white capitalize`}>
                      {design.status}
                    </span>
                  </div>

                  <div className="text-sm text-slate-400 mb-3">
                    {design.systemSize} kW | {design.panelCount} panels | {design.location}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <div className="text-slate-400">Cost</div>
                      <div className="text-amber-400 font-semibold">{formatCurrency(design.estimatedCost)}</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <div className="text-slate-400">Monthly</div>
                      <div className="text-green-400 font-semibold">{design.monthlyProduction} kWh</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Updated {new Date(design.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && project && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                <p className="text-slate-400">Project ID: {project.id}</p>
              </div>
              <span className={`text-sm px-4 py-2 rounded-full ${getStatusColor(project.status)} text-white capitalize`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="text-slate-400 text-sm">Start Date</div>
                <div className="text-white text-lg font-semibold">
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="text-slate-400 text-sm">Est. Completion</div>
                <div className="text-white text-lg font-semibold">
                  {new Date(project.estimatedCompletion).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="text-slate-400 text-sm">Progress</div>
                <div className="text-amber-400 text-lg font-semibold">{project.progress}%</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
              <div className="space-y-6">
                {project.milestones.map((milestone, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500' : 'bg-slate-600 border-2 border-slate-500'
                    }`}>
                      {milestone.completed && '✓'}
                    </div>
                    <div className={`p-4 rounded-xl ${
                      milestone.completed ? 'bg-green-900/20 border border-green-800/30' : 'bg-slate-700/30'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className={milestone.completed ? 'text-white font-medium' : 'text-slate-400'}>
                          {milestone.name}
                        </div>
                        {milestone.date && (
                          <div className="text-sm text-green-400">
                            {new Date(milestone.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Production Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Today', value: '18.5 kWh', icon: '☀️', trend: '+12%' },
              { label: 'This Week', value: '112 kWh', icon: '📊', trend: '+8%' },
              { label: 'This Month', value: '485 kWh', icon: '📈', trend: '+15%' },
              { label: 'CO2 Saved', value: '242 kg', icon: '🌍', trend: '' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{stat.icon}</span>
                  {stat.trend && <span className="text-xs text-green-400">{stat.trend}</span>}
                </div>
                <div className="text-xl font-bold text-white mt-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Production Chart (Simplified) */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Last 30 Days Production</h3>
            <div className="h-64 flex items-end gap-1">
              {production.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t"
                  style={{ height: `${(day.production / 25) * 100}%` }}
                  title={`${day.date}: ${day.production.toFixed(1)} kWh`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Current Power Flow</h3>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">☀️</div>
                  <div className="text-2xl font-bold text-amber-400">2.8 kW</div>
                  <div className="text-sm text-slate-400">Solar</div>
                </div>
                <div className="text-3xl text-slate-500">→</div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <div className="text-2xl font-bold text-blue-400">1.9 kW</div>
                  <div className="text-sm text-slate-400">Home</div>
                </div>
                <div className="text-3xl text-slate-500">→</div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-green-400">0.9 kW</div>
                  <div className="text-sm text-slate-400">Export</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
              <div className="space-y-3">
                {[
                  { name: 'Panels', status: 'online', efficiency: 98 },
                  { name: 'Inverter', status: 'online', efficiency: 96 },
                  { name: 'Battery', status: 'charging', efficiency: 85 },
                  { name: 'Grid Connection', status: 'active', efficiency: 100 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${item.efficiency}%` }}
                        />
                      </div>
                      <span className="text-green-400 text-sm">{item.efficiency}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Tab */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Call Us', icon: '📞', action: '+254 722 123 456', desc: 'Mon-Fri 8AM-6PM' },
              { title: 'WhatsApp', icon: '💬', action: 'Chat Now', desc: '24/7 Support' },
              { title: 'Email', icon: '📧', action: 'support@emersoneims.co.ke', desc: 'Response within 24hrs' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <div className="text-amber-400 font-medium">{item.action}</div>
                <div className="text-sm text-slate-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                { q: 'How do I track my installation progress?', a: 'Go to the Projects tab to see real-time updates on your installation status and milestones.' },
                { q: 'What does the efficiency percentage mean?', a: 'Efficiency shows how well your system is performing compared to its rated capacity, accounting for weather and other factors.' },
                { q: 'How can I download my production reports?', a: 'In the Monitoring tab, click the Export button to download PDF or Excel reports of your solar production data.' },
                { q: 'When should I schedule maintenance?', a: 'We recommend annual maintenance checks. Your dashboard will show reminders when maintenance is due.' },
              ].map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                    <span className="text-white">{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-3 text-slate-300 text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Design Detail Modal */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDesign(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedDesign.name}</h3>
                    <p className="text-slate-400">{selectedDesign.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">System Size</div>
                    <div className="text-xl font-bold text-white">{selectedDesign.systemSize} kW</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Panels</div>
                    <div className="text-xl font-bold text-white">{selectedDesign.panelCount}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Estimated Cost</div>
                    <div className="text-xl font-bold text-amber-400">{formatCurrency(selectedDesign.estimatedCost)}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Monthly Savings</div>
                    <div className="text-xl font-bold text-green-400">{formatCurrency(selectedDesign.monthlySavings)}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Monthly Production</div>
                    <div className="text-xl font-bold text-cyan-400">{selectedDesign.monthlyProduction} kWh</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400">Payback Period</div>
                    <div className="text-xl font-bold text-purple-400">{selectedDesign.paybackYears} years</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400">
                    Request Quote
                  </button>
                  <button className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    Edit Design
                  </button>
                  <button className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerPortal;
