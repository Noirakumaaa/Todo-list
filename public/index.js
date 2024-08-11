document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('refreshButton').addEventListener('click', function() {
        location.reload();
    });

    ongoingItems();
});

function addItem() {
    const todoItem = document.getElementById('newItem').value;

    fetch('/api/add/todoItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo_item: todoItem })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        createDivItem(todoItem, data.input_number);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function createDivItem(todoItem, itemID) {
    const newDiv = document.createElement('div');
    newDiv.className = 'todo-list-item';
    
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    
    const newTodoItem = document.createElement('h3');
    newTodoItem.className = 'todo-text';
    newTodoItem.textContent = todoItem;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = "⭐";
    deleteButton.id = itemID;

    deleteButton.addEventListener('click', function() {
        const deleteID = this.id;
        console.log('Delete ID:', deleteID);
        updateData(deleteID);
        const deleteDiv = this.parentNode;
        deleteDiv.remove();
    });

    newDiv.appendChild(newCheckbox);
    newDiv.appendChild(newTodoItem);
    newDiv.appendChild(deleteButton);
    
    const todoList = document.getElementById('todoList');
    todoList.appendChild(newDiv);
}


function doneItemdiv(todoItem, itemID) {
    const newDiv = document.createElement('div');
    newDiv.className = 'todo-list-item';
    
    const newCheckbox = document.createElement('input');
    newCheckbox.type = 'checkbox';
    
    const newTodoItem = document.createElement('h3');
    newTodoItem.className = 'todo-text';
    newTodoItem.textContent = todoItem;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = "X";
    deleteButton.id = itemID;

    deleteButton.addEventListener('click', function() {
        const deleteID = this.id;
        console.log('Delete ID:', deleteID);
        deleteData(deleteID);
        const deleteDiv = this.parentNode;
        deleteDiv.remove();
    });

    newDiv.appendChild(newCheckbox);
    newDiv.appendChild(newTodoItem);
    newDiv.appendChild(deleteButton);
    
    const todoList = document.getElementById('todoList');
    todoList.appendChild(newDiv);
}

async function ongoingItems() {

    const existingID = new Set();

    const allItems = document.querySelectorAll('.todo-list-item');
    allItems.forEach(item => {
        item.remove();
    });

    fetch('/api/get/todoItem')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            if(element.ongoing === false && !existingID.has(element.input_number)) {
                createDivItem(element.todo_item, element.input_number);
                existingID.add(element.input_number);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateData(input_number) {
    fetch('/api/update/todoItem', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_number: input_number })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Update response:', data);
        const itemDiv = document.getElementById(input_number);
        if (itemDiv) itemDiv.remove();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function completedTask(){
    const existingID = new Set();

    const allItems = document.querySelectorAll('.todo-list-item');
    allItems.forEach(item => {
        item.remove();
    });

    fetch('/api/get/todoItem')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            if(element.ongoing === true && !existingID.has(element.input_number)) {
                doneItemdiv(element.todo_item, element.input_number);
                existingID.add(element.input_number);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function deleteData(input_number){
    fetch('/api/delete/todoItem', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_number: input_number })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Update response:', data);
        const itemDiv = document.getElementById(input_number);
        if (itemDiv) itemDiv.remove();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


