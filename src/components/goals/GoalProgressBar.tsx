'use client';

import React from 'react';

interface GoalProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export default function GoalProgressBar({
  progress,
  size = 'md',
  showLabel = true,
  color,
}: GoalProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getProgressColor = () => {
    if (color) return color;
    if (clampedProgress >= 100) return 'bg-green-500';
    if (clampedProgress >= 75) return 'bg-blue-500';
    if (clampedProgress >= 50) return 'bg-yellow-500';
    if (clampedProgress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getProgressColor()} ${heightClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[40px] text-right">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}
