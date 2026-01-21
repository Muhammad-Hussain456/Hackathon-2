"""
API router for the todo application.

This module defines all API routes with authentication and proper validation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..models.user import User, UserCreate
from ..models.task import Task, TaskCreate, TaskUpdate
from ..services.auth_service import (
    get_current_active_user,
    authenticate_user,
    create_access_token,
    get_password_hash
)
from ..database.session import get_session
from datetime import timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get secret key from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

router = APIRouter()


@router.post("/users/register")
def register_user(
    user_create: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user with email and password.

    Args:
        user_create: User creation details including email, name, and password
        session: Database session

    Returns:
        User: The created user object
    """
    from ..services.user_service import UserService

    # Validate user data
    UserService.validate_user_data(user_create)

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user_create.password)

    # Create the new user
    db_user = User(
        email=user_create.email,
        name=user_create.name,
        password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.post("/users/login")
def login_user(
    email: str,
    password: str,
    session: Session = Depends(get_session)
):
    """
    Login a user with email and password.

    Args:
        email: User's email address
        password: User's password
        session: Database session

    Returns:
        dict: JWT access token and token type
    """
    from ..services.user_service import UserService

    user = UserService.authenticate_user(session, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current authenticated user information.

    Args:
        current_user: The currently authenticated user

    Returns:
        User: The current user's information
    """
    return current_user


@router.get("/{user_id}/tasks")
def read_tasks(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    List tasks for authenticated user with filtering options.

    Args:
        user_id: User ID (must match authenticated user)
        current_user: The currently authenticated user
        session: Database session

    Returns:
        List of task objects for the user
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    tasks = TaskService.get_tasks_for_user(session, user_id)
    return tasks


@router.post("/{user_id}/tasks")
def create_task(
    user_id: int,
    task_create: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID (must match authenticated user)
        task_create: Task creation details
        current_user: The currently authenticated user
        session: Database session

    Returns:
        Task: The created task object
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    # Validate task data
    TaskService.validate_task_data(task_create)

    # Create the task
    task_id = TaskService.create_task(session, task_create, user_id)

    # Retrieve and return the created task
    created_task = session.get(Task, task_id)
    return created_task


@router.get("/{user_id}/tasks/{id}")
def read_task(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific task.

    Args:
        user_id: User ID (must match authenticated user)
        id: Task ID
        current_user: The currently authenticated user
        session: Database session

    Returns:
        Task: The requested task object
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    task = TaskService.get_task_by_id_and_user(session, id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{user_id}/tasks/{id}")
def update_task(
    user_id: int,
    id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing task.

    Args:
        user_id: User ID (must match authenticated user)
        id: Task ID
        task_update: Task update details
        current_user: The currently authenticated user
        session: Database session

    Returns:
        Task: The updated task object
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    updated_task = TaskService.update_task(session, id, user_id, task_update)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return updated_task


@router.delete("/{user_id}/tasks/{id}")
def delete_task(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task.

    Args:
        user_id: User ID (must match authenticated user)
        id: Task ID
        current_user: The currently authenticated user
        session: Database session

    Returns:
        dict: Success message
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user's tasks"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    success = TaskService.delete_task(session, id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}


@router.patch("/{user_id}/tasks/{id}/complete")
def toggle_task_completion(
    user_id: int,
    id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status.

    Args:
        user_id: User ID (must match authenticated user)
        id: Task ID
        current_user: The currently authenticated user
        session: Database session

    Returns:
        Task: The updated task object with toggled completion status
    """
    # Validate that user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )

    # Import here to avoid circular import
    from ..services.task_service import TaskService

    updated_task = TaskService.toggle_task_completion(session, id, user_id)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return updated_task