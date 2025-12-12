'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import GoalProgressBar from '@/components/goals/GoalProgressBar';

export default function GoalContext() {
  const { getActiveGoals, getGoalProgress, getIgnoredGoals } = useApp();
  const activeGoals = getActiveGoals();
  const ignoredGoals = getIgnoredGoals();

  if (activeGoals.length === 0) {
    return (
      <div className="bg-gradient-to-br from-brand-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-brand-100 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Set Your North Stars
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Goals give your daily tasks meaning. What are you working toward?
        </p>
        <Link
          href="/goals"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 text-sm font-medium transition-colors"
        >
          Create Your First Goal
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today you're working toward...
        </h2>
        <Link
          href="/goals"
          className="text-xs text-brand-500 hover:text-brand-600"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {activeGoals.slice(0, 3).map((goal) => {
          const progress = getGoalProgress(goal.id);
          const isIgnored = ignoredGoals.some((g) => g.id === goal.id);

          return (
            <Link key={goal.id} href={`/goals/${goal.id}`}>
              <div
                className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  isIgnored
                    ? 'border-orange-200 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10'
                    : 'border-gray-100 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: goal.color || '#6B7280' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {goal.title}
                      </h3>
                      {isIgnored && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                          needs attention
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <GoalProgressBar progress={progress} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {activeGoals.length > 3 && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            +{activeGoals.length - 3} more goals
          </p>
        )}
      </div>
    </div>
  );
}
