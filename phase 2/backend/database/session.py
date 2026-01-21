"""
Database session management for the todo application.

This module sets up the database connection and session management.
"""

from sqlmodel import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_todo.db")  # Using SQLite for testing

# Create the database engine with performance optimizations
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for debugging SQL queries
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections after 5 minutes
    pool_size=20,  # Number of connection objects to maintain
    max_overflow=30,  # Additional connections beyond pool_size
    pool_timeout=10  # Timeout for getting a connection from the pool
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """
    Generator function to get a database session.

    Yields:
        Session: A database session that will be closed after use.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def create_db_and_tables():
    """
    Create the database tables.

    This function should be called when starting the application
    to ensure all required tables exist.
    """
    from sqlmodel import SQLModel
    from ..models.user import User
    from ..models.task import Task

    SQLModel.metadata.create_all(engine)