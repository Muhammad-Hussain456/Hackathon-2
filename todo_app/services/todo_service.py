"""
Todo service for business logic operations.

This service handles all business logic for todo operations including
creating, retrieving, updating, deleting, and marking todos as complete.
"""

from typing import List, Optional
import sys
import os

# Add the parent directory to the path to allow imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.todo import TodoItem
from services.storage_service import StorageService


class TodoService:
    """
    Handles business logic for todo operations.

    Manages all todo-related functionality including CRUD operations
    and status updates.
    """

    def __init__(self):
        """Initialize the todo service with a storage service."""
        self.storage = StorageService()

    def add_todo(self, title: str, description: str = None, due_date: str = None) -> int:
        """
        Create a new todo item.

        Args:
            title: Required title for the todo (non-empty)
            description: Optional description
            due_date: Optional due date string

        Returns:
            int: The ID of the newly created todo

        Raises:
            ValueError: If title is empty
        """
        # Create a new todo with a unique ID and default status of "Pending"
        todo_id = self.storage.increment_id()
        new_todo = TodoItem(
            id=todo_id,
            title=title,
            description=description,
            due_date=due_date,
            status="Pending"
        )
        self.storage.save_todo(new_todo)
        return todo_id

    def get_all_todos(self) -> List[TodoItem]:
        """
        Retrieve all todos.

        Returns:
            List of all TodoItem objects in creation order
        """
        return self.storage.get_all_todos()

    def update_todo(self, todo_id: int, title: str = None, description: str = None, due_date: str = None) -> bool:
        """
        Update specified fields of an existing todo.

        Args:
            todo_id: ID of the todo to update
            title: New title if provided
            description: New description if provided
            due_date: New due date if provided

        Returns:
            bool: True if successful, False if todo not found
        """
        todo = self.storage.get_todo(todo_id)
        if todo is None:
            return False

        # Update only the fields that are provided
        todo.update(title=title, description=description, due_date=due_date)
        self.storage.save_todo(todo)
        return True

    def delete_todo(self, todo_id: int) -> bool:
        """
        Remove a todo from storage.

        Args:
            todo_id: ID of the todo to delete

        Returns:
            bool: True if successful, False if todo not found
        """
        return self.storage.remove_todo(todo_id)

    def mark_complete(self, todo_id: int) -> bool:
        """
        Mark a todo as completed.

        Args:
            todo_id: ID of the todo to mark complete

        Returns:
            bool: True if successful, False if todo not found
        """
        todo = self.storage.get_todo(todo_id)
        if todo is None:
            return False

        todo.update(status="Completed")
        self.storage.save_todo(todo)
        return True

    def get_todo_by_id(self, todo_id: int) -> Optional[TodoItem]:
        """
        Get a specific todo by ID.

        Args:
            todo_id: ID of the todo to retrieve

        Returns:
            TodoItem if found, None otherwise
        """
        return self.storage.get_todo(todo_id)