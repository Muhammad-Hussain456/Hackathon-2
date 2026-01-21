# API Contract: Todo Operations for Full-Stack Web Application

**Date**: 2026-01-21
**Feature**: Full-Stack Todo Web Application
**Version**: 1.0

## Overview

This document describes the REST API contracts for the full-stack todo web application. All endpoints require JWT token authentication in the Authorization header.

## Authentication

All API endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

The token is validated on each request to ensure user authentication and enforce user isolation.

## User Endpoints

### GET /api/users/me
- **Description**: Get current authenticated user information
- **Headers**: Authorization: Bearer <token>
- **Response**: 200 OK with user object
- **Errors**: 401 Unauthorized if token invalid

## Task Endpoints

### GET /api/{user_id}/tasks
- **Description**: List tasks for authenticated user with filtering options
- **Path Parameters**: `user_id` (must match authenticated user)
- **Query Parameters**: `status` (optional, filter by completion status)
- **Headers**: Authorization: Bearer <token>
- **Response**: 200 OK with array of task objects
- **Errors**: 401 Unauthorized, 403 Forbidden (if user_id doesn't match)

### POST /api/{user_id}/tasks
- **Description**: Create a new task for the authenticated user
- **Path Parameters**: `user_id` (must match authenticated user)
- **Headers**: Authorization: Bearer <token>, Content-Type: application/json
- **Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "completed": "boolean (optional, default: false)"
  }
  ```
- **Response**: 201 Created with created task object
- **Errors**: 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden

### GET /api/{user_id}/tasks/{id}
- **Description**: Retrieve a specific task
- **Path Parameters**: `user_id` (must match authenticated user), `id` (task ID)
- **Headers**: Authorization: Bearer <token>
- **Response**: 200 OK with task object
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### PUT /api/{user_id}/tasks/{id}
- **Description**: Update an existing task
- **Path Parameters**: `user_id` (must match authenticated user), `id` (task ID)
- **Headers**: Authorization: Bearer <token>, Content-Type: application/json
- **Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "completed": "boolean (optional)"
  }
  ```
- **Response**: 200 OK with updated task object
- **Errors**: 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden, 404 Not Found

### DELETE /api/{user_id}/tasks/{id}
- **Description**: Delete a task
- **Path Parameters**: `user_id` (must match authenticated user), `id` (task ID)
- **Headers**: Authorization: Bearer <token>
- **Response**: 204 No Content
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### PATCH /api/{user_id}/tasks/{id}/complete
- **Description**: Toggle task completion status
- **Path Parameters**: `user_id` (must match authenticated user), `id` (task ID)
- **Headers**: Authorization: Bearer <token>
- **Response**: 200 OK with updated task object
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found

## Data Models

### User Object
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "created_at": "timestamp"
}
```

### Task Object
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "completed": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "detail": "error message"
}
```

### HTTP Status Codes

- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (user access violation)
- 404: Not Found (resource doesn't exist)
- 422: Unprocessable Entity (validation errors for request body)
- 500: Internal Server Error (unexpected server errors)