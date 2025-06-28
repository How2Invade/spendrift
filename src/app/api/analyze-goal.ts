import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeGoal } from '@/ai/flows/goal-analysis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' });
  }
  try {
    const result = await analyzeGoal({ title, description });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'AI analysis failed' });
  }
} 