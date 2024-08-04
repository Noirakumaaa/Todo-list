
document.addEventListener('DOMContentLoaded', (event) => {
    addData();
});

async function addItem() {
    const todoList = document.getElementById('todoList');
    const newItem = document.getElementById('newItem').value;

    if (newItem.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    const itemDiv = document.createElement('div');
    itemDiv.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.textContent = newItem;

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);

    todoList.appendChild(itemDiv);

    document.getElementById('newItem').value = ''; // Clear the input

    try {
        const response = await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newItem: newItem }) // Send the newItem value as JSON with the correct field name
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Server response:', data);
        addData()
    } catch (error) {
        console.error('Error:', error);
    }
}

function refreshItem(itemDes, done, id) {
    const todoList = document.getElementById('todoList');

    const itemDiv = document.createElement('div');
    itemDiv.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = done; // Set the checkbox based on `done` status
    checkbox.className = 'todo-item'; // Add the class 'todo-item'
    checkbox.setAttribute('data-id', id); // Set a unique data-id
    
    const label = document.createElement('label');
    label.textContent = itemDes;

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);

    todoList.appendChild(itemDiv);
}

async function addData() {
    try {
        const response = await fetch('http://localhost:3000/api/items/todolist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        
        // Clear the current list
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';

        // Add the fetched items to the list
        for (let i = 0; i < data.todos.length; i++) {
            refreshItem(data.todos[i], data.itemDones[i], data.ids[i]);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


document.getElementById('deleteData').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.todo-item:checked'); // Select all checked checkboxes
    console.log(checkboxes);
    const idsToDelete = Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-id'));
    console.log('IDs to delete:', idsToDelete); // Log the IDs to be deleted

    if (idsToDelete.length > 0) {
        try {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: idsToDelete })
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Items deleted successfully', result);
                addData()
                // Optionally remove the deleted items from the DOM
                idsToDelete.forEach(id => {
                    const checkbox = document.querySelector(`.todoCheckbox[data-id="${id}"]`);
                    if (checkbox) {
                        checkbox.parentElement.remove();
                    }
                });
            } else {
                console.error('Error deleting items:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('No items selected for deletion');
    }
});
