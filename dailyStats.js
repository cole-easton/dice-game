import * as DateUtils from "./dates.js";
import * as Streaks from './streaks.js';

const data = JSON.parse(localStorage.getItem("eqy-daily-scores")) ?? {};
renderCalendar(data);

const scores = Object.values(data).sort((a, b) => b - a);
const len = scores.length;

if (len) {
    const median = len % 2 ? scores[Math.floor(len / 2)] : (scores[len / 2] + scores[len / 2 - 1]) / 2;
    const max = scores[0];
    const streaks = Streaks.getStreaks(Object.keys(data));
    document.querySelector("#daily-streak").textContent = streaks.current;
    document.querySelector("#longest-daily-streak").textContent = streaks.longest;
    document.querySelector("#stat-median").textContent = median;
    document.querySelector("#stat-max").textContent = max;
    document.querySelector("#stat-median").textContent = median;
}

function renderCalendar(data) {
    console.log(data);
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    const today = new Date();
    const thisSaturday = new Date(today);
    thisSaturday.setDate(today.getDate() - today.getDay() + 6);
    const days = [];

    for (let i = 27; i >= 0; i--) {
        const d = new Date(thisSaturday);
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    days.forEach(d => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (data[d]) {
            cell.classList.add("played");
            cell.textContent = data[d];
            cell.title = `${d}: ${data[d]} points`;
        } else {
            cell.classList.add("missed");
            cell.title = `${d}: no play`;
        }

        if (d === DateUtils.toLocalYMD(today)) {
            cell.classList.add("today");
        }

        grid.appendChild(cell);
    });
}



