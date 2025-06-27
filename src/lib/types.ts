export type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  emotionalState: 'impulse' | 'need' | 'want';
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  progress: number;
};
