'use client';

/**
 * Community Fault Codes Panel
 *
 * Browse and submit crowdsourced fault codes
 * Features voting, comments, and contributor profiles
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCommunityService,
  CommunityFaultCode,
  SUPPORTED_BRANDS,
  CONTRIBUTOR_BADGES,
  CONTRIBUTOR_REWARDS,
  SAMPLE_COMMUNITY_CODES,
} from '@/lib/generator-oracle/communityFaultCodes';
import {
  searchAllFaultCodes,
  getTotalFaultCodeCount,
  getAllFaultCodeStats,
  CONTROLLER_BRANDS,
} from '@/lib/generator-oracle/integratedDiagnosticService';

interface CommunityFaultCodesPanelProps {
  userId?: string;
  userName?: string;
}

type ViewMode = 'browse' | 'submit' | 'leaderboard' | 'mySubmissions';

export default function CommunityFaultCodesPanel({
  userId = 'demo_user',
  userName = 'Demo Technician',
}: CommunityFaultCodesPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [codes, setCodes] = useState<CommunityFaultCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<CommunityFaultCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'helpful'>('newest');

  const service = getCommunityService();

  useEffect(() => {
    loadCodes();
  }, [selectedBrand, sortBy]);

  const loadCodes = async () => {
    const filters = {
      brand: selectedBrand !== 'all' ? selectedBrand : undefined,
      status: 'verified' as const,
      sortBy,
    };
    const result = await service.getAllFaultCodes(filters);
    setCodes(result);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await service.searchCodes(searchQuery);
      setCodes(results);
    } else {
      loadCodes();
    }
  };

  const handleVote = async (codeId: string, isUpvote: boolean) => {
    await service.vote(codeId, userId, isUpvote);
    loadCodes();
  };

  const handleMarkHelpful = async (codeId: string) => {
    await service.markHelpful(codeId, userId);
    loadCodes();
  };

  return (
    <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              Community Fault Codes
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Crowdsourced solutions from field technicians
            </p>
          </div>

          <div className="flex gap-2">
            {(['browse', 'submit', 'leaderboard'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'browse' && '📋 Browse'}
                {mode === 'submit' && '➕ Submit'}
                {mode === 'leaderboard' && '🏆 Leaderboard'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Browse View */}
      {viewMode === 'browse' && (
        <div className="p-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search fault codes, symptoms..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Brands</option>
              {SUPPORTED_BRANDS.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Search
            </button>
          </div>

          {/* Sample Codes Display */}
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-sm">
              💡 Showing sample community codes. In production, this displays real submissions from technicians worldwide.
            </p>
          </div>

          {/* Codes List */}
          <div className="space-y-4">
            {SAMPLE_COMMUNITY_CODES.map((code, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCode(code as CommunityFaultCode)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">
                        {code.code}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                        {code.controllerBrand}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        code.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        code.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        code.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {code.difficulty}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold mb-1">{code.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{code.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVote(code.code!, true); }}
                        className="flex items-center gap-1 text-slate-400 hover:text-green-400"
                      >
                        <span>👍</span>
                        <span>24</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkHelpful(code.code!); }}
                        className="flex items-center gap-1 text-slate-400 hover:text-cyan-400"
                      >
                        <span>✅</span>
                        <span>18 found helpful</span>
                      </button>
                      <span className="text-slate-500">👁️ 156 views</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Submitted by</p>
                    <p className="text-sm text-slate-300">Field Tech Kenya</p>
                    <p className="text-xs text-purple-400">🏆 Certified</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Submit View */}
      {viewMode === 'submit' && (
        <SubmissionForm userId={userId} userName={userName} onSubmit={() => {
          setViewMode('browse');
          loadCodes();
        }} />
      )}

      {/* Leaderboard View */}
      {viewMode === 'leaderboard' && (
        <LeaderboardView />
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-mono">
                      {selectedCode.code}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-2">{selectedCode.title}</h2>
                    <p className="text-slate-400 mt-1">{selectedCode.controllerBrand} - {selectedCode.controllerModel}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCode(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-slate-300 mb-6">{selectedCode.description}</p>

                {/* Symptoms */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Symptoms</h3>
                  <ul className="space-y-1">
                    {selectedCode.symptoms?.map((s, i) => (
                      <li key={i} className="text-slate-300 flex items-start gap-2">
                        <span className="text-yellow-400">⚠️</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Causes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Possible Causes</h3>
                  <ul className="space-y-1">
                    {selectedCode.causes?.map((c, i) => (
                      <li key={i} className="text-slate-300 flex items-start gap-2">
                        <span className="text-red-400">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solution */}
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Solution</h3>
                  <p className="text-slate-300">{selectedCode.solution}</p>
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Step-by-Step Procedure</h3>
                  <ol className="space-y-2">
                    {selectedCode.steps?.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tools & Parts */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Required Tools</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCode.tools?.map((tool, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{tool}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Parts Needed</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCode.parts?.length ? selectedCode.parts.map((part, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-400">{part}</span>
                      )) : (
                        <span className="text-slate-500 text-sm">None required</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                    👍 Upvote (24)
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30">
                    ✅ This solved my problem
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600">
                    💬 Comment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Submission Form Component
function SubmissionForm({
  userId,
  userName,
  onSubmit,
}: {
  userId: string;
  userName: string;
  onSubmit: () => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    controllerBrand: '',
    controllerModel: '',
    title: '',
    description: '',
    symptoms: [''],
    causes: [''],
    solution: '',
    steps: [''],
    tools: [''],
    parts: [''],
    difficulty: 'medium' as const,
    estimatedTime: '',
  });

  const handleArrayFieldChange = (field: 'symptoms' | 'causes' | 'steps' | 'tools' | 'parts', index: number, value: string) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayField = (field: 'symptoms' | 'causes' | 'steps' | 'tools' | 'parts') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const service = getCommunityService();
    const result = await service.submitFaultCode({
      ...formData,
      symptoms: formData.symptoms.filter(Boolean),
      causes: formData.causes.filter(Boolean),
      steps: formData.steps.filter(Boolean),
      tools: formData.tools.filter(Boolean),
      parts: formData.parts.filter(Boolean),
      photos: [],
      submittedBy: {
        id: userId,
        name: userName,
        totalContributions: 0,
      },
    });

    if (result.success) {
      alert('Fault code submitted successfully! It will be reviewed by our team.');
      onSubmit();
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <h3 className="text-purple-400 font-semibold mb-2">🎁 Contributor Rewards</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {CONTRIBUTOR_REWARDS.map((r, i) => (
            <div key={i} className="p-2 bg-slate-800 rounded text-center">
              <p className="text-white font-bold">{r.threshold}+</p>
              <p className="text-slate-400">{r.reward}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Fault Code *</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., DSE-1234 or UNDOCUMENTED"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Controller Brand *</label>
          <select
            value={formData.controllerBrand}
            onChange={(e) => setFormData({ ...formData, controllerBrand: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            required
          >
            <option value="">Select Brand</option>
            {SUPPORTED_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Controller Model</label>
          <input
            type="text"
            value={formData.controllerModel}
            onChange={(e) => setFormData({ ...formData, controllerModel: e.target.value })}
            placeholder="e.g., DSE7320, InteliGen NT"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="easy">Easy (Basic tools, &lt;30 min)</option>
            <option value="medium">Medium (Some experience needed)</option>
            <option value="hard">Hard (Advanced skills)</option>
            <option value="expert">Expert (Specialized equipment)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the fault"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Detailed Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the problem in detail, including when it occurs and any patterns you noticed"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white h-24"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Symptoms</label>
        {formData.symptoms.map((s, i) => (
          <input
            key={i}
            type="text"
            value={s}
            onChange={(e) => handleArrayFieldChange('symptoms', i, e.target.value)}
            placeholder={`Symptom ${i + 1}`}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white mb-2"
          />
        ))}
        <button type="button" onClick={() => addArrayField('symptoms')} className="text-sm text-purple-400 hover:text-purple-300">
          + Add Symptom
        </button>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Solution *</label>
        <textarea
          value={formData.solution}
          onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
          placeholder="Describe the solution that fixed this problem"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white h-24"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Step-by-Step Procedure</label>
        {formData.steps.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-8 bg-cyan-500/20 text-cyan-400 rounded flex items-center justify-center text-sm">{i + 1}</span>
            <input
              type="text"
              value={s}
              onChange={(e) => handleArrayFieldChange('steps', i, e.target.value)}
              placeholder={`Step ${i + 1}`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
        ))}
        <button type="button" onClick={() => addArrayField('steps')} className="text-sm text-purple-400 hover:text-purple-300">
          + Add Step
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90"
        >
          Submit Fault Code
        </button>
      </div>
    </form>
  );
}

// Leaderboard Component
function LeaderboardView() {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">🏆 Top Contributors</h3>
        <p className="text-slate-400">Technicians making Generator Oracle better</p>
      </div>

      {/* Badges Showcase */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-4">Earn Badges</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CONTRIBUTOR_BADGES.slice(0, 5).map((badge) => (
            <div key={badge.id} className="p-3 bg-slate-800 rounded-lg text-center">
              <span className="text-3xl">{badge.icon}</span>
              <p className="text-white text-sm font-medium mt-1">{badge.name}</p>
              <p className="text-slate-500 text-xs">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Leaderboard */}
      <div className="space-y-3">
        {[
          { rank: 1, name: 'John Mwangi', location: 'Nairobi', score: 2450, verified: 89, badges: ['👑', '🏆', '❤️'] },
          { rank: 2, name: 'Peter Ochieng', location: 'Mombasa', score: 1890, verified: 67, badges: ['🏆', '✅', '🔧'] },
          { rank: 3, name: 'James Kamau', location: 'Kisumu', score: 1560, verified: 52, badges: ['✅', '👍', '📸'] },
          { rank: 4, name: 'Samuel Kiprop', location: 'Nakuru', score: 1230, verified: 41, badges: ['✅', '🔧'] },
          { rank: 5, name: 'David Njoroge', location: 'Eldoret', score: 980, verified: 33, badges: ['🌟', '👍'] },
        ].map((contributor) => (
          <div
            key={contributor.rank}
            className={`flex items-center gap-4 p-4 rounded-xl border ${
              contributor.rank === 1 ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500/50' :
              contributor.rank === 2 ? 'bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/50' :
              contributor.rank === 3 ? 'bg-gradient-to-r from-orange-700/20 to-orange-600/10 border-orange-600/50' :
              'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              contributor.rank === 1 ? 'bg-amber-500 text-black' :
              contributor.rank === 2 ? 'bg-slate-400 text-black' :
              contributor.rank === 3 ? 'bg-orange-600 text-white' :
              'bg-slate-700 text-white'
            }`}>
              #{contributor.rank}
            </div>

            <div className="flex-1">
              <p className="text-white font-semibold">{contributor.name}</p>
              <p className="text-slate-400 text-sm">{contributor.location}</p>
            </div>

            <div className="flex gap-1">
              {contributor.badges.map((badge, i) => (
                <span key={i} className="text-xl">{badge}</span>
              ))}
            </div>

            <div className="text-right">
              <p className="text-purple-400 font-bold">{contributor.score.toLocaleString()}</p>
              <p className="text-slate-500 text-xs">{contributor.verified} verified</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg text-center">
        <p className="text-white font-semibold">Want to join the leaderboard?</p>
        <p className="text-slate-400 text-sm">Submit verified fault codes to earn points and rewards!</p>
      </div>
    </div>
  );
}
