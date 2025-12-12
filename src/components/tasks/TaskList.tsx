'use client';

import React from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
  showProject?: boolean;
}

export default function TaskList({ tasks, emptyMessage = 'No tasks', showProject = true }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} showProject={showProject} />
      ))}
    </div>
  );
}
