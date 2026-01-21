"""
Unit tests for the todo application.

This module contains tests for the core functionality of the todo application.
"""

import unittest
import sys
import os

# Add the parent directory to the path to allow imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.todo import TodoItem
from services.storage_service import StorageService
from services.todo_service import TodoService


class TestTodoItem(unittest.TestCase):
    """Test cases for the TodoItem class."""

    def test_create_todo_item_valid(self):
        """Test creating a valid TodoItem."""
        todo = TodoItem(1, "Test title", "Test description", "2023-12-31", "Pending")
        self.assertEqual(todo.id, 1)
        self.assertEqual(todo.title, "Test title")
        self.assertEqual(todo.description, "Test description")
        self.assertEqual(todo.due_date, "2023-12-31")
        self.assertEqual(todo.status, "Pending")

    def test_create_todo_item_default_status(self):
        """Test creating a TodoItem with default status."""
        todo = TodoItem(1, "Test title")
        self.assertEqual(todo.status, "Pending")

    def test_create_todo_item_empty_title_raises_error(self):
        """Test that creating a TodoItem with empty title raises ValueError."""
        with self.assertRaises(ValueError):
            TodoItem(1, "")

    def test_create_todo_item_whitespace_only_title_raises_error(self):
        """Test that creating a TodoItem with whitespace-only title raises ValueError."""
        with self.assertRaises(ValueError):
            TodoItem(1, "   ")

    def test_create_todo_item_invalid_status_raises_error(self):
        """Test that creating a TodoItem with invalid status raises ValueError."""
        with self.assertRaises(ValueError):
            TodoItem(1, "Test title", status="Invalid")

    def test_update_todo_item(self):
        """Test updating a TodoItem."""
        todo = TodoItem(1, "Original title", "Original description", "2023-12-31", "Pending")

        todo.update(title="New title", description="New description", due_date="2024-01-01", status="Completed")

        self.assertEqual(todo.title, "New title")
        self.assertEqual(todo.description, "New description")
        self.assertEqual(todo.due_date, "2024-01-01")
        self.assertEqual(todo.status, "Completed")

    def test_update_todo_item_partial(self):
        """Test updating only some fields of a TodoItem."""
        todo = TodoItem(1, "Original title", "Original description", "2023-12-31", "Pending")

        todo.update(title="New title")  # Only update title

        self.assertEqual(todo.title, "New title")
        self.assertEqual(todo.description, "Original description")  # Should remain unchanged
        self.assertEqual(todo.due_date, "2023-12-31")  # Should remain unchanged
        self.assertEqual(todo.status, "Pending")  # Should remain unchanged

    def test_repr(self):
        """Test the string representation of a TodoItem."""
        todo = TodoItem(1, "Test title", status="Completed")
        expected = "TodoItem(id=1, title='Test title', status='Completed')"
        self.assertEqual(repr(todo), expected)

    def test_eq(self):
        """Test equality comparison of TodoItems."""
        todo1 = TodoItem(1, "Test title", "Test description", "2023-12-31", "Pending")
        todo2 = TodoItem(1, "Test title", "Test description", "2023-12-31", "Pending")
        todo3 = TodoItem(2, "Test title", "Test description", "2023-12-31", "Pending")

        self.assertEqual(todo1, todo2)
        self.assertNotEqual(todo1, todo3)


class TestStorageService(unittest.TestCase):
    """Test cases for the StorageService class."""

    def setUp(self):
        """Set up a fresh StorageService for each test."""
        self.storage = StorageService()

    def test_initialize_storage(self):
        """Test initializing storage."""
        self.storage.initialize_storage()
        self.assertEqual(len(self.storage.get_all_todos()), 0)

    def test_get_todo_not_found(self):
        """Test getting a non-existent todo."""
        result = self.storage.get_todo(999)
        self.assertIsNone(result)

    def test_save_and_get_todo(self):
        """Test saving and retrieving a todo."""
        todo = TodoItem(1, "Test title")
        self.storage.save_todo(todo)

        retrieved = self.storage.get_todo(1)
        self.assertEqual(retrieved, todo)

    def test_remove_todo_success(self):
        """Test successfully removing a todo."""
        todo = TodoItem(1, "Test title")
        self.storage.save_todo(todo)

        result = self.storage.remove_todo(1)
        self.assertTrue(result)
        self.assertIsNone(self.storage.get_todo(1))

    def test_remove_todo_not_found(self):
        """Test removing a non-existent todo."""
        result = self.storage.remove_todo(999)
        self.assertFalse(result)

    def test_get_all_todos_empty(self):
        """Test getting all todos when storage is empty."""
        result = self.storage.get_all_todos()
        self.assertEqual(len(result), 0)

    def test_get_all_todos_multiple(self):
        """Test getting all todos when storage has multiple items."""
        todo1 = TodoItem(1, "Test title 1")
        todo2 = TodoItem(2, "Test title 2")
        todo3 = TodoItem(3, "Test title 3")

        self.storage.save_todo(todo1)
        self.storage.save_todo(todo2)
        self.storage.save_todo(todo3)

        result = self.storage.get_all_todos()
        self.assertEqual(len(result), 3)
        # Should be sorted by ID
        self.assertEqual(result[0].id, 1)
        self.assertEqual(result[1].id, 2)
        self.assertEqual(result[2].id, 3)

    def test_get_next_id_initial(self):
        """Test getting the next ID initially."""
        self.assertEqual(self.storage.get_next_id(), 1)

    def test_increment_id(self):
        """Test incrementing the ID."""
        first_id = self.storage.increment_id()
        second_id = self.storage.increment_id()
        self.assertEqual(first_id, 1)
        self.assertEqual(second_id, 2)


