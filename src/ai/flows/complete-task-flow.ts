
'use server';
/**
 * @fileOverview A transactional flow to mark a task as complete and update the helper's statistics.
 *
 * - completeTaskAndupdateHelperStats - The main function to execute the transaction.
 * - CompleteTaskInput - The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { runTransaction, doc, getDoc, serverTimestamp, increment } from 'firebase/firestore';
import { initializeAdminApp } from '@/firebase/admin';

// Initialize Firebase Admin SDK to get a server-side Firestore instance
const adminApp = initializeAdminApp();
const db = adminApp.firestore();

// Define input schema for the flow
const CompleteTaskInputSchema = z.object({
  taskId: z.string().describe('The ID of the task being completed.'),
  helperId: z.string().describe("The ID of the helper who completed the task."),
});
export type CompleteTaskInput = z.infer<typeof CompleteTaskInputSchema>;

/**
 * Marks a task as complete and atomically updates the helper's completed tasks count
 * within a Firestore transaction. This ensures data consistency.
 * @param input - An object containing `taskId` and `helperId`.
 * @returns A promise that resolves when the transaction is complete, or rejects on error.
 */
export async function completeTaskAndupdateHelperStats(input: CompleteTaskInput): Promise<void> {
  return completeTaskFlow(input);
}

// Define the Genkit flow
const completeTaskFlow = ai.defineFlow(
  {
    name: 'completeTaskFlow',
    inputSchema: CompleteTaskInputSchema,
    outputSchema: z.void(),
  },
  async ({ taskId, helperId }) => {
    
    // Define references to the documents that will be part of the transaction
    const taskRef = db.collection('tasks').doc(taskId);
    const helperRef = db.collection('helpers').doc(helperId);

    try {
      // Run the transaction
      await runTransaction(db, async (transaction) => {
        // Read the helper document first to ensure it exists
        const helperDoc = await transaction.get(helperRef);
        if (!helperDoc.exists) {
          throw new Error("Helper profile not found!");
        }

        // Update the task document
        transaction.update(taskRef, {
          status: 'COMPLETED',
          completedAt: serverTimestamp(),
        });
        
        // Update the helper document
        transaction.update(helperRef, {
          completedTasks: increment(1),
        });
      });

      console.log(`Transaction successfully committed for task ${taskId}.`);

    } catch (error) {
      console.error("Transaction failed: ", error);
      // Re-throw the error to be handled by the caller
      throw new Error(`Failed to complete task and update stats: ${error}`);
    }
  }
);
