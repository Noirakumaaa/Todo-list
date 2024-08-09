const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const todoSchema = new mongoose.Schema({
    input_number: {
        type: Number,
        unique: true
    },
    todo_item :{
        type: String,
        required: true,
        unique: true
    },
    completed :{
        type: Boolean,
        default: false
    }

});

// Apply the auto-increment plugin to your schema
todoSchema.plugin(autoIncrement, { inc_field: 'input_number' });

const TodoItem = mongoose.model('TodoItem', todoSchema);

module.exports = TodoItem;
