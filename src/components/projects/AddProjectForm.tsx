'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectType, ProjectStatus, Priority } from '@/types';
import { PlusIcon } from '@/icons';

interface AddProjectFormProps {
  onAdd?: () => void;
}

export default function AddProjectForm({ onAdd }: AddProjectFormProps) {
  const { addProject } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('personal');
  const [status, setStatus] = useState<ProjectStatus>('idea');
  const [priority, setPriority] = useState<Priority>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      type,
      status,
      priority,
      vision: '',
      nextAction: '',
      notes: '',
      links: [],
      goalId: null,
      areaId: null,
    });

    setName('');
    setIsOpen(false);
    onAdd?.();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 p-5 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-all"
      >
        <PlusIcon className="w-5 h-5" />
        <span>New Project</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name..."
        autoFocus
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
      />

      <div className="grid grid-cols-3 gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ProjectType)}
          className="text-sm px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="land">Land</option>
          <option value="coaching">Coaching</option>
          <option value="ai-product">AI Product</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          className="text-sm px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="idea">Idea</option>
          <option value="planning">Planning</option>
          <option value="building">Building</option>
          <option value="launching">Launching</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value) as Priority)}
          className="text-sm px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value={1}>P1 - Critical</option>
          <option value={2}>P2 - High</option>
          <option value={3}>P3 - Medium</option>
          <option value={4}>P4 - Low</option>
          <option value={5}>P5 - Someday</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-3 py-1.5 text-sm bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
