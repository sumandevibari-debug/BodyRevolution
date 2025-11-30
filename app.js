/* ============================================
   BodyRevolution - app.js
   Full advanced app core
   Integrates with muscle.js
   Features: Dark Mode, Rest Timer, Export, Auto-Save
   ============================================ */

/* ====================
   1) APP DATA (Static Content)
   ==================================== */
const APP_DATA = {
  phases: [
    { id: 1, title: "Foundation Phase", desc: "Building consistency, sleep, hydration.", active: true, completed: false },
    { id: 2, title: "Movement Phase", desc: "Strength building & protein focus.", active: false, completed: false },
    { id: 3, title: "Nutrition Mastery", desc: "Calorie tracking & macro optimization.", active: false, completed: false },
    { id: 4, title: "Lifestyle Mode", desc: "Habit automation & advanced training.", active: false, completed: false }
  ],
  // Fallback exercises if muscle.js fails to load
  exercises: [
    { id: "u1", cat: "upper", name: "Push-ups (Basic)", vid: "assets/videos/pushups.mp4" },
    { id: "l1", cat: "lower", name: "Squats (Basic)", vid: "assets/videos/squat.mp4" },
    { id: "c1", cat: "core", name: "Crunch (Basic)", vid: "assets/videos/abs.mp4" }
  ],
  habits: [
    { id: "h_water", title: "Ushapan (Morning Water)", desc: "500ml warm water empty stomach" },
    { id: "h_prot", title: "Protein First", desc: "Eat protein first in every meal" },
    { id: "h_walk", title: "Shatapavali (Walk)", desc: "10 min walk after dinner" },
    { id: "h_sleep", title: "Early Sleep", desc: "Sleep by 10:30 PM" },
    { id: "h_veg", title: "Add Vegetables", desc: "Extra vegetables with lunch/dinner" }
  ],
  motivationalQuotes: [
    "Small habits, big transformations! 🚀",
    "Consistency beats intensity! 💪",
    "Your future self will thank you! 🙏",
    "One day at a time! ⏳",
    "Sweat is just fat crying! 💦"
  ],
  indianTips: [
    "Replace white rice with brown rice or quinoa",
    "Use ghee in moderation (1-2 tsp daily)",
    "Include dal/lentils in at least one meal daily",
    "Opt for grilled/tandoori over fried foods",
    "Drink buttermilk (chaas) instead of sugary drinks"
  ]
};

/* ================================
   2) STORAGE / STATE (Local Storage)
   ================================ */
const Store = {
  user: JSON.parse(localStorage.getItem('br_user')) || null,
  logs: JSON.parse(localStorage.getItem('br_logs')) || {},
  phases: JSON.parse(localStorage.getItem('br_phases')) || APP_DATA.phases,
  photos: JSON.parse(localStorage.getItem('br_photos')) || [],
  muscleProgress: JSON.parse(localStorage.getItem('br_muscle_progress')) || {},
  preferences: JSON.parse(localStorage.getItem('br_prefs')) || { theme: 'light' },
  
  save() {
    localStorage.setItem('br_user', JSON.stringify(this.user));
    localStorage.setItem('br_logs', JSON.stringify(this.logs));
    localStorage.setItem('br_phases', JSON.stringify(this.phases));
    localStorage.setItem('br_photos', JSON.stringify(this.photos));
    localStorage.setItem('br_muscle_progress', JSON.stringify(this.muscleProgress));
    localStorage.setItem('br_prefs', JSON.stringify(this.preferences));
  },
  
  logHabit(id) {
    const today = new Date().toISOString().split('T')[0];
    if(!this.logs[today]) this.logs[today] = [];
    
    // Toggle logic
    if(this.logs[today].includes(id)) {
      this.logs[today] = this.logs[today].filter(x => x !== id);
    } else {
      this.logs[today].push(id);
    }
    this.save();
  },
  
  addPhoto(dataUrl) {
    // Add new photo to start of array, keep max 48
    this.photos.unshift({ id: Date.now(), data: dataUrl, date: new Date().toISOString() });
    if(this.photos.length > 48) this.photos.pop();
    this.save();
  },
  
  completePhase(id) {
    this.phases = this.phases.map(p => {
      if(p.id === id) p.completed = true;
      if(p.id === id + 1) p.active = true;
      return p;
    });
    this.save();
  },
  
  logLift(exercise, weight, reps, sets) {
    const today = new Date().toISOString().split('T')[0];
    if(!this.muscleProgress[today]) this.muscleProgress[today] = [];
    this.muscleProgress[today].push({ exercise, weight, reps, sets, date: new Date().toISOString() });
    this.save();
  },

  setTheme(theme) {
    this.preferences.theme = theme;
    this.save();
    document.documentElement.setAttribute('data-theme', theme);
  }
};

