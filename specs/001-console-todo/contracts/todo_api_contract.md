# API Contract: Todo Operations

**Date**: 2026-01-21
**Feature**: Console Todo Application
**Version**: 1.0

## Overview

This document describes the internal API contracts for the console todo application. Since this is a console application without external APIs, these represent the internal service interfaces.

## Todo Service Interface

### Add Todo
- **Method**: `add_todo(title: str, description: str = None, due_date: str = None) -> int`
- **Description**: Creates a new todo item
- **Parameters**:
  - `title` (str): Required title (non-empty)
  - `description` (str, optional): Optional description
  - `due_date` (str, optional): Optional due date string
- **Returns**: int - The ID of the newly created todo
- **Throws**: ValueError if title is empty
- **Post-condition**: Todo is stored in memory with "Pending" status and assigned ID

### View Todos
- **Method**: `get_all_todos() -> List[TodoItem]`
- **Description**: Retrieves all todos
- **Returns**: List of TodoItem objects in creation order
- **Post-condition**: Returns empty list if no todos exist

### Update Todo
- **Method**: `update_todo(todo_id: int, title: str = None, description: str = None, due_date: str = None) -> bool`
- **Description**: Updates specified fields of an existing todo
- **Parameters**:
  - `todo_id` (int): ID of the todo to update
  - `title` (str, optional): New title if provided
  - `description` (str, optional): New description if provided
  - `due_date` (str, optional): New due date if provided
- **Returns**: bool - True if successful, False if todo not found
- **Post-condition**: Only specified fields are updated, others remain unchanged

### Delete Todo
- **Method**: `delete_todo(todo_id: int) -> bool`
- **Description**: Removes a todo from storage
- **Parameters**: `todo_id` (int): ID of the todo to delete
- **Returns**: bool - True if successful, False if todo not found
- **Post-condition**: Todo is removed from storage

### Mark Todo Complete
- **Method**: `mark_complete(todo_id: int) -> bool`
- **Description**: Marks a todo as completed
- **Parameters**: `todo_id` (int): ID of the todo to mark complete
- **Returns**: bool - True if successful, False if todo not found
- **Post-condition**: Todo status is set to "Completed"

## Storage Service Interface

### Initialize Storage
- **Method**: `initialize_storage() -> None`
- **Description**: Sets up the in-memory storage
- **Post-condition**: Empty storage is ready for use

### Get Todo
- **Method**: `get_todo(todo_id: int) -> TodoItem | None`
- **Description**: Retrieves a specific todo by ID
- **Parameters**: `todo_id` (int): ID of the todo to retrieve
- **Returns**: TodoItem if found, None otherwise

### Save Todo
- **Method**: `save_todo(todo_item: TodoItem) -> None`
- **Description**: Saves or updates a todo in storage
- **Parameters**: `todo_item` (TodoItem): The todo item to save

### Remove Todo
- **Method**: `remove_todo(todo_id: int) -> bool`
- **Description**: Removes a todo from storage
- **Parameters**: `todo_id` (int): ID of the todo to remove
- **Returns**: bool - True if successful, False if not found

### Get All Todos
- **Method**: `get_all_todos() -> List[TodoItem]`
- **Description**: Retrieves all todos from storage
- **Returns**: List of all TodoItem objects in storage