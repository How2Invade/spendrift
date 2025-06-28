import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GoalAnalysisInputSchema = z.object({
  title: z.string().describe('The title of the user goal.'),
  description: z.string().describe('The description of the user goal.'),
});
export type GoalAnalysisInput = z.infer<typeof GoalAnalysisInputSchema>;

const GoalAnalysisOutputSchema = z.object({
  points: z.number().describe('Recommended points for this goal (10-100)'),
  emoji: z.string().describe('A single emoji that best represents the goal.'),
});
export type GoalAnalysisOutput = z.infer<typeof GoalAnalysisOutputSchema>;

export const analyzeGoal = ai.defineFlow(
  {
    name: 'analyzeGoal',
    inputSchema: GoalAnalysisInputSchema,
    outputSchema: GoalAnalysisOutputSchema,
  },
  async (input) => {
    const { title, description } = input;
    const { text } = await ai.generate({
      prompt: `You are a gamified finance app AI. Given a user's goal title and description, suggest a fair points value (between 10 and 100, higher for harder/longer goals) and a single emoji that best represents the goal. Respond in JSON like: { "points": 50, "emoji": "💰" }

Title: ${title}
Description: ${description}

JSON:`,
    });
    try {
      const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
      return {
        points: Math.max(10, Math.min(100, Number(json.points) || 20)),
        emoji: typeof json.emoji === 'string' ? json.emoji : '🎯',
      };
    } catch {
      return { points: 20, emoji: '��' };
    }
  }
); 