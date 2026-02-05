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
      <div className="text-center py-16">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
          <svg
            className="h-6 w-6 text-indigo-600"
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
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-2 text-gray-500">Get started by creating a new task to organize your day.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleCompletion(task.id)}
              className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div className="ml-3 flex-1 min-w-0">
              <p className={`text-base font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </p>

              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.due_date && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    new Date(task.due_date) < new Date() && !task.completed
                      ? 'bg-red-100 text-red-800'
                      : task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(task)}
                className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                    onDelete(task.id);
                  }
                }}
                className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;