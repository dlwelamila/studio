'use client';

import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
  const [hasCustomerProfile, setHasCustomerProfile] = useState(false);
  const [hasHelperProfile, setHasHelperProfile] = useState(false);

  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    const checkForProfiles = async () => {
      if (!user || !firestore) {
        setIsRoleLoading(false);
        return;
      }
      setIsRoleLoading(true);
      
      const customerRef = doc(firestore, 'customers', user.uid);
      const helperRef = doc(firestore, 'helpers', user.uid);

      const [customerDoc, helperDoc] = await Promise.all([
        getDoc(customerRef),
        getDoc(helperRef),
      ]);

      const customerExists = customerDoc.exists();
      const helperExists = helperDoc.exists();

      setHasCustomerProfile(customerExists);
      setHasHelperProfile(helperExists);

      // Set initial role based on what profiles exist
      if (helperExists && !customerExists) {
        setRole('helper');
      } else {
        setRole('customer');
      }
      
      setIsRoleLoading(false);
    };

    checkForProfiles();
  }, [user, firestore]);
  
  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'customer' ? 'helper' : 'customer'));
  };

  const value = useMemo(() => ({ 
      role, 
      setRole, 
      toggleRole,
      hasCustomerProfile,
      hasHelperProfile,
      isRoleLoading: isAuthLoading || isRoleLoading,
    }), [role, hasCustomerProfile, hasHelperProfile, isAuthLoading, isRoleLoading]);

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
