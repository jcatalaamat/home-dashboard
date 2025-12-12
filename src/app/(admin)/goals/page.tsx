'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import GoalCard from '@/components/goals/GoalCard';
import AddGoalForm from '@/components/goals/AddGoalForm';
import { Quarter, GoalStatus } from '@/types';

type FilterTab = 'active' | 'all' | 'achieved';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'achieved', label: 'Achieved' },
];

const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const currentYear = new Date().getFullYear();
const currentQuarter = (): Quarter => {
  const month = new Date().getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

export default function GoalsPage() {
  const { goals, getActiveGoals, getGoalsByQuarter, getIgnoredGoals, getOrphanTasks } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('active');
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter | 'all'>(currentQuarter());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const activeGoals = getActiveGoals();
  const ignoredGoals = getIgnoredGoals();
  const orphanTasks = getOrphanTasks();

  const getFilteredGoals = () => {
    let filtered = goals;

    // Filter by status
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter((g) => g.status === 'active');
        break;
      case 'achieved':
        filtered = filtered.filter((g) => g.status === 'achieved');
        break;
      case 'all':
      default:
        break;
    }

    // Filter by quarter/year
    if (selectedQuarter !== 'all') {
      filtered = filtered.filter(
        (g) => g.quarter === selectedQuarter && g.year === selectedYear
      );
    }

    return filtered;
  };

  const filteredGoals = getFilteredGoals();
  const onTrackGoals = activeGoals.filter((g) => !ignoredGoals.some((ig) => ig.id === g.id));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">North Stars</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your high-level goals that guide every action
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-green-600">{onTrackGoals.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">On Track</p>
        </div>
        <div className={`p-4 rounded-xl border ${
          ignoredGoals.length > 0
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <p className={`text-2xl font-bold ${
            ignoredGoals.length > 0 ? 'text-orange-600' : 'text-gray-900 dark:text-white'
          }`}>
            {ignoredGoals.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ignored (7+ days)</p>
        </div>
        <div className={`p-4 rounded-xl border ${
          orphanTasks.length > 0
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <p className={`text-2xl font-bold ${
            orphanTasks.length > 0 ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
          }`}>
            {orphanTasks.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Orphan Tasks</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Status Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
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

        {/* Quarter/Year Filter */}
        <div className="flex gap-2">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value as Quarter | 'all')}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Quarters</option>
            {quarters.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
            <option value={currentYear - 1}>{currentYear - 1}</option>
          </select>
        </div>
      </div>

      {/* Warning Banners */}
      {ignoredGoals.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl">
          <p className="text-sm text-orange-800 dark:text-orange-300">
            <strong>Heads up:</strong> {ignoredGoals.length} goal{ignoredGoals.length !== 1 ? 's' : ''} {ignoredGoals.length !== 1 ? 'have' : 'has'} had no activity in 7+ days.
            Consider taking action or pausing {ignoredGoals.length !== 1 ? 'them' : 'it'}.
          </p>
        </div>
      )}

      {orphanTasks.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>Coaching note:</strong> {orphanTasks.length} task{orphanTasks.length !== 1 ? 's don\'t' : ' doesn\'t'} support any goal.
            Link {orphanTasks.length !== 1 ? 'them' : 'it'} to a North Star or consider if {orphanTasks.length !== 1 ? 'they\'re' : 'it\'s'} truly important.
          </p>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        <AddGoalForm />
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {activeTab === 'achieved'
            ? 'No achieved goals yet. Keep pushing!'
            : selectedQuarter !== 'all'
            ? `No goals for ${selectedQuarter} ${selectedYear}.`
            : 'No goals yet. Set your first North Star!'}
        </div>
      )}
    </div>
  );
}
