const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./config/db'); // Import your MySQL connection
const path = require('path');

const app = express();
app.use(bodyParser.json()); // To parse JSON bodies
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/data', async (req, res) => {
    const data = req.body;

    // Validate and extract the data you need
    const { newItem } = data;

    try {
        // Use parameterized query to prevent SQL injection
        const [result] = await mysql.query('INSERT INTO todo_list (todoItem, itemDone) VALUES (?, ?)', [newItem, false]);

        // Send a response back to the client
        res.status(200).json({ message: 'Data received successfully', insertedId: result.insertId });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Error inserting data', error: error.message });
    }
});


app.delete('/api/data/delete', async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        console.log('Invalid request: No IDs provided');
        return res.status(400).json({ error: 'Invalid request: No IDs provided' });
    }

    try {
        let allDeleted = true;
        const notFoundIds = []; // Track IDs that were not found

        for (const id of ids) {
            const [result] = await mysql.execute('DELETE FROM todo_list WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                allDeleted = false;
                notFoundIds.push(id); // Collect IDs not found
            }
        }

        if (allDeleted) {
            res.json({ message: 'All items deleted successfully' });
        } else {
            res.status(404).json({ message: 'Some items were not found and could not be deleted', notFoundIds });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        if (!res.headersSent) { // Check if headers are already sent
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


app.post('/api/items/todolist', async (req, res) => {
    console.log('Request received for /api/items/todolist');
    
    try {
        const [data] = await mysql.query('SELECT * FROM todo_list');
        const ids = [];
        const todos = [];
        const itemDones = [];

        if (data.length > 0) {
            data.forEach(row => {
                ids.push(row.id); // Ensure column names are correct
                todos.push(row.todoItem); // Ensure column names are correct
                itemDones.push(row.itemDone); // Ensure column names are correct
            });
        } else {
            console.log('No data found.');
        }

        res.json({ ids, todos, itemDones });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
