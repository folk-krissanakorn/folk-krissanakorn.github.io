document.addEventListener("DOMContentLoaded", function () {
    if (window.dataLoaded) {
        console.log("⚠️ ข้อมูลถูกโหลดแล้ว ไม่โหลดซ้ำ");
        return;
    }
    window.dataLoaded = true;

    console.log("🚀 โหลดข้อมูลจาก LocalStorage...");
    const studyData = JSON.parse(localStorage.getItem("study-time")) || [];
    const taskData = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("📥 ดึงข้อมูล Study Time:", studyData);
    console.log("📥 ดึงข้อมูล Tasks:", taskData);

    processStudyData(studyData, taskData);
});

let studyChart = null;
let lastSubjects = [];
let lastTimeSpent = [];

function processStudyData(studyData, taskData) {
    const subjectMap = {};
    const colorMap = {};

    taskData.forEach(task => {
        colorMap[task.subject.trim().toLowerCase()] = task.color || "#5A91E6";
    });

    studyData.forEach(entry => {
        let subject = entry.subject.trim().toLowerCase();
        if (!subjectMap[subject]) {
            subjectMap[subject] = 0;
        }
        subjectMap[subject] += entry.timeSpent / 60; // ใช้ timeSpent แทน
    });

    const subjects = Object.keys(subjectMap);
    const timeSpent = Object.values(subjectMap);
    const colors = subjects.map(subject => colorMap[subject] || "#5A91E6");

    console.log("Subjects:", subjects);
    console.log("Time Spent:", timeSpent);
    console.log("Colors:", colors);

    if (JSON.stringify(lastSubjects) === JSON.stringify(subjects) &&
        JSON.stringify(lastTimeSpent) === JSON.stringify(timeSpent)) {
        console.log("⚠️ ข้อมูลไม่เปลี่ยน ไม่ต้องอัปเดตกราฟ");
        return;
    }
    lastSubjects = subjects;
    lastTimeSpent = timeSpent;

    requestAnimationFrame(() => {
        renderChart(subjects, timeSpent, colors);
    });
}

function renderChart(subjects, timeSpent, colors) {
    const ctx = document.getElementById("studyChart").getContext("2d", { willReadFrequently: true });

    if (studyChart) {
        console.log("🔄 อัปเดตกราฟแทนการสร้างใหม่...");
        studyChart.data.labels = subjects;
        studyChart.data.datasets[0].data = timeSpent;
        studyChart.data.datasets[0].backgroundColor = colors;
        studyChart.options.animation = false;
        studyChart.update();
        console.log("✅ กราฟอัปเดตเสร็จสิ้น เวลา: ", new Date().toLocaleTimeString());
        return;
    }

    console.log("📊 กำลังสร้างกราฟ...");
    studyChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: subjects,
            datasets: [{
                label: "เวลาที่ใช้ไป (นาที)",
                data: timeSpent,
                backgroundColor: colors,
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
    console.log("✅ กราฟสร้างเสร็จ เวลา: ", new Date().toLocaleTimeString());
}
