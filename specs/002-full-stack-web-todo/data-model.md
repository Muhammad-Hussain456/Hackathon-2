# Data Model: Phase II - Full-Stack Todo Web Application

**Date**: 2026-01-21
**Feature**: Full-Stack Todo Web Application

## Entities

### User
**Description**: Represents a registered user with authentication credentials managed by Better Auth

**Fields**:
- `id`: int | str - Unique identifier for the user (assigned by authentication system)
- `email`: str - User's email address (unique, validated)
- `name`: str | None - User's display name
- `created_at`: datetime - Timestamp when user account was created

**Validation Rules**:
- `id`: Must be unique within the system
- `email`: Required, must be valid email format, unique
- `name`: Optional, maximum length validation
- `created_at`: Automatically set on creation

### Task
**Description**: Represents a task with title, description, completion status, timestamps, and user association

**Fields**:
- `id`: int - Unique identifier assigned automatically (auto-incrementing)
- `user_id`: int | str - Foreign key linking to the user who owns this task
- `title`: str - Required task title (non-empty)
- `description`: str | None - Optional detailed description
- `completed`: bool - Completion status (default: false)
- `created_at`: datetime - Timestamp when task was created
- `updated_at`: datetime - Timestamp when task was last modified

**Validation Rules**:
- `id`: Must be a positive integer, unique within the system
- `user_id`: Must reference an existing user
- `title`: Required, must not be empty or whitespace-only
- `description`: Optional, can be None or any string
- `completed`: Boolean value, defaults to False
- `created_at`: Automatically set on creation
- `updated_at`: Automatically updated on modification

**State Transitions**:
- Default: `completed = false` when created
- Change allowed: `false` → `true` only (via mark complete operation)

## Relationships

- User has many Tasks (one-to-many relationship)
- Each Task belongs to exactly one User
- Tasks are isolated by user_id (user can only access their own tasks)

## Storage Schema

```sql
-- Users table (managed by Better Auth)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

## Constraints

- All data is persisted in Neon PostgreSQL database
- User isolation: users can only access tasks with matching user_id
- Title validation: reject empty/whitespace-only strings
- Referential integrity: foreign key constraints ensure valid user references
- Timestamps automatically managed by database triggers