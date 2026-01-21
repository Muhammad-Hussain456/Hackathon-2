"""
In-memory storage service for todo items.

This service manages the in-memory storage of todo items using a dictionary
with ID as key for efficient lookup.
"""

from typing import Dict, List, Optional
import sys
import os

# Add the parent directory to the path to allow imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.todo import TodoItem


class StorageService:
    """
    Handles in-memory storage operations for todo items.

    Uses a dictionary with ID as key for efficient lookup of todo items.
    """

    def __init__(self):
        """Initialize the in-memory storage."""
        self._storage: Dict[int, TodoItem] = {}
        self._next_id: int = 1

    def initialize_storage(self) -> None:
        """
        Initialize or reset the in-memory storage.

        Creates an empty storage and resets the ID counter.
        """
        self._storage = {}
        self._next_id = 1

    def get_todo(self, todo_id: int) -> Optional[TodoItem]:
        """
        Retrieve a specific todo by ID.

        Args:
            todo_id: ID of the todo to retrieve

        Returns:
            TodoItem if found, None otherwise
        """
        return self._storage.get(todo_id)

    def save_todo(self, todo_item: TodoItem) -> None:
        """
        Save or update a todo in storage.

        Args:
            todo_item: The todo item to save
        """
        self._storage[todo_item.id] = todo_item
        # Update next_id if necessary
        if todo_item.id >= self._next_id:
            self._next_id = todo_item.id + 1

    def remove_todo(self, todo_id: int) -> bool:
        """
        Remove a todo from storage.

        Args:
            todo_id: ID of the todo to remove

        Returns:
            bool: True if successful, False if not found
        """
        if todo_id in self._storage:
            del self._storage[todo_id]
            return True
        return False

    def get_all_todos(self) -> List[TodoItem]:
        """
        Retrieve all todos from storage.

        Returns:
            List of all TodoItem objects in storage, sorted by ID
        """
        return sorted(list(self._storage.values()), key=lambda x: x.id)

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new todo.

        Returns:
            int: The next available ID
        """
        return self._next_id

    def increment_id(self) -> int:
        """
        Increment the ID counter and return the new value.

        Returns:
            int: The new ID value
        """
        current_id = self._next_id
        self._next_id += 1
        return current_id