'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import TaskList from '@/components/tasks/TaskList';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import { Task, TaskMode, TaskTimeBlock } from '@/types';

const modes: { id: TaskMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deep-work', label: 'Deep Work' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'family', label: 'Family' },
  { id: 'sales', label: 'Sales' },
];

const timeBlocks: { id: TaskTimeBlock; label: string; emoji: string }[] = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
];

export default function TodayPage() {
  const { getTodayTasks, getTodayIntent, setTodayIntent, setTodayReflection, updateTask } = useApp();
  const [activeMode, setActiveMode] = useState<TaskMode>('all');

  const todayTasks = getTodayTasks();
  const todayIntent = getTodayIntent();
  const today = new Date().toISOString().split('T')[0];

  // Filter tasks by mode
  const filteredTasks = useMemo(() => {
    if (activeMode === 'all') return todayTasks;
    return todayTasks.filter((t) => t.mode === activeMode);
  }, [todayTasks, activeMode]);

  // Group tasks by time block
  const tasksByTimeBlock = useMemo(() => {
    return timeBlocks.map((block) => ({
      ...block,
      tasks: filteredTasks.filter((t) => t.timeBlock === block.id),
    }));
  }, [filteredTasks]);

  // Unscheduled tasks (in today but no time block)
  const unscheduledTasks = filteredTasks.filter((t) => t.timeBlock === 'unscheduled');

  // Calculate stats
  const totalTasks = todayTasks.length;
  const doneTasks = todayTasks.filter((t) => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Format today's date nicely
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {doneTasks} of {totalTasks} tasks completed
          </span>
          <span className="text-sm font-bold text-brand-500">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Daily Intent */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Today I intend to...
        </label>
        <textarea
          value={todayIntent?.intention || ''}
          onChange={(e) => setTodayIntent(e.target.value)}
          placeholder="Set your intention for today..."
          rows={2}
          className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeMode === mode.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Time Blocks */}
      <div className="space-y-6">
        {tasksByTimeBlock.map((block) => (
          <div
            key={block.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>{block.emoji}</span>
              <span>{block.label}</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({block.tasks.length})
              </span>
            </h2>
            {block.tasks.length > 0 ? (
              <TaskList tasks={block.tasks} />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm py-2">
                No tasks scheduled for {block.label.toLowerCase()}
              </p>
            )}
          </div>
        ))}

        {/* Unscheduled */}
        {unscheduledTasks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Unscheduled ({unscheduledTasks.length})
            </h2>
            <TaskList tasks={unscheduledTasks} />
          </div>
        )}
      </div>

      {/* Add Task */}
      <div className="mt-6">
        <AddTaskForm defaultScheduledFor={today} />
      </div>

      {/* Evening Reflection (show after 6 PM) */}
      {new Date().getHours() >= 18 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mt-6">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Evening Reflection
          </label>
          <textarea
            value={todayIntent?.reflection || ''}
            onChange={(e) => setTodayReflection(e.target.value)}
            placeholder="How did today go? What did you learn?"
            rows={3}
            className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}
