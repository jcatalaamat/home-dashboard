'use client';

import React from 'react';
import { Task, Goal } from '@/types';
import { useApp } from '@/context/AppContext';

interface LastWeekSummaryProps {
  completedTasks: Task[];
  startDate: Date;
  endDate: Date;
}

export default function LastWeekSummary({
  completedTasks,
  startDate,
  endDate,
}: LastWeekSummaryProps) {
  const { goals, projects } = useApp();

  // Group tasks by goal
  const tasksByGoal = new Map<string | null, Task[]>();
  const noGoalTasks: Task[] = [];

  completedTasks.forEach((task) => {
    if (task.goalId) {
      const existing = tasksByGoal.get(task.goalId) || [];
      tasksByGoal.set(task.goalId, [...existing, task]);
    } else if (task.projectId) {
      const project = projects.find((p) => p.id === task.projectId);
      if (project?.goalId) {
        const existing = tasksByGoal.get(project.goalId) || [];
        tasksByGoal.set(project.goalId, [...existing, task]);
      } else {
        noGoalTasks.push(task);
      }
    } else {
      noGoalTasks.push(task);
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Last Week's Progress
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </div>

      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {completedTasks.length}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          tasks completed
        </p>
      </div>

      {/* Tasks grouped by goal */}
      <div className="space-y-4">
        {Array.from(tasksByGoal.entries()).map(([goalId, tasks]) => {
          const goal = goals.find((g) => g.id === goalId);
          if (!goal) return null;

          return (
            <div key={goalId}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: goal.color || '#6B7280' }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {goal.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({tasks.length} task{tasks.length !== 1 ? 's' : ''})
                </span>
              </div>
              <ul className="ml-5 space-y-1">
                {tasks.slice(0, 3).map((task) => (
                  <li
                    key={task.id}
                    className="text-sm text-gray-600 dark:text-gray-400 truncate"
                  >
                    • {task.title}
                  </li>
                ))}
                {tasks.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-500">
                    +{tasks.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          );
        })}

        {/* Orphan tasks */}
        {noGoalTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Other tasks
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({noGoalTasks.length} task{noGoalTasks.length !== 1 ? 's' : ''})
              </span>
            </div>
            <ul className="ml-5 space-y-1">
              {noGoalTasks.slice(0, 3).map((task) => (
                <li
                  key={task.id}
                  className="text-sm text-gray-600 dark:text-gray-400 truncate"
                >
                  • {task.title}
                </li>
              ))}
              {noGoalTasks.length > 3 && (
                <li className="text-xs text-gray-500 dark:text-gray-500">
                  +{noGoalTasks.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {completedTasks.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No completed tasks last week.
          </p>
        )}
      </div>
    </div>
  );
}
