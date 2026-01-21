"""
User service for the todo application.

This module handles user-related business logic including authentication and validation.
"""

from sqlmodel import Session, select
from typing import Optional
from fastapi import HTTPException, status
from ..models.user import User, UserCreate
from .auth_service import verify_password, get_password_hash


class UserService:
    """
    Service class to handle user-related business logic.
    """

    @staticmethod
    def validate_user_data(user_create: UserCreate) -> None:
        """
        Validate user data according to business rules.

        Args:
            user_create: User creation details to validate

        Raises:
            HTTPException: If validation fails
        """
        # Validate email format
        if not user_create.email or "@" not in user_create.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valid email address is required"
            )

        # Validate password strength
        if not user_create.password or len(user_create.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long"
            )

        # Validate name length if provided
        if user_create.name and len(user_create.name) > 255:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name cannot exceed 255 characters"
            )

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Args:
            session: Database session
            email: User's email address
            password: User's plain text password

        Returns:
            User: The authenticated user if credentials are valid, None otherwise
        """
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()

        if not user or not verify_password(password, user.password):
            return None

        return user