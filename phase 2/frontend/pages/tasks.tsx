/**
 * Tasks page for the Todo application.
 *
 * This page displays all tasks for the authenticated user and provides
 * functionality to create, update, delete, and mark tasks as complete.
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../lib/types';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } from '../lib/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load tasks when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userTasks = await getTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      if ((error as Error).message.includes('Authentication token not found')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newTask = await createTask(user.id, {
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        completed: taskData.completed
      });

      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + (error as Error).message);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (!user || !updatedTask.id) return;

    try {
      const updated = await updateTask(user.id, updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        due_date: updatedTask.due_date,
        completed: updatedTask.completed
      });

      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task: ' + (error as Error).message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      await deleteTask(user.id, taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task: ' + (error as Error).message);
    }
  };

  const handleToggleCompletion = async (taskId: number) => {
    if (!user) return;

    try {
      const updatedTask = await toggleTaskCompletion(user.id, taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      alert('Failed to update task: ' + (error as Error).message);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (task: Task) => {
    if (editingTask) {
      handleUpdateTask(task);
    } else {
      handleCreateTask(task);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect effect will handle navigation
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Tasks - Todo Application</title>
        <meta name="description" content="Manage your todo tasks" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Action buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Total: {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </h2>
            <p className="text-gray-600">
              {tasks.filter(t => t.completed).length} completed
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Task
          </button>
        </div>

        {/* Task list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onToggleCompletion={handleToggleCompletion}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ) : (
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
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create your first task
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          task={editingTask || undefined}
          onSave={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;