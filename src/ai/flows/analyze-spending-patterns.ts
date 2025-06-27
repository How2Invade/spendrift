// src/ai/flows/analyze-spending-patterns.ts
'use server';

/**
 * @fileOverview Analyzes user spending patterns and provides personalized savings advice.
 *
 * - analyzeSpendingPatterns - A function that analyzes spending patterns and provides advice.
 * - SpendingPatternsInput - The input type for the analyzeSpendingPatterns function.
 * - SpendingAdviceOutput - The return type for the analyzeSpendingPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingPatternsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A CSV string of the user spending data, including category, amount, date, and emotional state (impulse, need, want). Amounts are in Indian Rupees (₹).'
    ),
  personalData: z.string().describe('Relevant personal data of the user, such as age, income (in ₹), and financial goals.'),
});

export type SpendingPatternsInput = z.infer<typeof SpendingPatternsInputSchema>;

const SpendingAdviceOutputSchema = z.object({
  analysisSummary: z.string().describe('A summary of the spending patterns.'),
  advice: z.string().describe('Personalized advice on how to save money, using a mix of English and Hindi (Hinglish).'),
  emotionalStateTags: z.array(z.string()).describe('Tags indicating the emotional state associated with spending.'),
});

export type SpendingAdviceOutput = z.infer<typeof SpendingAdviceOutputSchema>;

export async function analyzeSpendingPatterns(input: SpendingPatternsInput): Promise<SpendingAdviceOutput> {
  return analyzeSpendingPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingPatternsPrompt',
  input: {schema: SpendingPatternsInputSchema},
  output: {schema: SpendingAdviceOutputSchema},
  prompt: `You are a financial advisor for Gen Z in India. Analyze the user's spending patterns and provide personalized advice on how to save money. Amounts are in Indian Rupees (₹).

  Spending Data: {{{spendingData}}}
  Personal Data: {{{personalData}}}

  Analyze the spending data to identify trends and areas where the user can save money. Consider the user's emotional state when spending (impulse, need, want) and tailor your advice accordingly.

  Speak in a mix of English and Hindi (Hinglish) and use emojis to make the advice more engaging. For example: "Yaar, your Swiggy spending is too high! Thoda control karo."

  Include a summary of the spending patterns, personalized advice, and emotional state tags related to spending.
`,
});

const analyzeSpendingPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingPatternsFlow',
    inputSchema: SpendingPatternsInputSchema,
    outputSchema: SpendingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
