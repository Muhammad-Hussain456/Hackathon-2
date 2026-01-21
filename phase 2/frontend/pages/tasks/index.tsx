/**
 * Tasks page for the Todo application.
 *
 * This page displays all tasks for the authenticated user and allows management of tasks.
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Define the Task type
type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from API when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would fetch from the backend API
        // const token = localStorage.getItem('token');
        // const response = await fetch('/api/my/tasks', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        //
        // if (response.ok) {
        //   const data = await response.json();
        //   setTasks(data);
        // } else {
        //   throw new Error('Failed to fetch tasks');
        // }

        // For demo purposes, using mock data
        setTimeout(() => {
          setTasks([
            { id: 1, title: 'Sample Task', description: 'This is a sample task', completed: false, created_at: '2026-01-21T10:00:00Z', updated_at: '2026-01-21T10:00:00Z', user_id: 1 },
            { id: 2, title: 'Complete Todo App', description: 'Finish implementing the todo application', completed: true, created_at: '2026-01-21T09:30:00Z', updated_at: '2026-01-21T11:15:00Z', user_id: 1 },
          ]);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      // In a real app, this would call the backend API to toggle completion
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/tasks/${taskId}/complete`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // Update the task in the UI immediately
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );

      // In a real app, handle the API response
      console.log(`Toggled task ${taskId} completion status`);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>Tasks - Todo Application</title>
          <meta name="description" content="View and manage your todo tasks" />
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Tasks - Todo Application</title>
        <meta name="description" content="View and manage your todo tasks" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
          <Link
            href="/tasks/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Task
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
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
            <div className="mt-6">
              <Link
                href="/tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create your first task
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                        />
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-indigo-600'}`}>
                          {task.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {task.completed ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    {task.description && (
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {task.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end space-x-3">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this task?')) {
                            // In a real app, this would call the backend API to delete the task
                            setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
                            console.log(`Deleted task ${task.id}`);
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default TasksPage;