document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  // Restore theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});



/* =========================
   Pomodoro Timer (unchanged API)
   ========================= */
let pomodoroTime = 25 * 60;
let pomodoroTimer;
let isPomodoroRunning = false;

function updatePomodoroDisplay() {
  const mins = String(Math.floor(pomodoroTime / 60)).padStart(2, "0");
  const secs = String(pomodoroTime % 60).padStart(2, "0");
  const el = document.getElementById("pomodoro-display");
  if (el) el.textContent = `${mins}:${secs}`;
}

function startPomodoro() {
  if (!isPomodoroRunning) {
    isPomodoroRunning = true;
    pomodoroTimer = setInterval(() => {
      if (pomodoroTime > 0) {
        pomodoroTime--;
        updatePomodoroDisplay();
      } else {
        clearInterval(pomodoroTimer);
        isPomodoroRunning = false;
      }
    }, 1000);
  }
}

function resetPomodoro() {
  clearInterval(pomodoroTimer);
  isPomodoroRunning = false;
  pomodoroTime = 25 * 60;
  updatePomodoroDisplay();
}

/* =========================
   Focus Session (unchanged API)
   ========================= */
let focusTimer;
function startFocus() {
  const input = document.getElementById("focus-minutes");
  if (!input) return;
  const minutes = parseInt(input.value, 10);
  if (!minutes || minutes <= 0) return;

  let timeLeft = minutes * 60;
  clearInterval(focusTimer);
  focusTimer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const secs = String(timeLeft % 60).padStart(2, "0");
      const el = document.getElementById("focus-display");
      if (el) el.textContent = `${mins}:${secs}`;
    } else {
      clearInterval(focusTimer);
    }
  }, 1000);
}

/* =========================
   Stopwatch (unchanged API)
   ========================= */
let stopwatchTime = 0;
let stopwatchTimer;
let isStopwatchRunning = false;

function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const secs = String(sec % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function startStopwatch() {
  if (!isStopwatchRunning) {
    isStopwatchRunning = true;
    stopwatchTimer = setInterval(() => {
      stopwatchTime++;
      const el = document.getElementById("stopwatch-display");
      if (el) el.textContent = formatTime(stopwatchTime);
    }, 1000);
  }
}

function stopStopwatch() {
  clearInterval(stopwatchTimer);
  isStopwatchRunning = false;
}

function resetStopwatch() {
  clearInterval(stopwatchTimer);
  isStopwatchRunning = false;
  stopwatchTime = 0;
  const el = document.getElementById("stopwatch-display");
  if (el) el.textContent = "00:00:00";
}

/* =========================
   Spotify Player (NEW — matches your HTML buttons)
   ========================= */
function loadSpotify(preset) {
  // Replace IDs if you want different playlists; these are common focus lists.
  const playlists = {
    lofi: "37i9dQZF1DXc8kgYqQLMfH",          // Lo-Fi Beats
    piano: "37i9dQZF1DX4sWSpwq3LiO",         // Peaceful Piano
    motivation: "37i9dQZF1DXdxcBWuJkbcy",    // Workday Motivation (general)
    instrumental: "37i9dQZF1DX8NTLI2TtZa6"   // Instrumental Study
  };
  const id = playlists[preset] || playlists.lofi;
  const player = document.getElementById("spotify-player");
  if (!player) return;

  player.innerHTML = `
    <iframe
      style="width:100%; min-height:200px; border:0; border-radius:12px;"
      src="https://open.spotify.com/embed/playlist/${id}"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  `;
}

/* =========================
   To-Do List (NEW — prevents errors from missing addTask)
   ========================= */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function addTask() {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  if (!input || !list) return;

  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" />
      <span>${escapeHtml(text)}</span>
    </label>
    <button class="delete-task" aria-label="Delete">✕</button>
  `;
  list.appendChild(li);
  input.value = "";

  li.querySelector('input[type="checkbox"]').addEventListener("change", e => {
    li.classList.toggle("done", e.target.checked);
  });
  li.querySelector(".delete-task").addEventListener("click", () => li.remove());
}

/* =========================
   Init after DOM is ready
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  updatePomodoroDisplay();
  const sw = document.getElementById("stopwatch-display");
  if (sw) sw.textContent = "00:00:00";

  // Preload a default Spotify playlist so the player isn't empty
  loadSpotify("lofi");
});
