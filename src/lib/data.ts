import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'helper';
  avatarUrl: string;
  location: string;
  memberSince: Date;
  // Helper-specific fields
  verified?: boolean;
  rating?: number;
  completedTasks?: number;
  skills?: string[];
};

export type Task = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: { min: number; max: number };
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedHelperId?: string;
  createdAt: Date;
  completedAt?: Date;
};

export type Offer = {
  id: string;
  taskId: string;
  helperId: string;
  price: number;
  message: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
};

export type Rating = {
  id: string;
  taskId: string;
  helperId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Aisha Juma',
    email: 'aisha@example.com',
    role: 'customer',
    avatarUrl: avatars.find(a => a.id === 'avatar-1')?.imageUrl || '',
    location: 'Mikocheni, Dar es Salaam',
    memberSince: new Date('2023-01-15'),
  },
  {
    id: 'user-2',
    name: 'Baraka Simon',
    email: 'baraka@example.com',
    role: 'helper',
    avatarUrl: avatars.find(a => a.id === 'avatar-2')?.imageUrl || '',
    location: 'Kinondoni, Dar es Salaam',
    memberSince: new Date('2023-02-20'),
    verified: true,
    rating: 4.8,
    completedTasks: 25,
    skills: ['Cleaning', 'Laundry', 'Dishwashing'],
  },
  {
    id: 'user-3',
    name: 'Catherine Michael',
    email: 'catherine@example.com',
    role: 'customer',
    avatarUrl: avatars.find(a => a.id === 'avatar-3')?.imageUrl || '',
    location: 'Masaki, Dar es Salaam',
    memberSince: new Date('2023-03-10'),
  },
  {
    id: 'user-4',
    name: 'David Moses',
    email: 'david@example.com',
    role: 'helper',
    avatarUrl: avatars.find(a => a.id === 'avatar-4')?.imageUrl || '',
    location: 'Upanga, Dar es Salaam',
    memberSince: new Date('2023-04-05'),
    verified: true,
    rating: 4.5,
    completedTasks: 15,
    skills: ['Home Maintenance', 'Gardening'],
  },
    {
    id: 'user-5',
    name: 'Fatuma Hassan',
    email: 'fatuma@example.com',
    role: 'helper',
    avatarUrl: avatars.find(a => a.id === 'avatar-5')?.imageUrl || '',
    location: 'Mikocheni, Dar es Salaam',
    memberSince: new Date('2023-05-12'),
    verified: true,
    rating: 4.9,
    completedTasks: 42,
    skills: ['Cleaning', 'Cooking', 'Laundry'],
  },
  {
    id: 'user-6',
    name: 'George Peter',
    email: 'george@example.com',
    role: 'helper',
    avatarUrl: avatars.find(a => a.id === 'avatar-6')?.imageUrl || '',
    location: 'Kijitonyama, Dar es Salaam',
    memberSince: new Date('2023-06-18'),
    verified: false,
    rating: 4.2,
    completedTasks: 8,
    skills: ['Dishwashing'],
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    customerId: 'user-1',
    title: 'Full House Cleaning',
    description: 'Need a deep clean for a 3-bedroom apartment. Includes floors, windows, and bathrooms. All cleaning supplies will be provided.',
    category: 'Cleaning',
    location: 'Mikocheni, Dar es Salaam',
    budget: { min: 40000, max: 60000 },
    status: 'open',
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'task-2',
    customerId: 'user-1',
    title: 'Weekly Laundry Service',
    description: 'Looking for someone to handle laundry for a family of four on a weekly basis. Wash, dry, and fold.',
    category: 'Laundry',
    location: 'Mikocheni, Dar es Salaam',
    budget: { min: 25000, max: 35000 },
    status: 'assigned',
    assignedHelperId: 'user-2',
    createdAt: new Date('2024-07-18T14:30:00Z'),
  },
  {
    id: 'task-3',
    customerId: 'user-3',
    title: 'Garden Weeding and Tidying',
    description: 'My small garden needs weeding and the lawn needs to be mowed. Should take about 2-3 hours.',
    category: 'Gardening',
    location: 'Masaki, Dar es Salaam',
    budget: { min: 15000, max: 25000 },
    status: 'completed',
    assignedHelperId: 'user-4',
    createdAt: new Date('2024-07-15T09:00:00Z'),
    completedAt: new Date('2024-07-15T12:30:00Z'),
  },
    {
    id: 'task-4',
    customerId: 'user-3',
    title: 'Post-Party Dishwashing',
    description: 'I hosted a party and need help with a large amount of dishes, glasses, and cutlery. Need someone urgently for this evening.',
    category: 'Dishwashing',
    location: 'Masaki, Dar es Salaam',
    budget: { min: 10000, max: 15000 },
    status: 'in_progress',
    assignedHelperId: 'user-6',
    createdAt: new Date('2024-07-21T18:00:00Z'),
  },
];

export const offers: Offer[] = [
  {
    id: 'offer-1',
    taskId: 'task-1',
    helperId: 'user-2',
    price: 55000,
    message: 'I am experienced in deep cleaning and can be there tomorrow morning. I will bring my own eco-friendly products.',
    createdAt: new Date('2024-07-20T11:00:00Z'),
    status: 'pending',
  },
  {
    id: 'offer-2',
    taskId: 'task-1',
    helperId: 'user-5',
    price: 50000,
    message: 'Hello, I live nearby and can start immediately. I have a 5-star rating for cleaning tasks.',
    createdAt: new Date('2024-07-20T11:30:00Z'),
    status: 'pending',
  },
  {
    id: 'offer-3',
    taskId: 'task-1',
    helperId: 'user-4',
    price: 60000,
    message: 'I can handle this task efficiently. Available this afternoon.',
    createdAt: new Date('2024-07-20T12:00:00Z'),
    status: 'pending',
  },
];

export const ratings: Rating[] = [
  {
    id: 'rating-1',
    taskId: 'task-3',
    helperId: 'user-4',
    customerId: 'user-3',
    rating: 5,
    comment: 'David did an amazing job with the garden. Very professional and efficient. Highly recommend!',
    createdAt: new Date('2024-07-15T13:00:00Z'),
  },
];

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
