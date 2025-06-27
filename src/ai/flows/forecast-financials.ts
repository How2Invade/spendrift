'use server';

/**
 * @fileOverview AI agent that forecasts financial health based on transaction history.
 *
 * - forecastFinancials - A function that handles the financial forecasting process.
 * - ForecastFinancialsInput - The input type for the forecastFinancials function.
 * - ForecastFinancialsOutput - The return type for the forecastFinancials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastFinancialsInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('A CSV string of the user transaction history, including category, amount, date, and type (income/expense). All amounts are in Indian Rupees (₹).'),
});
export type ForecastFinancialsInput = z.infer<typeof ForecastFinancialsInputSchema>;

const ForecastFinancialsOutputSchema = z.object({
  cashFlowForecast: z.string().describe('A summary of the expected cash flow for the next 30 days, in Rupees.'),
  riskAssessment: z.string().describe('An assessment of risky spending habits or patterns.'),
  earlyWarnings: z.array(z.string()).describe('A list of potential upcoming financial shortfalls or issues.'),
});
export type ForecastFinancialsOutput = z.infer<typeof ForecastFinancialsOutputSchema>;

export async function forecastFinancials(input: ForecastFinancialsInput): Promise<ForecastFinancialsOutput> {
  return forecastFinancialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastFinancialsPrompt',
  input: {schema: ForecastFinancialsInputSchema},
  output: {schema: ForecastFinancialsOutputSchema},
  prompt: `You are a financial analyst AI for the Indian market. Your task is to analyze a user's transaction history (in Rupees) and provide a forecast for the next 30 days.

  Based on the following transaction history, provide:
  1.  A cash flow forecast.
  2.  An assessment of risky spending habits.
  3.  A list of early warnings for potential financial shortfalls.

  Keep the language clear, concise, and helpful. Use Indian currency (₹) for all financial figures.

  Transaction History (CSV):
  {{{transactionHistory}}}
  `,
});

const forecastFinancialsFlow = ai.defineFlow(
  {
    name: 'forecastFinancialsFlow',
    inputSchema: ForecastFinancialsInputSchema,
    outputSchema: ForecastFinancialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
