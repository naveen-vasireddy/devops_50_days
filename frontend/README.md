# Todo List Frontend

A React-based frontend for the todo list application.

## Features

- Create tasks with title and description
- View all tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Real-time updates from the backend API

## Prerequisites

- Node.js 14+
- npm or yarn

## Installation

```bash
npm install
```

## Running

Start the development server:

```bash
npm start
```

The app runs on `http://localhost:3000` by default.

## Building

Create a production build:

```bash
npm run build
```

## API Connection

The frontend connects to the backend API at `http://localhost:8000/api` by default.

To change the API URL, set the `REACT_APP_API_URL` environment variable:

```bash
REACT_APP_API_URL=http://your-api-url npm start
```

## Docker

Build Docker image:

```bash
docker build -t frontend:v1 .
```

Run container:

```bash
docker run -d -p 3000:3000 --name frontend-app frontend:v1
```
