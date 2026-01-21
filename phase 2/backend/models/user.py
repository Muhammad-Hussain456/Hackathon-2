"""
User model for the todo application.

This module defines the User model with all required fields and validation rules.
"""

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
    from .task import Task
from typing import List


class UserBase(SQLModel):
    """
    Base model for User with common fields.
    """
    email: str = Field(unique=True, nullable=False, index=True)  # Add index for performance
    name: Optional[str] = Field(default=None, max_length=255)


class User(UserBase, table=True):
    """
    User model representing a registered user with authentication credentials.

    Fields:
        id: Unique identifier for the user (assigned by authentication system)
        email: User's email address (unique, validated)
        name: User's display name (optional)
        created_at: Timestamp when user account was created
        password: User's hashed password (stored securely)
    """
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    password: str = Field(nullable=False)  # This will be hashed before storing
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    # Relationship with Tasks
    tasks: List["Task"] = Relationship(sa_relationship_kwargs={"lazy": "select"})


class UserRead(UserBase):
    """
    Model for reading user data without sensitive information.
    """
    id: int
    created_at: datetime


class UserCreate(UserBase):
    """
    Model for creating a new user.
    """
    password: str  # This will be hashed before storing


class UserUpdate(SQLModel):
    """
    Model for updating user information.
    """
    email: Optional[str] = None
    name: Optional[str] = None