/**
 * Integration tests for frontend-backend task operations in the todo application.
 *
 * These tests verify that the frontend components properly interact with the backend API.
 */

import { jest } from '@jest/globals';
import { Task, User } from '../../lib/types';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, loginUser, registerUser, getCurrentUser } from '../../lib/api';

// Mock the fetch API to simulate API calls
global.fetch = jest.fn();

describe('Frontend-Backend Integration Tests for Task Operations', () => {
  const mockUserId = 1;
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    user_id: mockUserId
  };

  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockReset();

    // Set up a mock authentication token
    localStorage.setItem('todo_app_token', 'mock-jwt-token');
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem('todo_app_token');
  });

  describe('Task Retrieval', () => {
    test('should fetch tasks for a user', async () => {
      // Arrange
      const mockTasks: Task[] = [mockTask];
      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
        status: 200
      });

      // Act
      const tasks = await getTasks(mockUserId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('Task Creation', () => {
    test('should create a new task', async () => {
      // Arrange
      const newTaskData = {
        title: 'New Task',
        description: 'New Description',
        completed: false
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockTask, ...newTaskData, id: 2 }),
        status: 200
      });

      // Act
      const createdTask = await createTask(mockUserId, newTaskData);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newTaskData),
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(createdTask.title).toBe('New Task');
      expect(createdTask.description).toBe('New Description');
    });
  });

  describe('Task Update', () => {
    test('should update an existing task', async () => {
      // Arrange
      const taskId = 1;
      const updateData = {
        title: 'Updated Task',
        completed: true
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockTask, ...updateData }),
        status: 200
      });

      // Act
      const updatedTask = await updateTask(mockUserId, taskId, updateData);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks/${taskId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.completed).toBe(true);
    });
  });

  describe('Task Deletion', () => {
    test('should delete a task', async () => {
      // Arrange
      const taskId = 1;

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      // Act
      await deleteTask(mockUserId, taskId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks/${taskId}`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
    });
  });

  describe('Task Completion Toggle', () => {
    test('should toggle task completion status', async () => {
      // Arrange
      const taskId = 1;
      const toggledTask = { ...mockTask, completed: true };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => toggledTask,
        status: 200
      });

      // Act
      const result = await toggleTaskCompletion(mockUserId, taskId);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/${mockUserId}/tasks/${taskId}/complete`,
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(result.completed).toBe(true);
    });
  });

  describe('User Authentication', () => {
    test('should login user and return token', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const loginResponse = {
        access_token: 'new-jwt-token',
        token_type: 'bearer'
      };

      // Mock the POST request for login
      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => loginResponse,
        status: 200
      });

      // Act
      const response = await loginUser(credentials);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/users/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );
      expect(response.access_token).toBe('new-jwt-token');
    });

    test('should register a new user', async () => {
      // Arrange
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123'
      };

      const userResponse = {
        id: 2,
        email: 'newuser@example.com',
        name: 'New User',
        created_at: '2023-01-01T00:00:00Z'
      };

      (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => userResponse,
        status: 200
      });

      // Act
      const response = await registerUser(userData);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/users/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
          headers: expect.not.objectContaining({
            'Authorization': 'Bearer'
          })
        })
      );
      expect(response.email).toBe('newuser@example.com');
    });
  });
});