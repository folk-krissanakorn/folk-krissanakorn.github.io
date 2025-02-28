document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTask");
    const homePage = document.getElementById("homePage");
    const addTaskPage = document.getElementById("addTaskPage");
    const backBtn = document.getElementById("backBtn");
    const saveTaskBtn = document.getElementById("saveTask");
    const taskList = document.getElementById("taskList");
    const fromHour = document.getElementById("fromHour");
    const fromMinute = document.getElementById("fromMinute");
    const toHour = document.getElementById("toHour");
    const toMinute = document.getElementById("toMinute");
    const noteInput = document.getElementById("note");
    const categoryButtons = document.querySelectorAll(".category");
    const currentDateDisplay = document.getElementById("currentDate");
    const currentTimeDisplay = document.getElementById("currentTime");
    let selectedCategory = "";

    function updateCurrentTime() {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        currentDateDisplay.textContent = now.toLocaleDateString("en-US", options);
        currentTimeDisplay.textContent = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateCurrentTime, 1000);

    function populateTimeOptions() {
        for (let i = 0; i < 24; i++) {
            let hour = i.toString().padStart(2, "0");
            fromHour.innerHTML += `<option value="${hour}">${hour}</option>`;
            toHour.innerHTML += `<option value="${hour}">${hour}</option>`;
        }
        for (let i = 0; i < 60; i += 5) {
            let minute = i.toString().padStart(2, "0");
            fromMinute.innerHTML += `<option value="${minute}">${minute}</option>`;
            toMinute.innerHTML += `<option value="${minute}">${minute}</option>`;
        }
    }
    populateTimeOptions();

    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task, index) => createTaskElement(task, index));
        adjustAddTaskButton();
    }

    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function createTaskElement(task, index) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.style.backgroundColor = getCategoryColor(task.category);
        taskDiv.innerHTML = `
            <div class="task-header">
                <span class="task-category">${task.category}</span>
                <button class="delete-task" data-index="${index}">X</button>
            </div>
            <div class="task-time">${task.from} - ${task.to}</div>
            <div class="task-content">${task.note}</div>
        `;
        taskList.appendChild(taskDiv);
        taskDiv.querySelector(".delete-task").addEventListener("click", () => deleteTask(index));
    }

    function deleteTask(index) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.splice(index, 1);
        saveTasks(tasks);
        loadTasks();
    }

    function getCategoryColor(category) {
        if (category === "Work") return "#74c0fc";
        if (category === "Personal") return "#f4b860";
        return "#c87b7b";
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            categoryButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            selectedCategory = this.textContent;
        });
    });

    function showPage(hidePage, showPage) {
        hidePage.classList.add("hidden");
        setTimeout(() => {
            hidePage.style.display = "none";
            showPage.style.display = "block";
            setTimeout(() => showPage.classList.add("visible"), 10);
        }, 300);
    }

    function adjustAddTaskButton() {
        if (taskList.children.length > 0) {
            addTaskBtn.style.bottom = "80px";
        } else {
            addTaskBtn.style.bottom = "20px";
        }
    }

    addTaskBtn.addEventListener("click", () => showPage(homePage, addTaskPage));
    backBtn.addEventListener("click", () => showPage(addTaskPage, homePage));

    saveTaskBtn.addEventListener("click", function () {
        const from = `${fromHour.value}:${fromMinute.value}`;
        const to = `${toHour.value}:${toMinute.value}`;
        const note = noteInput.value.trim();
        if (!note || !selectedCategory) {
            alert("Please fill all fields.");
            return;
        }

        const newTask = { category: selectedCategory, from, to, note };
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(newTask);
        saveTasks(tasks);
        loadTasks();
        showPage(addTaskPage, homePage);
    });

    loadTasks();
});