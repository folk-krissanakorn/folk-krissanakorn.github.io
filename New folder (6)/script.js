document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTask");
    const homePage = document.getElementById("homePage");
    const addTaskPage = document.getElementById("addTaskPage");
    const backBtn = document.getElementById("backBtn");
    const saveTaskBtn = document.getElementById("saveTask");
    const taskList = document.getElementById("taskList");
    const fromTime = document.getElementById("fromTime");
    const toTime = document.getElementById("toTime");
    const noteInput = document.getElementById("note");
    const categoryButtons = document.querySelectorAll(".category");
    let selectedCategory = "Meeting";

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            categoryButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            selectedCategory = this.textContent.trim();
        });
    });

    addTaskBtn.addEventListener("click", function () {
        homePage.style.display = "none";
        addTaskPage.style.display = "block";
    });

    backBtn.addEventListener("click", function () {
        addTaskPage.style.display = "none";
        homePage.style.display = "block";
    });

    saveTaskBtn.addEventListener("click", function () {
        const from = fromTime.value.trim();
        const to = toTime.value.trim();
        const note = noteInput.value.trim();
        
        if (!from || !to || !note) {
            alert("Please fill in all fields.");
            return;
        }
        
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        
        let bgColor = "#c87b7b";
        if (selectedCategory === "Work") bgColor = "#74c0fc";
        if (selectedCategory === "Personal") bgColor = "#f4b860";
        
        taskDiv.style.backgroundColor = bgColor;
        taskDiv.innerHTML = `
            <div class="task-header">
                <span class="task-category">${selectedCategory}</span>
                <span class="task-time">${from} - ${to}</span>
            </div>
            <div class="task-content">${note}</div>
        `;
        taskList.appendChild(taskDiv);
        
        fromTime.value = "";
        toTime.value = "";
        noteInput.value = "";
        
        addTaskPage.style.display = "none";
        homePage.style.display = "block";
    });
});
