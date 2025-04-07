import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post('http://localhost:8000/api/tasks/', {
        title: newTask,
        completed: false,
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  const completeTask = async (taskId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/tasks/${taskId}/`, {
        completed: !currentStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error al marcar la tarea como completada:', error);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>

      {tasks.length === 0 ? (
        <p className="no-tasks">No hay tareas.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              {task.title}
              <button
                className="complete-btn"
                onClick={() => completeTask(task.id, task.completed)}
              >
                {task.completed ? 'Desmarcar' : 'Completar'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="input-group">
        <input
          type="text"
          value={newTask}
          placeholder="Nueva tarea"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Agregar Tarea</button>
      </div>
    </div>
  );
}

export default App;
