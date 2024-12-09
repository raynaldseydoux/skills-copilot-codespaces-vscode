// Create web server   
// http://localhost:3000/comments

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Create express server
const app = express();

// Set the port
const port = 3000;

// Read the comments from the file
let comments = JSON.parse(fs.readFileSync('comments.json'));

// Set up body parser
app.use(bodyParser.json());

// Get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Get a comment by id
app.get('/comments/:id', (req, res) => {
    const id = req.params.id;
    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).send(`Comment with id ${id} not found`);
    }
});

// Add a comment
app.post('/comments', (req, res) => {
    const comment = req.body;
    comments.push(comment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.status(201).json(comment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    comments = comments.filter((comment) => comment.id !== id);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.status(204).send();
});

// Update a comment
app.put('/comments/:id', (req, res) => {
    const id = req.params.id;
    const index = comments.findIndex((comment) => comment.id === id);
    if (index !== -1) {
        comments[index] = req.body;
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        res.json(comments[index]);
    } else {
        res.status(404).send(`Comment with id ${id} not found`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

// Use the following commands to test the server
// curl http://localhost:3000/comments
// curl http://localhost:3000/comments/1
// curl -X POST -H "Content-Type: application/json" -d "{\"id\": \"3\", \"name\": \"Jane\", \"comment\": \"I like it\"