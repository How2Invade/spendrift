import { config } from 'dotenv';
config();

import '@/ai/flows/parse-bank-statement.ts';
import '@/ai/flows/analyze-spending-patterns.ts';
import '@/ai/flows/parse-expense-chat.ts';
import '@/ai/flows/financial-guidance-chat.ts';
import '@/ai/flows/forecast-financials.ts';
