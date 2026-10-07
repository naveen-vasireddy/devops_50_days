import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/tasks`, {
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      setTasks([response.data, ...tasks]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE}/tasks/${id}/toggle`);
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      setError('');
    } catch (err) {
      setError('Failed to toggle task');
      console.error(err);
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE}/tasks/${id}`, updatedData);
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Todo List</h1>
      </header>

      <main className="App-main">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={createTask} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="btn-submit">
            Add Task
          </button>
        </form>

        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : (
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="empty-state">No tasks yet. Add one above!</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-check">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="checkbox"
                    />
                  </div>
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
