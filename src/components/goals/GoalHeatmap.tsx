'use client';

import React from 'react';

interface GoalHeatmapProps {
  data: Record<string, boolean>;
  days?: number;
}

export default function GoalHeatmap({ data, days = 30 }: GoalHeatmapProps) {
  const today = new Date();
  const dates: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const getIntensity = (hasActivity: boolean): string => {
    if (!hasActivity) return 'bg-gray-100 dark:bg-gray-700';
    return 'bg-green-500 dark:bg-green-600';
  };

  const activeDays = Object.values(data).filter((hasActivity) => hasActivity).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Activity (last {days} days)
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {activeDays} active days
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {dates.map((date) => {
          const hasActivity = data[date] || false;
          const dateObj = new Date(date);

          return (
            <div
              key={date}
              className={`w-4 h-4 rounded-sm ${getIntensity(hasActivity)} transition-colors`}
              title={`${date}: ${hasActivity ? 'active' : 'no activity'}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
          <span>No activity</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}
