# Quickstart Guide: Phase I - In-Memory Python Console Todo Application

**Date**: 2026-01-21
**Feature**: Console Todo Application

## Prerequisites

- Python 3.13 installed
- UV package manager (recommended) or pip

## Setup

1. Clone the repository (if applicable) or create a new project directory
2. Navigate to the project directory
3. Install dependencies (if any):
   ```bash
   uv venv  # or python -m venv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

## Running the Application

1. Execute the main application file:
   ```bash
   python main.py
   ```

2. The application will start and display the main menu:
   ```
   1. Add Todo
   2. View Todos
   3. Update Todo
   4. Delete Todo
   5. Mark Todo as Complete
   6. Exit
   ```

## Basic Usage

1. **Add Todo**: Select option 1, then enter the title, description (optional), and due date (optional)
2. **View Todos**: Select option 2 to see all todos in a formatted list
3. **Update Todo**: Select option 3, enter the todo ID, and provide new information for fields you want to change
4. **Delete Todo**: Select option 4 and enter the todo ID to remove
5. **Mark Complete**: Select option 5 and enter the todo ID to mark as completed
6. **Exit**: Select option 6 to quit the application

## Testing

Run the unit tests to verify functionality:
```bash
python -m pytest tests/test_todo.py
```

Or using unittest:
```bash
python -m unittest discover tests/
```

## Development

The application follows a layered architecture:
- `main.py`: Entry point and application flow
- `models/todo.py`: TodoItem class definition
- `services/todo_service.py`: Business logic for todo operations
- `services/storage_service.py`: In-memory storage implementation
- `cli/menu.py`: CLI interface and menu navigation
- `tests/test_todo.py`: Unit tests for functionality