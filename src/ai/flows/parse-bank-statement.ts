'use server';

/**
 * @fileOverview AI agent that parses bank statements to extract structured transaction data.
 *
 * - parseBankStatement - A function that handles the bank statement parsing process.
 * - ParseBankStatementInput - The input type for the parseBankStatement function.
 * - ParseBankStatementOutput - The return type for the parseBankStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseBankStatementInputSchema = z.object({
  statementDataUri: z
    .string()
    .describe(
      "A bank statement provided as a data URI. This can be from a text file, CSV, PDF, or an image file (PNG, JPG). The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseBankStatementInput = z.infer<typeof ParseBankStatementInputSchema>;

const TransactionSchema = z.object({
    description: z.string().describe('A brief description of the transaction.'),
    category: z.string().describe('The category of the expense (e.g., Food, Shopping, Bills).'),
    amount: z.number().describe('The amount of the transaction in Rupees.'),
    date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
    type: z.enum(['income', 'expense']).describe('The type of transaction.'),
});

const ParseBankStatementOutputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of structured transactions parsed from the statement.'),
  summary: z.string().describe('A concise summary of spending insights derived from the bank statement. Financial values should be in Rupees (₹).')
});
export type ParseBankStatementOutput = z.infer<typeof ParseBankStatementOutputSchema>;

export async function parseBankStatement(input: ParseBankStatementInput): Promise<ParseBankStatementOutput> {
  return parseBankStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseBankStatementPrompt',
  input: {schema: ParseBankStatementInputSchema},
  output: {schema: ParseBankStatementOutputSchema},
  prompt: `You are an AI financial assistant for the Indian market. Your primary task is to parse a bank statement and extract each transaction into a structured format. The statement is provided as a data URI and could be a text file, PDF, or an image. Amounts are in Indian Rupees (₹).

  Analyze the following bank statement. For each transaction, identify the description, merchant (e.g., Swiggy, Zomato, Blinkit, Amazon), amount, date, and type (income or expense). Assign it to a clear spending category (e.g., Food & Drinks, Shopping, Bills, Transport, Entertainment, Rent).

  Return an array of all transactions found and a concise summary of the key spending insights.

  Statement: {{media url=statementDataUri}}
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
