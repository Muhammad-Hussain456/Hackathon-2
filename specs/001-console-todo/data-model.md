# Data Model: Phase I - In-Memory Python Console Todo Application

**Date**: 2026-01-21
**Feature**: Console Todo Application

## Entities

### Todo Item
**Description**: Represents a task that needs to be completed

**Fields**:
- `id`: int - Unique identifier assigned automatically (auto-incrementing)
- `title`: str - Required task title (non-empty)
- `description`: str | None - Optional detailed description
- `due_date`: str | None - Optional due date (string format, not validated in Phase I)
- `status`: str - Current status ("Pending" or "Completed")

**Validation Rules**:
- `id`: Must be a positive integer, unique within the system
- `title`: Required, must not be empty or whitespace-only
- `description`: Optional, can be None or any string
- `due_date`: Optional, can be None or any string
- `status`: Must be either "Pending" or "Completed"

**State Transitions**:
- Default: "Pending" when created
- Change allowed: "Pending" → "Completed" only (via mark complete operation)

### Todo List
**Description**: Collection of todo items stored in memory during application runtime

**Characteristics**:
- In-memory only (no persistence)
- Dictionary-based storage with ID as key for efficient lookup
- Maintains all todo items during application session

## Relationships

- Todo List contains multiple Todo Items
- Each Todo Item belongs to exactly one Todo List (during session)
- Todo Items have unique IDs within the Todo List

## Storage Schema

```python
# In-memory representation
storage: Dict[int, TodoItem] = {}
next_id: int = 1  # Auto-increment counter for new items
```

## Constraints

- All data is ephemeral (lost when application exits)
- IDs are guaranteed unique within a single session
- Title validation: reject empty/whitespace-only strings
- Status validation: only "Pending" and "Completed" values allowed
- ID validation: operations require valid existing IDs