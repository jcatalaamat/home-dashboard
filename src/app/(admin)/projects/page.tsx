'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ProjectCard from '@/components/projects/ProjectCard';
import AddProjectForm from '@/components/projects/AddProjectForm';
import { ProjectStatus } from '@/types';

type FilterTab = 'active' | 'all' | 'paused';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'paused', label: 'Paused' },
];

export default function ProjectsPage() {
  const { projects } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('active');

  const getFilteredProjects = () => {
    switch (activeTab) {
      case 'active':
        return projects
          .filter((p) => p.status !== 'paused' && p.status !== 'idea')
          .sort((a, b) => a.priority - b.priority);
      case 'paused':
        return projects.filter((p) => p.status === 'paused');
      case 'all':
      default:
        return projects.sort((a, b) => a.priority - b.priority);
    }
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
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

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <AddProjectForm />
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {activeTab === 'paused'
            ? 'No paused projects.'
            : 'No projects yet. Create your first one!'}
        </div>
      )}
    </div>
  );
}
