'use server';

/**
 * @fileOverview Recommends helpers for a given task based on location, user ratings, and estimated time of delivery.
 *
 * - recommendHelpersForTask - A function that recommends helpers for a task.
 * - RecommendHelpersForTaskInput - The input type for the recommendHelpersForTask function.
 * - RecommendHelpersForTaskOutput - The return type for the recommendHelpersForTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendHelpersForTaskInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be performed.'),
  taskLocation: z.string().describe('The location where the task needs to be performed.'),
  customerRating: z.number().describe('The rating given by the customer'),
});

export type RecommendHelpersForTaskInput = z.infer<typeof RecommendHelpersForTaskInputSchema>;

const RecommendHelpersForTaskOutputSchema = z.object({
  recommendedHelpers: z
    .array(z.string())
    .describe('A list of helper IDs recommended for the task.'),
});

export type RecommendHelpersForTaskOutput = z.infer<typeof RecommendHelpersForTaskOutputSchema>;

export async function recommendHelpersForTask(
  input: RecommendHelpersForTaskInput
): Promise<RecommendHelpersForTaskOutput> {
  return recommendHelpersForTaskFlow(input);
}

const recommendHelpersForTaskPrompt = ai.definePrompt({
  name: 'recommendHelpersForTaskPrompt',
  input: {schema: RecommendHelpersForTaskInputSchema},
  output: {schema: RecommendHelpersForTaskOutputSchema},
  prompt: `You are an expert task recommender that recommends helpers for tasks.

Consider the following factors when recommending helpers:

- Location: The helper should be located near the task location.
- User Ratings: The helper should have high user ratings.
- Estimated Time of Delivery: The helper should be able to complete the task within the estimated time of delivery.

Task Description: {{{taskDescription}}}
Task Location: {{{taskLocation}}}
Customer Rating: {{{customerRating}}}

Based on these factors, recommend a list of helper IDs for the task.

Make sure the output is a list of helper ids.
`,
});

const recommendHelpersForTaskFlow = ai.defineFlow(
  {
    name: 'recommendHelpersForTaskFlow',
    inputSchema: RecommendHelpersForTaskInputSchema,
    outputSchema: RecommendHelpersForTaskOutputSchema,
  },
  async input => {
    const {output} = await recommendHelpersForTaskPrompt(input);
    return output!;
  }
);
