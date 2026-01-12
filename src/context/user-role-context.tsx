'use client';

import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Customer, Helper } from '@/lib/data';

type UserRole = 'customer' | 'helper';

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  hasCustomerProfile: boolean;
  hasHelperProfile: boolean;
  isRoleLoading: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const customerProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'customers', user.uid) : null, [firestore, user]);
  const helperProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'helpers', user.uid) : null, [firestore, user]);

  const { data: customerProfile, isLoading: isCustomerLoading } = useDoc<Customer>(customerProfileRef);
  const { data: helperProfile, isLoading: isHelperLoading } = useDoc<Helper>(helperProfileRef);
  
  const hasCustomerProfile = !!customerProfile;
  const hasHelperProfile = !!helperProfile;

  useEffect(() => {
    const totalLoading = isAuthLoading || isCustomerLoading || isHelperLoading;
    setIsRoleLoading(totalLoading);
    if (!totalLoading) {
      // Logic to set the initial role
      if (hasHelperProfile && !hasCustomerProfile) {
        setRole('helper');
      } else {
        // Default to customer if they have a customer profile OR if they have both
        setRole('customer');
      }
    }
  }, [isAuthLoading, isCustomerLoading, isHelperLoading, hasCustomerProfile, hasHelperProfile]);


  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'customer' ? 'helper' : 'customer'));
  };

  const value = useMemo(() => ({ 
      role, 
      setRole, 
      toggleRole,
      hasCustomerProfile,
      hasHelperProfile,
      isRoleLoading,
    }), [role, hasCustomerProfile, hasHelperProfile, isRoleLoading]);

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
