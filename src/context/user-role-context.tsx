'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

type UserRole = 'customer' | 'helper';

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');

  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'customer' ? 'helper' : 'customer'));
  };

  const value = useMemo(() => ({ role, setRole, toggleRole }), [role]);

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
