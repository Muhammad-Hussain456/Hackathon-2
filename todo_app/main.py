#!/usr/bin/env python3
"""
Main entry point for the console todo application.

This module provides the main menu loop and integrates all components
of the todo application.
"""

import sys
import os

# Add the parent directory to the path to allow imports
sys.path.insert(0, os.path.dirname(__file__))

from cli.menu import TodoMenu


def main():
    """
    Main function to run the todo application.

    Initializes the menu system and starts the main application loop.
    """
    print("Welcome to the Todo Application!")
    menu = TodoMenu()
    menu.run()


if __name__ == "__main__":
    main()