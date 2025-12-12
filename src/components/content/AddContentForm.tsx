'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ContentType, ContentPlatform, ContentStatus } from '@/types';
import { PlusIcon } from '@/icons';

export default function AddContentForm() {
  const { addContent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('post');
  const [platform, setPlatform] = useState<ContentPlatform>('instagram');
  const [status, setStatus] = useState<ContentStatus>('idea');
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addContent({
      title: title.trim(),
      type,
      platform,
      status,
      content: content.trim(),
      assetUrls: [],
      scheduledFor: scheduledFor || null,
      postedAt: null,
      goalId: null,
    });

    // Reset form
    setTitle('');
    setContent('');
    setScheduledFor('');
    setType('post');
    setPlatform('instagram');
    setStatus('idea');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-all min-h-[200px]"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="font-medium">New Content</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-brand-300 dark:border-brand-600 space-y-4 shadow-md"
    >
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Content title..."
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Type and Platform */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            className="w-full text-sm px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="post">Post</option>
            <option value="reel">Reel</option>
            <option value="carousel">Carousel</option>
            <option value="copy">Copy</option>
            <option value="template">Template</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
            className="w-full text-sm px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Status and Scheduled Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            className="w-full text-sm px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="idea">Idea</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="w-full text-sm px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Create Content
        </button>
      </div>
    </form>
  );
}
