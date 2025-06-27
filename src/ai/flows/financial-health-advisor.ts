'use server';

/**
 * @fileOverview A personal finance AI advisor for Indian Gen Z users.
 *
 * - financialHealthAdvisor - A function that provides a financial health check.
 * - FinancialHealthAdvisorInput - The input type for the financialHealthAdvisor function.
 * - FinancialHealthAdvisorOutput - The return type for the financialHealthAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialHealthAdvisorInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('A CSV string of the user transaction history, including category, amount, date, and type (income/expense). All amounts are in Indian Rupees (₹).'),
  userGoals: z.string().describe('A string describing the user\'s financial goals (e.g., "Save for Goa trip, Buy new iPhone").'),
  userIncome: z.number().describe('The user\'s monthly income in Indian Rupees (₹).'),
});
export type FinancialHealthAdvisorInput = z.infer<typeof FinancialHealthAdvisorInputSchema>;

const SubscriptionSuggestionSchema = z.object({
    name: z.string().describe('The name of the recurring subscription (e.g., Netflix, Amazon Prime).'),
    suggestion: z.string().describe('A short, actionable suggestion for this subscription.'),
});

const FinancialHealthAdvisorOutputSchema = z.object({
  overallStatus: z.string().describe('A single, catchy phrase summarizing the financial situation (e.g., "Vibe is good!", "Bro, we need to talk.", "Red alert! 🚨").'),
  riskWarnings: z.array(z.string()).describe('A list of potential financial risks or shortfalls, like running out of money or overspending.'),
  subscriptionSuggestions: z.array(SubscriptionSuggestionSchema).describe('Suggestions for managing recurring subscriptions.'),
  goalAnalysis: z.string().describe('A brief analysis of how current spending habits affect financial goals.'),
  spendingFeedback: z.string().describe('Actionable feedback on spending, particularly on areas like food delivery, shopping, or outings.'),
});
export type FinancialHealthAdvisorOutput = z.infer<typeof FinancialHealthAdvisorOutputSchema>;

export async function financialHealthAdvisor(input: FinancialHealthAdvisorInput): Promise<FinancialHealthAdvisorOutput> {
  return financialHealthAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialHealthAdvisorPrompt',
  input: {schema: FinancialHealthAdvisorInputSchema},
  output: {schema: FinancialHealthAdvisorOutputSchema},
  prompt: `You are a super-chill and savvy personal finance AI advisor for Indian Gen Z users. Your name is FinBot. Your goal is to give them a quick, actionable financial health check. Speak like a smart, funny friend, not a boring banker. Use Hinglish and emojis where it feels natural. All financial figures are in Indian Rupees (₹).

Here's the data:
- Monthly Income: ₹{{{userIncome}}}
- Financial Goals: {{{userGoals}}}
- Transaction History (CSV):
{{{transactionHistory}}}

Your task is to analyze this and provide:
1.  **Overall Status:** A one-liner on their financial health.
2.  **Risk Warnings:** Analyze their spending vs. income. Are they at risk of running out of money before the month ends? Are they in danger of a negative balance? Is their spending on Swiggy, Zomato, or shopping too high for their income? Be direct but not preachy.
3.  **Subscription Suggestions:** Detect recurring spends like Netflix, Amazon Prime, Hotstar, Spotify, gym fees, or EMIs. If they seem to have too many or some seem unnecessary, suggest cancelling or pausing them to save money.
4.  **Goal Analysis:** Briefly comment on whether their spending is helping or hurting their goals (e.g., "That Goa trip isn't gonna happen if the Swiggy budget stays this high, yaar.").
5.  **Spending Feedback:** Give one or two highly actionable tips based on their biggest spending categories.

Keep all advice short, simple, and clear. Focus on being relatable and helpful.`,
});

const financialHealthAdvisorFlow = ai.defineFlow(
  {
    name: 'financialHealthAdvisorFlow',
    inputSchema: FinancialHealthAdvisorInputSchema,
    outputSchema: FinancialHealthAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
