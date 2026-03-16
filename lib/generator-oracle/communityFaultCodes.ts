/**
 * Community Fault Code Library
 *
 * Crowdsourced fault codes from field technicians
 * Features:
 * - User submissions with photos
 * - Community voting/verification
 * - Moderation queue
 * - Contributor rewards
 */

export interface CommunityFaultCode {
  id: string;
  code: string;
  controllerBrand: string;
  controllerModel: string;
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  solution: string;
  steps: string[];
  photos: string[]; // Base64 or URLs
  tools: string[];
  parts: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';

  // Submission metadata
  submittedBy: {
    id: string;
    name: string;
    certificationLevel?: string;
    totalContributions: number;
  };
  submittedAt: string;

  // Verification
  status: 'pending' | 'verified' | 'rejected' | 'flagged';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;

  // Community engagement
  upvotes: number;
  downvotes: number;
  views: number;
  helpfulCount: number; // "This solved my problem"
  comments: CommunityComment[];

  // AI verification score
  aiVerificationScore?: number;
  aiVerificationNotes?: string;
}

export interface CommunityComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isHelpful: boolean;
  upvotes: number;
}

export interface ContributorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  certificationLevel: 'none' | 'beginner' | 'certified' | 'master' | 'expert';
  specializations: string[]; // e.g., ['Cummins', 'DSE', 'Electrical']

  // Stats
  totalSubmissions: number;
  verifiedSubmissions: number;
  totalUpvotes: number;
  totalHelpfulMarks: number;
  contributorScore: number;

  // Rewards
  subscriptionCredits: number; // Free months earned
  badges: ContributorBadge[];
  rank: number; // Global leaderboard position

  joinedAt: string;
  lastActiveAt: string;
}

export interface ContributorBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

// Badge definitions
export const CONTRIBUTOR_BADGES: Omit<ContributorBadge, 'earnedAt'>[] = [
  {
    id: 'first_submission',
    name: 'First Contribution',
    icon: '🌟',
    description: 'Submitted your first fault code',
  },
  {
    id: 'verified_5',
    name: 'Reliable Contributor',
    icon: '✅',
    description: '5 verified fault codes',
  },
  {
    id: 'verified_25',
    name: 'Trusted Expert',
    icon: '🏆',
    description: '25 verified fault codes',
  },
  {
    id: 'verified_100',
    name: 'Community Legend',
    icon: '👑',
    description: '100 verified fault codes',
  },
  {
    id: 'upvotes_50',
    name: 'Helpful Technician',
    icon: '👍',
    description: 'Received 50 upvotes',
  },
  {
    id: 'upvotes_500',
    name: 'Community Favorite',
    icon: '❤️',
    description: 'Received 500 upvotes',
  },
  {
    id: 'helpful_25',
    name: 'Problem Solver',
    icon: '🔧',
    description: '25 people marked your solutions as helpful',
  },
  {
    id: 'multi_brand',
    name: 'Multi-Brand Expert',
    icon: '🌐',
    description: 'Contributed to 5+ controller brands',
  },
  {
    id: 'photo_pro',
    name: 'Visual Documenter',
    icon: '📸',
    description: 'Added photos to 20+ submissions',
  },
  {
    id: 'speed_demon',
    name: 'Quick Responder',
    icon: '⚡',
    description: 'First to solve 10 community questions',
  },
];

// Reward tiers
export const CONTRIBUTOR_REWARDS = [
  { threshold: 10, reward: '1 month free subscription', credits: 1 },
  { threshold: 25, reward: '3 months free subscription', credits: 3 },
  { threshold: 50, reward: '6 months free subscription', credits: 6 },
  { threshold: 100, reward: '1 year free subscription', credits: 12 },
  { threshold: 250, reward: 'Lifetime access + Partner status', credits: 999 },
];

