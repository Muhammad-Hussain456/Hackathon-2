"""
API dependencies for the todo application.

This module contains dependency injection functions for API endpoints.
"""

from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from ..database.session import SessionLocal, get_session
from ..models.user import User
from ..services.auth_service import get_current_active_user


def get_db_session() -> Generator[Session, None, None]:
    """
    Get a database session for use in API endpoints.

    Yields:
        Session: Database session that will be closed after use
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# Dependency for getting the current authenticated user
CurrentUser = Depends(get_current_active_user)

# Dependency for getting a database session
DBSessionDep = Depends(get_db_session)