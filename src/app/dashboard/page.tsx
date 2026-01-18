'use client';

import { useUserRole } from '@/context/user-role-context';
import CustomerDashboard from './customer-dashboard';
import HelperDashboard from './helper-dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { role, isRoleLoading, hasCustomerProfile, hasHelperProfile, setRole } = useUserRole();

  if (isRoleLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading your dashboard…
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>Choose how you want to use tasKey right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {hasCustomerProfile && (
              <Button onClick={() => setRole('customer')} className="w-full">
                I’m hiring (Customer)
              </Button>
            )}
            {hasHelperProfile && (
              <Button
                variant={hasCustomerProfile ? 'outline' : 'default'}
                onClick={() => setRole('helper')}
                className="w-full"
              >
                I’m helping (Helper)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === 'customer') {
    return <CustomerDashboard />;
  }

  return <HelperDashboard />;
}
