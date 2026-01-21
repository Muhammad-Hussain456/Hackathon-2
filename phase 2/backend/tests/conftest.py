"""
Configuration for pytest fixtures in the todo application tests.
"""

import pytest
from sqlmodel import create_engine, SQLModel
from sqlmodel.pool import StaticPool
from ..database.session import SessionLocal
from ..main import app
from fastapi.testclient import TestClient


@pytest.fixture(name="session")
def session_fixture():
    """
    Create a test database session.

    Yields:
        Session: A database session for testing
    """
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(bind=engine)
    from sqlalchemy.orm import sessionmaker
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(name="client")
def client_fixture():
    """
    Create a test client for the FastAPI application.

    Yields:
        TestClient: A test client for making requests to the API
    """
    with TestClient(app) as client:
        yield client