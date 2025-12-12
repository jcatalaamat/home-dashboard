'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GoalType, GoalStatus, Quarter, PipelineType } from '@/types';
import { PlusIcon, CloseIcon } from '@/icons';
import AreaSelector from '@/components/ui/AreaSelector';

const goalTypes: { id: GoalType; label: string; description: string }[] = [
  { id: 'numeric', label: 'Metric', description: 'Track a number (e.g., Sell 3 plots)' },
  { id: 'project', label: 'Project', description: 'Complete tasks in linked projects' },
  { id: 'pipeline', label: 'Pipeline', description: 'Move deals through stages' },
  { id: 'habit', label: 'Habit', description: 'Track consistent activity' },
];

const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear + 1];

const goalColors = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280',
];

export default function AddGoalForm() {
  const { addGoal, projects } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [type, setType] = useState<GoalType>('numeric');
  const [quarter, setQuarter] = useState<Quarter>(() => {
    const month = new Date().getMonth();
    if (month < 3) return 'Q1';
    if (month < 6) return 'Q2';
    if (month < 9) return 'Q3';
    return 'Q4';
  });
  const [year, setYear] = useState(currentYear);
  const [targetMetric, setTargetMetric] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [pipelineType, setPipelineType] = useState<PipelineType>('salvaje');
  const [targetStage, setTargetStage] = useState('sold');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [color, setColor] = useState(goalColors[0]);
  const [areaId, setAreaId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !why.trim()) return;

    addGoal({
      title: title.trim(),
      why: why.trim(),
      type,
      quarter,
      year,
      status: 'active' as GoalStatus,
      areaId,
      targetMetric: type === 'numeric' ? Number(targetMetric) || undefined : undefined,
      currentMetric: type === 'numeric' ? 0 : undefined,
      metricUnit: type === 'numeric' ? metricUnit.trim() || undefined : undefined,
      pipelineType: type === 'pipeline' ? pipelineType : undefined,
      targetStage: type === 'pipeline' ? targetStage : undefined,
      projectIds: selectedProjects,
      color,
    });

    // Reset form
    setTitle('');
    setWhy('');
    setType('numeric');
    setTargetMetric('');
    setMetricUnit('');
    setSelectedProjects([]);
    setAreaId(null);
    setIsOpen(false);
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer min-h-[200px]"
      >
        <PlusIcon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-500 dark:text-gray-400 font-medium">Add North Star</span>
      </button>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">New Goal</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Sell 3 plots this quarter"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            autoFocus
          />
        </div>

        {/* Why */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Why does this matter?
          </label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="The emotional driver behind this goal..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {goalTypes.map((gt) => (
              <button
                key={gt.id}
                type="button"
                onClick={() => setType(gt.id)}
                className={`p-2 text-left rounded-lg border transition-colors ${
                  type === gt.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="block text-sm font-medium text-gray-900 dark:text-white">
                  {gt.label}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {gt.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Numeric Goal Fields */}
        {type === 'numeric' && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target
              </label>
              <input
                type="number"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                placeholder="e.g., plots"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* Pipeline Goal Fields */}
        {type === 'pipeline' && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pipeline
              </label>
              <select
                value={pipelineType}
                onChange={(e) => setPipelineType(e.target.value as PipelineType)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="salvaje">Salvaje (Land)</option>
                <option value="ai-bots">AI Bots</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Stage
              </label>
              <select
                value={targetStage}
                onChange={(e) => setTargetStage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              >
                {pipelineType === 'salvaje' ? (
                  <>
                    <option value="sold">Sold</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="visited">Visited</option>
                  </>
                ) : (
                  <>
                    <option value="won">Won</option>
                    <option value="proposal-sent">Proposal Sent</option>
                    <option value="demo-done">Demo Done</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {/* Area & Quarter & Year */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Area
            </label>
            <AreaSelector
              value={areaId}
              onChange={setAreaId}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quarter
            </label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value as Quarter)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            >
              {quarters.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Link Projects */}
        {projects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Projects (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    selectedProjects.includes(project.id)
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex gap-2">
            {goalColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!title.trim() || !why.trim()}
          className="w-full py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Create Goal
        </button>
      </form>
    </div>
  );
}