/* ========================
   3) REST TIMER UTILITY
   ======================== */
const RestTimer = {
  seconds: 0,
  interval: null,
  
  start(sec = 60) {
    this.stop(); // Clear existing
    this.seconds = sec;
    document.getElementById('rest-timer-overlay').classList.remove('hidden');
    this.render();
    
    this.interval = setInterval(() => {
      this.seconds--;
      if (this.seconds <= 0) {
        this.stop();
        // Play small audio dip feedback
        const audio = document.getElementById('bg-music'); 
        if(audio && !audio.paused) { 
            const prevVol = audio.volume;
            audio.volume = 0.2; 
            setTimeout(()=> audio.volume = prevVol, 1500); 
        }
        // Vibration if supported
        if("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
        alert("Rest Finished! Get back to it! 💪");
      }
      this.render();
    }, 1000);
  },

  add(sec) {
    this.seconds += sec;
    this.render();
  },

  stop() {
    clearInterval(this.interval);
    document.getElementById('rest-timer-overlay').classList.add('hidden');
  },

  render() {
    const m = Math.floor(this.seconds / 60);
    const s = this.seconds % 60;
    // Format MM:SS
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0'+s : s}`;
  }
};

/* ========================
   4) VIEWS (HTML Generators)
   ======================== */
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const Views = {
  home() {
    const today = new Date().toISOString().split('T')[0];
    const done = Store.logs[today] || [];
    const percent = Math.round((done.length / APP_DATA.habits.length) * 100) || 0;
    const quote = APP_DATA.motivationalQuotes[Math.floor(Math.random()*APP_DATA.motivationalQuotes.length)];
    
    return `
      <div style="padding:18px">
        <div class="card" style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h2>Namaste, ${escapeHtml(Store.user.name)} 🙏</h2>
            <div class="muted-text">${escapeHtml(quote)}</div>
          </div>
        </div>

        <div class="card" style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div><strong>Daily Habit Progress</strong></div>
            <div style="font-weight:800">${percent}%</div>
          </div>
          <div style="margin-top:10px;background:rgba(0,0,0,0.05);height:10px;border-radius:8px;overflow:hidden">
            <div style="height:100%;width:${percent}%;background:linear-gradient(90deg,#2ECC71,#1AB394)"></div>
          </div>
        </div>

        <div style="margin-top:12px">
          <h3>Today's Habits</h3>
          ${APP_DATA.habits.map(h=>{
            const isDone = (Store.logs[new Date().toISOString().split('T')[0]]||[]).includes(h.id);
            return `
              <div class="card" style="display:flex;align-items:center;cursor:pointer;margin-top:10px" onclick="Actions.toggleHabit('${h.id}')">
                <div style="width:42px;height:42px;border-radius:999px;border:2px solid ${isDone? 'var(--secondary)':'var(--border)'};display:flex;align-items:center;justify-content:center;margin-right:12px;background:${isDone?'var(--secondary)':'var(--surface)'}">
                  ${isDone?'<span style="color:#fff;font-weight:800">✓</span>':''}
                </div>
                <div>
                  <div style="font-weight:800">${escapeHtml(h.title)}</div>
                  <div class="muted-text">${escapeHtml(h.desc)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  journey() {
    return `
      <div style="padding:18px">
        <h2>4-Month Roadmap 🗺️</h2>
        <div class="card" style="margin-top:12px">
          ${Store.phases.map(p=>`
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:800">${escapeHtml(p.title)}</div>
                  <div class="muted-text">${escapeHtml(p.desc)}</div>
                </div>
                <div>
                  ${p.completed?'<span style="color:var(--secondary);font-weight:800;">DONE ✅</span>':(p.active?`<button class="btn btn-sm btn-primary" onclick="Actions.completePhase(${p.id})">Finish</button>`:'')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  library() {
    return `
      <div style="padding:14px">
        <h2>Exercise Library 🏋️</h2>
        <div class="filter-scroller" style="margin-top:10px">
          <div class="filter-tag active" onclick="Actions.filterLib('all', this)">All</div>
          <div class="filter-tag" onclick="Actions.filterLib('upper', this)">Upper</div>
          <div class="filter-tag" onclick="Actions.filterLib('lower', this)">Lower</div>
          <div class="filter-tag" onclick="Actions.filterLib('core', this)">Core</div>
        </div>
        <div id="vid-grid" style="margin-top:12px">
          ${this._renderVideos('all')}
        </div>
      </div>
    `;
  },

  _renderVideos(cat) {
    let allExercises = [...APP_DATA.exercises];
    // Check if MuscleModule (external file) is loaded
    if (window.MuscleModule && window.MuscleModule.exercises) {
      const mapped = window.MuscleModule.exercises.map(e => ({
        id: e.id, cat: e.muscle, name: e.name, vid: e.tutorial
      }));
      allExercises = [...allExercises, ...mapped];
    }
    const list = cat === 'all' ? allExercises : allExercises.filter(e => e.cat === cat);
    if(!list.length) return `<div class="card muted-text">No videos found.</div>`;

    return list.map(v => `
      <div class="video-card card">
        <iframe class="video-iframe" src="${escapeHtml(v.vid)}" title="${escapeHtml(v.name)}" frameborder="0" loading="lazy" allowfullscreen></iframe>
        <div class="video-info">
          <div style="font-weight:800">${escapeHtml(v.name)}</div>
          <div class="muted-text" style="margin-top:6px">${escapeHtml(v.cat.toUpperCase())}</div>
        </div>
      </div>
    `).join('');
  },

  nutrition() {
    return `
      <div style="padding:18px">
        <h2>Indian Nutrition Guide 🍛</h2>
        <div class="card" style="margin-top:12px">
          <h3>Vegetarian Protein Sources</h3>
          <ul style="margin-top:8px;padding-left:18px" class="muted-text">
            <li>Paneer (100g = 18g protein)</li>
            <li>Dal & Legumes (1 bowl = 15g protein)</li>
            <li>Soya Chunks (50g = 25g protein)</li>
            <li>Curd/Yogurt (1 bowl = 8g protein)</li>
          </ul>
        </div>
        <div class="card" style="margin-top:12px">
          <h3>Indian Tips</h3>
          <ul style="padding-left:18px">${APP_DATA.indianTips.map(i=>`<li class="muted-text">${escapeHtml(i)}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  },

  muscleBuilding() {
    const gymPlan = window.MuscleModule ? window.MuscleModule.workoutPlans.gym : { push:[], pull:[], legs:[] };
    let planHtml = `<div style="margin-bottom:12px"><strong>Push:</strong> ${gymPlan.push.join(', ')}</div>`;
    planHtml += `<div style="margin-bottom:12px"><strong>Pull:</strong> ${gymPlan.pull.join(', ')}</div>`;
    planHtml += `<div><strong>Legs:</strong> ${gymPlan.legs.join(', ')}</div>`;

    return `
      <div style="padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h2>Muscle Building 💪</h2>
          <!-- REST TIMER BUTTON -->
          <button class="btn btn-outline btn-sm" onclick="RestTimer.start(60)">⏱ Rest Timer</button>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Current Routine</h3>
          <div style="margin-top:10px;font-size:0.9rem;line-height:1.6">${planHtml}</div>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Lift Tracker</h3>
          <div id="lift-tracker">
            <input id="lift-exercise" placeholder="Exercise Name (e.g. Bench Press)" class="inp-wiz" style="margin-top:6px"/><br/>
            <div style="display:flex;gap:10px">
              <input id="lift-weight" type="number" placeholder="Kg" class="inp-wiz" style="margin-top:6px"/>
              <input id="lift-reps" type="number" placeholder="Reps" class="inp-wiz" style="margin-top:6px"/>
              <input id="lift-sets" type="number" placeholder="Sets" class="inp-wiz" style="margin-top:6px"/>
            </div>
            <button class="btn btn-primary" style="margin-top:10px;width:100%" onclick="App.logLift()">Log Lift</button>
          </div>
        </div>
      </div>
    `;
  },

  profile() {
    const isDark = Store.preferences.theme === 'dark';
    
    // Calendar Logic
    const prefix = new Date().toISOString().slice(0,7); // YYYY-MM
    let calHTML = '';
    for(let i=1;i<=30;i++){
      const key = `${prefix}-${String(i).padStart(2,'0')}`;
      const hit = Store.logs[key] && Store.logs[key].length >= 2;
      calHTML += `<div class="cal-day ${hit?'hit':''}">${i}</div>`;
    }

    const photosHtml = (Store.photos || []).map(p=>`<img class="photo-thumb" src="${p.data}" alt="progress">`).join('');
    // Recent lifts log
    const lifts = Object.values(Store.muscleProgress).flat().slice(-3).reverse().map(l=>`<div style="margin:6px 0;padding:8px;background:var(--bg);border-radius:6px;font-size:0.85rem"><strong>${escapeHtml(l.exercise)}</strong>: ${l.weight}kg × ${l.reps}</div>`).join('');

    return `
      <div style="padding:18px">
        <h2>My Profile & Settings ⚙️</h2>
        
        <div class="card" style="display:flex;gap:12px;text-align:center">
          <div style="flex:1"><div class="kv">${escapeHtml(Store.user.cw)}</div><div class="muted-text">Start Kg</div></div>
          <div style="flex:1"><div class="kv" style="color:var(--secondary)">${escapeHtml(Store.user.tw)}</div><div class="muted-text">Goal Kg</div></div>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Consistency (This Month)</h3>
          <div class="calendar-grid">${calHTML}</div>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Recent Lifts</h3>
          ${lifts || '<div class="muted-text">No lifts yet.</div>'}
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Progress Photos</h3>
          <input id="photo-input" type="file" accept="image/*" style="margin-top:10px;width:100%" />
          <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="App.savePhoto()">Save Photo</button>
          <div class="progress-photos">${photosHtml}</div>
        </div>

        <!-- SETTINGS CARD (Theme, Export, Logout) -->
        <div class="card" style="margin-top:12px">
          <h3>App Settings</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px">
            <span>Dark Mode</span>
            <button class="btn btn-sm btn-outline" onclick="App.toggleTheme()">${isDark ? '☀️ Light' : '🌙 Dark'}</button>
          </div>
          <hr style="border:0;border-top:1px solid var(--border);margin:12px 0"/>
          
          <button class="btn btn-outline" style="width:100%;margin-bottom:10px" onclick="App.exportData()">📂 Export Data (JSON)</button>
          <button class="btn btn-danger" style="width:100%" onclick="App.logout()">🚪 Logout / Reset</button>
        </div>
      </div>
    `;
  }
};

/* ========================
   5) ROUTER & ACTIONS
   ======================== */
const Router = {
  go(view) {
    const container = document.getElementById('view-container');
    container.style.opacity = '0';
    
    // Small delay for fade effect
    setTimeout(() => {
        container.innerHTML = Views[view]();
        container.style.opacity = '1';
        window.scrollTo(0,0);
    }, 150);
    
    // Update bottom nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
  }
};

const Actions = {
  toggleHabit(id) {
    Store.logHabit(id);
    Router.go('home'); 
    App.updateStreak();
  },
  completePhase(id) {
    if(confirm("Mark this phase as complete?")) {
        Store.completePhase(id);
        Router.go('journey');
    }
  },
  filterLib(cat, el) {
    document.querySelectorAll('.filter-tag').forEach(t=>t.classList.remove('active'));
    if(el) el.classList.add('active');
    document.getElementById('vid-grid').innerHTML = Views._renderVideos(cat);
  }
};

/* ========================
   6) MAIN APP CONTROLLER
   ======================== */
const App = {
  init() {
    // 1. Apply Theme Immediately
    if(Store.preferences.theme) {
      document.documentElement.setAttribute('data-theme', Store.preferences.theme);
    }

    this.bindNav();
    this.initMusic();
    
    // 2. Check Login State / Onboarding
    if(!Store.user) {
      Onboarding.init();
    } else {
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('music-widget').classList.remove('hidden');
      Router.go('home');
      this.updateStreak();
    }
  },

  bindNav() {
    document.querySelectorAll('.nav-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> Router.go(btn.dataset.view));
    });
  },

  updateStreak() {
    // Simple logic: total days logged
    const count = Object.keys(Store.logs).length;
    const el = document.getElementById('streak-num');
    if(el) el.innerText = count;
  },

  toggleTheme() {
    const newTheme = Store.preferences.theme === 'dark' ? 'light' : 'dark';
    Store.setTheme(newTheme);
    // Refresh view to update button text if we are on profile page
    const currentBtn = document.querySelector('.nav-btn.active');
    if(currentBtn && currentBtn.dataset.view === 'profile') {
      Router.go('profile');
    }
  },

  logout() {
    if(confirm("Are you sure? This will delete all local data and reset the app.")) {
      localStorage.clear();
      location.reload();
    }
  },

  exportData() {
    const dataStr = JSON.stringify(localStorage);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'bodyrevolution_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  savePhoto() {
    const input = document.getElementById('photo-input');
    if(!input || !input.files[0]) return alert('Select photo first');
    
    const reader = new FileReader();
    reader.onload = function(e) {
      Store.addPhoto(e.target.result);
      alert('Photo saved locally!');
      Router.go('profile');
    };
    reader.readAsDataURL(input.files[0]);
  },

  logLift() {
    const ex = document.getElementById('lift-exercise').value;
    const wt = document.getElementById('lift-weight').value;
    const rp = document.getElementById('lift-reps').value;
    const st = document.getElementById('lift-sets').value;
    
    if(!ex || !wt || !rp || !st) return alert('Fill all fields');
    
    Store.logLift(ex, wt, rp, st);
    alert('Lift Logged!');
    Router.go('profile'); // Send user to profile to see the log
  },

  initMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('btn-music-toggle');
    const viz = document.getElementById('eq-viz');
    if(!btn) return;
    
    btn.addEventListener('click', ()=>{
      if(audio.paused) {
        audio.play().catch(e => console.log("Audio prevented:", e));
        btn.innerText = "⏸";
        viz.classList.add('playing');
      } else {
        audio.pause();
        btn.innerText = "▶";
        viz.classList.remove('playing');
      }
    });
  }
};

/* ========================
   7) ONBOARDING WIZARD
   ======================== */
const Onboarding = {
  step: 0,
  data: {},
  steps: [
    { q: "What is your main goal?", k: "goal", t: "radio", options: ["Lose Fat","Build Muscle","General Fitness"] },
    { q: "What is your name?", k: "name", t: "text" },
    { q: "Current Weight (kg)?", k: "cw", t: "number" },
    { q: "Target Weight (kg)?", k: "tw", t: "number" }
  ],
  init() {
    document.getElementById('onboarding').classList.remove('hidden');
    this.render();
    document.getElementById('wiz-next').onclick = ()=> this.next();
    document.getElementById('wiz-back').onclick = ()=> this.prev();
  },
  render() {
    const s = this.steps[this.step];
    const slot = document.getElementById('wiz-slot');
    let html = `<h3 style="margin-bottom:15px">${s.q}</h3>`;
    
    if(s.t === 'radio') {
      s.options.forEach(opt => html += `<label style="display:block;margin:10px 0;padding:10px;border:1px solid var(--border);border-radius:8px;cursor:pointer"><input type="radio" name="${s.k}" value="${opt}"> ${opt}</label>`);
    } else {
      html += `<input id="wiz-inp" class="inp-wiz" type="${s.t}" placeholder="Type here..." value="${this.data[s.k]||''}"/>`;
    }
    
    slot.innerHTML = html;
    
    // Toggle back button visibility
    const btnBack = document.getElementById('wiz-back');
    if(this.step === 0) btnBack.classList.add('hidden');
    else btnBack.classList.remove('hidden');
  },
  next() {
    const s = this.steps[this.step];
    if(s.t === 'radio') {
      const el = document.querySelector(`input[name="${s.k}"]:checked`);
      if(!el) return alert('Please select an option');
      this.data[s.k] = el.value;
    } else {
      const val = document.getElementById('wiz-inp').value;
      if(!val) return alert('This field is required');
      this.data[s.k] = val;
    }

    if(this.step < this.steps.length - 1) {
      this.step++;
      this.render();
    } else {
      Store.user = this.data;
      Store.save();
      location.reload(); // Reload to trigger App.init() fresh
    }
  },
  prev() {
    if(this.step > 0) {
      this.step--;
      this.render();
    }
  }
};

/* ========================
   8) BOOTSTRAP
   ======================== */
document.addEventListener('DOMContentLoaded', ()=> {
  App.init();
});