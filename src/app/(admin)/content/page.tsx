'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ContentCard from '@/components/content/ContentCard';
import AddContentForm from '@/components/content/AddContentForm';
import { ContentStatus, ContentType } from '@/types';

type StatusFilter = 'all' | 'idea' | 'draft' | 'ready' | 'scheduled' | 'posted';
type TypeFilter = 'all' | 'post' | 'reel' | 'carousel' | 'copy' | 'template';

const statusTabs: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'idea', label: 'Ideas' },
  { id: 'draft', label: 'Drafts' },
  { id: 'ready', label: 'Ready' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'posted', label: 'Posted' },
];

const typeTabs: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'post', label: 'Posts' },
  { id: 'reel', label: 'Reels' },
  { id: 'carousel', label: 'Carousels' },
  { id: 'copy', label: 'Copy' },
  { id: 'template', label: 'Templates' },
];

export default function ContentPage() {
  const { contentItems } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const getFilteredContent = () => {
    return contentItems.filter((item) => {
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      const typeMatch = typeFilter === 'all' || item.type === typeFilter;
      return statusMatch && typeMatch;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const filteredContent = getFilteredContent();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Engine</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {filteredContent.length} content item{filteredContent.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
          Filter by Status
        </label>
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="mb-6">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
          Filter by Type
        </label>
        <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                typeFilter === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AddContentForm />
        {filteredContent.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No content found. Create your first content item!
        </div>
      )}
    </div>
  );
}
