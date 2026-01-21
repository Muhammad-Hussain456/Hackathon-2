/**
 * Task detail page for the Todo application.
 *
 * This page displays the details of a specific task and allows users to edit or delete it.
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { Task } from '../lib/types';
import { getTask, updateTask, deleteTask, toggleTaskCompletion } from '../lib/api';

const TaskDetailPage: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    due_date: ''
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { id } = router.query;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load task when user and task ID are available
  useEffect(() => {
    if (user && id) {
      loadTask();
    }
  }, [user, id]);

  const loadTask = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      const taskData = await getTask(user.id, parseInt(id as string, 10));
      setTask(taskData);

      // Initialize edit data
      setEditData({
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.due_date || ''
      });
    } catch (error) {
      console.error('Failed to load task:', error);
      setError((error as Error).message);
      if ((error as Error).message.includes('Authentication token not found')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async () => {
    if (!user || !task) return;

    try {
      const updatedTask = await toggleTaskCompletion(user.id, task.id!);
      setTask(updatedTask);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      alert('Failed to update task: ' + (error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!user || !task) return;

    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      try {
        await deleteTask(user.id, task.id!);
        router.push('/tasks'); // Redirect to tasks list after deletion
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task: ' + (error as Error).message);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!user || !task) return;

    try {
      const updatedTask = await updateTask(user.id, task.id!, {
        title: editData.title,
        description: editData.description,
        due_date: editData.due_date,
        completed: task.completed
      });

      setTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task: ' + (error as Error).message);
    }
  };

  const handleCancelEdit = () => {
    // Revert edit data to current task data
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date || ''
      });
    }
    setIsEditing(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect effect will handle navigation
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/tasks" className="text-indigo-600 hover:text-indigo-500">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task not found</h2>
          <Link href="/tasks" className="text-indigo-600 hover:text-indigo-500">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{task.title} - Todo Application</title>
        <meta name="description" content={`Details for task: ${task.title}`} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="text-3xl font-bold text-gray-900 w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <h2 className={`text-3xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h2>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Created at: {new Date(task.created_at!).toLocaleString()}
                  {task.updated_at && task.updated_at !== task.created_at && (
                    <span>, Updated: {new Date(task.updated_at).toLocaleString()}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleCompletion}
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                    task.completed
                      ? 'text-green-700 bg-green-100 hover:bg-green-200'
                      : 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {task.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                ) : (
                  <div className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {task.description || 'No description provided.'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.due_date}
                    onChange={(e) => setEditData({...editData, due_date: e.target.value})}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                ) : (
                  <div className="mt-1 text-gray-900">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date set.'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Link href="/tasks" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Back to Tasks
              </Link>

              {!isEditing ? (
                <div className="space-x-3">
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetailPage;