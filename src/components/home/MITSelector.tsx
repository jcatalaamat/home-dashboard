'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/types';

export default function MITSelector() {
  const { getTodayTasks, getMITs, setMITs, updateTask, goals } = useApp();
  const todayTasks = getTodayTasks();
  const currentMITTasks = getMITs();
  const currentMITIds = currentMITTasks.map((t) => t.id);

  const [selectedMITs, setSelectedMITs] = useState<string[]>(currentMITIds);
  const [isSelecting, setIsSelecting] = useState(false);

  // Filter out completed tasks
  const availableTasks = todayTasks.filter(
    (t) => t.status !== 'done' && !selectedMITs.includes(t.id)
  );

  const mitTasks = todayTasks.filter((t) => selectedMITs.includes(t.id));
  const completedMITs = mitTasks.filter((t) => t.status === 'done').length;

  const handleSelectMIT = (taskId: string) => {
    if (selectedMITs.length >= 3) return;
    const newMITs = [...selectedMITs, taskId];
    setSelectedMITs(newMITs);
    setMITs(newMITs);
    setIsSelecting(false);
  };

  const handleRemoveMIT = (taskId: string) => {
    const newMITs = selectedMITs.filter((id) => id !== taskId);
    setSelectedMITs(newMITs);
    setMITs(newMITs);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, {
      status: task.status === 'done' ? 'todo' : 'done',
    });
  };

  const getGoalForTask = (task: Task) => {
    if (task.goalId) {
      return goals.find((g) => g.id === task.goalId);
    }
    return null;
  };

  if (selectedMITs.length === 0 && !isSelecting) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Important Tasks
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose 3 tasks that would make today successful
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSelecting(true)}
          className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-500 transition-colors"
        >
          + Select Your MITs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Most Important Tasks
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedMITs}/{selectedMITs.length} completed
          </p>
        </div>
        {selectedMITs.length < 3 && (
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className="text-xs text-brand-500 hover:text-brand-600"
          >
            {isSelecting ? 'Cancel' : '+ Add'}
          </button>
        )}
      </div>

      {/* Selected MITs */}
      <div className="space-y-2 mb-4">
        {mitTasks.map((task, index) => {
          const goal = getGoalForTask(task);
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                task.status === 'done'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                  : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-5">
                {index + 1}
              </span>
              <button
                onClick={() => handleToggleComplete(task)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'done'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
                }`}
              >
                {task.status === 'done' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    task.status === 'done'
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </p>
                {goal && (
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: goal.color || '#6B7280' }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {goal.title}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRemoveMIT(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Task Selector */}
      {isSelecting && availableTasks.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Select from today's tasks:
          </p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {availableTasks.map((task) => {
              const goal = getGoalForTask(task);
              return (
                <button
                  key={task.id}
                  onClick={() => handleSelectMIT(task.id)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <p className="text-sm text-gray-900 dark:text-white">{task.title}</p>
                  {goal && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: goal.color || '#6B7280' }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.title}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isSelecting && availableTasks.length === 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No more tasks available for today.
          </p>
        </div>
      )}
    </div>
  );
}
