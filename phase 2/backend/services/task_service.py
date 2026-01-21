"""
Task service layer for the todo application.

This module handles business logic for task operations with user isolation.
"""

from sqlmodel import Session, select, func
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from fastapi import HTTPException, status
from datetime import datetime


class TaskService:
    """
    Service class to handle task-related business logic with proper user isolation.
    """

    @staticmethod
    def create_task(session: Session, task_create: TaskCreate, user_id: int) -> Task:
        """
        Create a new task for the specified user.

        Args:
            session: Database session
            task_create: Task creation details
            user_id: ID of the user creating the task

        Returns:
            Task: The created task object
        """
        # Create the task with the specified user_id
        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            user_id=user_id
        )

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

    @staticmethod
    def get_tasks_for_user(session: Session, user_id: int) -> List[Task]:
        """
        Get all tasks for a specific user.

        Args:
            session: Database session
            user_id: ID of the user whose tasks to retrieve

        Returns:
            List[Task]: List of tasks belonging to the user
        """
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()

        return tasks

    @staticmethod
    def get_task_by_id_and_user(session: Session, task_id: int, user_id: int) -> Optional[Task]:
        """
        Get a specific task by its ID and user ID to ensure user isolation.

        Args:
            session: Database session
            task_id: ID of the task to retrieve
            user_id: ID of the user requesting the task

        Returns:
            Task: The requested task if it belongs to the user, None otherwise
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()

        return task

    @staticmethod
    def update_task(session: Session, task_id: int, user_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """
        Update an existing task for a specific user.

        Args:
            session: Database session
            task_id: ID of the task to update
            user_id: ID of the user requesting the update
            task_update: Task update details

        Returns:
            Task: The updated task if it belongs to the user, None if not found
        """
        # Query the specific task for the user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return None

        # Update the task with provided values
        for field, value in task_update.dict(exclude_unset=True).items():
            setattr(db_task, field, value)

        # Update the updated_at timestamp
        db_task.updated_at = func.now()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

    @staticmethod
    def delete_task(session: Session, task_id: int, user_id: int) -> bool:
        """
        Delete a task for a specific user.

        Args:
            session: Database session
            task_id: ID of the task to delete
            user_id: ID of the user requesting the deletion

        Returns:
            bool: True if the task was deleted, False if not found
        """
        # Query the specific task for the user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return False

        session.delete(db_task)
        session.commit()

        return True

    @staticmethod
    def toggle_task_completion(session: Session, task_id: int, user_id: int) -> Optional[Task]:
        """
        Toggle the completion status of a task for a specific user.

        Args:
            session: Database session
            task_id: ID of the task to update
            user_id: ID of the user requesting the update

        Returns:
            Task: The updated task if it belongs to the user, None if not found
        """
        # Query the specific task for the user
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return None

        # Toggle the completion status
        db_task.completed = not db_task.completed
        db_task.updated_at = func.now()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

    @staticmethod
    def validate_task_data(task_create: TaskCreate) -> None:
        """
        Validate task data according to business rules.

        Args:
            task_create: Task creation details to validate

        Raises:
            HTTPException: If validation fails
        """
        # Validate title is not empty
        if not task_create.title or not task_create.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title is required and cannot be empty"
            )

        # Validate title length
        if len(task_create.title) > 255:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title cannot exceed 255 characters"
            )

        # Validate description length if provided
        if task_create.description and len(task_create.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description cannot exceed 1000 characters"
            )