'use client';

import React from 'react';
import { Task, Project } from '@/types';
import { useApp } from '@/context/AppContext';
import { CheckCircleIcon, TimeIcon, FolderIcon } from '@/icons';

interface TaskItemProps {
  task: Task;
  showProject?: boolean;
}

const priorityColors = {
  low: 'text-gray-400',
  normal: 'text-blue-500',
  high: 'text-red-500',
};

const areaColors = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  family: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  admin: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  spiritual: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function TaskItem({ task, showProject = true }: TaskItemProps) {
  const { toggleTaskDone, getProject, scheduleTaskForToday, moveTaskToTomorrow } = useApp();
  const project = task.projectId ? getProject(task.projectId) : null;
  const isDone = task.status === 'done';

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isDone
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleTaskDone(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          isDone
            ? 'bg-brand-500 border-brand-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
        }`}
      >
        {isDone && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isDone ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </span>
          {task.priority === 'high' && !isDone && (
            <span className="w-2 h-2 rounded-full bg-red-500" title="High priority" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {showProject && project && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <FolderIcon className="w-3 h-3" />
              {project.name}
            </span>
          )}
          <span className={`text-xs px-1.5 py-0.5 rounded ${areaColors[task.area]}`}>
            {task.area}
          </span>
        </div>
      </div>

      {/* Quick Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.scheduledFor && !isDone && (
          <button
            onClick={() => scheduleTaskForToday(task.id)}
            className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Schedule for today"
          >
            <TimeIcon className="w-4 h-4" />
          </button>
        )}
        {task.scheduledFor && !isDone && (
          <button
            onClick={() => moveTaskToTomorrow(task.id)}
            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs"
            title="Move to tomorrow"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}
