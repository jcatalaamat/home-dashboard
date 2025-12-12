'use client';

import React, { useState } from 'react';
import { ContentItem } from '@/types';
import EditContentForm from './EditContentForm';

interface ContentCardProps {
  content: ContentItem;
}

const statusColors = {
  idea: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ready: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  posted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const typeColors = {
  post: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  reel: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  carousel: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  copy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  template: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
};

const platformColors = {
  instagram: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  linkedin: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  twitter: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
  youtube: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  other: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
};

const typeLabels = {
  post: 'Post',
  reel: 'Reel',
  carousel: 'Carousel',
  copy: 'Copy',
  template: 'Template',
};

const platformLabels = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  youtube: 'YouTube',
  other: 'Other',
};

export default function ContentCard({ content }: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isEditing) {
    return <EditContentForm content={content} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors mb-2 line-clamp-2">
          {content.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[content.type]}`}>
            {typeLabels[content.type]}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${platformColors[content.platform]}`}>
            {platformLabels[content.platform]}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[content.status]}`}>
            {content.status}
          </span>
        </div>
      </div>

      {/* Content Preview */}
      {content.content && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {content.content}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-1">
          {content.scheduledFor && (
            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(content.scheduledFor)}</span>
            </div>
          )}
          {content.postedAt && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Posted {formatDate(content.postedAt)}</span>
            </div>
          )}
        </div>

        {content.assetUrls.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {content.assetUrls.length} asset{content.assetUrls.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
