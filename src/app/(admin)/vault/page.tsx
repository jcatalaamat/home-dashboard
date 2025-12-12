'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Note, NoteCategory } from '@/types';
import { PlusIcon, PencilIcon, TrashBinIcon, CloseIcon } from '@/icons';
import AreaSelector from '@/components/ui/AreaSelector';

type FilterTab = 'all' | NoteCategory;

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'scripts', label: 'Scripts' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'clients', label: 'Clients' },
  { id: 'branding', label: 'Branding' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'other', label: 'Other' },
];

const categoryColors: Record<NoteCategory, string> = {
  ideas: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  scripts: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  meetings: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  clients: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  branding: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  spiritual: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function VaultPage() {
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoteCategory>('ideas');
  const [formTags, setFormTags] = useState('');
  const [formAreaId, setFormAreaId] = useState<string | null>(null);

  const getFilteredNotes = () => {
    let filtered = notes;

    // Apply category filter
    if (activeTab !== 'all') {
      filtered = filtered.filter((n) => n.category === activeTab);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchNotes(searchQuery);
      if (activeTab !== 'all') {
        filtered = filtered.filter((n) => n.category === activeTab);
      }
    }

    // Sort by updatedAt (most recent first)
    return filtered.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  };

  const filteredNotes = getFilteredNotes();

  const handleCreateNote = () => {
    setIsCreatingNote(true);
    setFormTitle('');
    setFormContent('');
    setFormCategory(activeTab !== 'all' ? activeTab : 'ideas');
    setFormTags('');
    setFormAreaId(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormTags(note.tags.join(', '));
    setFormAreaId(note.areaId || null);
  };

  const handleSaveNote = () => {
    if (!formTitle.trim()) return;

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingNote) {
      // Update existing note
      updateNote(editingNote.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        tags,
        areaId: formAreaId,
      });
      setEditingNote(null);
    } else {
      // Create new note
      addNote({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        tags,
        projectId: null,
        areaId: formAreaId,
      });
      setIsCreatingNote(false);
    }

    // Reset form
    setFormTitle('');
    setFormContent('');
    setFormCategory('ideas');
    setFormTags('');
    setFormAreaId(null);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsCreatingNote(false);
    setFormTitle('');
    setFormContent('');
    setFormCategory('ideas');
    setFormTags('');
    setFormAreaId(null);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      if (editingNote?.id === id) {
        handleCancelEdit();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vault</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, content, or tags..."
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
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

      {/* Note Editor Modal/Form */}
      {(isCreatingNote || editingNote) && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingNote ? 'Edit Note' : 'New Note'}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Note title..."
              autoFocus
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            />

            {/* Category, Area & Tags Row */}
            <div className="grid grid-cols-3 gap-4">
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as NoteCategory)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="ideas">Ideas</option>
                <option value="scripts">Scripts</option>
                <option value="meetings">Meetings</option>
                <option value="clients">Clients</option>
                <option value="branding">Branding</option>
                <option value="spiritual">Spiritual</option>
                <option value="other">Other</option>
              </select>

              <AreaSelector
                value={formAreaId}
                onChange={setFormAreaId}
                className="px-3 py-2"
              />

              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Tags (comma separated)..."
                className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Content */}
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Write your note here..."
              rows={12}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-y"
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <div>
                {editingNote && (
                  <button
                    onClick={() => handleDeleteNote(editingNote.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashBinIcon className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!formTitle.trim()}
                  className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleEditNote(note)}
              className="group p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNote(note);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-brand-500 transition-opacity"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${categoryColors[note.category]}`}>
                  {note.category}
                </span>
              </div>

              {/* Content Preview */}
              {note.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {note.content.slice(0, 100)}
                  {note.content.length > 100 && '...'}
                </p>
              )}

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {formatDate(note.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery.trim()
              ? 'No notes found matching your search.'
              : activeTab === 'all'
              ? 'No notes yet. Create your first one!'
              : `No ${activeTab} notes yet.`}
          </p>
        </div>
      )}
    </div>
  );
}
