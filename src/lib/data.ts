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
  references?: string;
  additionalSkills?: string;
  verificationStatus: 'Pending Verification' | 'Verified';
  isAvailable: boolean;
  reliabilityIndicator: '??' | '???' | '??';
  memberSince: Timestamp;
  rating?: number;
  completedTasks?: number;
};

export type Customer = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  phoneNumber: string;
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
  effort: 'light' | 'medium' | 'heavy';
  toolsRequired: string[];
  timeWindow: string; // e.g. "Tomorrow afternoon", "Flexible"
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedHelperId?: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
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
