const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

function renderTasks(filteredTasks = tasks) {

    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            <div class="task-info">
                <h3>${task.text}</h3>

                <p>
                    📅 ${task.date || "No Date"}
                    &nbsp;&nbsp;
                    🕒 ${task.time || "No Time"}
                </p>
            </div>

            <div class="buttons">

                <button class="complete">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit">
                    Edit
                </button>

                <button class="delete">
                    Delete
                </button>

            </div>
        `;

        li.querySelector(".complete").addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        li.querySelector(".edit").addEventListener("click", () => {

            const newText = prompt("Edit Task", task.text);

            if (newText !== null && newText.trim() !== "") {

                tasks[index].text = newText;

                saveTasks();

                renderTasks();

            }

        });

        li.querySelector(".delete").addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(li);

    });

    updateStats();

}

addTaskBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;

    }

    tasks.push({

        text: text,

        date: taskDate.value,

        time: taskTime.value,

        completed: false

    });

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    saveTasks();

    renderTasks();

});

searchTask.addEventListener("keyup", () => {

    const keyword = searchTask.value.toLowerCase();

    const filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(keyword)
    );

    renderTasks(filtered);

});

renderTasks();