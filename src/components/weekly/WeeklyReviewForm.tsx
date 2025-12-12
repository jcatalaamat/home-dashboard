'use client';

import React from 'react';

interface WeeklyReviewFormProps {
  whatMovedNeedle: string;
  setWhatMovedNeedle: (value: string) => void;
  whatDidntWork: string;
  setWhatDidntWork: (value: string) => void;
  whatFeltAligned: string;
  setWhatFeltAligned: (value: string) => void;
}

export default function WeeklyReviewForm({
  whatMovedNeedle,
  setWhatMovedNeedle,
  whatDidntWork,
  setWhatDidntWork,
  whatFeltAligned,
  setWhatFeltAligned,
}: WeeklyReviewFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What moved the needle?
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          What actions or accomplishments made the biggest impact?
        </p>
        <textarea
          value={whatMovedNeedle}
          onChange={(e) => setWhatMovedNeedle(e.target.value)}
          placeholder="The biggest wins this week..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What didn't work?
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          What obstacles, distractions, or mistakes held you back?
        </p>
        <textarea
          value={whatDidntWork}
          onChange={(e) => setWhatDidntWork(e.target.value)}
          placeholder="Things to improve or avoid..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What felt aligned?
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          What moments felt energizing, meaningful, or in flow?
        </p>
        <textarea
          value={whatFeltAligned}
          onChange={(e) => setWhatFeltAligned(e.target.value)}
          placeholder="Moments of alignment and flow..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>
    </div>
  );
}
