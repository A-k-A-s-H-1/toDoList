// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Fetch all tasks
router.get('/', (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Add a new task
router.post('/', (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title, completed) VALUES (?, ?)", [title, false], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: this.lastID, title, completed: false });
  });
});

// Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json({ deletedID: id });
  });
});

// Mark task as completed
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).json({ updatedID: id });
  });
});

module.exports = router;