import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Timestamp, GeoPoint } from 'firebase/firestore';

const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export type Helper = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  email?: string;
  phoneNumber: string;
  phoneVerified?: boolean;
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
    completionRate: number;
    ratingAvg: number;
    reliabilityLevel: 'GREEN' | 'YELLOW' | 'RED';
  };
  walletSummary: {
    lifetimeEarnings: number;
    currency: 'TZS';
  };
  
  // Legacy fields to be deprecated or merged into stats
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
  acceptedOfferId?: string; // ID of the accepted offer
  effort: 'light' | 'medium' | 'heavy';
  toolsRequired: string[];
  timeWindow: string; // e.g. "Tomorrow afternoon", "Flexible"
  status: 'OPEN' | 'ASSIGNED' | 'ACTIVE' | 'COMPLETED' | 'IN_DISPUTE' | 'REASSIGNED' | 'CANCELLED';
  assignedHelperId?: string;
  createdAt: Timestamp;
  dueDate?: Timestamp;
  assignedAt?: Timestamp;
  arrivedAt?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  disputedAt?: Timestamp;
  allowOffers: boolean;
  participantsCount?: number;
  helperCheckInTime?: Timestamp;
  customerConfirmationTime?: Timestamp;
  completedItems?: string[];
  evidence?: {
    before?: string[];
    after?: string[];
  }
};

export type Offer = {
  id: string;
  taskId: string;
  helperId: string;
  price: number;
  etaAt: Timestamp;
  message: string;
  status: 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED';
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

export type TaskParticipant = {
  id: string; // {taskId}_{helperId}
  taskId: string;
  customerId: string;
  helperId: string;
  status: 'ACTIVE' | 'WITHDRAWN' | 'SELECTED' | 'NOT_SELECTED';
  createdAt: Timestamp;
  lastMessageAt?: Timestamp;
};

export type TaskThread = {
  id: string; // {taskId}_{helperId}
  taskId: string;
  customerId: string;
  helperId: string;
  participantIds: string[]; // [customerId, helperId]
  createdAt: Timestamp;
  lastMessageAt?: Timestamp;
  lastMessagePreview?: string;
  lastMessageSenderId?: string;
  lastReadAt?: Record<string, Timestamp>;
  unreadCounts?: Record<string, number>;
  typing?: Record<string, boolean>;
  locked?: boolean;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
  type: 'TEXT' | 'SYSTEM';
  meta?: any;
}


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