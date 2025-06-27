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
    .describe('The text content of the bank statement to be parsed.'),
});
export type ParseBankStatementInput = z.infer<typeof ParseBankStatementInputSchema>;

const ParseBankStatementOutputSchema = z.object({
  spendingInsights: z
    .string()
    .describe('A summary of spending insights derived from the bank statement.'),
  categories: z.array(z.string()).describe('Categories of expenses found in the statement')
});
export type ParseBankStatementOutput = z.infer<typeof ParseBankStatementOutputSchema>;

export async function parseBankStatement(input: ParseBankStatementInput): Promise<ParseBankStatementOutput> {
  return parseBankStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBankStatementPrompt',
  input: {schema: ParseBankStatementInputSchema},
  output: {schema: ParseBankStatementOutputSchema},
  prompt: `You are a financial analyst tasked with parsing bank statements and providing insights on spending habits.

  Analyze the following bank statement and provide a summary of spending insights, including key spending categories.  Be concise and provide actionable advice.

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
