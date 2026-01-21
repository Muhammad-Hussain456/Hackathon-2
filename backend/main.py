"""
Main FastAPI application for the todo web application.

This module creates the FastAPI application with CORS configuration.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from .api.router import router
from .database.session import create_db_and_tables


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to responses.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"

        return response


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        FastAPI: Configured FastAPI application instance
    """
    app = FastAPI(
        title="Todo Web Application API",
        description="A full-stack todo web application with multi-user support, persistent storage, and authentication.",
        version="1.0.0",
    )

    # Add security headers middleware first
    app.add_middleware(SecurityHeadersMiddleware)

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify your frontend domain
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        # expose_headers=["Access-Control-Allow-Origin"]
    )

    # Include API routes
    app.include_router(router, prefix="/api", tags=["todo"])

    # Add logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        logger.info(f"{request.method} {request.url.path}")
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response

    # Create database tables on startup
    @app.on_event("startup")
    def on_startup():
        from .database.session import create_db_and_tables
        create_db_and_tables()
        logger.info("Database tables created")

    # Health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app


# Create the application instance
app = create_application()

# Include this so the application can be run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)