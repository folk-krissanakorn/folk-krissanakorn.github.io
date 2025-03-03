///////////////////////////// 🎵 Audio section ////////////////////////////////////
const audio = document.getElementById('background-music');
const button = document.getElementById('toggle-button');
const volumeSlider = document.getElementById('volume-slider');
const AudioPanel = document.getElementById('AudioPanel');
const songSelector = document.getElementById('song-selector');
const cassetteSound = document.getElementById('cassette-sound');
audio.volume = 0.4;

function toggleAudio() {
    AudioPanel.style.display = (AudioPanel.style.display === "block") ? "none" : "block";
}

let isMusicPlaying = false;

button.addEventListener('click', () => {
    if (isMusicPlaying) {
        audio.pause();
        button.textContent = "Turn Music Off";
        button.style.backgroundColor = "rgb(246, 25, 25)";
    } else {
        cassetteSound.play();
        cassetteSound.currentTime = 0;

        cassetteSound.onended = () => {
            audio.play();
            button.textContent = "Turn Music On";
            button.style.backgroundColor = "rgb(139, 209, 35)";
        };
    }
    isMusicPlaying = !isMusicPlaying;
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

songSelector.addEventListener('change', () => {
    const selectedSong = songSelector.value;
    audio.src = selectedSong;
    button.textContent = "Changing";
    button.style.backgroundColor = "rgb(123, 123, 123)";
    isMusicPlaying = true;
    cassetteSound.play();
    cassetteSound.currentTime = 0;
    cassetteSound.onended = () => {
        audio.play();
        button.textContent = "Turn Music On";
        button.style.backgroundColor = "rgb(139, 209, 35)";
    };
});

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
let extraCountdown;
let isExtraTimeRunning = false;
let isTimerRunning = false;

// 📌 ฟังก์ชันบันทึก Study Time ลง LocalStorage
function sendStudyTimeToLocalStorage(subject, timeSpent) {
    if (!subject || subject === "Unknown Subject") {
        console.error("❌ ไม่สามารถบันทึกได้: ชื่อวิชาว่างเปล่า");
        return;
    }

    try {
        let studyData = JSON.parse(localStorage.getItem("study-time")) || [];
        studyData.push({ subject, timeSpent });
        localStorage.setItem("study-time", JSON.stringify(studyData));
        console.log("✅ Study Time ถูกบันทึกลง LocalStorage:", studyData);
    } catch (error) {
        console.error("🚨 LocalStorage Error:", error);
    }
}

// 📌 อัปเดต Timer บนหน้าจอ
const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

updateTimer();

// 📌 ฟังก์ชันเริ่มจับเวลา
const startTimer = () => {
    if (isTimerRunning) return;
    isTimerRunning = true;

    start.disabled = true;
    stop.disabled = false;
    stop.style.display = "inline-block"; 
    moreButton.style.display = "none"; 

    bufferNowTime = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("candle").style.height = (100 * (timeLeft / totalTime)) + "px";
            updateTimer();
        } else {
            handleTimeEnd();
        }
    }, 1000);
};

// 📌 ฟังก์ชันเมื่อเวลาหมด
function handleTimeEnd() {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval);
    clearInterval(smokeInterval);

    let subject = localStorage.getItem("selectedTaskSubject") || "Unknown Subject";
    let timeSpent = totalTime;
    sendStudyTimeToLocalStorage(subject, timeSpent);

    alert("⏳ Session ended! Data saved.");
    createSmoke();

    isTimerRunning = false;

    if (extraTime > 0) {
        startExtraTime();
    } else {
        moreButton.style.display = "inline-block";
    }
}

// 📌 ฟังก์ชันเริ่ม Extra Time
function startExtraTime() {
    isExtraTimeRunning = true;
    timeLeft = extraTime;
    moreButton.style.display = "none";
    
    start.disabled = true;
    stop.disabled = true;

    extraCountdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(extraCountdown);
            alert("🎉 Extra Time Finished!");
            isExtraTimeRunning = false;
            moreButton.style.display = "inline-block";
            stop.style.display = "none"; // ❌ ซ่อนปุ่ม Stop หลังจาก Extra Time หมด
        }
    }, 1000);
}

// 📌 ฟังก์ชัน More Rest (ขยายเวลาพัก 8 วินาที)
moreButton.addEventListener('click', () => {
    extraTime = 8;
    updateTimer();
    startExtraTime();
});

// 📌 ฟังก์ชันหยุดจับเวลา
const stopTimer = () => {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval);
    clearInterval(smokeInterval);
    updateTimer();
    start.disabled = false;
    isTimerRunning = false;
};

// 📌 ฟังก์ชันรีเซ็ต Timer
const resetTimer = () => {
    start.disabled = false;
    stop.disabled = true;
    stop.style.display = "inline-block"; 
    moreButton.style.display = "none";
    
    clearInterval(bufferNowTime);
    timeLeft = 10;
    extraTime = 6;
    updateTimer();

    document.getElementById("candle").style.height = "100px";
    document.getElementById("flame").style.display = "block";
};

// 📌 ฟังก์ชันสร้างควัน (smoke)
function createSmoke() {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    document.getElementById("candle").appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000);
}

// 📌 ปุ่มควบคุม Timer
start.addEventListener("click", () => {
    if (timeLeft === 10) {
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
