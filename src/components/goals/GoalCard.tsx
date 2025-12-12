'use client';

import React from 'react';
import Link from 'next/link';
import { Goal } from '@/types';
import { useApp } from '@/context/AppContext';
import GoalProgressBar from './GoalProgressBar';

interface GoalCardProps {
  goal: Goal;
}

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  achieved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  abandoned: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const typeLabels = {
  numeric: 'Metric',
  project: 'Project',
  pipeline: 'Pipeline',
  habit: 'Habit',
};

const typeIcons = {
  numeric: '#',
  project: '[]',
  pipeline: '|>',
  habit: '~',
};

export default function GoalCard({ goal }: GoalCardProps) {
  const { getGoalProgress, projects, getIgnoredGoals } = useApp();
  const progress = getGoalProgress(goal.id);
  const linkedProjects = projects.filter((p) => goal.projectIds.includes(p.id));
  const ignoredGoals = getIgnoredGoals();
  const isIgnored = ignoredGoals.some((g) => g.id === goal.id);

  return (
    <Link href={`/goals/${goal.id}`}>
      <div className={`group p-5 bg-white dark:bg-gray-800 rounded-xl border hover:shadow-md transition-all cursor-pointer ${
        isIgnored
          ? 'border-orange-300 dark:border-orange-600'
          : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'
      }`}>
        {/* Warning Badge */}
        {isIgnored && (
          <div className="mb-2">
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              No activity in 7+ days
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                {typeIcons[goal.type]}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                {goal.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 italic">
              "{goal.why}"
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[goal.status]}`}>
              {goal.status}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {goal.quarter} {goal.year}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <GoalProgressBar progress={progress} />
          {goal.type === 'numeric' && goal.targetMetric && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {goal.currentMetric || 0} / {goal.targetMetric} {goal.metricUnit || ''}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
              {typeLabels[goal.type]}
            </span>
            {linkedProjects.length > 0 && (
              <span>{linkedProjects.length} project{linkedProjects.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          {goal.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: goal.color }}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
