'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DocumentReference,
  onSnapshot,
  getDoc,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean; // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
  mutate: () => void; // Function to manually re-fetch the document.
}

/**
 * Options for useDoc hook.
 * emitPermissionErrors:
 *  - When true, permission errors are emitted globally through errorEmitter.
 *  - Default false to avoid "boot-killer" global crashes for normal forbidden reads
 *    (e.g., user opening a thread they are not a member of).
 */
export interface UseDocOptions {
  emitPermissionErrors?: boolean;
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedDocRef or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidance. Also make sure that it's dependencies are stable
 * references
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} memoizedDocRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @param {UseDocOptions} options - Optional behavior flags.
 * @returns {UseDocResult<T>} Object with data, isLoading, error, and mutate function.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
  options: UseDocOptions = {},
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  const emitPermissionErrors = options.emitPermissionErrors === true;

  const mutate = useCallback(() => {
    if (!memoizedDocRef) return;

    setIsLoading(true);
    getDoc(memoizedDocRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
      })
      .catch((_err) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        });
        setError(contextualError);
        setData(null);

        // ✅ DO NOT kill the app by default.
        // Only emit globally if caller explicitly requests.
        if (emitPermissionErrors) {
          errorEmitter.emit('permission-error', contextualError);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [memoizedDocRef, emitPermissionErrors]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (_error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // ✅ DO NOT kill the app by default.
        if (emitPermissionErrors) {
          errorEmitter.emit('permission-error', contextualError);
        }
      },
    );

    return () => unsubscribe();
  }, [memoizedDocRef, emitPermissionErrors]);

  return { data, isLoading, error, mutate };
}
