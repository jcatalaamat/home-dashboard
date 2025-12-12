'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

const statusColors = {
  idea: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  planning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  building: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  launching: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ActiveProjects() {
  const { getActiveProjects, getProjectTasks } = useApp();
  const activeProjects = getActiveProjects().slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Active Projects
        </h2>
        <Link
          href="/projects"
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          View all →
        </Link>
      </div>

      {activeProjects.length > 0 ? (
        <div className="space-y-3">
          {activeProjects.map((project) => {
            const tasks = getProjectTasks(project.id);
            const activeTasks = tasks.filter((t) => t.status !== 'done').length;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                        {project.name}
                      </h3>
                      {project.nextAction && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          Next: {project.nextAction}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  {activeTasks > 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {activeTasks} active task{activeTasks !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p>No active projects</p>
          <Link href="/projects" className="text-brand-500 hover:underline text-sm">
            Create one →
          </Link>
        </div>
      )}
    </div>
  );
}
