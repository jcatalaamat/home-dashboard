'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function MorningCheckIn() {
  const { getTodayCheckIn, setMorningCheckIn, getActiveGoals } = useApp();
  const checkIn = getTodayCheckIn();
  const activeGoals = getActiveGoals();

  const [intention, setIntention] = useState(checkIn?.morningIntention || '');
  const [singleAction, setSingleAction] = useState(checkIn?.singleAction || '');
  const [goalFocus, setGoalFocus] = useState<string | null>(checkIn?.goalFocus || null);
  const [isSaved, setIsSaved] = useState(false);

  // Check if it's morning (before noon)
  const hour = new Date().getHours();
  const isMorning = hour < 12;

  // If already filled in, show compact view
  const isComplete = checkIn?.morningIntention && checkIn?.singleAction;

  const handleSave = () => {
    setMorningCheckIn({
      morningIntention: intention,
      singleAction,
      goalFocus,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isComplete && !isMorning) {
    return null; // Hide after morning if complete
  }

  if (isComplete) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-amber-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">☀️</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Morning Check-In
          </h2>
          <span className="ml-auto text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            Complete
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Intention:</span> {checkIn.morningIntention}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Single action:</span> {checkIn.singleAction}
          </p>
          {checkIn.goalFocus && (
            <p className="text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Focus goal:</span>{' '}
              {activeGoals.find((g) => g.id === checkIn.goalFocus)?.title}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-amber-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">☀️</span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Morning Check-In
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What's your intention for today?
          </label>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Today I will..."
            className="w-full px-3 py-2 text-sm border border-amber-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What single action would make today a win?
          </label>
          <input
            type="text"
            value={singleAction}
            onChange={(e) => setSingleAction(e.target.value)}
            placeholder="If I accomplish just one thing..."
            className="w-full px-3 py-2 text-sm border border-amber-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {activeGoals.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Which goal needs attention today?
            </label>
            <select
              value={goalFocus || ''}
              onChange={(e) => setGoalFocus(e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-amber-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">Select a goal...</option>
              {activeGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!intention.trim() || !singleAction.trim()}
          className="w-full py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSaved ? '✓ Saved!' : 'Start My Day'}
        </button>
      </div>
    </div>
  );
}