class TestTodoService(unittest.TestCase):
    """Test cases for the TodoService class."""

    def setUp(self):
        """Set up a fresh TodoService for each test."""
        self.service = TodoService()

    def test_add_todo_success(self):
        """Test successfully adding a todo."""
        todo_id = self.service.add_todo("Test title", "Test description", "2023-12-31")

        self.assertEqual(todo_id, 1)

        # Verify the todo was saved
        saved_todo = self.service.get_todo_by_id(todo_id)
        self.assertIsNotNone(saved_todo)
        self.assertEqual(saved_todo.title, "Test title")
        self.assertEqual(saved_todo.description, "Test description")
        self.assertEqual(saved_todo.due_date, "2023-12-31")
        self.assertEqual(saved_todo.status, "Pending")

    def test_add_todo_minimal(self):
        """Test adding a todo with minimal information."""
        todo_id = self.service.add_todo("Test title")

        self.assertEqual(todo_id, 1)

        saved_todo = self.service.get_todo_by_id(todo_id)
        self.assertIsNotNone(saved_todo)
        self.assertEqual(saved_todo.title, "Test title")
        self.assertIsNone(saved_todo.description)
        self.assertIsNone(saved_todo.due_date)
        self.assertEqual(saved_todo.status, "Pending")

    def test_add_todo_empty_title_raises_error(self):
        """Test that adding a todo with empty title raises ValueError."""
        with self.assertRaises(ValueError):
            self.service.add_todo("")

    def test_get_all_todos_empty(self):
        """Test getting all todos when there are none."""
        result = self.service.get_all_todos()
        self.assertEqual(len(result), 0)

    def test_get_all_todos_multiple(self):
        """Test getting all todos when there are multiple."""
        id1 = self.service.add_todo("Title 1")
        id2 = self.service.add_todo("Title 2")
        id3 = self.service.add_todo("Title 3")

        result = self.service.get_all_todos()
        self.assertEqual(len(result), 3)
        # Should be sorted by ID
        self.assertEqual(result[0].id, 1)
        self.assertEqual(result[1].id, 2)
        self.assertEqual(result[2].id, 3)

    def test_update_todo_success(self):
        """Test successfully updating a todo."""
        todo_id = self.service.add_todo("Original title", "Original description")

        result = self.service.update_todo(todo_id, title="New title", description="New description")

        self.assertTrue(result)

        updated_todo = self.service.get_todo_by_id(todo_id)
        self.assertEqual(updated_todo.title, "New title")
        self.assertEqual(updated_todo.description, "New description")

    def test_update_todo_not_found(self):
        """Test updating a non-existent todo."""
        result = self.service.update_todo(999, title="New title")
        self.assertFalse(result)

    def test_delete_todo_success(self):
        """Test successfully deleting a todo."""
        todo_id = self.service.add_todo("Test title")

        result = self.service.delete_todo(todo_id)

        self.assertTrue(result)
        self.assertIsNone(self.service.get_todo_by_id(todo_id))

    def test_delete_todo_not_found(self):
        """Test deleting a non-existent todo."""
        result = self.service.delete_todo(999)
        self.assertFalse(result)

    def test_mark_complete_success(self):
        """Test successfully marking a todo as complete."""
        todo_id = self.service.add_todo("Test title")

        result = self.service.mark_complete(todo_id)

        self.assertTrue(result)

        updated_todo = self.service.get_todo_by_id(todo_id)
        self.assertEqual(updated_todo.status, "Completed")

    def test_mark_complete_not_found(self):
        """Test marking a non-existent todo as complete."""
        result = self.service.mark_complete(999)
        self.assertFalse(result)

    def test_get_todo_by_id_not_found(self):
        """Test getting a non-existent todo by ID."""
        result = self.service.get_todo_by_id(999)
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()