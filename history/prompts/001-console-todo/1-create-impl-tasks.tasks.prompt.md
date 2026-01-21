---
id: 1
title: Create Impl Tasks
stage: tasks
date: 2026-01-21
surface: agent
model: claude-sonnet-4-5-20250929
feature: console-todo
branch: 001-console-todo
user: user
command: "/sp.tasks "
labels: [tasks, todo-app, console, python, implementation]
links:
  spec: specs/001-console-todo/spec.md
  plan: specs/001-console-todo/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-console-todo/tasks.md
 - specs/001-console-todo/spec.md
 - specs/001-console-todo/plan.md
 - specs/001-console-todo/data-model.md
 - specs/001-console-todo/contracts/todo_api_contract.md
 - specs/001-console-todo/research.md
 - specs/001-console-todo/quickstart.md
tests:
 - none
---

## Prompt

```text

```

## Response snapshot

```text
# Implementation Tasks: Phase I - In-Memory Python Console Todo Application

**Feature**: Console Todo Application
**Branch**: 001-console-todo
**Created**: 2026-01-21
**Status**: Ready for Implementation

## Overview

Implementation plan for the Phase I In-Memory Python Console Todo Application, organized by user story priority and implementation phases. Each user story is designed to be independently testable and deliverable.

## Dependencies

User stories can be implemented in parallel after foundational components are complete. The dependency order is: Setup → Foundational → User Stories (P1, P2) → Polish.

## Parallel Execution Examples

- User Story 1 (Add Todo) and User Story 2 (View Todos) can be implemented in parallel after foundational components
- User Story 3 (Update Todo) and User Story 4 (Delete Todo) can be implemented in parallel
- User Story 5 (Mark Complete) and User Story 6 (Navigate Menu) can be implemented in parallel

## Implementation Strategy

MVP scope includes User Story 1 (Add Todo) and User Story 2 (View Todos) with minimal CLI interface. Subsequent stories add functionality incrementally, with User Stories 3-6 completing the full feature set. Cross-cutting concerns like error handling and validation are addressed throughout.

---

## Phase 1: Setup

- [ ] T001 Create project directory structure: todo_app/, todo_app/models/, todo_app/services/, todo_app/cli/, todo_app/tests/
- [ ] T002 Initialize Python project with requirements.txt or pyproject.toml
- [ ] T003 Create basic README.md with project overview and setup instructions

---

## Phase 2: Foundational Components

- [ ] T004 Create TodoItem class in todo_app/models/todo.py with id, title, description, due_date, status fields
- [ ] T005 Implement TodoItem validation logic (title not empty, status in ["Pending", "Completed"])
- [ ] T006 Create in-memory storage service in todo_app/services/storage_service.py with initialize_storage, get_todo, save_todo, remove_todo, get_all_todos methods
- [ ] T007 Create todo service in todo_app/services/todo_service.py with add_todo, get_all_todos, update_todo, delete_todo, mark_complete methods
- [ ] T008 [P] Create main entry point in todo_app/main.py with basic structure

---

## Phase 3: User Story 1 - Add Todo Items (Priority: P1)

**Goal**: Enable users to add new todo items to their list so they can track tasks they need to complete.

**Independent Test**: Can be fully tested by adding various todo items with different titles and descriptions, and verifying they appear in the system.

**Tasks**:
- [ ] T009 [US1] Implement add_todo functionality in todo_app/services/todo_service.py to create new todos with unique IDs and "Pending" status
- [ ] T010 [US1] Add input validation in add_todo to reject empty titles
- [ ] T011 [US1] Create CLI function in todo_app/cli/menu.py for adding todos with title, description, and due date prompts
- [ ] T012 [US1] Integrate add todo CLI function with main menu in todo_app/main.py
- [ ] T013 [US1] [P] Create basic unit tests for add todo functionality in todo_app/tests/test_todo.py

---

## Phase 4: User Story 2 - View All Todo Items (Priority: P1)

**Goal**: Enable users to view all their todo items so they can see what tasks they need to complete.

**Independent Test**: Can be fully tested by viewing the list of todos after adding them, ensuring they display correctly with all relevant information.

**Tasks**:
- [ ] T014 [US2] Implement get_all_todos functionality in todo_app/services/todo_service.py to return all todos
- [ ] T015 [US2] Create CLI function in todo_app/cli/menu.py for viewing todos with formatted display
- [ ] T016 [US2] Display ID, title, status, and due date for each todo when viewing the list
- [ ] T017 [US2] Handle case where no todos exist with friendly message
- [ ] T018 [US2] [P] Integrate view todos CLI function with main menu in todo_app/main.py
- [ ] T019 [US2] [P] Create basic unit tests for view todos functionality in todo_app/tests/test_todo.py

---

## Phase 5: User Story 3 - Update Todo Items (Priority: P2)

**Goal**: Enable users to update their todo items so they can modify titles, descriptions, or due dates as needed.

**Independent Test**: Can be fully tested by updating specific todo items and verifying changes are saved and displayed correctly.

**Tasks**:
- [ ] T020 [US3] Implement update_todo functionality in todo_app/services/todo_service.py to update only specified fields
- [ ] T021 [US3] Add validation in update_todo to ensure todo exists before updating
- [ ] T022 [US3] Create CLI function in todo_app/cli/menu.py for updating todos with ID prompt and optional field updates
- [ ] T023 [US3] Integrate update todo CLI function with main menu in todo_app/main.py
- [ ] T024 [US3] [P] Create basic unit tests for update todo functionality in todo_app/tests/test_todo.py

---

## Phase 6: User Story 4 - Delete Todo Items (Priority: P2)

**Goal**: Enable users to delete todo items so they can remove tasks they no longer need to track.

**Independent Test**: Can be fully tested by deleting specific todo items and verifying they no longer appear in the list.

**Tasks**:
- [ ] T025 [US4] Implement delete_todo functionality in todo_app/services/todo_service.py to remove todos by ID
- [ ] T026 [US4] Add validation in delete_todo to ensure todo exists before deletion
- [ ] T027 [US4] Create CLI function in todo_app/cli/menu.py for deleting todos with ID prompt
- [ ] T028 [US4] Integrate delete todo CLI function with main menu in todo_app/main.py
- [ ] T029 [US4] [P] Create basic unit tests for delete todo functionality in todo_app/tests/test_todo.py

---

## Phase 7: User Story 5 - Mark Todo as Complete (Priority: P1)

**Goal**: Enable users to mark their todo items as complete so they can track their progress and distinguish between pending and completed tasks.

**Independent Test**: Can be fully tested by marking todos as complete and verifying their status updates correctly.

**Tasks**:
- [ ] T030 [US5] Implement mark_complete functionality in todo_app/services/todo_service.py to change status to "Completed"
- [ ] T031 [US5] Add validation in mark_complete to ensure todo exists before changing status
- [ ] T032 [US5] Create CLI function in todo_app/cli/menu.py for marking todos as complete with ID prompt
- [ ] T033 [US5] Integrate mark complete CLI function with main menu in todo_app/main.py
- [ ] T034 [US5] [P] Create basic unit tests for mark complete functionality in todo_app/tests/test_todo.py

---

## Phase 8: User Story 6 - Navigate Main Menu (Priority: P1)

**Goal**: Enable users to navigate the main menu so they can access all todo management features.

**Independent Test**: Can be fully tested by navigating through all menu options and confirming each leads to the appropriate function.

**Tasks**:
- [ ] T035 [US6] Implement main menu loop in todo_app/main.py with options 1-6 as specified
- [ ] T036 [US6] Add input validation for menu selection to handle invalid choices
- [ ] T037 [US6] Implement proper exit functionality when option 6 is selected
- [ ] T038 [US6] Add clear error messages when invalid menu options are entered
- [ ] T039 [US6] [P] Create basic unit tests for menu navigation in todo_app/tests/test_todo.py

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T040 Add comprehensive input validation throughout the application to handle edge cases (empty titles, invalid IDs, etc.)
- [ ] T041 Implement proper error handling to prevent crashes from malformed input
- [ ] T042 Add clear error messages for all validation failures and error conditions
- [ ] T043 Ensure all code follows PEP-8 standards for Python
- [ ] T044 Add docstrings and comments to all public functions and classes
- [ ] T045 Create comprehensive README.md with setup, usage, and testing instructions
- [ ] T046 Run full test suite to verify all functionality works together
- [ ] T047 Perform manual testing of all user stories to ensure they work as expected
- [ ] T048 Optimize performance to meet <100ms per operation requirement
```

## Outcome

- ✅ Impact: Created comprehensive implementation tasks for Phase I console todo application
- 🧪 Tests: none
- 📁 Files: Created tasks.md with 48 detailed implementation tasks organized by user stories
- 🔁 Next prompts: Ready for implementation using the generated tasks
- 🧠 Reflection: Tasks organized by user story priority with clear dependencies and parallel execution opportunities

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): not applicable