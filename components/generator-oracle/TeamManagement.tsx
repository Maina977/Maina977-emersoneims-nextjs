'use client';

/**
 * GENERATOR ORACLE TEAM MANAGEMENT
 * Organization and team member management UI
 *
 * @copyright 2026 Generator Oracle
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOracleAuth, useIsManager, type OracleUser } from './AuthProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TeamManagementProps {
  className?: string;
}

interface TeamMember extends OracleUser {
  statusLabel?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function TeamManagement({ className = '' }: TeamManagementProps) {
  const { user } = useOracleAuth();
  const isManager = useIsManager();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OracleUser['role']>('technician');
  const [isInviting, setIsInviting] = useState(false);

  /**
   * Fetch team members
   */
  const fetchMembers = useCallback(async () => {
    if (!user?.organization_id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/generator-oracle/team/members?orgId=${user.organization_id}`);
      const data = await response.json();

      if (data.success) {
        setMembers(data.members);
      } else {
        setError(data.error || 'Failed to load team');
      }
    } catch (err) {
      console.error('Fetch members error:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  }, [user?.organization_id]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /**
   * Update member role
   */
  const updateRole = useCallback(async (memberId: number, newRole: OracleUser['role']) => {
    try {
      const response = await fetch('/api/generator-oracle/team/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        setMembers(prev =>
          prev.map(m => (m.id === memberId ? { ...m, role: newRole } : m))
        );
      } else {
        alert(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Update role error:', err);
      alert('Failed to update role');
    }
  }, []);

  /**
   * Deactivate member
   */
  const deactivateMember = useCallback(async (memberId: number) => {
    if (!confirm('Are you sure you want to deactivate this user? They will lose access immediately.')) {
      return;
    }

    try {
      const response = await fetch('/api/generator-oracle/team/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId }),
      });

      const data = await response.json();

      if (data.success) {
        setMembers(prev =>
          prev.map(m => (m.id === memberId ? { ...m, is_active: false } : m))
        );
      } else {
        alert(data.error || 'Failed to deactivate user');
      }
    } catch (err) {
      console.error('Deactivate error:', err);
      alert('Failed to deactivate user');
    }
  }, []);

  /**
   * Invite new member
   */
  const inviteMember = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    try {
      setIsInviting(true);
      const response = await fetch('/api/generator-oracle/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          organizationId: user?.organization_id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowInviteModal(false);
        setInviteEmail('');
        alert('Invitation sent successfully!');
        fetchMembers();
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Invite error:', err);
      alert('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  }, [inviteEmail, inviteRole, user?.organization_id, fetchMembers]);

  /**
   * Get role badge styles
   */
  const getRoleBadge = (role: OracleUser['role']) => {
    const styles = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      manager: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      technician: 'bg-green-500/20 text-green-400 border-green-500/50',
      viewer: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    };
    return styles[role];
  };

  // No organization
  if (!user?.organization_id) {
    return (
      <div className={`p-6 bg-slate-900/50 rounded-xl border border-slate-700/50 ${className}`}>
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">👤</span>
          <h3 className="text-lg font-bold text-white mb-2">Individual Account</h3>
          <p className="text-slate-400 mb-4">
            You&apos;re not part of an organization. Team features are available for organization accounts.
          </p>
          <button className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30">
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Team Management</h2>
          <p className="text-slate-400 text-sm">{members.length} team members</p>
        </div>
        {isManager && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:opacity-90"
          >
            + Invite Member
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        /* Members List */
        <div className="space-y-3">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 bg-slate-800/50 rounded-xl border ${
                member.is_active ? 'border-slate-700/50' : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{member.name || 'No name'}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded border ${getRoleBadge(member.role)}`}>
                        {member.role}
                      </span>
                      {member.id === user?.id && (
                        <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">
                          You
                        </span>
                      )}
                      {!member.is_active && (
                        <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/50">
                          Deactivated
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{member.email}</p>
                    {member.last_login && (
                      <p className="text-slate-500 text-xs">
                        Last active: {new Date(member.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isManager && member.id !== user?.id && member.is_active && (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateRole(member.id, e.target.value as OracleUser['role'])}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                      disabled={member.role === 'admin' && user?.role !== 'admin'}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="technician">Technician</option>
                      <option value="manager">Manager</option>
                      {user?.role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                    <button
                      onClick={() => deactivateMember(member.id)}
                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded hover:bg-red-500/20"
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>

              <form onSubmit={inviteMember} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as OracleUser['role'])}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="viewer">Viewer - Can view diagnostics</option>
                    <option value="technician">Technician - Can run diagnostics</option>
                    <option value="manager">Manager - Can manage team</option>
                    {user?.role === 'admin' && <option value="admin">Admin - Full access</option>}
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl disabled:opacity-50"
                  >
                    {isInviting ? 'Sending...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
