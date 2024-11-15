import React, { useState, useEffect } from 'react';
import './TaskManager.css'

const TaskManager = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [title, setTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('date');
    const [priority, setPriority] = useState('low');

    // Add Task
    const addTask = () => {
        if (!title.trim()) return;
        const newTask = { id: Date.now(), title, completed: false, priority };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTitle('');
    };

    // Delete Task
    const deleteTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    // Toggle Completion
    const toggleComplete = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Filter and Sort Tasks
    const filteredTasks = tasks
        .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortOption === 'priority') {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            if (sortOption === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    return (
    <div className='main'>
        <div style={{ maxWidth: '500px', margin: '0 auto' , textAlign:'center'}}>
            <h1>Task - Manager</h1>

            {/* Task Input */}
            <div className='task-section'>
                <input className='task-input'
                    type="text"
                    placeholder="Add a new task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select className='select-option' value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button className='addtaskbtn' onClick={addTask}>Add Task</button>
            </div>

            {/* Search and Sort */}
            <div className='task-section'>
                <input className='task-input'
                    type="text"
                    placeholder="Search tasks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select className='select-option' value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="date">Date Added</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
            </div>

            {/* Task List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredTasks.map((task) => (
                    <li
                        key={task.id}
                        style={{
                            height:"50px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderBottom: '1px solid #ccc',
                            transition: 'background 0.3s',
                            backgroundColor: task.completed ? '#d4edda' : 'aliceblue',
                        }}
                    >
                        <div style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}
                            />
                            <strong>[{task.priority.toUpperCase()}]</strong> {task.title}
                        </div>
                        <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px',backgroundColor:'red',color:'white', height:'30px', width:'100px',borderRadius:'5px',border:'none' }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
};

export default TaskManager;
