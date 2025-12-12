'use client';

import React from 'react';
import { WeeklyOutcome } from '@/types';
import { useApp } from '@/context/AppContext';
import { CheckCircleIcon, CloseIcon } from '@/icons';

interface WeeklyOutcomeCardProps {
  outcome: WeeklyOutcome;
  onToggle: () => void;
  onRemove: () => void;
}

export default function WeeklyOutcomeCard({
  outcome,
  onToggle,
  onRemove,
}: WeeklyOutcomeCardProps) {
  const { goals } = useApp();
  const linkedGoal = outcome.goalId ? goals.find((g) => g.id === outcome.goalId) : null;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        outcome.isCompleted
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            outcome.isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-brand-500'
          }`}
        >
          {outcome.isCompleted && (
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
              outcome.isCompleted
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {outcome.description}
          </p>
          {linkedGoal && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: linkedGoal.color || '#6B7280' }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {linkedGoal.title}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
