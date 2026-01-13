'use client';

import { useMemo } from 'react';
import type { Helper } from '@/lib/data';

export type HelperCapability = 'canBrowseTasks' | 'canSendOffers' | 'canReceiveAssignments' | 'canUpdateTaskStatus';

export type HelperStats = {
    totalAttempted: number;
    jobsCompleted: number;
    jobsCancelled: number;
    completionRate: number;
    ratingAvg: number;
    reliabilityLevel: 'GREEN' | 'YELLOW' | 'RED';
}

const TIERS = [
  { name: 'Bronze', jobsRequired: 0 },
  { name: 'Silver', jobsRequired: 5 },
  { name: 'Gold', jobsRequired: 20 },
];


export type HelperTier = {
    current: { name: string; jobsCompleted: number; };
    next: { name: string; jobsRequired: number; } | null;
    progress: number;
}

export type HelperJourney = {
  lifecycleStage: Helper['lifecycleStage'];
  profileCompletion: Helper['profileCompletion'];
  verificationStatus: Helper['verificationStatus'];
  capabilities: Record<HelperCapability, boolean>;
  nextActions: { id: string; label: string; required: boolean; href?: string }[];
  stats: HelperStats;
  tier: HelperTier | null;
};

/**
 * A client-side hook to derive a helper's journey status, capabilities, and next actions.
 * In a production app, this logic should live on the backend for authoritativeness.
 *
 * @param helper The helper document data from Firestore.
 * @returns A HelperJourney object with derived state.
 */
export function useHelperJourney(helper: Helper | null | undefined): HelperJourney | null {
  const journey = useMemo(() => {
    if (!helper) {
      return null;
    }

    const { verificationStatus, profileCompletion, stats, isAvailable } = helper;
    let lifecycleStage: Helper['lifecycleStage'] = 'REGISTERED'; // Default
    const capabilities: Record<HelperCapability, boolean> = {
      canBrowseTasks: verificationStatus !== 'SUSPENDED',
      canSendOffers: false,
      canReceiveAssignments: false,
      canUpdateTaskStatus: verificationStatus !== 'SUSPENDED', // Checked against task assignment elsewhere
    };
    const nextActions: HelperJourney['nextActions'] = [];

    // --- Derivation Rules (as per spec) ---

    // 1. Determine Lifecycle Stage
    if (profileCompletion && profileCompletion.percent < 100) {
      lifecycleStage = 'PROFILE_INCOMPLETE';
    } else if (verificationStatus === 'PENDING') {
      lifecycleStage = 'PENDING_VERIFICATION';
    } else if (verificationStatus === 'APPROVED') {
      if ((stats?.jobsCompleted || 0) >= 5 && stats?.reliabilityLevel === 'GREEN') {
        lifecycleStage = 'GROWING';
      } else if ((stats?.jobsCompleted || 0) > 0 || isAvailable) {
        lifecycleStage = 'ACTIVE';
      } else {
        lifecycleStage = 'VERIFIED_READY';
      }
    } else if (verificationStatus === 'SUSPENDED') {
      lifecycleStage = 'SUSPENDED';
    }

    // 2. Determine Capabilities based on Stage/Status
    if (verificationStatus === 'APPROVED') {
      capabilities.canSendOffers = true;
      capabilities.canReceiveAssignments = true;
    }

    // 3. Determine Next Actions based on Stage
    switch (lifecycleStage) {
      case 'PROFILE_INCOMPLETE':
        if (profileCompletion?.missing.includes('aboutMe')) {
            nextActions.push({ id: 'ADD_ABOUT_ME', label: 'Add your bio', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion?.missing.includes('serviceAreas')) {
            nextActions.push({ id: 'ADD_AREAS', label: 'Select service areas', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion?.missing.includes('serviceCategories')) {
            nextActions.push({ id: 'ADD_CATEGORIES', label: 'Choose your skills', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion?.missing.includes('profilePhoto')) {
            nextActions.push({ id: 'UPLOAD_PHOTO', label: 'Add a clear profile photo', required: true, href: '/dashboard/profile' });
        }
        break;
      case 'PENDING_VERIFICATION':
        nextActions.push({ id: 'WAIT_FOR_VERIFICATION', label: 'Verification in progress', required: false });
        break;
      case 'VERIFIED_READY':
        nextActions.push({ id: 'SEND_FIRST_OFFER', label: 'Send your first offer', required: false, href: '/dashboard/browse' });
        break;
      case 'SUSPENDED':
         nextActions.push({ id: 'CONTACT_SUPPORT', label: 'Contact Support', required: true, href: '/support' });
        break;
    }

    // 4. Calculate stats
    const totalAttempted = (stats?.jobsCompleted || 0) + (stats?.jobsCancelled || 0);
    const completionRate = totalAttempted > 0 ? ((stats?.jobsCompleted || 0) / totalAttempted) : 1; // Default to 100% if no tasks

    const calculatedStats: HelperStats = {
        jobsCompleted: stats?.jobsCompleted || 0,
        jobsCancelled: stats?.jobsCancelled || 0,
        ratingAvg: stats?.ratingAvg || 0,
        reliabilityLevel: stats?.reliabilityLevel || 'GREEN',
        totalAttempted,
        completionRate,
    };
    
    // 5. Calculate Tier
    let tier: HelperTier | null = null;
    const jobsCompleted = calculatedStats.jobsCompleted;
    const currentTierIndex = TIERS.slice().reverse().findIndex(t => jobsCompleted >= t.jobsRequired);

    if (currentTierIndex !== -1) {
        const currentTierInfo = TIERS[TIERS.length - 1 - currentTierIndex];
        const nextTierInfo = TIERS.length - 1 - currentTierIndex + 1 < TIERS.length ? TIERS[TIERS.length - currentTierIndex] : null;

        let progress = 100;
        if (nextTierInfo) {
            const jobsForCurrentTier = currentTierInfo.jobsRequired;
            const jobsForNextTier = nextTierInfo.jobsRequired;
            progress = ((jobsCompleted - jobsForCurrentTier) / (jobsForNextTier - jobsForCurrentTier)) * 100;
        }

        tier = {
            current: { ...currentTierInfo, jobsCompleted },
            next: nextTierInfo,
            progress: Math.min(progress, 100),
        };
    }


    return {
      lifecycleStage,
      profileCompletion: profileCompletion || { percent: 0, missing: ['profilePhoto', 'serviceCategories', 'serviceAreas', 'aboutMe'] },
      verificationStatus,
      capabilities,
      nextActions,
      stats: calculatedStats,
      tier,
    };
  }, [helper]);

  return journey;
}
