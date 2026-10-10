
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend files from the project folder
app.use(express.static(__dirname));

// API tasks
let tasks = [];
let nextId = 1;

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Task name is required"
        });
    }

    const task = {
        id: nextId++,
        text: text.trim(),
        completed: false
    };

    tasks.push(task);
    res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
    const task = tasks.find(
        item => item.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.completed = Boolean(req.body.completed);
    res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const exists = tasks.some(task => task.id === id);

    if (!exists) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks = tasks.filter(task => task.id !== id);
    res.json({ message: "Task deleted successfully" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`App running on port ${PORT}`);
});
