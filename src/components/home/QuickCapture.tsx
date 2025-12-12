'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PlusIcon } from '@/icons';

export default function QuickCapture() {
  const { addTask } = useApp();
  const [taskTitle, setTaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Add to inbox (no project, no schedule)
    addTask({
      title: taskTitle.trim(),
      projectId: null,
      goalId: null,
      areaId: null,
      area: 'work',
      category: 'cashflow',
      status: 'todo',
      priority: 'normal',
      dueDate: null,
      scheduledFor: null,
      timeBlock: 'unscheduled',
      mode: 'all',
    });

    setTaskTitle('');
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Capture
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task to inbox..."
          className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!taskTitle.trim() || isSubmitting}
          className="px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Press Enter to add task to inbox
      </p>
    </div>
  );
}
