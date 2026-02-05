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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900 text-center">Error Loading Task</h2>
          <p className="mt-2 text-gray-600 text-center">{error}</p>
          <div className="mt-6">
            <Link href="/tasks" className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Task Not Found</h2>
          <p className="mt-2 text-gray-600">The task you're looking for doesn't exist or has been deleted.</p>
          <div className="mt-6">
            <Link href="/tasks" className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Head>
        <title>{task.title} - TodoPro</title>
        <meta name="description" content={`Details for task: ${task.title}`} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
              <p className="mt-1 text-gray-600">Manage your individual task information</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
                <span className="font-medium">Welcome, {user.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="px-6 py-6 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="text-2xl md:text-3xl font-bold text-gray-900 w-full border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent py-2"
                  />
                ) : (
                  <h2 className={`text-2xl md:text-3xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h2>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>

                  {task.due_date && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(task.due_date) < new Date() && !task.completed
                        ? 'bg-red-100 text-red-800'
                        : task.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Created: {new Date(task.created_at!).toLocaleString()}
                  {task.updated_at && task.updated_at !== task.created_at && (
                    <span className="block sm:inline sm:ml-4"> • Updated: {new Date(task.updated_at).toLocaleString()}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleCompletion}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg ${
                    task.completed
                      ? 'text-green-700 bg-green-100 hover:bg-green-200'
                      : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                  } transition-colors`}
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {task.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Enter task description..."
                  />
                ) : (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className={`text-gray-700 ${!task.description ? 'italic text-gray-500' : ''}`}>
                      {task.description || 'No description provided.'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.due_date}
                    onChange={(e) => setEditData({...editData, due_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                ) : (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date set.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <Link href="/tasks" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Tasks
              </Link>

              <div className="flex space-x-4">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetailPage;