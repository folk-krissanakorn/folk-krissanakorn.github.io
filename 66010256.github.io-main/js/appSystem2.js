///////////////////////////// ⏳ System section ////////////////////////////////////

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const moreButton = document.getElementById('more');
moreButton.style.backgroundColor = 'rgb(255, 165, 0)';
moreButton.style.display = 'none';

let timeLeft = 10;
let totalTime = 10;
let extraTime = 6;
let bufferNowTime;
let fireInterval;
let smokeInterval;
let isExtraTimeRunning = false;
let extraCountdown;

// 📌 ฟังก์ชันบันทึก Study Time ลง LocalStorage
function sendStudyTimeToLocalStorage(subject, timeSpent) {
    if (!subject || subject === "Unknown Subject") {
        console.error("❌ ไม่สามารถบันทึกได้: ชื่อวิชาว่างเปล่า");
        return;
    }

    let studyData = JSON.parse(localStorage.getItem("study-time")) || [];
    studyData.push({ subject, timeSpent });
    localStorage.setItem("study-time", JSON.stringify(studyData));

    console.log("✅ Study Time ถูกบันทึกลง LocalStorage:", studyData);
}

// 📌 ฟังก์ชันสร้างอนุภาคควัน
function createSmokeParticles() {
    if (timeLeft <= 0) return;

    // สร้างอนุภาคควัน 3 อันในแต่ละครั้ง
    for (let i = 0; i < 3; i++) {  
        setTimeout(() => {
            const smoke = document.createElement("div");
            smoke.classList.add("smoke-particle");

            // กำหนดตำแหน่งและขนาดอนุภาคควัน
            let randomX = Math.random() * 20 - 10; // ขยับซ้าย-ขวาแบบสุ่ม
            let randomY = Math.random() * 10 - 5;  // ขยับขึ้น-ลงแบบสุ่ม
            smoke.style.left = `calc(50% + ${randomX}px)`;
            smoke.style.top = `calc(-70px + ${randomY}px)`;
            smoke.style.animationDuration = (1.5 + Math.random()) + "s"; 

            // เพิ่มอนุภาคควันลงในเทียน
            document.getElementById("candle").appendChild(smoke);
            // ลบอนุภาคควันหลังจากแอนิเมชันเสร็จสิ้น
            setTimeout(() => smoke.remove(), 3000); 
        }, i * 300);
    }
}

// 📌 ฟังก์ชันเมื่อเวลาหมด
function handleTimeEnd() {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval);
    clearInterval(smokeInterval);

    // ✅ ดึงข้อมูลวิชาจาก LocalStorage
    let subject = localStorage.getItem("selectedTaskSubject") || "Unknown Subject";
    let timeSpent = totalTime;

    console.log("🔍 ส่งข้อมูลไปยัง LocalStorage:", subject, timeSpent);
    
    // ✅ บันทึก Study Time ก่อนโหลดหน้าใหม่
    sendStudyTimeToLocalStorage(subject, timeSpent);

    alert("⏳ Session ended! Data saved.");

    if (extraTime > 0) {
        startExtraTime();
    }
}

// 📌 ฟังก์ชันเริ่มจับเวลา
const startTimer = () => {
    start.disabled = true;
    start.style.backgroundColor = "rgb(74, 116, 11)";
    stop.style.backgroundColor = "rgb(246, 25, 25)";

    bufferNowTime = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("candle").style.height = (100 * (timeLeft / totalTime)) + "px";
            updateTimer();
        } else {
            handleTimeEnd();
        }
    }, 1000);

    // เริ่มเอฟเฟคควันไฟ
    fireInterval = setInterval(createSmokeParticles, 1500);
};

// 📌 ฟังก์ชันหยุดจับเวลา
const stopTimer = () => {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval); // หยุดเอฟเฟคควันไฟ
    clearInterval(smokeInterval);
    updateTimer();
    start.disabled = false;
    start.style.backgroundColor = "rgb(146, 232, 16)";
    stop.style.backgroundColor = "rgb(109, 12, 12)";
};

// 📌 ฟังก์ชันรีเซ็ต Timer
const resetTimer = () => {
    start.disabled = false;
    stop.disabled = false;
    start.style.backgroundColor = "rgb(139, 209, 35)";
    stop.style.backgroundColor = "rgb(246, 25, 25)";
    clearInterval(bufferNowTime);

    updateButtons();
    timeLeft = 10;
    updateTimer();

    // หยุดเอฟเฟคควันไฟ
    clearInterval(fireInterval);
    clearInterval(smokeInterval);

    document.getElementById("candle").style.height = "100px";
    document.getElementById("flame").style.display = "block";
};

// 📌 ฟังก์ชันสำหรับปุ่ม More Rest
moreButton.addEventListener('click', () => {
    moreButton.style.display = 'none';
    if (timeLeft === 0 && extraTime === 0) {
        extraTime += 8;
        updateButtons();
        updateExtra();
        const moreTimeInterval = setInterval(() => {
            if (extraTime > 0 && timeLeft === 0) {
                extraTime--;
                updateExtra();
                updateButtons();
            } else {
                reset.disabled = false;
                clearInterval(moreTimeInterval);
            }
        }, 1000);
    }
    updateButtons();
});

// 📌 ปุ่มควบคุม Timer
start.addEventListener("click", () => {
    if (timeLeft == 0) {
        start.style.backgroundColor = "rgb(85, 85, 85)";
        alert("Pls, Click reset");
    } else {
        startTimer();
    }
});

stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

// 📌 ปุ่มกลับหน้า Home
function goBack() {
    window.location.href = "home.html";
}

updateTimer();
