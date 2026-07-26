# Task Board

Task Board is a full-stack task management application built with Django REST Framework and React. It allows users to manage tasks using a Kanban board with role-based authentication and task tracking features.

## Features

* User authentication
* Admin and User roles
* Create, update, and delete tasks
* Kanban board
* Drag and drop task status
* Task comments
* Search and filter tasks
* Sort tasks by due date
* Image upload
* PDF and Excel export
* Pagination

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* TanStack Query
* dnd-kit

### Backend

* Django
* Django REST Framework
* Pillow

### Database

* SQLite (Development)
* PostgreSQL (Production)

## Project Structure

```text
task-board/
│
├── backend/
├── frontend/
└── README.md
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## User Roles

### Admin

* Manage tasks
* Reorder tasks
* Export data
* View all comments

### User

* View tasks
* Update task status
* Add comments

## Purpose

This project was built for learning and internship assessment purposes.
