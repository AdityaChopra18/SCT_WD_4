document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) li.classList.add('completed');

            const taskText = document.createElement('span');
            taskText.textContent = task.text;

            const taskDate = document.createElement('small');
            taskDate.textContent = task.datetime ? ` (${new Date(task.datetime).toLocaleString()})` : '';

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Uncomplete' : 'Complete';
            completeBtn.onclick = () => toggleComplete(index);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editTask(index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTask(index);

            actions.appendChild(completeBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(taskDate);
            li.appendChild(actions);

            taskList.appendChild(li);
        });
    }

    function addTask(text, datetime) {
        tasks.push({ text, datetime, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const li = taskList.children[index];
        const taskText = li.querySelector('span').textContent;
        const taskDate = tasks[index].datetime;

        li.innerHTML = '';
        const editForm = document.createElement('form');
        editForm.className = 'edit-form';
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText;
        
        const editDatetime = document.createElement('input');
        editDatetime.type = 'datetime-local';
        editDatetime.value = taskDate;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';

        editForm.appendChild(editInput);
        editForm.appendChild(editDatetime);
        editForm.appendChild(saveBtn);

        editForm.onsubmit = (e) => {
            e.preventDefault();
            tasks[index].text = editInput.value;
            tasks[index].datetime = editDatetime.value;
            saveTasks();
            renderTasks();
        };

        li.appendChild(editForm);
    }

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        if (taskInput.value.trim()) {
            addTask(taskInput.value.trim(), taskDatetime.value);
            taskInput.value = '';
            taskDatetime.value = '';
        }
    };

    renderTasks();
});