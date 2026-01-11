'use client';

import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import CustomerDashboard from './customer-dashboard';
import HelperDashboard from './helper-dashboard';

export default function DashboardPage() {
  const { role } = useUserRole();

  // Based on the role, we render a different dashboard
  if (role === 'customer') {
    return <CustomerDashboard />;
  }
  
  return <HelperDashboard />;
}
