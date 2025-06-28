import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { title = '', description = '' } = await req.json();

  // Simple mock logic for demo
  let points = 20;
  let emoji = '🎯';
  const lower = (title + ' ' + description).toLowerCase();
  if (lower.includes('save') && lower.match(/\d+/)) {
    const amount = parseInt(lower.match(/\d+/)[0], 10);
    points = Math.min(100, Math.max(20, Math.floor(amount / 100)));
    emoji = '💰';
  } else if (lower.includes('iphone')) {
    points = 80;
    emoji = '📱';
  } else if (lower.includes('read') || lower.includes('book')) {
    points = 30;
    emoji = '📚';
  } else if (lower.includes('walk') || lower.includes('steps')) {
    points = 25;
    emoji = '🚶';
  }

  return NextResponse.json({ points, emoji });
} 