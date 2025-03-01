document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("donutChart").getContext("2d");

    const data = {
        labels: ["Math", "Science" , "English"],
        datasets: [{
            data: [50, 30 ,20], // 70% Reading, 30% Break
            backgroundColor: ["#74c0fc", "#f4b860","#c87b7b"],
            hoverOffset: 4
        }]
    };

    const config = {
        type: "doughnut",
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    };

    new Chart(ctx, config);
     // Navbar functionality
     const navItems = document.querySelectorAll('.nav-item');
     function setActiveNavItem() {
         navItems.forEach(item => item.classList.remove('active'));
         this.classList.add('active');
     }
     navItems.forEach(item => item.addEventListener('click', setActiveNavItem));
});