'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GoalStatus, Quarter } from '@/types';
import GoalProgressBar from '@/components/goals/GoalProgressBar';
import GoalHeatmap from '@/components/goals/GoalHeatmap';
import GoalTimeline from '@/components/goals/GoalTimeline';
import { ChevronLeftIcon, TrashBinIcon, PencilIcon } from '@/icons';

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  achieved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  abandoned: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

const typeLabels = {
  numeric: 'Metric Goal',
  project: 'Project Goal',
  pipeline: 'Pipeline Goal',
  habit: 'Habit Goal',
};

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    goals,
    projects,
    tasks,
    deals,
    getGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getGoalHeatmap,
    getGoalActivities,
    updateGoalMetric,
    logGoalActivity,
  } = useApp();

  const goalId = params.id as string;
  const goal = getGoal(goalId);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal?.title || '');
  const [editWhy, setEditWhy] = useState(goal?.why || '');
  const [editStatus, setEditStatus] = useState<GoalStatus>(goal?.status || 'active');
  const [metricInput, setMetricInput] = useState('');
  const [activityNote, setActivityNote] = useState('');

  if (!goal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Goal not found.</p>
        <Link href="/goals" className="text-brand-500 hover:underline mt-2 inline-block">
          Back to Goals
        </Link>
      </div>
    );
  }

  const progress = getGoalProgress(goal.id);
  const heatmapData = getGoalHeatmap(goal.id, 30);
  const activities = getGoalActivities(goal.id);

  const linkedProjects = projects.filter((p) => goal.projectIds.includes(p.id));
  const linkedTasks = tasks.filter(
    (t) => t.goalId === goal.id || goal.projectIds.includes(t.projectId || '')
  );
  const linkedDeals = goal.pipelineType
    ? deals.filter((d) => d.pipelineType === goal.pipelineType && d.goalId === goal.id)
    : [];

  const completedTasks = linkedTasks.filter((t) => t.status === 'done').length;
  const activeTasks = linkedTasks.filter((t) => t.status !== 'done' && t.status !== 'someday').length;

  const handleSaveEdit = () => {
    updateGoal(goal.id, {
      title: editTitle.trim(),
      why: editWhy.trim(),
      status: editStatus,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goal.id);
      router.push('/goals');
    }
  };

  const handleUpdateMetric = () => {
    const value = Number(metricInput);
    if (!isNaN(value) && value !== 0) {
      updateGoalMetric(goal.id, value);
      setMetricInput('');
    }
  };

  const handleLogActivity = () => {
    if (activityNote.trim()) {
      logGoalActivity({
        goalId: goal.id,
        date: new Date().toISOString().split('T')[0],
        type: 'manual_log',
        description: activityNote.trim(),
      });
      setActivityNote('');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/goals"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Goals
        </Link>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-2xl font-bold px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            />
            <textarea
              value={editWhy}
              onChange={(e) => setEditWhy(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              placeholder="Why does this matter?"
            />
            <div className="flex items-center gap-4">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as GoalStatus)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="achieved">Achieved</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goal.title}
                </h1>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[goal.status]}`}>
                  {goal.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic mb-1">"{goal.why}"</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {typeLabels[goal.type]} • {goal.quarter} {goal.year}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <TrashBinIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>

        <GoalProgressBar progress={progress} size="lg" />

        {goal.type === 'numeric' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current: <span className="font-semibold text-gray-900 dark:text-white">{goal.currentMetric || 0}</span> / {goal.targetMetric} {goal.metricUnit}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={metricInput}
                onChange={(e) => setMetricInput(e.target.value)}
                placeholder="Add progress..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleUpdateMetric}
                disabled={!metricInput || isNaN(Number(metricInput))}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Update
              </button>
            </div>
          </div>
        )}

        {goal.type === 'project' && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{completedTasks}</span> of {linkedTasks.length} tasks completed
            </p>
            {activeTasks > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {activeTasks} task{activeTasks !== 1 ? 's' : ''} in progress
              </p>
            )}
          </div>
        )}

        {goal.type === 'pipeline' && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {linkedDeals.length} deal{linkedDeals.length !== 1 ? 's' : ''} linked • Target: <span className="font-semibold">{goal.targetStage}</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Heatmap */}
        <GoalHeatmap data={heatmapData} days={30} />

        {/* Timeline */}
        <GoalTimeline activities={activities} limit={5} />
      </div>

      {/* Log Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Log Activity
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            placeholder="What did you do toward this goal?"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            onKeyDown={(e) => e.key === 'Enter' && handleLogActivity()}
          />
          <button
            onClick={handleLogActivity}
            disabled={!activityNote.trim()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Log
          </button>
        </div>
      </div>

      {/* Linked Projects */}
      {linkedProjects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Linked Projects
          </h2>
          <div className="space-y-3">
            {linkedProjects.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const completedProjectTasks = projectTasks.filter((t) => t.status === 'done').length;
              const projectProgress = projectTasks.length > 0
                ? (completedProjectTasks / projectTasks.length) * 100
                : 0;

              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {completedProjectTasks}/{projectTasks.length} tasks
                      </span>
                    </div>
                    <GoalProgressBar progress={projectProgress} size="sm" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked Tasks */}
      {linkedTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Related Tasks ({activeTasks} active)
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {linkedTasks
              .filter((t) => t.status !== 'done')
              .slice(0, 10)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === 'doing' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm text-gray-900 dark:text-white flex-1">
                    {task.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.status}
                  </span>
                </div>
              ))}
            {linkedTasks.filter((t) => t.status !== 'done').length > 10 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                +{linkedTasks.filter((t) => t.status !== 'done').length - 10} more tasks
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
