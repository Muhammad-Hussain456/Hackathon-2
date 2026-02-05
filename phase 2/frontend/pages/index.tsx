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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Head>
        <title>TodoPro - Manage Your Tasks Efficiently</title>
        <meta name="description" content="A beautiful and intuitive todo application" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">TodoPro</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="mt-10 lg:mt-0">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Organize Your Life with</span>
                <span className="block text-indigo-600 mt-2">TodoPro</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                A beautiful, intuitive task management application designed to help you stay productive and organized.
                With secure authentication and seamless synchronization across devices.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5">
                  Get Started
                </Link>
                <Link href="/login" className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative">
                <div className="relative rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-white p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                        <span className="ml-3 text-gray-700">Complete project proposal</span>
                        <span className="ml-auto text-xs text-gray-500">Today</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" defaultChecked />
                        <span className="ml-3 text-gray-700 line-through text-gray-500">Review quarterly reports</span>
                        <span className="ml-auto text-xs text-gray-500">Yesterday</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                        <span className="ml-3 text-gray-700">Schedule team meeting</span>
                        <span className="ml-auto text-xs text-gray-500">Tomorrow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Powerful features designed to boost your productivity
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Task Management</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create, update, and organize your tasks with ease. Set due dates and priorities to stay on track.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Authentication</h3>
                <p className="mt-2 text-base text-gray-500">
                  Protect your data with industry-standard authentication and encryption.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Fully Responsive</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access your tasks from any device. Our app looks great on desktop, tablet, and mobile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of users who trust TodoPro to manage their tasks and boost productivity.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition duration-300">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-gray-400">© {new Date().getFullYear()} TodoPro. All rights reserved.</span>
            </div>
            <div className="mt-8 md:mt-0 flex justify-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;