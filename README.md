# Team Task Manager

## Overview

Team Task Manager is a modern task and project management application built for teams who need a polished workspace with strong functionality. It provides project planning, task tracking, and dashboard insights with secure authentication and real-time workflow management.

## Features

- User Authentication
- JWT Authentication
- Role Based Access
- Project Management
- Task Management
- Dashboard
- MongoDB
- Responsive UI

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Mongoose

## Installation

1. Clone the repository:
   ```bash
   git clone <GITHUB_REPOSITORY_URL>
   cd team-task-manager
   ```
2. Install dependencies for the frontend:
   ```bash
   cd client
   npm install
   ```
3. Install dependencies for the backend:
   ```bash
   cd ../server
   npm install
   ```
4. Configure environment variables for the backend.
5. Start the development servers:
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd ../client
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the `server` folder and configure the following variables:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
```

## Folder Structure

```
team-task-manager/
├── client/                 # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT

### Projects
- `GET /api/projects` - Get projects for authenticated user
- `POST /api/projects` - Create a new project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

### Dashboard
- `GET /api/dashboard` - Get dashboard summary metrics

## Future Improvements

- Add role-based permissions and admin management
- Add team collaboration and shared workspaces
- Add real-time notifications and activity feeds
- Add advanced analytics and reporting
- Add file attachments and comments

## Author

Sargunan C

## Links

- Live Demo: http://localhost:5173/login
- GitHub Repository: https://github.com/Sargunan-1619/team-task-manager
