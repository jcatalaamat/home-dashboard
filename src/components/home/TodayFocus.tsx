'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import TaskItem from '@/components/tasks/TaskItem';

export default function TodayFocus() {
  const { getTodayTasks } = useApp();
  const todayTasks = getTodayTasks();

  // Get top 5 tasks that aren't done, prioritize high priority
  const focusTasks = todayTasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  const doneTasks = todayTasks.filter((t) => t.status === 'done').length;
  const totalTasks = todayTasks.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today&apos;s Focus
        </h2>
        <Link
          href="/today"
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          View all →
        </Link>
      </div>

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">
              {doneTasks}/{totalTasks} completed
            </span>
            <span className="font-medium text-brand-500">
              {Math.round((doneTasks / totalTasks) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      {focusTasks.length > 0 ? (
        <div className="space-y-2">
          {focusTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          {totalTasks > 0 ? (
            <p>All tasks completed! 🎉</p>
          ) : (
            <p>No tasks scheduled for today</p>
          )}
        </div>
      )}
    </div>
  );
}
