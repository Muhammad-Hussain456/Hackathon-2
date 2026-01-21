/**
 * Task list component for the Todo application.
 *
 * This component displays a list of tasks and provides functionality to manage them.
 */

import React from 'react';
import { Task } from '../lib/types';

type TaskListProps = {
  tasks: Task[];
  onToggleCompletion: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDelete, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <li key={task.id} className="py-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleCompletion(task.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className={`ml-3 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </span>
          </div>

          {task.description && (
            <p className="mt-1 ml-7 text-sm text-gray-500">{task.description}</p>
          )}

          {task.due_date && (
            <p className="mt-1 ml-7 text-xs text-gray-400">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}

          <div className="mt-2 ml-7 flex space-x-3">
            <button
              onClick={() => onEdit(task)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                  onDelete(task.id);
                }
              }}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;