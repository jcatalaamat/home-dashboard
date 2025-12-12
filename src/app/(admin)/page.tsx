'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import TodayFocus from '@/components/home/TodayFocus';
import ActiveProjects from '@/components/home/ActiveProjects';
import QuickCapture from '@/components/home/QuickCapture';
import GoalContext from '@/components/home/GoalContext';
import MorningCheckIn from '@/components/home/MorningCheckIn';
import EveningReflection from '@/components/home/EveningReflection';
import MITSelector from '@/components/home/MITSelector';

export default function HomePage() {
  const {
    getTodayTasks,
    getActiveProjects,
    getTodayIntent,
    getActiveGoals,
    getOrphanTasks,
    getIgnoredGoals,
  } = useApp();

  const todayTasks = getTodayTasks();
  const activeProjects = getActiveProjects();
  const todayIntent = getTodayIntent();
  const activeGoals = getActiveGoals();
  const orphanTasks = getOrphanTasks();
  const ignoredGoals = getIgnoredGoals();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Format today's date nicely
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Calculate daily stats
  const completedToday = todayTasks.filter((t) => t.status === 'done').length;
  const totalToday = todayTasks.length;
  const highPriorityTasks = todayTasks.filter(
    (t) => t.priority === 'high' && t.status !== 'done'
  ).length;

  // Check time of day for Coach Mode
  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isEvening = hour >= 18;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, Astral
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>

        {/* Top Priority Line */}
        {highPriorityTasks > 0 && (
          <div className="mt-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              You have {highPriorityTasks} high-priority task{highPriorityTasks !== 1 ? 's' : ''} today
            </p>
          </div>
        )}

        {/* Daily Intent Preview */}
        {todayIntent?.intention && (
          <div className="mt-3 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg">
            <p className="text-sm text-brand-700 dark:text-brand-400">
              {todayIntent.intention}
            </p>
          </div>
        )}

        {/* Coaching Warnings */}
        {orphanTasks.length > 0 && (
          <div className="mt-3 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              {orphanTasks.length} task{orphanTasks.length !== 1 ? 's' : ''} without goal context.{' '}
              <span className="text-yellow-600 dark:text-yellow-500">
                Consider linking to a North Star.
              </span>
            </p>
          </div>
        )}

        {ignoredGoals.length > 0 && (
          <div className="mt-3 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              {ignoredGoals.length} goal{ignoredGoals.length !== 1 ? 's' : ''} need attention (no activity in 7+ days).
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Progress</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {completedToday}/{totalToday}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">tasks completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {activeGoals.length}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">north stars</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Projects</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {activeProjects.length}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">in progress</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Focus Mode</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {isMorning ? 'Morning' : isEvening ? 'Evening' : 'Afternoon'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">current block</p>
        </div>
      </div>

      {/* Coach Mode Section */}
      {(isMorning || isEvening) && (
        <div className="mb-6">
          {isMorning && <MorningCheckIn />}
          {isEvening && <EveningReflection />}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <GoalContext />
          <MITSelector />
          <TodayFocus />
          <QuickCapture />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ActiveProjects />
        </div>
      </div>
    </div>
  );
}
