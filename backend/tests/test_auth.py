"""
Unit tests for authentication-related functionality in the todo application.
"""

import pytest
from sqlmodel import Session
from fastapi.testclient import TestClient
from ..models.user import User
from ..services.auth_service import get_password_hash


def test_user_registration(client: TestClient, session: Session):
    """
    Test user registration via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    user_data = {
        "email": "newuser@example.com",
        "name": "New User",
        "password": "securepassword123"
    }

    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200

    user_response = response.json()
    assert user_response["email"] == "newuser@example.com"
    assert user_response["name"] == "New User"
    assert "id" in user_response
    assert user_response["created_at"]


def test_user_login_success(client: TestClient, session: Session):
    """
    Test successful user login via the API.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First register a user
    user_data = {
        "email": "loginuser@example.com",
        "name": "Login User",
        "password": "securepassword123"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200

    # Now try to log in with the same credentials
    login_data = {
        "email": "loginuser@example.com",
        "password": "securepassword123"
    }

    response = client.post("/api/users/login", params=login_data)
    assert response.status_code == 200

    auth_response = response.json()
    assert "access_token" in auth_response
    assert auth_response["token_type"] == "bearer"


def test_user_login_failure_wrong_password(client: TestClient, session: Session):
    """
    Test user login failure with wrong password.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First register a user
    user_data = {
        "email": "wrongpassuser@example.com",
        "name": "Wrong Password User",
        "password": "securepassword123"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200

    # Now try to log in with wrong password
    login_data = {
        "email": "wrongpassuser@example.com",
        "password": "wrongpassword"
    }

    response = client.post("/api/users/login", params=login_data)
    assert response.status_code == 401  # Unauthorized


def test_user_login_failure_nonexistent_user(client: TestClient, session: Session):
    """
    Test user login failure with non-existent user.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # Try to log in with non-existent user
    login_data = {
        "email": "nonexistent@example.com",
        "password": "any_password"
    }

    response = client.post("/api/users/login", params=login_data)
    assert response.status_code == 401  # Unauthorized


def test_get_current_user_authenticated(client: TestClient, session: Session):
    """
    Test getting current user information with valid authentication.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # First register and log in a user to get a token
    user_data = {
        "email": "currentuser@example.com",
        "name": "Current User",
        "password": "securepassword123"
    }
    response = client.post("/api/users/register", json=user_data)
    assert response.status_code == 200

    # Log in to get token
    login_data = {
        "email": "currentuser@example.com",
        "password": "securepassword123"
    }
    response = client.post("/api/users/login", params=login_data)
    assert response.status_code == 200

    auth_response = response.json()
    token = auth_response["access_token"]

    # Make request to get current user with the token
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    user_response = response.json()
    assert user_response["email"] == "currentuser@example.com"
    assert user_response["name"] == "Current User"


def test_get_current_user_unauthenticated(client: TestClient, session: Session):
    """
    Test getting current user information without authentication.

    Args:
        client: Test client for making API requests
        session: Database session for the test
    """
    # Make request to get current user without a token
    response = client.get("/api/users/me")
    assert response.status_code == 401  # Unauthorized


def test_password_hashing():
    """
    Test that password hashing works correctly.
    """
    password = "securepassword123"
    hashed = get_password_hash(password)

    # Verify that the hash is different from the original password
    assert password != hashed

    # Verify that the hash can be verified against the original password
    from ..services.auth_service import verify_password
    assert verify_password(password, hashed) is True

    # Verify that the hash rejects a different password
    assert verify_password("differentpassword", hashed) is False