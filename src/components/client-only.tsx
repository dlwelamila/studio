'use client';

import { useState, useEffect, type ReactNode } from 'react';

type ClientOnlyProps = {
  children: ReactNode;
};

/**
 * A component that ensures its children are only rendered on the client side.
 * This is useful for preventing React hydration errors when a component
 * generates content (like random IDs) that would differ between the server
 * and the client.
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
