"""
CLI menu interface for the todo application.

This module provides the command-line interface for interacting with
the todo application.
"""

from typing import Optional
import sys
import os

# Add the parent directory to the path to allow imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.todo_service import TodoService


class TodoMenu:
    """
    Command-line interface for the todo application.

    Provides the menu system and handles user interactions.
    """

    def __init__(self):
        """Initialize the menu with a todo service."""
        self.service = TodoService()

    def display_menu(self):
        """Display the main menu options."""
        print("\n" + "="*40)
        print("TODO APPLICATION MENU")
        print("="*40)
        print("1. Add Todo")
        print("2. View Todos")
        print("3. Update Todo")
        print("4. Delete Todo")
        print("5. Mark Todo as Complete")
        print("6. Exit")
        print("-"*40)

    def get_user_choice(self) -> str:
        """
        Get the user's menu choice.

        Returns:
            str: The user's menu choice
        """
        try:
            choice = input("Enter your choice (1-6): ").strip()
            return choice
        except (EOFError, KeyboardInterrupt):
            print("\nExiting...")
            return "6"  # Return exit option

    def handle_add_todo(self):
        """Handle the add todo functionality."""
        print("\n--- Add New Todo ---")

        title = input("Enter title: ").strip()
        if not title:
            print("Error: Title cannot be empty.")
            return

        description = input("Enter description (optional, press Enter to skip): ").strip()
        description = description if description else None

        due_date = input("Enter due date (optional, press Enter to skip): ").strip()
        due_date = due_date if due_date else None

        try:
            todo_id = self.service.add_todo(title, description, due_date)
            print(f"Successfully added todo with ID: {todo_id}")
        except ValueError as e:
            print(f"Error: {e}")

    def handle_view_todos(self):
        """Handle the view todos functionality."""
        print("\n--- View All Todos ---")
        todos = self.service.get_all_todos()

        if not todos:
            print("No todos found.")
            return

        print(f"{'ID':<4} {'Title':<20} {'Status':<12} {'Due Date':<15} {'Description'}")
        print("-" * 70)
        for todo in todos:
            desc = todo.description if todo.description else ""
            due_date = todo.due_date if todo.due_date else ""
            print(f"{todo.id:<4} {todo.title[:19]:<20} {todo.status:<12} {due_date[:14]:<15} {desc}")

    def handle_update_todo(self):
        """Handle the update todo functionality."""
        print("\n--- Update Todo ---")

        if not self._has_todos():
            return

        try:
            todo_id_str = input("Enter the ID of the todo to update: ").strip()
            todo_id = int(todo_id_str)
        except ValueError:
            print("Error: Please enter a valid integer ID.")
            return

        # Check if todo exists
        existing_todo = self.service.get_todo_by_id(todo_id)
        if not existing_todo:
            print(f"Error: Todo with ID {todo_id} not found.")
            return

        print(f"Updating todo: {existing_todo.title}")

        # Get new values (press Enter to keep current value)
        new_title = input(f"Enter new title (current: '{existing_todo.title}', press Enter to keep): ").strip()
        new_title = new_title if new_title else None

        new_description = input(f"Enter new description (current: '{existing_todo.description or ''}', press Enter to keep): ").strip()
        new_description = new_description if new_description else None

        new_due_date = input(f"Enter new due date (current: '{existing_todo.due_date or ''}', press Enter to keep): ").strip()
        new_due_date = new_due_date if new_due_date else None

        success = self.service.update_todo(
            todo_id,
            title=new_title,
            description=new_description,
            due_date=new_due_date
        )

        if success:
            print("Todo updated successfully!")
        else:
            print("Failed to update todo.")

    def handle_delete_todo(self):
        """Handle the delete todo functionality."""
        print("\n--- Delete Todo ---")

        if not self._has_todos():
            return

        try:
            todo_id_str = input("Enter the ID of the todo to delete: ").strip()
            todo_id = int(todo_id_str)
        except ValueError:
            print("Error: Please enter a valid integer ID.")
            return

        success = self.service.delete_todo(todo_id)

        if success:
            print(f"Todo with ID {todo_id} deleted successfully!")
        else:
            print(f"Error: Todo with ID {todo_id} not found.")

    def handle_mark_complete(self):
        """Handle marking a todo as complete."""
        print("\n--- Mark Todo as Complete ---")

        if not self._has_todos():
            return

        try:
            todo_id_str = input("Enter the ID of the todo to mark as complete: ").strip()
            todo_id = int(todo_id_str)
        except ValueError:
            print("Error: Please enter a valid integer ID.")
            return

        success = self.service.mark_complete(todo_id)

        if success:
            print(f"Todo with ID {todo_id} marked as complete!")
        else:
            print(f"Error: Todo with ID {todo_id} not found.")

    def _has_todos(self) -> bool:
        """
        Check if there are any todos in the system.

        Returns:
            bool: True if there are todos, False otherwise
        """
        todos = self.service.get_all_todos()
        if not todos:
            print("No todos found. Please add a todo first.")
            return False
        return True

    def run(self):
        """Run the main menu loop."""
        while True:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == "1":
                self.handle_add_todo()
            elif choice == "2":
                self.handle_view_todos()
            elif choice == "3":
                self.handle_update_todo()
            elif choice == "4":
                self.handle_delete_todo()
            elif choice == "5":
                self.handle_mark_complete()
            elif choice == "6":
                print("Thank you for using the Todo Application. Goodbye!")
                break
            else:
                print(f"Invalid choice: '{choice}'. Please enter a number between 1 and 6.")

            # Pause to let user see results before showing menu again
            input("\nPress Enter to continue...")