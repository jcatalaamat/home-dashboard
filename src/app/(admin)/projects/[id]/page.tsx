'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import TaskList from '@/components/tasks/TaskList';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import { ProjectStatus, Priority } from '@/types';
import { ChevronLeftIcon, TrashBinIcon, PencilIcon } from '@/icons';
import Link from 'next/link';

const statusColors = {
  idea: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  planning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  building: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  launching: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProject, deleteProject, getProjectTasks } = useApp();

  const projectId = params.id as string;
  const project = getProject(projectId);
  const tasks = getProjectTasks(projectId);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project?.name || '');
  const [editNextAction, setEditNextAction] = useState(project?.nextAction || '');
  const [editNotes, setEditNotes] = useState(project?.notes || '');
  const [editStatus, setEditStatus] = useState<ProjectStatus>(project?.status || 'idea');
  const [editPriority, setEditPriority] = useState<Priority>(project?.priority || 3);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Project not found
        </h2>
        <Link href="/projects" className="text-brand-500 hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    updateProject(projectId, {
      name: editName,
      nextAction: editNextAction,
      notes: editNotes,
      status: editStatus,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this project? Tasks will be kept but unlinked.')) {
      deleteProject(projectId);
      router.push('/projects');
    }
  };

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const completedTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div>
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 mb-4"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Back to projects
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-brand-500 dark:text-white w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm bg-brand-500 text-white rounded hover:bg-brand-600"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <TrashBinIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status & Priority */}
        <div className="flex items-center gap-3 mb-4">
          {isEditing ? (
            <>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                className="text-sm px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
              >
                <option value="idea">Idea</option>
                <option value="planning">Planning</option>
                <option value="building">Building</option>
                <option value="launching">Launching</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(Number(e.target.value) as Priority)}
                className="text-sm px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white"
              >
                <option value={1}>P1</option>
                <option value={2}>P2</option>
                <option value={3}>P3</option>
                <option value={4}>P4</option>
                <option value={5}>P5</option>
              </select>
            </>
          ) : (
            <>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Priority {project.priority}
              </span>
            </>
          )}
        </div>

        {/* Next Action */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Next Action
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editNextAction}
              onChange={(e) => setEditNextAction(e.target.value)}
              placeholder="What's the next step?"
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            />
          ) : (
            <p className="mt-1 text-gray-900 dark:text-white">
              {project.nextAction || <span className="text-gray-400 italic">No next action set</span>}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Notes
          </label>
          {isEditing ? (
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Project notes..."
              rows={4}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          ) : (
            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {project.notes || <span className="text-gray-400 italic">No notes</span>}
            </p>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Tasks ({activeTasks.length})
          </h2>
          <TaskList tasks={activeTasks} showProject={false} emptyMessage="No active tasks" />
          <div className="mt-4">
            <AddTaskForm defaultProjectId={projectId} />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completed ({completedTasks.length})
          </h2>
          <TaskList tasks={completedTasks} showProject={false} emptyMessage="No completed tasks" />
        </div>
      </div>
    </div>
  );
}
