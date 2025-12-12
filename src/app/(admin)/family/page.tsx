'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { MealPlan, ShoppingItem, FamilyEvent } from '@/types';

type Tab = 'meals' | 'shopping' | 'events';

const categoryLabels = {
  groceries: 'Groceries',
  baby: 'Baby',
  household: 'Household',
  other: 'Other',
};

const eventTypeLabels = {
  appointment: 'Appointment',
  baby: 'Baby',
  couple: 'Couple',
  health: 'Health',
  other: 'Other',
};

export default function FamilyPage() {
  const {
    // Meal Plans
    addMealPlan,
    updateMealPlan,
    getWeekMealPlans,
    getMealPlanByDate,
    // Shopping
    shoppingItems,
    addShoppingItem,
    toggleShoppingItem,
    clearCompletedShopping,
    // Events
    addFamilyEvent,
    deleteFamilyEvent,
    getUpcomingEvents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('meals');

  // Meal Planner State
  const [editingMeal, setEditingMeal] = useState<{ date: string; mealType: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [mealInput, setMealInput] = useState('');

  // Shopping List State
  const [shoppingName, setShoppingName] = useState('');
  const [shoppingQuantity, setShoppingQuantity] = useState('');
  const [shoppingCategory, setShoppingCategory] = useState<'groceries' | 'baby' | 'household' | 'other'>('groceries');

  // Events State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState<'appointment' | 'baby' | 'couple' | 'health' | 'other'>('appointment');
  const [eventNotes, setEventNotes] = useState('');

  // Generate week dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
      };
    });
  }, []);

  const weekMealPlans = getWeekMealPlans();

  // Handle meal editing
  const handleMealClick = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const plan = getMealPlanByDate(date);
    setEditingMeal({ date, mealType });
    setMealInput(plan?.[mealType] || '');
  };

  const handleMealSave = () => {
    if (!editingMeal) return;

    const existingPlan = getMealPlanByDate(editingMeal.date);

    if (existingPlan) {
      updateMealPlan(existingPlan.id, {
        [editingMeal.mealType]: mealInput,
      });
    } else {
      addMealPlan({
        date: editingMeal.date,
        breakfast: editingMeal.mealType === 'breakfast' ? mealInput : '',
        lunch: editingMeal.mealType === 'lunch' ? mealInput : '',
        dinner: editingMeal.mealType === 'dinner' ? mealInput : '',
        notes: '',
      });
    }

    setEditingMeal(null);
    setMealInput('');
  };

  const handleMealCancel = () => {
    setEditingMeal(null);
    setMealInput('');
  };

  // Handle shopping
  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoppingName.trim()) return;

    addShoppingItem({
      name: shoppingName,
      quantity: shoppingQuantity || '1',
      category: shoppingCategory,
      completed: false,
    });

    setShoppingName('');
    setShoppingQuantity('');
    setShoppingCategory('groceries');
  };

  // Group shopping items by category
  const groupedShoppingItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {
      groceries: [],
      baby: [],
      household: [],
      other: [],
    };

    shoppingItems.forEach((item) => {
      groups[item.category].push(item);
    });

    return groups;
  }, [shoppingItems]);

  // Handle events
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    addFamilyEvent({
      title: eventTitle,
      date: eventDate,
      type: eventType,
      notes: eventNotes,
    });

    setEventTitle('');
    setEventDate('');
    setEventType('appointment');
    setEventNotes('');
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage meals, shopping, and family events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('meals')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'meals'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Meal Planner
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'shopping'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Shopping List
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'events'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Events & Appointments
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'meals' && (
        <div>
          {/* Weekly Meal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDates.map((day) => {
              const mealPlan = weekMealPlans.find((m) => m.date === day.date);
              const isToday = day.date === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={day.date}
                  className={`bg-white dark:bg-gray-800 rounded-xl border ${
                    isToday
                      ? 'border-brand-500 dark:border-brand-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } p-3`}
                >
                  {/* Day Header */}
                  <div className="text-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {day.dayName}
                    </div>
                    <div className={`text-lg font-bold ${
                      isToday ? 'text-brand-500' : 'text-gray-900 dark:text-white'
                    }`}>
                      {day.dayNumber}
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="space-y-2">
                    {/* Breakfast */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Breakfast
                      </div>
                      <button
                        onClick={() => handleMealClick(day.date, 'breakfast')}
                        className="w-full text-left text-xs p-2 rounded bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[2rem] text-gray-700 dark:text-gray-300"
                      >
                        {mealPlan?.breakfast || 'Click to add'}
                      </button>
                    </div>

                    {/* Lunch */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Lunch
                      </div>
                      <button
                        onClick={() => handleMealClick(day.date, 'lunch')}
                        className="w-full text-left text-xs p-2 rounded bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[2rem] text-gray-700 dark:text-gray-300"
                      >
                        {mealPlan?.lunch || 'Click to add'}
                      </button>
                    </div>

                    {/* Dinner */}
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Dinner
                      </div>
                      <button
                        onClick={() => handleMealClick(day.date, 'dinner')}
                        className="w-full text-left text-xs p-2 rounded bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[2rem] text-gray-700 dark:text-gray-300"
                      >
                        {mealPlan?.dinner || 'Click to add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Meal Modal */}
          {editingMeal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit {editingMeal.mealType.charAt(0).toUpperCase() + editingMeal.mealType.slice(1)}
                </h3>
                <input
                  type="text"
                  value={mealInput}
                  onChange={(e) => setMealInput(e.target.value)}
                  placeholder="Enter meal..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleMealSave();
                    if (e.key === 'Escape') handleMealCancel();
                  }}
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleMealSave}
                    className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleMealCancel}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'shopping' && (
        <div className="space-y-6">
          {/* Add Item Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Item</h2>
            <form onSubmit={handleAddShoppingItem} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={shoppingName}
                  onChange={(e) => setShoppingName(e.target.value)}
                  placeholder="Item name"
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                  required
                />
                <input
                  type="text"
                  value={shoppingQuantity}
                  onChange={(e) => setShoppingQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                />
                <select
                  value={shoppingCategory}
                  onChange={(e) => setShoppingCategory(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="groceries">Groceries</option>
                  <option value="baby">Baby</option>
                  <option value="household">Household</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                >
                  Add Item
                </button>
                {shoppingItems.filter((i) => i.completed).length > 0 && (
                  <button
                    type="button"
                    onClick={clearCompletedShopping}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Clear Completed
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Shopping List by Category */}
          <div className="space-y-4">
            {Object.entries(groupedShoppingItems).map(([category, items]) => {
              if (items.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                    <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {items.filter((i) => !i.completed).length} of {items.length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleShoppingItem(item.id)}
                          className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                        />
                        <span className={`flex-1 text-sm ${
                          item.completed
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {shoppingItems.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-gray-400 dark:text-gray-500">
                  No items in your shopping list. Add some above!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Add Event Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event title"
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                  required
                />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500"
              >
                <option value="appointment">Appointment</option>
                <option value="baby">Baby</option>
                <option value="couple">Couple</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
              <textarea
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                placeholder="Notes (optional)"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:border-brand-500 resize-none"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
              >
                Add Event
              </button>
            </form>
          </div>

          {/* Upcoming Events List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const formattedDate = eventDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {eventDate.getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                            {eventTypeLabels[event.type]}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formattedDate}
                          </span>
                        </div>
                        {event.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteFamilyEvent(event.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete event"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                No upcoming events. Add one above!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
