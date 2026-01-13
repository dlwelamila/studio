'use server';
/**
 * @fileOverview Suggests new skills for a helper to learn.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { taskCategories } from '@/lib/data';

const SuggestSkillsInputSchema = z.object({
  currentSkills: z.array(z.string()).describe("The helper's current list of service categories."),
});

export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestionSchema = z.object({
    skill: z.string().describe("The suggested new skill."),
    reason: z.string().describe("A brief, compelling reason why this skill is a good addition for the helper."),
});

const SuggestSkillsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).max(3).describe('A list of up to 3 skill suggestions.'),
});

export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const allSkills = taskCategories.join(', ');

const suggestSkillsPrompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: { schema: SuggestSkillsInputSchema },
  output: { schema: SuggestSkillsOutputSchema },
  prompt: `You are an expert career coach for on-demand helpers. Your goal is to help them grow their business by suggesting new skills.

A helper has the following skills: {{{currentSkills}}}.

Here is a list of all available skill categories on the platform: ${allSkills}.

Analyze the helper's current skills and suggest up to 3 new skills they could add to get more jobs. The new skills must NOT be in their current skill list.

For each suggestion, provide a short, encouraging reason why it's a good next step. For example, if they know "Cleaning", you could suggest "Gardening" because customers who need cleaning often need garden help too.
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const { output } = await suggestSkillsPrompt(input);
    return output!;
  }
);
