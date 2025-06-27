import type { Transaction, Goal } from './types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Boba Tea',
    category: 'Food & Drinks',
    amount: 7.5,
    date: '2024-05-20',
    type: 'expense',
    emotionalState: 'impulse',
  },
  {
    id: '2',
    description: 'New Sneakers',
    category: 'Shopping',
    amount: 150.0,
    date: '2024-05-19',
    type: 'expense',
    emotionalState: 'want',
  },
  {
    id: '3',
    description: 'Freelance Gig Payment',
    category: 'Income',
    amount: 500.0,
    date: '2024-05-18',
    type: 'income',
    emotionalState: 'need',
  },
  {
    id: '4',
    description: 'Monthly Rent',
    category: 'Bills',
    amount: 800.0,
    date: '2024-05-17',
    type: 'expense',
    emotionalState: 'need',
  },
  {
    id: '5',
    description: 'Movie Tickets',
    category: 'Entertainment',
    amount: 25.0,
    date: '2024-05-16',
    type: 'expense',
    emotionalState: 'want',
  },
];

export const mockGoals: Goal[] = [
    {
        id: '1',
        title: 'No-Swiggy Week',
        description: 'Avoid ordering from Swiggy/Zomato for 7 days straight.',
        emoji: '🍔',
        progress: 60,
    },
    {
        id: '2',
        title: 'Save for Concert',
        description: 'Put aside $150 for that upcoming concert.',
        emoji: '🎤',
        progress: 25,
    },
    {
        id: '3',
        title: 'No Impulse Buys',
        description: 'Go 3 days without making any impulse purchases.',
        emoji: '🛍️',
        progress: 100,
    },
    {
        id: '4',
        title: 'Build Emergency Fund',
        description: 'Add $100 to your emergency savings.',
        emoji: '🏦',
        progress: 80,
    },
    {
        id: '5',
        title: 'Coffee Detox',
        description: 'Make coffee at home instead of buying it for 5 days.',
        emoji: '☕',
        progress: 40,
    },
];
