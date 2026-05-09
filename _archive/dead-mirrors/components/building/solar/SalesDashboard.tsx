'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== SALES DASHBOARD ====================

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  systemSize: string;
  budget: string;
  status: 'new' | 'contacted' | 'quoted' | 'negotiating' | 'won' | 'lost';
  source: string;
  createdAt: Date;
  lastContact: Date;
  notes: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
}

interface Quote {
  id: string;
  leadId: string;
  customerName: string;
  systemSize: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  validUntil: Date;
  items: { description: string; quantity: number; price: number }[];
}

interface SalesMetrics {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  totalQuotes: number;
  quotesThisWeek: number;
  revenue: number;
  revenueTarget: number;
  avgDealSize: number;
  pipelineValue: number;
}

// Sample data generator
const generateSampleLeads = (): Lead[] => [
  {
    id: 'L001',
    name: 'John Kamau',
    phone: '+254 722 123 456',
    email: 'john.kamau@email.com',
    location: 'Karen, Nairobi',
    systemSize: '10 kW',
    budget: 'KES 1.2M - 1.5M',
    status: 'quoted',
    source: 'Website',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000),
    notes: 'Interested in hybrid system with battery backup. Has 3-phase supply.',
    assignedTo: 'James Omondi',
    priority: 'high',
    estimatedValue: 1350000,
  },
  {
    id: 'L002',
    name: 'Mary Wanjiku',
    phone: '+254 733 234 567',
    email: 'mary.w@company.co.ke',
    location: 'Westlands, Nairobi',
    systemSize: '25 kW',
    budget: 'KES 3M+',
    status: 'negotiating',
    source: 'Referral',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Commercial building. Wants to offset daytime load. Has existing generator.',
    assignedTo: 'James Omondi',
    priority: 'high',
    estimatedValue: 3200000,
  },
  {
    id: 'L003',
    name: 'Peter Mwangi',
    phone: '+254 711 345 678',
    email: 'peter.mwangi@gmail.com',
    location: 'Kilimani, Nairobi',
    systemSize: '5 kW',
    budget: 'KES 600K - 800K',
    status: 'contacted',
    source: 'Facebook',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000),
    notes: 'Apartment owner. Limited roof space. Needs site survey.',
    assignedTo: 'Alice Njeri',
    priority: 'medium',
    estimatedValue: 720000,
  },
  {
    id: 'L004',
    name: 'Grace Hotel Ltd',
    phone: '+254 700 456 789',
    email: 'procurement@gracehotel.co.ke',
    location: 'Diani, Mombasa',
    systemSize: '100 kW',
    budget: 'KES 12M+',
    status: 'new',
    source: 'Tender',
    createdAt: new Date(),
    lastContact: new Date(),
    notes: 'Beach resort looking for solar-diesel hybrid. High priority tender.',
    assignedTo: 'Unassigned',
    priority: 'high',
    estimatedValue: 15000000,
  },
  {
    id: 'L005',
    name: 'Samson Ochieng',
    phone: '+254 720 567 890',
    email: 'samson.o@yahoo.com',
    location: 'Kisumu',
    systemSize: '3 kW',
    budget: 'KES 350K - 450K',
    status: 'won',
    source: 'Google Ads',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: 'Installation scheduled for next week. Deposit received.',
    assignedTo: 'James Omondi',
    priority: 'low',
    estimatedValue: 420000,
  },
];

const generateSampleQuotes = (): Quote[] => [
  {
    id: 'Q001',
    leadId: 'L001',
    customerName: 'John Kamau',
    systemSize: 10,
    totalAmount: 1350000,
    status: 'viewed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    items: [
      { description: '545W JA Solar Mono Panel', quantity: 18, price: 35000 },
      { description: '10kW Deye Hybrid Inverter', quantity: 1, price: 280000 },
      { description: '5kWh Lithium Battery', quantity: 2, price: 180000 },
      { description: 'Installation & Wiring', quantity: 1, price: 150000 },
    ],
  },
  {
    id: 'Q002',
    leadId: 'L002',
    customerName: 'Mary Wanjiku',
    systemSize: 25,
    totalAmount: 3200000,
    status: 'sent',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    items: [
      { description: '545W LONGi Hi-MO 5', quantity: 46, price: 38000 },
      { description: '25kW Sungrow Inverter', quantity: 1, price: 450000 },
      { description: '20kWh Lithium Bank', quantity: 1, price: 680000 },
      { description: 'Installation & Commissioning', quantity: 1, price: 320000 },
    ],
  },
];

