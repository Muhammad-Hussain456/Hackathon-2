# Quickstart Guide: Phase II - Full-Stack Todo Web Application

**Date**: 2026-01-21
**Feature**: Full-Stack Todo Web Application

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.13
- PostgreSQL (or Neon Serverless PostgreSQL account)
- Git

## Setup

1. Clone the repository (if applicable) or create a new project directory
2. Navigate to the project root directory
3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Configuration

1. Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/todoapp
   BETTER_AUTH_SECRET=your-secret-key
   ```
2. Configure frontend environment variables as needed for API endpoints

## Running the Application

### Backend (FastAPI)
1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
2. The API will be available at http://localhost:8000

### Frontend (Next.js)
1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. The web application will be available at http://localhost:3000

## Basic Usage

1. Register an account via the web interface
2. Log in with your credentials
3. Create, view, update, delete, and mark tasks as complete
4. Each user's tasks are isolated from other users

## Testing

Run backend tests:
```bash
cd backend
pytest
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Development

The application follows a layered architecture:
- `frontend/`: Next.js application with pages, components, and API integration
- `backend/`: FastAPI application with models, services, API routes, and database access
- `docker-compose.yml`: Container orchestration for local development
- Authentication handled via Better Auth with JWT tokens

## API Endpoints

The backend provides REST API endpoints:
- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

All endpoints require JWT authentication in the Authorization header.