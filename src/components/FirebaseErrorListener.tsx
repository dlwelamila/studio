'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Listens for globally emitted Firestore permission errors.
 *
 * IMPORTANT:
 * - Permission errors are expected in normal flows (e.g., user tries to open a chat they don't belong to).
 * - This listener must NOT crash the app.
 * - We log + dispatch a UI event instead of throwing.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (err: FirestorePermissionError) => {
      const method = err?.request?.method ?? 'unknown';
      const path = err?.request?.path ?? 'unknown';
      const uid = err?.request?.auth?.uid ?? null;
      const email = err?.request?.auth?.token?.email ?? null;

      console.warn('[FirestorePermissionError]', {
        method,
        path,
        uid,
        email,
        message: err.message,
      });

      // Optional: dispatch an event for any UI toaster/snackbar system
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('taskey:permission-error', {
            detail: { method, path, uid, email, message: err.message },
          }),
        );
      }
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
