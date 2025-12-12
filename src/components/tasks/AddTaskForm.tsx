'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TaskArea, TaskPriority, TaskCategory } from '@/types';
import { PlusIcon } from '@/icons';
import AreaSelector from '@/components/ui/AreaSelector';

interface AddTaskFormProps {
  defaultProjectId?: string | null;
  defaultScheduledFor?: string | null;
  onAdd?: () => void;
}

export default function AddTaskForm({ defaultProjectId = null, defaultScheduledFor = null, onAdd }: AddTaskFormProps) {
  const { addTask, projects } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string | null>(defaultProjectId);
  const [area, setArea] = useState<TaskArea>('work');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [category, setCategory] = useState<TaskCategory>('cashflow');
  const [areaId, setAreaId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      projectId,
      goalId: null,
      areaId,
      area,
      category,
      status: 'todo',
      priority,
      dueDate: null,
      scheduledFor: defaultScheduledFor,
      timeBlock: 'unscheduled',
      mode: 'all',
    });

    setTitle('');
    setIsOpen(false);
    onAdd?.();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full p-3 text-gray-500 dark:text-gray-400 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Add task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        autoFocus
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={projectId || ''}
          onChange={(e) => setProjectId(e.target.value || null)}
          className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={area}
          onChange={(e) => setArea(e.target.value as TaskArea)}
          className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="work">Work</option>
          <option value="family">Family</option>
          <option value="admin">Admin</option>
          <option value="health">Health</option>
          <option value="spiritual">Spiritual</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
        >
          <option value="cashflow">P1: Cashflow</option>
          <option value="land-sales">P2: Land Sales</option>
          <option value="incubator">P3: Incubator</option>
          <option value="mini-projects">P4: Mini-projects</option>
          <option value="personal">P5: Personal</option>
        </select>

        <AreaSelector
          value={areaId}
          onChange={setAreaId}
          className="text-xs px-2 py-1"
          noneLabel="No life area"
        />
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
          disabled={!title.trim()}
          className="px-3 py-1.5 text-sm bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
