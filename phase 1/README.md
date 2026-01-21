# Todo Application

A simple console-based todo application implemented in Python 3.13.

## Overview

This application allows users to manage their todo items through a command-line interface. All data is stored in memory only and will be lost when the application exits.

## Features

- Add new todo items
- View all todo items
- Update existing todo items
- Delete todo items
- Mark todo items as complete
- Menu-driven interface

## Prerequisites

- Python 3.13

## Installation

1. Clone or download the repository
2. Navigate to the `todo_app` directory

## Usage

To run the application:

```bash
python main.py
```

Follow the on-screen menu prompts to interact with the application.

## File Structure

```
todo_app/
├── main.py                 # Entry point with CLI menu
├── models/
│   └── todo.py            # TodoItem class definition
├── services/
│   ├── todo_service.py    # Business logic for todo operations
│   └── storage_service.py # In-memory storage implementation
├── cli/
│   └── menu.py            # CLI interface and menu navigation
└── tests/
    └── test_todo.py       # Unit tests for todo functionality
```

## License

This project is created for educational purposes as part of a hackathon challenge.