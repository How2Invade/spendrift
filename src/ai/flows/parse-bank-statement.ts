'use server';

/**
 * @fileOverview AI agent that parses bank statements to provide insights on spending habits.
 *
 * - parseBankStatement - A function that handles the bank statement parsing process.
 * - ParseBankStatementInput - The input type for the parseBankStatement function.
 * - ParseBankStatementOutput - The return type for the parseBankStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseBankStatementInputSchema = z.object({
  statementText: z
    .string()
    .describe('The text content of the Indian bank statement to be parsed. It might be from a bank or UPI app.'),
});
export type ParseBankStatementInput = z.infer<typeof ParseBankStatementInputSchema>;

const ParseBankStatementOutputSchema = z.object({
  spendingInsights: z
    .string()
    .describe('A summary of spending insights derived from the bank statement. Financial values should be in Rupees (₹).'),
  categories: z.array(z.string()).describe('Categories of expenses found in the statement (e.g., Swiggy, Zomato, Rent, Shopping)')
});
export type ParseBankStatementOutput = z.infer<typeof ParseBankStatementOutputSchema>;

export async function parseBankStatement(input: ParseBankStatementInput): Promise<ParseBankStatementOutput> {
  return parseBankStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBankStatementPrompt',
  input: {schema: ParseBankStatementInputSchema},
  output: {schema: ParseBankStatementOutputSchema},
  prompt: `You are a financial analyst tasked with parsing Indian bank statements and providing insights on spending habits. Amounts will be in Indian Rupees (₹).

  Analyze the following bank statement and provide a summary of spending insights, including key spending categories. Be concise and provide actionable advice. Identify common Indian merchants like Swiggy, Zomato, Blinkit, etc.

  Statement: {{{statementText}}}
  `,
});

const parseBankStatementFlow = ai.defineFlow(
  {
    name: 'parseBankStatementFlow',
    inputSchema: ParseBankStatementInputSchema,
    outputSchema: ParseBankStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
