/**
 * Home/Dashboard page for the Todo application.
 *
 * This page serves as the main entry point for the application and provides
 * navigation to different sections of the todo app.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Todo Application</title>
        <meta name="description" content="A simple todo application" />
      </Head>

      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Todo Application</h1>
          <p className="mt-2">Manage your tasks efficiently</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Todo App</h2>

          <p className="mb-6 text-gray-700">
            This is a full-stack todo application with multi-user support, persistent storage, and authentication.
            You can manage your tasks with the ability to create, read, update, delete, and mark tasks as complete.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/login" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-3 px-4 rounded-lg text-center transition duration-300">
              Login
            </Link>

            <Link href="/signup" className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-3 px-4 rounded-lg text-center transition duration-300">
              Sign Up
            </Link>

            <Link href="/tasks" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-lg text-center transition duration-300">
              View Tasks
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Create new tasks with titles and descriptions</li>
            <li>View all your tasks in one place</li>
            <li>Update existing tasks as needed</li>
            <li>Delete tasks you no longer need</li>
            <li>Mark tasks as complete when finished</li>
            <li>Secure authentication to protect your data</li>
          </ul>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Todo Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;