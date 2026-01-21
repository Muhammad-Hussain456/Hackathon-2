"""
TodoItem model representing a task that needs to be completed.

This class defines the structure and validation rules for todo items
in the console todo application.
"""


class TodoItem:
    """
    Represents a task that needs to be completed.

    Attributes:
        id (int): Unique identifier assigned automatically (auto-incrementing)
        title (str): Required task title (non-empty)
        description (str | None): Optional detailed description
        due_date (str | None): Optional due date (string format, not validated in Phase I)
        status (str): Current status ("Pending" or "Completed")
    """

    def __init__(self, id: int, title: str, description: str = None, due_date: str = None, status: str = "Pending"):
        """
        Initialize a TodoItem instance.

        Args:
            id: Unique identifier for the todo
            title: Task title (required, non-empty)
            description: Optional description
            due_date: Optional due date
            status: Status of the todo, defaults to "Pending"

        Raises:
            ValueError: If title is empty or status is invalid
        """
        self.id = id
        self.title = self._validate_title(title)
        self.description = description
        self.due_date = due_date
        self.status = self._validate_status(status)

    def _validate_title(self, title: str) -> str:
        """Validate that title is not empty or whitespace-only."""
        if not title or not title.strip():
            raise ValueError("Title cannot be empty or whitespace-only")
        return title.strip()

    def _validate_status(self, status: str) -> str:
        """Validate that status is either 'Pending' or 'Completed'."""
        if status not in ["Pending", "Completed"]:
            raise ValueError(f"Status must be either 'Pending' or 'Completed', got '{status}'")
        return status

    def update(self, title: str = None, description: str = None, due_date: str = None, status: str = None):
        """
        Update the todo item with new values.

        Only provided fields will be updated, others remain unchanged.
        """
        if title is not None:
            self.title = self._validate_title(title)
        if description is not None:
            self.description = description
        if due_date is not None:
            self.due_date = due_date
        if status is not None:
            self.status = self._validate_status(status)

    def to_dict(self) -> dict:
        """
        Convert the TodoItem to a dictionary representation.

        Returns:
            dict: Dictionary representation of the TodoItem
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date,
            'status': self.status
        }

    def __repr__(self):
        """String representation of the TodoItem."""
        return f"TodoItem(id={self.id}, title='{self.title}', status='{self.status}')"

    def __eq__(self, other):
        """Compare two TodoItem instances."""
        if not isinstance(other, TodoItem):
            return False
        return (self.id == other.id and
                self.title == other.title and
                self.description == other.description and
                self.due_date == other.due_date and
                self.status == other.status)