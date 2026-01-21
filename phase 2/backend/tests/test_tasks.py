"""
Unit tests for task-related functionality in the todo application.
"""

import pytest
from sqlmodel import Session, select
from fastapi.testclient import TestClient
from unittest.mock import patch
from ..models.task import Task
from ..models.user import User
from ..services.todo_service import TodoService


def test_create_task(client: TestClient, session: Session):
    """
    Test creating a new task via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First, create a user to associate with the task
    user_data = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "securepassword"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200
    user_response = response.json()
    user_id = user_response["id"]

    # Now create a task for this user
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }

    response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert response.status_code == 200

    task_response = response.json()
    assert task_response["title"] == "Test Task"
    assert task_response["description"] == "Test Description"
    assert task_response["completed"] is False
    assert task_response["user_id"] == user_id


def test_get_all_tasks(client: TestClient, session: Session):
    """
    Test retrieving all tasks for a user via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First, create a user
    user_data = {
        "email": "test2@example.com",
        "name": "Test User 2",
        "password": "securepassword"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200
    user_response = response.json()
    user_id = user_response["id"]

    # Create a task for this user
    task_data = {
        "title": "Another Test Task",
        "description": "Another Test Description",
        "completed": False
    }
    response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert response.status_code == 200

    # Get all tasks for the user
    response = client.get(f"/api/{user_id}/tasks")
    assert response.status_code == 200

    tasks_response = response.json()
    assert len(tasks_response) == 1
    assert tasks_response[0]["title"] == "Another Test Task"


def test_update_task(client: TestClient, session: Session):
    """
    Test updating an existing task via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First, create a user
    user_data = {
        "email": "test3@example.com",
        "name": "Test User 3",
        "password": "securepassword"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200
    user_response = response.json()
    user_id = user_response["id"]

    # Create a task for this user
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "completed": False
    }
    response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert response.status_code == 200
    task_response = response.json()
    task_id = task_response["id"]

    # Update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "completed": True
    }
    response = client.put(f"/api/{user_id}/tasks/{task_id}", json=update_data)
    assert response.status_code == 200

    updated_task = response.json()
    assert updated_task["title"] == "Updated Task"
    assert updated_task["description"] == "Updated Description"
    assert updated_task["completed"] is True


def test_delete_task(client: TestClient, session: Session):
    """
    Test deleting a task via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First, create a user
    user_data = {
        "email": "test4@example.com",
        "name": "Test User 4",
        "password": "securepassword"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200
    user_response = response.json()
    user_id = user_response["id"]

    # Create a task for this user
    task_data = {
        "title": "Task to Delete",
        "description": "Description to Delete",
        "completed": False
    }
    response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert response.status_code == 200
    task_response = response.json()
    task_id = task_response["id"]

    # Verify the task exists
    response = client.get(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 200

    # Delete the task
    response = client.delete(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 200

    # Verify the task no longer exists
    response = client.get(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 404


def test_mark_task_complete(client: TestClient, session: Session):
    """
    Test marking a task as complete via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First, create a user
    user_data = {
        "email": "test5@example.com",
        "name": "Test User 5",
        "password": "securepassword"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200
    user_response = response.json()
    user_id = user_response["id"]

    # Create a task for this user
    task_data = {
        "title": "Task to Complete",
        "description": "Description to Complete",
        "completed": False
    }
    response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert response.status_code == 200
    task_response = response.json()
    task_id = task_response["id"]

    # Verify the task is initially not complete
    response = client.get(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 200
    task_before = response.json()
    assert task_before["completed"] is False

    # Mark the task as complete
    response = client.patch(f"/api/{user_id}/tasks/{task_id}/complete")
    assert response.status_code == 200

    # Verify the task is now complete
    response = client.get(f"/api/{user_id}/tasks/{task_id}")
    assert response.status_code == 200
    task_after = response.json()
    assert task_after["completed"] is True