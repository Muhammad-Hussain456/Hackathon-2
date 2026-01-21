"""
Task model for the todo application.

This module defines the Task model with all required fields and validation rules.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
    from .user import User


class TaskBase(SQLModel):
    """
    Base model for Task with common fields.
    """
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id")


class Task(TaskBase, table=True):
    """
    Task model representing a task with title, description, completion status, timestamps, and user association.

    Fields:
        id: Unique identifier assigned automatically (auto-incrementing)
        user_id: Foreign key linking to the user who owns this task
        title: Required task title (non-empty)
        description: Optional detailed description
        completed: Completion status (default: false)
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last modified

    Validation Rules:
        id: Must be a positive integer, unique within the system
        user_id: Must reference an existing user
        title: Required, must not be empty or whitespace-only
        description: Optional, can be None or any string
        completed: Boolean value, defaults to False
        created_at: Automatically set on creation
        updated_at: Automatically updated on modification

    State Transitions:
        Default: completed = false when created
        Change allowed: false → true only (via mark complete operation)
    """
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    user_id: int = Field(default=None, foreign_key="user.id", index=True)  # Add index for performance
    completed: bool = Field(default=False, index=True)  # Add index for filtering by completion status
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)  # Add index for sorting
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship with User
    user: Optional["User"] = Relationship(sa_relationship_kwargs={"lazy": "select"})


class TaskRead(TaskBase):
    """
    Model for reading task data.
    """
    id: int
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    """
    Model for creating a new task.
    """
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    completed: bool = False


class TaskUpdate(SQLModel):
    """
    Model for updating task information.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None