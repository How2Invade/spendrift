'use server';

/**
 * @fileOverview A flow that parses expense data from natural language chat input.
 *
 * - parseExpenseChat - A function that handles the expense parsing process.
 * - ParseExpenseChatInput - The input type for the parseExpenseChat function.
 * - ParseExpenseChatOutput - The return type for the parseExpenseChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseExpenseChatInputSchema = z.object({
  chatInput: z
    .string()
    .describe('Natural language input describing the expense.'),
});
export type ParseExpenseChatInput = z.infer<typeof ParseExpenseChatInputSchema>;

const ParseExpenseChatOutputSchema = z.object({
  category: z.string().describe('The category of the expense (e.g., food, transportation, entertainment).'),
  amount: z.number().describe('The amount spent on the expense.'),
  date: z.string().describe('The date the expense occurred (YYYY-MM-DD).'),
  description: z.string().describe('A brief description of the expense.'),
});
export type ParseExpenseChatOutput = z.infer<typeof ParseExpenseChatOutputSchema>;

export async function parseExpenseChat(input: ParseExpenseChatInput): Promise<ParseExpenseChatOutput> {
  return parseExpenseChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseExpenseChatPrompt',
  input: {schema: ParseExpenseChatInputSchema},
  output: {schema: ParseExpenseChatOutputSchema},
  prompt: `You are an AI assistant that parses expense data from natural language chat input.

  Given the following chat input, extract the category, amount, date, and description of the expense.
  Ensure the date is formatted as YYYY-MM-DD.

  Chat Input: {{{chatInput}}}
  `,
});

const parseExpenseChatFlow = ai.defineFlow(
  {
    name: 'parseExpenseChatFlow',
    inputSchema: ParseExpenseChatInputSchema,
    outputSchema: ParseExpenseChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