// Controller brands for categorization
export const SUPPORTED_BRANDS = [
  'DSE (Deep Sea Electronics)',
  'ComAp',
  'Woodward',
  'SmartGen',
  'Caterpillar PowerWizard',
  'Cummins PowerCommand',
  'Datakom',
  'Lovato',
  'Volvo Penta',
  'Siemens',
  'ENKO',
  'Other',
];

/**
 * Community Fault Code Service
 * Handles all operations for community-submitted fault codes
 */
export class CommunityFaultCodeService {
  private storageKey = 'oracle_community_faults';
  private profileKey = 'oracle_contributor_profile';

  // Get all community fault codes
  async getAllFaultCodes(filters?: {
    brand?: string;
    status?: CommunityFaultCode['status'];
    sortBy?: 'newest' | 'upvotes' | 'helpful' | 'views';
  }): Promise<CommunityFaultCode[]> {
    const codes = this.getStoredCodes();

    let filtered = codes;

    if (filters?.brand) {
      filtered = filtered.filter(c => c.controllerBrand === filters.brand);
    }

    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Sort
    switch (filters?.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case 'upvotes':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    return filtered;
  }

  // Search community codes
  async searchCodes(query: string): Promise<CommunityFaultCode[]> {
    const codes = this.getStoredCodes();
    const lowerQuery = query.toLowerCase();

    return codes.filter(c =>
      c.code.toLowerCase().includes(lowerQuery) ||
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.symptoms.some(s => s.toLowerCase().includes(lowerQuery)) ||
      c.causes.some(s => s.toLowerCase().includes(lowerQuery))
    );
  }

  // Submit new fault code
  async submitFaultCode(
    submission: Omit<CommunityFaultCode, 'id' | 'submittedAt' | 'status' | 'upvotes' | 'downvotes' | 'views' | 'helpfulCount' | 'comments' | 'aiVerificationScore'>
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Validate submission
      if (!submission.code || !submission.title || !submission.solution) {
        return { success: false, error: 'Missing required fields' };
      }

      // AI verification (simulated - would call API in production)
      const aiScore = this.calculateAIVerificationScore(submission);

      const newCode: CommunityFaultCode = {
        ...submission,
        id: this.generateId(),
        submittedAt: new Date().toISOString(),
        status: aiScore >= 0.7 ? 'pending' : 'flagged',
        upvotes: 0,
        downvotes: 0,
        views: 0,
        helpfulCount: 0,
        comments: [],
        aiVerificationScore: aiScore,
        aiVerificationNotes: aiScore < 0.7
          ? 'Flagged for manual review due to low AI confidence'
          : 'Passed initial AI verification',
      };

      const codes = this.getStoredCodes();
      codes.push(newCode);
      this.saveStoredCodes(codes);

      // Update contributor stats
      this.incrementContributorStats(submission.submittedBy.id);

      return { success: true, id: newCode.id };
    } catch (error) {
      return { success: false, error: 'Failed to submit fault code' };
    }
  }

