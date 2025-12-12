'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PlusIcon } from '@/icons';

interface OutcomeFormProps {
  onAdd: (description: string, goalId: string | null) => void;
}

export default function OutcomeForm({ onAdd }: OutcomeFormProps) {
  const { getActiveGoals } = useApp();
  const activeGoals = getActiveGoals();

  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAdd(description.trim(), goalId);
    setDescription('');
    setGoalId(null);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
      >
        <PlusIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Add weekly outcome</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What outcome would make this week a success?"
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
          autoFocus
        />

        <select
          value={goalId || ''}
          onChange={(e) => setGoalId(e.target.value || null)}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
        >
          <option value="">Link to a goal (optional)</option>
          {activeGoals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!description.trim()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Add Outcome
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setDescription('');
              setGoalId(null);
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
