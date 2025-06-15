let tasks = [];
let currentFilter = "All";

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromStorage();
  document.getElementById("todo-form").addEventListener("submit", addTask);
  filterTasks(currentFilter); 
});

function openForm() {
  document.getElementById("todo-form-modal").style.display = "block";
}

function closeForm() {
  document.getElementById("todo-form-modal").style.display = "none";
  document.getElementById("todo-form").reset();
}

function addTask(e) {
  e.preventDefault();
  const taskName = document.getElementById("taskName").value;
  const status = document.getElementById("status").value;
  const deadline = document.getElementById("deadline").value;

  const newTask = {
    id: Date.now(),
    taskName,
    status,
    deadline,
  };

  tasks.push(newTask);
  saveTasksToStorage();
  closeForm();
  filterTasks(currentFilter);
}

function renderTask(task) {
  const container = document.getElementById("task-container");

  const card = document.createElement("div");
  card.className = "task-card";

  const name = document.createElement("p");
  name.innerHTML = `<strong>Task:</strong> ${task.taskName}`;

  const status = document.createElement("p");
  status.innerHTML = `<strong>Status:</strong> ${task.status}`;

  const deadline = document.createElement("p");
  deadline.innerHTML = `<strong>Deadline:</strong> ${task.deadline}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "task-buttons";

  // Complete button
  if (task.status !== "Completed") {
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Mark as Completed";
    completeBtn.className = "btn-complete";
    completeBtn.onclick = () => markAsCompleted(task.id);
    buttonContainer.appendChild(completeBtn);
  }

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn-delete";
  deleteBtn.onclick = () => deleteTask(task.id);
  buttonContainer.appendChild(deleteBtn);

  card.appendChild(name);
  card.appendChild(status);
  card.appendChild(deadline);
  card.appendChild(buttonContainer);

  container.appendChild(card);
}

function markAsCompleted(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, status: "Completed" } : task
  );
  saveTasksToStorage();
  filterTasks(currentFilter);
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasksToStorage();
  filterTasks(currentFilter);
}

function filterTasks(filterType) {
  currentFilter = filterType;
  const container = document.getElementById("task-container");
  container.innerHTML = "";

  // Highlight selected filter
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === filterType) btn.classList.add("active");
  });

  // Sort tasks by deadline
  const sorted = tasks.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const filteredTasks = sorted.filter(task => {
    if (filterType === "All") {
      return task.status !== "Completed"; 
    } else {
      return task.status === filterType;
    }
  });

  filteredTasks.forEach(renderTask);
}

function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}
