# Exercise Editor

This is a simple web-based editor for managing programming exercises in the system. It allows administrators to create, edit, and delete exercises, including the test files that verify student solutions.

## Features

- View a list of all exercises
- Create new exercises
- Edit existing exercises, including:
  - Title
  - Instructions
  - Test file (C++ code using Google Test)
- Delete exercises

## Usage

1. Navigate to the editor directory in your web browser (e.g., http://yourserver.com/serverAPI/editor/)
2. Login with your admin credentials
3. Use the interface to manage exercises

## Security

The editor requires authentication and uses the same token-based authentication system as the main API. Only authenticated users can access the editor, and proper authorization checks should be implemented to ensure only administrators can modify exercises.

## Technical Details

- The editor uses the Google Test framework to verify C++ code submissions
- Exercise test files are stored in the `serverAPI/exercises/` directory with naming pattern `{id}_test.cpp`
- Exercise metadata (title, instructions) are stored in the MySQL database in the `exercise` table