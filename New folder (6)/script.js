document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const saveTaskBtn = document.getElementById("saveTask");
    const durationSelect = document.getElementById("duration");
    const noteInput = document.getElementById("note");
    const categoryButtons = document.querySelectorAll(".category");
    const currentDateElement = document.getElementById("currentDate");
    const currentTimeElement = document.getElementById("currentTime");
    let selectedCategory = "";

    // อัปเดตวันและเวลาแบบเรียลไทม์
    function updateCurrentTime() {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        if (currentDateElement && currentTimeElement) {
            currentDateElement.textContent = now.toLocaleDateString("en-US", options);
            currentTimeElement.textContent = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
        }
    }
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();

    // ฟังก์ชันเลือกหมวดหมู่ (Subject)
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            categoryButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            selectedCategory = this.textContent.trim(); // แก้ไขจาก dataset เป็น textContent
            console.log("✅ หมวดหมู่ที่เลือก:", selectedCategory);
        });
    });

    // ฟังก์ชันบันทึก Task เมื่อกด Save
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener("click", function () {
            console.log("✅ ปุ่ม Save ถูกคลิก");
            const duration = parseInt(durationSelect.value);
            const note = noteInput.value.trim();

            if (!selectedCategory || selectedCategory === "") {
                alert("❌ กรุณาเลือกหมวดหมู่ (Subject)");
                return;
            }

            if (!note) {
                alert("❌ กรุณาใส่ข้อความ");
                return;
            }

            const newTask = { category: selectedCategory, duration, note };
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            console.log("✅ บันทึก Task สำเร็จ:", newTask);
            
            // กลับไปหน้า Home หลังจากบันทึก Task
            window.location.href = "home.html";
        });
    }

    // โหลด Task เมื่อเปิดหน้า Home
    if (taskList) {
        function loadTasks() {
            taskList.innerHTML = "";
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.forEach((task, index) => createTaskElement(task, index));
        }

        function createTaskElement(task, index) {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.style.backgroundColor = getCategoryColor(task.category);
            taskDiv.innerHTML = `
                <div class="task-header">
                    <span class="task-category">${task.category}</span>
                    <span class="task-time">${task.duration} minutes</span>
                    <button class="delete-task" data-index="${index}">X</button>
                </div>
                <div class="task-content">${task.note}</div>
            `;
            taskList.appendChild(taskDiv);

            // ตั้งค่าให้ลบ Task ได้
            taskDiv.querySelector(".delete-task").addEventListener("click", () => deleteTask(index));
        }

        function getCategoryColor(category) {
            if (category === "Math") return "#74c0fc";  
            if (category === "Science") return "#f4b860"; 
            if (category === "English") return "#c87b7b"; 
            return "#ffffff";
        }

        function deleteTask(index) {
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        }

        loadTasks();
    }
});