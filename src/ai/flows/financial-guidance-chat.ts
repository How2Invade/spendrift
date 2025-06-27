'use server';
/**
 * @fileOverview A financial guidance chatbot flow.
 *
 * - financialGuidanceChat - A function that handles the chatbot conversation.
 * - FinancialGuidanceChatInput - The input type for the financialGuidanceChat function.
 * - FinancialGuidanceChatOutput - The return type for the financialGuidanceChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialGuidanceChatInputSchema = z.object({
  statementText: z
    .string()
    .describe('The text content of the bank statement to be analyzed.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
});
export type FinancialGuidanceChatInput = z.infer<typeof FinancialGuidanceChatInputSchema>;

const FinancialGuidanceChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response."),
});
export type FinancialGuidanceChatOutput = z.infer<typeof FinancialGuidanceChatOutputSchema>;

export async function financialGuidanceChat(
  input: FinancialGuidanceChatInput
): Promise<FinancialGuidanceChatOutput> {
  return financialGuidanceChatFlow(input);
}

const financialGuidanceChatFlow = ai.defineFlow(
  {
    name: 'financialGuidanceChatFlow',
    inputSchema: FinancialGuidanceChatInputSchema,
    outputSchema: FinancialGuidanceChatOutputSchema,
  },
  async (input) => {
    const history = input.history.map((msg) => ({
      role: msg.role,
      content: [{text: msg.content}],
    }));

    const {text} = await ai.generate({
      prompt: `You are a super-chill and savvy financial advisor chatbot for Gen Z in India, your name is FinBot. Your goal is to help users understand their spending (in Rupees), make smarter financial decisions, and proactively identify issues based on the provided bank statement.

When analyzing the statement, proactively look for:
- Spending patterns and trends (e.g., increased spending on food delivery from Swiggy/Zomato).
- Areas of overspending.
- Subscription overload (multiple subscriptions they might not need e.g. Netflix, Hotstar, Spotify).
- Risky spending habits or upcoming financial shortfalls.

Use this analysis to guide the user. Use a mix of English and Hindi (Hinglish) and emojis to keep it relatable and engaging.

Analyze this bank statement and answer the user's questions:
${input.statementText}
        `,
      history,
    });

    return {response: text};
  }
);
