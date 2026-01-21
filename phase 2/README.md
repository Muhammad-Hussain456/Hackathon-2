# Todo Web Application

A full-stack todo web application with multi-user support, persistent storage, and authentication.

## Overview

This application provides a complete todo management system with:
- Multi-user support with secure authentication
- Responsive web interface accessible from any device
- Persistent task storage with PostgreSQL database
- REST API with JWT-based authentication
- Modern frontend built with Next.js and Tailwind CSS

## Technologies

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: JWT tokens with custom auth service

## Setup

### Prerequisites

- Node.js 18+
- Python 3.13+
- PostgreSQL (or Neon Serverless PostgreSQL account)

### Backend Setup

1. Navigate to the backend directory: `cd hackathon-todo/backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables (see `.env.example`)

### Frontend Setup

1. Navigate to the frontend directory: `cd hackathon-todo/frontend`
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)

## Running the Application

### Backend

```bash
cd hackathon-todo/backend
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd hackathon-todo/frontend
npm run dev
```

## API Documentation

The API is documented using OpenAPI/Swagger. Once the backend is running, visit `http://localhost:8000/docs` to view the interactive API documentation.

## Architecture

The application follows a clean architecture with clear separation of concerns:

- **Frontend**: Next.js application with pages, components, and API integration
- **Backend**: FastAPI application with models, services, API routes, and database access
- **Database**: PostgreSQL with proper indexing and constraints
- **Authentication**: JWT-based with proper validation and user isolation

## Environment Variables

Both frontend and backend require environment variables for configuration. See the respective `.env.example` files for required variables.

## Testing

### Backend Tests

```bash
cd hackathon-todo/backend
pytest
```

### Frontend Tests

```bash
cd hackathon-todo/frontend
npm test
```