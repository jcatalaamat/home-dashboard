'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoutineType, RoutineItem } from '@/types';
import AreaSelector from '@/components/ui/AreaSelector';
import AreaBadge from '@/components/ui/AreaBadge';

type TabType = 'morning' | 'evening' | 'weekly' | 'monthly';

const tabs: { id: TabType; label: string; emoji: string }[] = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
  { id: 'weekly', label: 'Weekly', emoji: '📅' },
  { id: 'monthly', label: 'Monthly', emoji: '🗓️' },
];

export default function RoutinesPage() {
  const { routines, habitLogs, addRoutine, updateRoutine, deleteRoutine, getRoutinesByType, toggleHabitLog, getHabitLogsForDate } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('morning');
  const [newItemText, setNewItemText] = useState('');
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [newRoutineAreaId, setNewRoutineAreaId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = getHabitLogsForDate(today);

  // Get current routine for active tab
  const currentRoutines = getRoutinesByType(activeTab);
  const currentRoutine = currentRoutines.length > 0 ? currentRoutines[0] : null;

  // Calculate today's progress for all routine types
  const getRoutineProgress = (type: RoutineType) => {
    const typeRoutines = getRoutinesByType(type);
    if (typeRoutines.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const totalItems = typeRoutines.reduce((sum, r) => sum + r.items.length, 0);
    const completedItems = typeRoutines.reduce((sum, r) => {
      const routineCompleted = r.items.filter((item) =>
        todayLogs.some((log) => log.routineId === r.id && log.itemId === item.id && log.completed)
      ).length;
      return sum + routineCompleted;
    }, 0);

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { completed: completedItems, total: totalItems, percentage };
  };

  const overallProgress = tabs.reduce((acc, tab) => {
    const progress = getRoutineProgress(tab.id);
    return {
      completed: acc.completed + progress.completed,
      total: acc.total + progress.total,
    };
  }, { completed: 0, total: 0 });

  const overallPercentage = overallProgress.total > 0
    ? Math.round((overallProgress.completed / overallProgress.total) * 100)
    : 0;

  // Add new item to routine
  const handleAddItem = () => {
    if (!newItemText.trim()) return;

    if (currentRoutine) {
      // Add item to existing routine
      const newItem: RoutineItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newItemText.trim(),
        order: currentRoutine.items.length,
      };
      updateRoutine(currentRoutine.id, {
        items: [...currentRoutine.items, newItem],
      });
    } else {
      // Create new routine with first item
      const newItem: RoutineItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newItemText.trim(),
        order: 0,
      };
      addRoutine({
        name: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Routine`,
        type: activeTab,
        items: [newItem],
        areaId: newRoutineAreaId,
      });
    }
    setNewItemText('');
  };

  // Delete item from routine
  const handleDeleteItem = (itemId: string) => {
    if (!currentRoutine) return;
    const updatedItems = currentRoutine.items
      .filter((item) => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index }));
    updateRoutine(currentRoutine.id, { items: updatedItems });
  };

  // Move item up
  const handleMoveUp = (itemId: string) => {
    if (!currentRoutine) return;
    const itemIndex = currentRoutine.items.findIndex((item) => item.id === itemId);
    if (itemIndex <= 0) return;

    const newItems = [...currentRoutine.items];
    [newItems[itemIndex], newItems[itemIndex - 1]] = [newItems[itemIndex - 1], newItems[itemIndex]];
    const reorderedItems = newItems.map((item, index) => ({ ...item, order: index }));
    updateRoutine(currentRoutine.id, { items: reorderedItems });
  };

  // Move item down
  const handleMoveDown = (itemId: string) => {
    if (!currentRoutine) return;
    const itemIndex = currentRoutine.items.findIndex((item) => item.id === itemId);
    if (itemIndex < 0 || itemIndex >= currentRoutine.items.length - 1) return;

    const newItems = [...currentRoutine.items];
    [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
    const reorderedItems = newItems.map((item, index) => ({ ...item, order: index }));
    updateRoutine(currentRoutine.id, { items: reorderedItems });
  };

  // Edit item text
  const handleEditItem = (itemId: string, newText: string) => {
    if (!currentRoutine) return;
    const updatedItems = currentRoutine.items.map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );
    updateRoutine(currentRoutine.id, { items: updatedItems });
    setEditingRoutineId(null);
  };

  // Toggle habit completion
  const handleToggleHabit = (itemId: string) => {
    if (!currentRoutine) return;
    toggleHabitLog(currentRoutine.id, itemId, today);
  };

  // Check if item is completed today
  const isItemCompleted = (itemId: string) => {
    if (!currentRoutine) return false;
    return todayLogs.some(
      (log) => log.routineId === currentRoutine.id && log.itemId === itemId && log.completed
    );
  };

  // Format today's date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Routines</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Today's Overall Progress
          </span>
          <span className="text-sm font-bold text-brand-500">{overallPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {overallProgress.completed} of {overallProgress.total} items completed
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {tabs.map((tab) => {
          const progress = getRoutineProgress(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
              {progress.total > 0 && (
                <span className="ml-2 text-xs">
                  ({progress.completed}/{progress.total})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {tabs.find((t) => t.id === activeTab)?.emoji} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Routine
          </h2>
          {currentRoutine && currentRoutine.areaId && (
            <AreaBadge areaId={currentRoutine.areaId} size="md" />
          )}
        </div>

        {/* Routine Items List */}
        {currentRoutine && currentRoutine.items.length > 0 ? (
          <div className="space-y-2 mb-4">
            {currentRoutine.items.map((item, index) => {
              const completed = isItemCompleted(item.id);
              const isEditing = editingRoutineId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  } transition-colors`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleHabit(item.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      completed
                        ? 'bg-brand-500 border-brand-500'
                        : 'border-gray-300 dark:border-gray-500 hover:border-brand-500'
                    }`}
                  >
                    {completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Item Text */}
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={item.text}
                      onBlur={(e) => handleEditItem(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditItem(item.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingRoutineId(null);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 text-sm border border-brand-500 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingRoutineId(item.id)}
                      className={`flex-1 text-sm cursor-pointer ${
                        completed
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {item.text}
                    </span>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveUp(item.id)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(item.id)}
                      disabled={index === currentRoutine.items.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 py-4">
            No items in this routine yet. Add your first item below.
          </p>
        )}

        {/* Add New Item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
            placeholder="Add a new item to this routine..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
          {!currentRoutine && (
            <AreaSelector
              value={newRoutineAreaId}
              onChange={setNewRoutineAreaId}
              className="text-sm px-2 py-2"
              noneLabel="No area"
            />
          )}
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Progress for this routine */}
        {currentRoutine && currentRoutine.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Progress
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentRoutine.items.filter((item) => isItemCompleted(item.id)).length} /{' '}
                {currentRoutine.items.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    currentRoutine.items.length > 0
                      ? (currentRoutine.items.filter((item) => isItemCompleted(item.id)).length /
                          currentRoutine.items.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
