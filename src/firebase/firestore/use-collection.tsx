'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Query,
  onSnapshot,
  getDocs,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
  mutate: () => void;
}

/**
 * Options for useCollection hook.
 * emitPermissionErrors:
 *  - When true, permission errors are emitted globally through errorEmitter.
 *  - Default false to avoid global crashes for normal forbidden reads.
 */
export interface UseCollectionOptions {
  emitPermissionErrors?: boolean;
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    };
  };
}

function getPathFromQuery(q: any): string {
  try {
    if (q?.type === 'collection') return q.path;
    if (q?._query?.path?.canonicalString) return q._query.path.canonicalString();
  } catch {}
  return 'unknown path';
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 *
 * IMPORTANT: Input must be memoized (useMemoFirebase).
 *
 * @template T Optional type for document data. Defaults to any.
 * @param memoizedTargetRefOrQuery Firestore CollectionReference or Query. Waits if null/undefined.
 * @param options Optional flags (e.g., emitPermissionErrors).
 * @returns Object with data, isLoading, error, and mutate function.
 */
export function useCollection<T = any>(
  memoizedTargetRefOrQuery:
    | ((CollectionReference<DocumentData> | Query<DocumentData>) & { __memo?: boolean })
    | null
    | undefined,
  options: UseCollectionOptions = {},
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  const emitPermissionErrors = options.emitPermissionErrors === true;

  const handlePermissionError = useCallback(
    (operation: 'list' | 'get') => {
      if (!memoizedTargetRefOrQuery) return;

      const contextualError = new FirestorePermissionError({
        operation,
        path: getPathFromQuery(memoizedTargetRefOrQuery),
      });

      setError(contextualError);
      setData(null);

      // ✅ Avoid app-wide crashes by default.
      // Only emit globally when caller explicitly opts-in.
      if (emitPermissionErrors) {
        errorEmitter.emit('permission-error', contextualError);
      }
    },
    [memoizedTargetRefOrQuery, emitPermissionErrors],
  );

  const mutate = useCallback(() => {
    if (!memoizedTargetRefOrQuery) return;

    setIsLoading(true);
    getDocs(memoizedTargetRefOrQuery)
      .then((snapshot) => {
        const results: ResultItemType[] = snapshot.docs.map((d) => ({
          ...(d.data() as T),
          id: d.id,
        }));
        setData(results);
        setError(null);
      })
      .catch(() => {
        handlePermissionError('list');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [memoizedTargetRefOrQuery, handlePermissionError]);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map((d) => ({
          ...(d.data() as T),
          id: d.id,
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      () => {
        // ✅ permission errors must be a UI state, not a boot crash
        handlePermissionError('list');
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery, handlePermissionError]);

  if (memoizedTargetRefOrQuery && !(memoizedTargetRefOrQuery as any).__memo) {
    console.warn(
      'useCollection was not properly memoized using useMemoFirebase. This may cause infinite loops.',
      memoizedTargetRefOrQuery,
    );
  }

  return { data, isLoading, error, mutate };
}
