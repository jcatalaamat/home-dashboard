'use client';

import React from 'react';

interface FutureModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

const futureModules: FutureModule[] = [
  {
    id: 'ideas',
    title: 'Ideas Module',
    description: 'Capture and promote brilliant ideas to full projects. Track ideation to execution.',
    icon: '💡',
    category: 'Productivity',
  },
  {
    id: 'calendar',
    title: 'Calendar Integration',
    description: 'Sync with Google Calendar, iCal, and Outlook. Unified calendar view across all your systems.',
    icon: '📆',
    category: 'Integration',
  },
  {
    id: 'goals',
    title: 'Goals & OKRs',
    description: 'Set and track personal and business goals. Measure progress with OKRs and key metrics.',
    icon: '🎯',
    category: 'Strategy',
  },
  {
    id: 'team',
    title: 'Team & Delegation',
    description: 'Collaborate with team members. Assign tasks, track progress, and manage accountability.',
    icon: '👥',
    category: 'Collaboration',
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Deep insights into your productivity. Time tracking, habit streaks, and performance metrics.',
    icon: '📊',
    category: 'Analytics',
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Smart suggestions for task prioritization. Natural language processing for quick captures.',
    icon: '🤖',
    category: 'AI',
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    description: 'Native iOS and Android apps. Full offline support with seamless cloud sync.',
    icon: '📱',
    category: 'Platform',
  },
  {
    id: 'integrations',
    title: 'API Integrations',
    description: 'Connect with Notion, Slack, Zapier, and more. Automate workflows across your tools.',
    icon: '🔌',
    category: 'Integration',
  },
  {
    id: 'journaling',
    title: 'Advanced Journaling',
    description: 'Rich text editor with templates. Daily prompts, mood tracking, and gratitude logging.',
    icon: '📝',
    category: 'Wellness',
  },
  {
    id: 'relationships',
    title: 'Relationship CRM',
    description: 'Manage personal and professional relationships. Track interactions and important dates.',
    icon: '❤️',
    category: 'Personal',
  },
  {
    id: 'knowledge',
    title: 'Knowledge Base',
    description: 'Build your second brain. Link notes, create wikis, and manage your personal knowledge.',
    icon: '🧠',
    category: 'Learning',
  },
  {
    id: 'finances',
    title: 'Advanced Finance',
    description: 'Investment tracking, budget forecasting, and financial goal planning with visualizations.',
    icon: '💰',
    category: 'Finance',
  },
];

const categoryColors: Record<string, string> = {
  Productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Integration: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Strategy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Collaboration: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Analytics: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  AI: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Platform: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  Wellness: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  Personal: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Learning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export default function ExpandPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Expansion Room
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Future modules and features coming to Astral OS
        </p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 mb-8 text-white">
        <h2 className="text-xl font-bold mb-2">The Vision</h2>
        <p className="text-brand-50">
          Astral OS is evolving into a complete operating system for your life. These modules represent
          the future roadmap - features designed to help you build, grow, and thrive across every dimension
          of your personal and professional journey.
        </p>
      </div>

      {/* Coming Soon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {futureModules.map((module) => (
          <div
            key={module.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group"
          >
            {/* Icon & Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{module.icon}</div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                Coming Soon
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {module.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {module.description}
            </p>

            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  categoryColors[module.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {module.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Have a Feature Request?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Help shape the future of Astral OS. Share your ideas and vote on upcoming features.
        </p>
        <button
          className="px-6 py-3 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
          onClick={() => alert('Feature request form coming soon!')}
        >
          Submit Feature Request
        </button>
      </div>

      {/* Development Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Development Roadmap
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
              Q1 2025
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Foundation Phase
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ideas Module, Calendar Integration, Advanced Journaling
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
              Q2 2025
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Growth Phase
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Goals & OKRs, Team & Delegation, Analytics Dashboard
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
              Q3 2025
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Intelligence Phase
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                AI Assistant, API Integrations, Knowledge Base
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
              Q4 2025
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Platform Phase
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mobile App (iOS & Android), Advanced Finance, Relationship CRM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
