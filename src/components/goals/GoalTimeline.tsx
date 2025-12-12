'use client';

import React from 'react';
import { GoalActivity } from '@/types';

interface GoalTimelineProps {
  activities: GoalActivity[];
  limit?: number;
}

const activityIcons: Record<GoalActivity['type'], string> = {
  task_completed: '✓',
  metric_updated: '#',
  project_progress: '[]',
  pipeline_moved: '|>',
  manual_log: '✎',
};

const activityColors: Record<GoalActivity['type'], string> = {
  task_completed: 'bg-green-500',
  metric_updated: 'bg-blue-500',
  project_progress: 'bg-purple-500',
  pipeline_moved: 'bg-orange-500',
  manual_log: 'bg-gray-500',
};

export default function GoalTimeline({ activities, limit = 10 }: GoalTimelineProps) {
  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  if (sortedActivities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Recent Activity
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No activity yet. Start working on this goal!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Recent Activity
      </h3>

      <div className="space-y-3">
        {sortedActivities.map((activity, index) => {
          const date = new Date(activity.createdAt);
          const isToday = date.toDateString() === new Date().toDateString();
          const timeAgo = getTimeAgo(date);

          return (
            <div key={activity.id} className="flex gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${activityColors[activity.type]} flex items-center justify-center`}>
                <span className="text-xs text-white font-mono">
                  {activityIcons[activity.type]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                {activity.metricChange !== undefined && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +{activity.metricChange}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isToday ? timeAgo : date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > limit && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          +{activities.length - limit} more activities
        </p>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