// ==================== COMPONENT ====================

const SalesDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(generateSampleLeads());
  const [quotes, setQuotes] = useState<Quote[]>(generateSampleQuotes());
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'quotes' | 'analytics'>('overview');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);

  // Calculate metrics
  const metrics: SalesMetrics = {
    totalLeads: leads.length,
    newLeadsToday: leads.filter(l =>
      new Date(l.createdAt).toDateString() === new Date().toDateString()
    ).length,
    conversionRate: (leads.filter(l => l.status === 'won').length / leads.length) * 100,
    totalQuotes: quotes.length,
    quotesThisWeek: quotes.filter(q =>
      new Date(q.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    revenue: leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.estimatedValue, 0),
    revenueTarget: 5000000,
    avgDealSize: leads.filter(l => l.status === 'won').length > 0
      ? leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.estimatedValue, 0) / leads.filter(l => l.status === 'won').length
      : 0,
    pipelineValue: leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((sum, l) => sum + l.estimatedValue, 0),
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      quoted: 'bg-purple-500',
      negotiating: 'bg-orange-500',
      won: 'bg-green-500',
      lost: 'bg-red-500',
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      viewed: 'bg-purple-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
      expired: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'text-red-400 bg-red-900/30',
      medium: 'text-yellow-400 bg-yellow-900/30',
      low: 'text-green-400 bg-green-900/30',
    };
    return colors[priority] || 'text-gray-400 bg-gray-900/30';
  };

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString()}`;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Sales Dashboard
          </h2>
          <p className="text-slate-400 mt-1">
            Track leads, manage quotes, and close deals faster
          </p>
        </div>
        <button
          onClick={() => setShowNewLeadForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-2"
        >
          <span>+</span> New Lead
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'leads', label: 'Leads', icon: '👥' },
          { id: 'quotes', label: 'Quotes', icon: '📄' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads', value: metrics.totalLeads, icon: '👥', color: 'blue' },
              { label: 'New Today', value: metrics.newLeadsToday, icon: '🆕', color: 'green' },
              { label: 'Conversion Rate', value: `${metrics.conversionRate.toFixed(1)}%`, icon: '📈', color: 'purple' },
              { label: 'Pipeline Value', value: formatCurrency(metrics.pipelineValue), icon: '💰', color: 'amber' },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{metric.icon}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-900/30 text-${metric.color}-400`}>
                    {metric.label}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold text-white">{metric.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Revenue Progress */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Monthly Revenue Target</h3>
              <span className="text-emerald-400 font-bold">
                {formatCurrency(metrics.revenue)} / {formatCurrency(metrics.revenueTarget)}
              </span>
            </div>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (metrics.revenue / metrics.revenueTarget) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {((metrics.revenue / metrics.revenueTarget) * 100).toFixed(1)}% of target achieved
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hot Leads */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔥</span> Hot Leads
              </h3>
              <div className="space-y-3">
                {leads.filter(l => l.priority === 'high' && l.status !== 'won' && l.status !== 'lost').slice(0, 4).map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-sm text-slate-400">{lead.location}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)} text-white`}>
                          {lead.status}
                        </span>
                        <div className="text-sm text-emerald-400 mt-1">{formatCurrency(lead.estimatedValue)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quotes */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📄</span> Recent Quotes
              </h3>
              <div className="space-y-3">
                {quotes.slice(0, 4).map(quote => (
                  <div
                    key={quote.id}
                    className="p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{quote.customerName}</div>
                        <div className="text-sm text-slate-400">{quote.systemSize} kW System</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quote.status)} text-white`}>
                          {quote.status}
                        </span>
                        <div className="text-sm text-emerald-400 mt-1">{formatCurrency(quote.totalAmount)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Valid until {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="negotiating">Negotiating</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Leads Table */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">System</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeads.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-700/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{lead.location}</td>
                    <td className="px-4 py-3 text-slate-300">{lead.systemSize}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">{formatCurrency(lead.estimatedValue)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)} text-white capitalize`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{formatDate(lead.lastContact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quotes.map(quote => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{quote.customerName}</h3>
                    <p className="text-sm text-slate-400">Quote #{quote.id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(quote.status)} text-white capitalize`}>
                    {quote.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {quote.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.quantity}x {item.description}</span>
                      <span className="text-slate-400">{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(quote.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                    <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
                    <span>{quote.systemSize} kW System</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm">
                    Send
                  </button>
                  <button className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                    PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Lead Sources */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { source: 'Website', count: 12, percentage: 35, color: 'bg-blue-500' },
                { source: 'Referral', count: 8, percentage: 24, color: 'bg-green-500' },
                { source: 'Google Ads', count: 7, percentage: 21, color: 'bg-yellow-500' },
                { source: 'Facebook', count: 7, percentage: 20, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="35" fill="none" stroke="#374151" strokeWidth="8" />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${item.percentage * 2.2} 220`}
                        className={item.color.replace('bg-', 'text-')}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="text-sm text-white">{item.source}</div>
                  <div className="text-xs text-slate-400">{item.count} leads</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Stages */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Pipeline Stages</h3>
            <div className="space-y-4">
              {[
                { stage: 'New', count: leads.filter(l => l.status === 'new').length, value: leads.filter(l => l.status === 'new').reduce((sum, l) => sum + l.estimatedValue, 0), color: 'bg-blue-500' },
                { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, value: leads.filter(l => l.status === 'contacted').reduce((sum, l) => sum + l.estimatedValue, 0), color: 'bg-yellow-500' },
                { stage: 'Quoted', count: leads.filter(l => l.status === 'quoted').length, value: leads.filter(l => l.status === 'quoted').reduce((sum, l) => sum + l.estimatedValue, 0), color: 'bg-purple-500' },
                { stage: 'Negotiating', count: leads.filter(l => l.status === 'negotiating').length, value: leads.filter(l => l.status === 'negotiating').reduce((sum, l) => sum + l.estimatedValue, 0), color: 'bg-orange-500' },
                { stage: 'Won', count: leads.filter(l => l.status === 'won').length, value: leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.estimatedValue, 0), color: 'bg-green-500' },
              ].map((stage, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-300">{stage.stage}</div>
                  <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(5, (stage.count / leads.length) * 100)}%` }}
                    >
                      <span className="text-xs text-white font-bold">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm text-emerald-400">{formatCurrency(stage.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Response Time', value: '2.4 hrs', icon: '⏱️', trend: '+12%', positive: false },
              { label: 'Quote-to-Close', value: '18 days', icon: '📅', trend: '-3 days', positive: true },
              { label: 'Avg Deal Size', value: formatCurrency(metrics.avgDealSize), icon: '💵', trend: '+8%', positive: true },
              { label: 'Win Rate', value: `${metrics.conversionRate.toFixed(0)}%`, icon: '🎯', trend: '+5%', positive: true },
            ].map((metric, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
                <div className={`text-xs mt-1 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedLead.name}</h3>
                    <p className="text-slate-400">{selectedLead.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Phone</div>
                    <div className="text-white">{selectedLead.phone}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="text-white">{selectedLead.email}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">System Size</div>
                    <div className="text-white">{selectedLead.systemSize}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Budget</div>
                    <div className="text-white">{selectedLead.budget}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Estimated Value</div>
                    <div className="text-emerald-400 font-bold">{formatCurrency(selectedLead.estimatedValue)}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-sm text-slate-400">Source</div>
                    <div className="text-white">{selectedLead.source}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-slate-400 mb-2">Notes</div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-slate-300">
                    {selectedLead.notes}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">
                    Create Quote
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    Call
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    Email
                  </button>
                  <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                    WhatsApp
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

export default SalesDashboard;
