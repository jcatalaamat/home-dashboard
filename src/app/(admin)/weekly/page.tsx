'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { WeeklyOutcome } from '@/types';
import WeeklyReviewForm from '@/components/weekly/WeeklyReviewForm';
import WeeklyOutcomeCard from '@/components/weekly/WeeklyOutcomeCard';
import OutcomeForm from '@/components/weekly/OutcomeForm';
import LastWeekSummary from '@/components/weekly/LastWeekSummary';

type Phase = 'review' | 'plan';

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function getLastWeekDates(): { start: Date; end: Date } {
  const today = new Date();
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - today.getDay() - 6);
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  return { start: lastMonday, end: lastSunday };
}

export default function WeeklyPage() {
  const {
    tasks,
    goals,
    getCurrentWeekReview,
    addWeeklyReview,
    updateWeeklyReview,
    getActiveGoals,
    getIgnoredGoals,
  } = useApp();

  const weekStart = getWeekStart(new Date());
  const currentReview = getCurrentWeekReview();
  const activeGoals = getActiveGoals();
  const ignoredGoals = getIgnoredGoals();

  const [phase, setPhase] = useState<Phase>(
    currentReview?.whatMovedNeedle ? 'plan' : 'review'
  );

  // Review form state
  const [whatMovedNeedle, setWhatMovedNeedle] = useState(currentReview?.whatMovedNeedle || '');
  const [whatDidntWork, setWhatDidntWork] = useState(currentReview?.whatDidntWork || '');
  const [whatFeltAligned, setWhatFeltAligned] = useState(currentReview?.whatFeltAligned || '');

  // Outcomes state
  const [outcomes, setOutcomes] = useState<WeeklyOutcome[]>(
    currentReview?.weeklyOutcomes || []
  );

  // Get last week's completed tasks
  const { start: lastWeekStart, end: lastWeekEnd } = getLastWeekDates();
  const lastWeekCompletedTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.status !== 'done') return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= lastWeekStart && taskDate <= lastWeekEnd;
    });
  }, [tasks, lastWeekStart, lastWeekEnd]);

  // Check which goals have outcomes linked
  const goalsWithOutcomes = new Set(
    outcomes.filter((o) => o.goalId).map((o) => o.goalId)
  );
  const ignoredGoalsWithoutOutcomes = ignoredGoals.filter(
    (g) => !goalsWithOutcomes.has(g.id)
  );

  const handleSaveReview = () => {
    if (currentReview) {
      updateWeeklyReview(currentReview.id, {
        whatMovedNeedle,
        whatDidntWork,
        whatFeltAligned,
      });
    } else {
      addWeeklyReview({
        weekStart,
        whatMovedNeedle,
        whatDidntWork,
        whatFeltAligned,
        weeklyOutcomes: [],
      });
    }
    setPhase('plan');
  };

  const handleAddOutcome = (description: string, goalId: string | null) => {
    const newOutcome: WeeklyOutcome = {
      id: `outcome-${Date.now()}`,
      description,
      goalId,
      isCompleted: false,
      linkedTaskIds: [],
    };
    const newOutcomes = [...outcomes, newOutcome];
    setOutcomes(newOutcomes);

    // Save to review
    if (currentReview) {
      updateWeeklyReview(currentReview.id, { weeklyOutcomes: newOutcomes });
    }
  };

  const handleToggleOutcome = (outcomeId: string) => {
    const newOutcomes = outcomes.map((o) =>
      o.id === outcomeId ? { ...o, isCompleted: !o.isCompleted } : o
    );
    setOutcomes(newOutcomes);

    if (currentReview) {
      updateWeeklyReview(currentReview.id, { weeklyOutcomes: newOutcomes });
    }
  };

  const handleRemoveOutcome = (outcomeId: string) => {
    const newOutcomes = outcomes.filter((o) => o.id !== outcomeId);
    setOutcomes(newOutcomes);

    if (currentReview) {
      updateWeeklyReview(currentReview.id, { weeklyOutcomes: newOutcomes });
    }
  };

  const formatWeekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Planning</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Week of {formatWeekRange()}
        </p>
      </div>

      {/* Phase Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setPhase('review')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            phase === 'review'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          1. Review Last Week
        </button>
        <button
          onClick={() => setPhase('plan')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            phase === 'plan'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          2. Plan This Week
        </button>
      </div>

      {/* Phase 1: Review */}
      {phase === 'review' && (
        <div className="space-y-6">
          <LastWeekSummary
            completedTasks={lastWeekCompletedTasks}
            startDate={lastWeekStart}
            endDate={lastWeekEnd}
          />

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reflect on Last Week
            </h2>
            <WeeklyReviewForm
              whatMovedNeedle={whatMovedNeedle}
              setWhatMovedNeedle={setWhatMovedNeedle}
              whatDidntWork={whatDidntWork}
              setWhatDidntWork={setWhatDidntWork}
              whatFeltAligned={whatFeltAligned}
              setWhatFeltAligned={setWhatFeltAligned}
            />

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSaveReview}
                className="w-full py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium transition-colors"
              >
                Continue to Planning →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Plan */}
      {phase === 'plan' && (
        <div className="space-y-6">
          {/* Ignored Goals Warning */}
          {ignoredGoalsWithoutOutcomes.length > 0 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl">
              <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-2">
                Goals needing attention:
              </p>
              <div className="flex flex-wrap gap-2">
                {ignoredGoalsWithoutOutcomes.map((goal) => (
                  <span
                    key={goal.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-800/30 text-orange-700 dark:text-orange-300 rounded-full text-xs"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: goal.color || '#F97316' }}
                    />
                    {goal.title}
                  </span>
                ))}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                Consider adding an outcome for these goals this week.
              </p>
            </div>
          )}

          {/* Weekly Outcomes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weekly Outcomes
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  What 3 outcomes would make this week a success?
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {outcomes.filter((o) => o.isCompleted).length}/{outcomes.length} complete
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {outcomes.map((outcome) => (
                <WeeklyOutcomeCard
                  key={outcome.id}
                  outcome={outcome}
                  onToggle={() => handleToggleOutcome(outcome.id)}
                  onRemove={() => handleRemoveOutcome(outcome.id)}
                />
              ))}
            </div>

            {outcomes.length < 5 && <OutcomeForm onAdd={handleAddOutcome} />}

            {outcomes.length >= 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                Maximum 5 outcomes. Focus is power.
              </p>
            )}
          </div>

          {/* Active Goals Quick View */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Active North Stars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeGoals.map((goal) => {
                const hasOutcome = goalsWithOutcomes.has(goal.id);
                return (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      hasOutcome
                        ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: goal.color || '#6B7280' }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white truncate">
                        {goal.title}
                      </span>
                      {hasOutcome && (
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {goal.quarter} {goal.year}
                    </p>
                  </div>
                );
              })}
            </div>

            {activeGoals.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No active goals. Create one to start planning with purpose.
              </p>
            )}
          </div>

          {/* Review Summary (collapsed) */}
          {(whatMovedNeedle || whatDidntWork || whatFeltAligned) && (
            <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Week's Review
              </summary>
              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {whatMovedNeedle && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">What moved the needle:</p>
                    <p className="mt-1">{whatMovedNeedle}</p>
                  </div>
                )}
                {whatDidntWork && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">What didn't work:</p>
                    <p className="mt-1">{whatDidntWork}</p>
                  </div>
                )}
                {whatFeltAligned && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">What felt aligned:</p>
                    <p className="mt-1">{whatFeltAligned}</p>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
