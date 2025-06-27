'use server';

/**
 * @fileOverview An AI agent that reflects on user spending and predicts their financial future.
 *
 * - reflectOnSpending - A function that handles the reflection process.
 * - ReflectOnSpendingInput - The input type for the function.
 * - ReflectOnSpendingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReflectOnSpendingInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('A CSV string of the user transaction history, including category, amount, date, and type (income/expense). All amounts are in Indian Rupees (₹).'),
  userIncome: z.number().describe('The user\'s monthly income in Indian Rupees (₹).'),
});
export type ReflectOnSpendingInput = z.infer<typeof ReflectOnSpendingInputSchema>;

const ReflectOnSpendingOutputSchema = z.object({
  futureOutlook: z.enum(['positive', 'negative', 'neutral']).describe('The predicted financial outlook for the user.'),
  reflection: z.string().describe('A friendly, actionable piece of advice based on the user\'s spending habits.'),
  imagePrompt: z.string().describe('A detailed prompt for an image generator to create a visual representation of the user\'s financial future.'),
});
export type ReflectOnSpendingOutput = z.infer<typeof ReflectOnSpendingOutputSchema>;

export async function reflectOnSpending(input: ReflectOnSpendingInput): Promise<ReflectOnSpendingOutput> {
  return reflectOnSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reflectOnSpendingPrompt',
  input: {schema: ReflectOnSpendingInputSchema},
  output: {schema: ReflectOnSpendingOutputSchema},
  prompt: `You are a wise financial fortune teller for Indian Gen Z users. Your task is to analyze their financial habits and show them a glimpse of their future.

Analyze their monthly income versus their spending from the transaction history. All amounts are in Indian Rupees (₹).

- Monthly Income: ₹{{{userIncome}}}
- Transaction History (CSV):
{{{transactionHistory}}}

Based on their saving rate (income - expenses), determine their future outlook:
- If they save more than 20% of their income, their outlook is 'positive'.
- If they save between 0% and 20%, their outlook is 'neutral'.
- If their savings are negative (they spend more than they earn), their outlook is 'negative'.

1.  **Set 'futureOutlook'**: Set to 'positive', 'negative', or 'neutral'.
2.  **Write 'reflection'**: Provide a short, non-judgmental, and actionable piece of advice. Speak in a friendly, relatable tone (use some Hinglish).
3.  **Create 'imagePrompt'**: Based on the outlook, create a detailed prompt for an image generator.
    -   **Positive**: "A photorealistic image of a happy, stylish young Indian person in their late 20s, relaxing on a beautiful beach in Goa. The sun is setting, they are smiling, looking confident and financially secure."
    -   **Neutral**: "A photorealistic image of a young Indian person in their late 20s, sitting at a cafe with a laptop, looking thoughtful but a bit tired. They are dressed in casual clothes and appear to be managing, but not thriving."
    -   **Negative**: "A photorealistic, slightly dramatic image of a stressed young Indian person in their late 20s, looking worriedly at their empty wallet under a dim light. They are surrounded by bills and instant noodle cups."

Your entire response must be in the structured format.`,
});

const reflectOnSpendingFlow = ai.defineFlow(
  {
    name: 'reflectOnSpendingFlow',
    inputSchema: ReflectOnSpendingInputSchema,
    outputSchema: ReflectOnSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
