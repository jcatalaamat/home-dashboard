'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function EveningReflection() {
  const { getTodayCheckIn, setEveningReflection, getActiveGoals } = useApp();
  const checkIn = getTodayCheckIn();
  const activeGoals = getActiveGoals();

  const [didMoveGoal, setDidMoveGoal] = useState(checkIn?.didMoveGoalForward || false);
  const [goalMovedId, setGoalMovedId] = useState<string | null>(checkIn?.goalMovedId || null);
  const [insight, setInsight] = useState(checkIn?.insight || '');
  const [whatLetGo, setWhatLetGo] = useState(checkIn?.whatLetGo || '');
  const [isSaved, setIsSaved] = useState(false);

  // Check if it's evening (after 6 PM)
  const hour = new Date().getHours();
  const isEvening = hour >= 18;

  // If already filled in, show compact view
  const isComplete = checkIn?.insight;

  if (!isEvening) {
    return null; // Only show in evening
  }

  const handleSave = () => {
    setEveningReflection({
      didMoveGoalForward: didMoveGoal,
      goalMovedId,
      insight,
      whatLetGo,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isComplete) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-indigo-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌙</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Evening Reflection
          </h2>
          <span className="ml-auto text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            Complete
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Goal progress:</span>{' '}
            {checkIn.didMoveGoalForward ? 'Yes!' : 'Not today'}
            {checkIn.goalMovedId && ` (${activeGoals.find((g) => g.id === checkIn.goalMovedId)?.title})`}
          </p>
          {checkIn.insight && (
            <p className="text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Insight:</span> {checkIn.insight}
            </p>
          )}
          {checkIn.whatLetGo && (
            <p className="text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-400">Let go of:</span> {checkIn.whatLetGo}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border border-indigo-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌙</span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evening Reflection
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Did you move a goal forward today?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDidMoveGoal(true)}
              className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                didMoveGoal
                  ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              Yes!
            </button>
            <button
              type="button"
              onClick={() => {
                setDidMoveGoal(false);
                setGoalMovedId(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                !didMoveGoal
                  ? 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              Not today
            </button>
          </div>
        </div>

        {didMoveGoal && activeGoals.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Which goal?
            </label>
            <select
              value={goalMovedId || ''}
              onChange={(e) => setGoalMovedId(e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-indigo-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What insight emerged today?
          </label>
          <input
            type="text"
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder="I realized that..."
            className="w-full px-3 py-2 text-sm border border-indigo-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What did you let go of?
          </label>
          <input
            type="text"
            value={whatLetGo}
            onChange={(e) => setWhatLetGo(e.target.value)}
            placeholder="I released..."
            className="w-full px-3 py-2 text-sm border border-indigo-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
        >
          {isSaved ? '✓ Saved!' : 'Complete Reflection'}
        </button>
      </div>
    </div>
  );
}
