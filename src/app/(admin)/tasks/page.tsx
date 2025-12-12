'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import TaskList from '@/components/tasks/TaskList';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import { TaskFilter } from '@/types';

type FilterTab = 'inbox' | 'today' | 'upcoming' | 'someday' | 'all';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'someday', label: 'Someday' },
  { id: 'all', label: 'All' },
];

export default function TasksPage() {
  const { tasks, getInboxTasks, getTodayTasks, getUpcomingTasks, getSomedayTasks } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('today');

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'inbox':
        return getInboxTasks();
      case 'today':
        return getTodayTasks();
      case 'upcoming':
        return getUpcomingTasks();
      case 'someday':
        return getSomedayTasks();
      case 'all':
        return tasks.filter((t) => t.status !== 'done');
      default:
        return [];
    }
  };

  const filteredTasks = getFilteredTasks();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <TaskList
          tasks={filteredTasks}
          emptyMessage={
            activeTab === 'inbox'
              ? 'Inbox is empty! Tasks without a project or schedule land here.'
              : activeTab === 'today'
              ? 'Nothing scheduled for today. Add a task or schedule one from inbox.'
              : activeTab === 'upcoming'
              ? 'No upcoming tasks scheduled.'
              : activeTab === 'someday'
              ? 'No "someday" tasks. Use this for ideas you want to revisit later.'
              : 'No active tasks.'
          }
        />

        <div className="mt-4">
          <AddTaskForm
            defaultScheduledFor={activeTab === 'today' ? today : null}
          />
        </div>
      </div>
    </div>
  );
}