  // Vote on a fault code
  async vote(codeId: string, userId: string, isUpvote: boolean): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      if (isUpvote) {
        code.upvotes++;
      } else {
        code.downvotes++;
      }
      this.saveStoredCodes(codes);
    }
  }

  // Mark as helpful
  async markHelpful(codeId: string, userId: string): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      code.helpfulCount++;
      this.saveStoredCodes(codes);
    }
  }

  // Increment view count
  async recordView(codeId: string): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      code.views++;
      this.saveStoredCodes(codes);
    }
  }

  // Add comment
  async addComment(codeId: string, comment: Omit<CommunityComment, 'id' | 'createdAt' | 'upvotes'>): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      code.comments.push({
        ...comment,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        upvotes: 0,
      });
      this.saveStoredCodes(codes);
    }
  }

  // Admin: Verify fault code
  async verifyCode(codeId: string, adminId: string): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      code.status = 'verified';
      code.verifiedBy = adminId;
      code.verifiedAt = new Date().toISOString();
      this.saveStoredCodes(codes);

      // Award contributor
      this.incrementVerifiedCount(code.submittedBy.id);
    }
  }

  // Admin: Reject fault code
  async rejectCode(codeId: string, adminId: string, reason: string): Promise<void> {
    const codes = this.getStoredCodes();
    const code = codes.find(c => c.id === codeId);

    if (code) {
      code.status = 'rejected';
      code.verifiedBy = adminId;
      code.verifiedAt = new Date().toISOString();
      code.rejectionReason = reason;
      this.saveStoredCodes(codes);
    }
  }

  // Get contributor profile
  getContributorProfile(userId: string): ContributorProfile | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(`${this.profileKey}_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 20): Promise<ContributorProfile[]> {
    // In production, this would fetch from server
    // For now, return mock data
    return [];
  }

  // Calculate rewards for contributor
  getRewardsForContributor(verifiedCount: number): typeof CONTRIBUTOR_REWARDS[0] | null {
    for (let i = CONTRIBUTOR_REWARDS.length - 1; i >= 0; i--) {
      if (verifiedCount >= CONTRIBUTOR_REWARDS[i].threshold) {
        return CONTRIBUTOR_REWARDS[i];
      }
    }
    return null;
  }

  // Private helpers
  private getStoredCodes(): CommunityFaultCode[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveStoredCodes(codes: CommunityFaultCode[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(codes));
  }

  private generateId(): string {
    return `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAIVerificationScore(submission: Partial<CommunityFaultCode>): number {
    let score = 0.5; // Base score

    // Has detailed solution
    if (submission.solution && submission.solution.length > 100) score += 0.1;

    // Has steps
    if (submission.steps && submission.steps.length >= 3) score += 0.1;

    // Has photos
    if (submission.photos && submission.photos.length > 0) score += 0.1;

    // Has symptoms and causes
    if (submission.symptoms && submission.symptoms.length >= 2) score += 0.05;
    if (submission.causes && submission.causes.length >= 2) score += 0.05;

    // Has tools and parts
    if (submission.tools && submission.tools.length > 0) score += 0.05;
    if (submission.parts && submission.parts.length > 0) score += 0.05;

    return Math.min(score, 1);
  }

  private incrementContributorStats(userId: string): void {
    const profile = this.getContributorProfile(userId);
    if (profile) {
      profile.totalSubmissions++;
      profile.lastActiveAt = new Date().toISOString();
      this.saveContributorProfile(profile);
    }
  }

  private incrementVerifiedCount(userId: string): void {
    const profile = this.getContributorProfile(userId);
    if (profile) {
      profile.verifiedSubmissions++;
      profile.contributorScore += 10;

      // Check for badges
      this.checkAndAwardBadges(profile);

      // Check for rewards
      const reward = this.getRewardsForContributor(profile.verifiedSubmissions);
      if (reward && profile.subscriptionCredits < reward.credits) {
        profile.subscriptionCredits = reward.credits;
      }

      this.saveContributorProfile(profile);
    }
  }

  private checkAndAwardBadges(profile: ContributorProfile): void {
    const earnedBadgeIds = profile.badges.map(b => b.id);

    // First submission
    if (profile.totalSubmissions >= 1 && !earnedBadgeIds.includes('first_submission')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'first_submission')!,
        earnedAt: new Date().toISOString(),
      });
    }

    // Verified milestones
    if (profile.verifiedSubmissions >= 5 && !earnedBadgeIds.includes('verified_5')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'verified_5')!,
        earnedAt: new Date().toISOString(),
      });
    }

    if (profile.verifiedSubmissions >= 25 && !earnedBadgeIds.includes('verified_25')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'verified_25')!,
        earnedAt: new Date().toISOString(),
      });
    }

    if (profile.verifiedSubmissions >= 100 && !earnedBadgeIds.includes('verified_100')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'verified_100')!,
        earnedAt: new Date().toISOString(),
      });
    }

    // Upvote milestones
    if (profile.totalUpvotes >= 50 && !earnedBadgeIds.includes('upvotes_50')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'upvotes_50')!,
        earnedAt: new Date().toISOString(),
      });
    }

    if (profile.totalUpvotes >= 500 && !earnedBadgeIds.includes('upvotes_500')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'upvotes_500')!,
        earnedAt: new Date().toISOString(),
      });
    }

    // Helpful milestone
    if (profile.totalHelpfulMarks >= 25 && !earnedBadgeIds.includes('helpful_25')) {
      profile.badges.push({
        ...CONTRIBUTOR_BADGES.find(b => b.id === 'helpful_25')!,
        earnedAt: new Date().toISOString(),
      });
    }
  }

  private saveContributorProfile(profile: ContributorProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${this.profileKey}_${profile.id}`, JSON.stringify(profile));
  }
}

// Singleton instance
let serviceInstance: CommunityFaultCodeService | null = null;

export function getCommunityService(): CommunityFaultCodeService {
  if (!serviceInstance) {
    serviceInstance = new CommunityFaultCodeService();
  }
  return serviceInstance;
}

// Sample community fault codes for demo
export const SAMPLE_COMMUNITY_CODES: Partial<CommunityFaultCode>[] = [
  {
    code: 'DSE-UNDOC-01',
    controllerBrand: 'DSE (Deep Sea Electronics)',
    controllerModel: 'DSE7320',
    title: 'Intermittent CAN Communication Loss',
    description: 'Generator randomly shows CAN communication errors but no official DSE documentation mentions this specific pattern. Happens mainly during high ambient temperatures.',
    symptoms: [
      'Random "CAN Fail" alarms that clear on their own',
      'Engine parameters intermittently freeze on display',
      'Occurs more frequently above 40°C ambient',
    ],
    causes: [
      'CAN bus termination resistor value drift due to heat',
      'Moisture in CAN connector causing intermittent contact',
      'EMI from nearby VFD interfering with CAN signals',
    ],
    solution: 'Replace both 120Ω termination resistors with high-temperature rated versions. Apply dielectric grease to CAN connectors. If near VFD, add ferrite cores to CAN cable.',
    steps: [
      'Locate CAN bus termination resistors (usually at each end of bus)',
      'Measure resistance - should be 60Ω between CAN_H and CAN_L',
      'Replace with 120Ω 1% tolerance, 125°C rated resistors',
      'Clean all CAN connectors with contact cleaner',
      'Apply dielectric grease to prevent moisture ingress',
      'Test in high-temperature conditions',
    ],
    difficulty: 'medium',
    estimatedTime: '45 minutes',
    tools: ['Multimeter', 'Soldering iron', 'Contact cleaner', 'Dielectric grease'],
    parts: ['120Ω termination resistors (high-temp rated)', 'Ferrite cores (if EMI issue)'],
  },
  {
    code: 'COMAP-UNDOC-02',
    controllerBrand: 'ComAp',
    controllerModel: 'InteliGen NT',
    title: 'False Low Oil Pressure on Cold Start',
    description: 'Generator shows low oil pressure fault immediately on cold start even though physical gauge shows correct pressure. Only happens below 15°C ambient.',
    symptoms: [
      'Low oil pressure alarm within 2 seconds of start',
      'Physical gauge shows normal pressure',
      'Clears after engine warms up and restart',
    ],
    causes: [
      'Oil pressure sensor response time too slow for cold thick oil',
      'Controller start delay parameter too short',
      'Wrong oil viscosity for climate',
    ],
    solution: 'Increase oil pressure start delay from 3 to 8 seconds in InteliConfig. If using 15W-40, consider switching to 10W-30 for cold climates.',
    steps: [
      'Connect to controller via InteliConfig software',
      'Navigate to Protection → Oil Pressure settings',
      'Change "Start delay" from 3s to 8s',
      'Check oil grade matches ambient temperature range',
      'Test cold start multiple times',
    ],
    difficulty: 'easy',
    estimatedTime: '20 minutes',
    tools: ['Laptop with InteliConfig', 'USB-COM adapter'],
    parts: [],
  },
];
