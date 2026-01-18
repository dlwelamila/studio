'use client';

import { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

type UserRole = 'customer' | 'helper';

type UserRoleContextType = {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  hasCustomerProfile: boolean;
  hasHelperProfile: boolean;
  isRoleLoading: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isCheckingProfiles, setIsCheckingProfiles] = useState(true);
  const [hasCustomerProfile, setHasCustomerProfile] = useState(false);
  const [hasHelperProfile, setHasHelperProfile] = useState(false);

  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const getStoredRole = useCallback((): UserRole | null => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('taskey:preferredRole');
    return stored === 'customer' || stored === 'helper' ? stored : null;
  }, []);

  const applyRole = useCallback((nextRole: UserRole | null) => {
    setRole(nextRole);
    if (typeof window === 'undefined') return;
    if (nextRole) {
      window.localStorage.setItem('taskey:preferredRole', nextRole);
    } else {
      window.localStorage.removeItem('taskey:preferredRole');
    }
  }, []);

  useEffect(() => {
    if (!user || !firestore) {
      setHasCustomerProfile(false);
      setHasHelperProfile(false);
      applyRole(null);
      setIsCheckingProfiles(false);
      return;
    }

    let isCancelled = false;

    const checkForProfiles = async () => {
      setIsCheckingProfiles(true);

      const customerRef = doc(firestore, 'customers', user.uid);
      const helperRef = doc(firestore, 'helpers', user.uid);

      const [customerDoc, helperDoc] = await Promise.all([getDoc(customerRef), getDoc(helperRef)]);

      if (isCancelled) return;

      const customerExists = customerDoc.exists();
      const helperExists = helperDoc.exists();

      setHasCustomerProfile(customerExists);
      setHasHelperProfile(helperExists);

      const storedRole = getStoredRole();

      if (helperExists && !customerExists) {
        applyRole('helper');
      } else if (customerExists && !helperExists) {
        applyRole('customer');
      } else if (helperExists && customerExists) {
        if (storedRole) {
          applyRole(storedRole);
        } else {
          applyRole(null);
        }
      } else {
        applyRole(null);
      }

      setIsCheckingProfiles(false);
    };

    checkForProfiles();

    return () => {
      isCancelled = true;
    };
  }, [user, firestore, applyRole, getStoredRole]);

  const handleSetRole = useCallback((nextRole: UserRole) => {
    if (nextRole === 'customer' && !hasCustomerProfile) return;
    if (nextRole === 'helper' && !hasHelperProfile) return;
    applyRole(nextRole);
  }, [applyRole, hasCustomerProfile, hasHelperProfile]);

  const toggleRole = useCallback(() => {
    if (role === 'customer') {
      if (hasHelperProfile) {
        applyRole('helper');
      }
      return;
    }

    if (role === 'helper') {
      if (hasCustomerProfile) {
        applyRole('customer');
      }
      return;
    }

    if (!role) {
      if (hasHelperProfile) {
        applyRole('helper');
      } else if (hasCustomerProfile) {
        applyRole('customer');
      }
    }
  }, [role, hasCustomerProfile, hasHelperProfile, applyRole]);

  const value = useMemo(() => ({ 
      role, 
      setRole: handleSetRole, 
      toggleRole,
      hasCustomerProfile,
      hasHelperProfile,
      isRoleLoading: isAuthLoading || isCheckingProfiles,
    }), [role, handleSetRole, toggleRole, hasCustomerProfile, hasHelperProfile, isAuthLoading, isCheckingProfiles]);

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
