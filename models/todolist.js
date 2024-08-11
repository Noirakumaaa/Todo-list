const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const todoItemSchema = new mongoose.Schema({
    input_number: {
        type: Number,
        unique: true
    },
    todo_item :{
        type: String,
        required: true,
        unique: true
    },
    ongoing :{
        type: Boolean,
        default: false
    }

});

// Apply the auto-increment plugin to your schema
todoItemSchema.plugin(autoIncrement, { inc_field: 'input_number' });

const TodoItem = mongoose.model('TodoItem', todoItemSchema);

module.exports = TodoItem;
