'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { useApp } from '@/context/AppContext';

interface ProjectCardProps {
  project: Project;
}

const statusColors = {
  idea: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  planning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  building: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  launching: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const typeLabels = {
  land: 'Land',
  coaching: 'Coaching',
  'ai-product': 'AI Product',
  personal: 'Personal',
  other: 'Other',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { getProjectTasks } = useApp();
  const tasks = getProjectTasks(project.id);
  const activeTasks = tasks.filter((t) => t.status !== 'done').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
              {project.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {typeLabels[project.type]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              P{project.priority}
            </span>
          </div>
        </div>

        {/* Next Action */}
        {project.nextAction && (
          <div className="mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Next:</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
              {project.nextAction}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {activeTasks > 0 && (
              <span>{activeTasks} active</span>
            )}
            {completedTasks > 0 && (
              <span className="text-green-500">{completedTasks} done</span>
            )}
            {tasks.length === 0 && (
              <span>No tasks</span>
            )}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {project.links.length > 0 && `${project.links.length} links`}
          </span>
        </div>
      </div>
    </Link>
  );
}
