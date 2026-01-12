'use client';
import {
  DocumentReference,
  updateDoc,
  UpdateData,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A non-blocking wrapper around Firestore's updateDoc function.
 * It initiates a document update and handles permission errors globally
 * without blocking the main thread. It returns a promise that resolves
 * when the update is complete, but it's not meant to be awaited.
 *
 * @param {DocumentReference} docRef - The reference to the document to update.
 * @param {UpdateData<T>} data - An object containing the fields and values to update.
 * @returns {Promise<void>} A promise that resolves upon completion of the write.
 */
export function updateDocument<T = any>(
  docRef: DocumentReference,
  data: UpdateData<T>
): Promise<void> {
  const promise = updateDoc(docRef, data).catch((error: any) => {
    // Construct a detailed error for better debugging
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    });

    // Use a global emitter to propagate the error
    errorEmitter.emit('permission-error', permissionError);

    // Re-throw the original error if you need to allow local catch blocks to work as well
    throw error;
  });

  return promise;
}
