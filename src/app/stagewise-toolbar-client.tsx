'use client';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';

export function StagewiseToolbarClient() {
  return <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />;
} 