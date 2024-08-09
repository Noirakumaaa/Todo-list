const express = require('express');
const bodyParser = require('body-parser');
const {mongoDB} = require('mongodb')
const mongooes = require('mongoose')
const TodoItem = require('./models/todolist');
const path = require('path');

const app = express();
app.use(bodyParser.json()); // To parse JSON bodies
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.delete('/api/data/delete', async (req, res) => {
    const input_number = req.body;
    console.log(req.body)
    console.log('Received IDs:', input_number);
    ids = [];
    ids = [input_number];
    console.log(ids)
    // Validate if req.body is an array
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid input format. Expected an array of IDs.' });
    }

    try {
        // Handle deletion of multiple documents
        const deleteResults = await Promise.all(
            ids.map(async (element) => {
                // Use deleteMany to ensure all documents with the matching input_number are deleted
                return TodoItem.deleteOne({element});
            })
        );

        res.status(200).json(deleteResults);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
});



app.post('/api/data', async (req,res)=>{
    const {todo_item} = req.body;
    try{
        console.log(req.body);
        const todoItem = await TodoItem.create({todo_item})
        res.status(200).json(todoItem)
    }catch(error){
        res.status(500).json({message:error.message})
    }
})


app.get('/api/data', async(req,res)=>{
    try{
        const TodoItems = await TodoItem.find({})
        res.status(200).json(TodoItems);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})


mongooes.connect('mongodb+srv://Noir:uDuEfWwZGT8oEIyp@backenddb.izjaw.mongodb.net/todolist?retryWrites=true&w=majority&appName=backendDB')
.then(()=>{
    console.log("Database is connected");
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    
})

