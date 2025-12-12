'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ContentItem, ContentType, ContentPlatform, ContentStatus } from '@/types';

interface EditContentFormProps {
  content: ContentItem;
  onClose: () => void;
}

export default function EditContentForm({ content, onClose }: EditContentFormProps) {
  const { updateContent, deleteContent } = useApp();
  const [title, setTitle] = useState(content.title);
  const [type, setType] = useState<ContentType>(content.type);
  const [platform, setPlatform] = useState<ContentPlatform>(content.platform);
  const [status, setStatus] = useState<ContentStatus>(content.status);
  const [contentText, setContentText] = useState(content.content);
  const [scheduledFor, setScheduledFor] = useState(content.scheduledFor || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateContent(content.id, {
      title: title.trim(),
      type,
      platform,
      status,
      content: contentText.trim(),
      scheduledFor: scheduledFor || null,
      postedAt: status === 'posted' && !content.postedAt ? new Date().toISOString() : content.postedAt,
    });

    onClose();
  };

  const handleDelete = () => {
    deleteContent(content.id);
    onClose();
  };

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
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          placeholder="Write your content here..."
          rows={6}
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div>Created: {new Date(content.createdAt).toLocaleString()}</div>
        <div>Updated: {new Date(content.updatedAt).toLocaleString()}</div>
        {content.postedAt && (
          <div className="text-green-600 dark:text-green-400">
            Posted: {new Date(content.postedAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
