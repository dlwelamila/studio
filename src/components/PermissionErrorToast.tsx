'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type PermissionErrorDetail = {
  method?: string;
  path?: string;
  message?: string;
};

export function PermissionErrorToast() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<PermissionErrorDetail>;
      const safeDetail = detail ?? {};
      const pathSuffix = safeDetail.path ? ` (${safeDetail.path})` : '';

      toast({
        variant: 'destructive',
        title: 'Access restricted',
        description:
          safeDetail.message ?? `You do not have permission to view this resource${pathSuffix}.`,
      });
    };

    window.addEventListener('taskey:permission-error', handler as EventListener);
    return () => {
      window.removeEventListener('taskey:permission-error', handler as EventListener);
    };
  }, [toast]);

  return null;
}
