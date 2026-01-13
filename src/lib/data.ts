'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Timestamp, GeoPoint } from 'firebase/firestore';

const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export type Helper = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  email?: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  serviceCategories: string[];
  serviceAreas: string[];
  aboutMe: string;
  isAvailable: boolean;
  memberSince: Timestamp;

  // New Lifecycle Fields
  verificationStatus: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  profileCompletion: {
    percent: number; // 0-100
    missing: Array<'profilePhoto' | 'serviceCategories' | 'serviceAreas' | 'aboutMe'>;
  };
  lifecycleStage: 'REGISTERED' | 'PROFILE_INCOMPLETE' | 'PENDING_VERIFICATION' | 'VERIFIED_READY' | 'ACTIVE' | 'GROWING' | 'SUSPENDED';
  stats: {
    totalAttempted: number;
    jobsCompleted: number;
    jobsCancelled: number;
    completionRate: number; // 0-1
    ratingAvg: number;
    reliabilityLevel: 'GREEN' | 'YELLOW' | 'RED';
  };
  walletSummary: {
    lifetimeEarnings: number;
    currency: 'TZS';
  },
  
  // Legacy fields (set to default/empty)
  reliabilityIndicator: 'Good' | 'Average' | 'Poor';
};

export type Customer = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  phoneNumber: string;
  phoneVerified?: boolean;
  email?: string;
  rating?: number;
  profilePhotoUrl: string;
  memberSince: Timestamp;
};

export type Task = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  area: string; // Approximate area
  location?: GeoPoint; // Exact location, revealed after assignment
  budget: { min: number; max: number };
  acceptedOfferPrice?: number; // Final price from the accepted offer
  effort: 'light' | 'medium' | 'heavy';
  toolsRequired: string[];
  timeWindow: string; // e.g. "Tomorrow afternoon", "Flexible"
  status: 'OPEN' | 'ASSIGNED' | 'ACTIVE' | 'COMPLETED' | 'IN_DISPUTE' | 'REASSIGNED' | 'CANCELLED';
  assignedHelperId?: string;
  createdAt: Timestamp;
  assignedAt?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  disputedAt?: Timestamp;
};

export type Offer = {
  id: string;
  taskId: string;
  helperId: string;
  price: number;
  eta: string; // Availability / ETA
  message: string;
  status: 'ACTIVE' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED';
  createdAt: Timestamp;
};

export type Feedback = {
  id: string;
  taskId: string;
  customerId: string;
  helperId: string;
  rating: number;
  feedback: string;
  createdAt: Timestamp;
};

export type SupportTicket = {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: Timestamp;
};


export const taskCategories = [
    'Cleaning',
    'Laundry',
    'Dishwashing',
    'Home Maintenance',
    'Gardening',
    'Cooking',
    'Shopping',
    'Other'
];
