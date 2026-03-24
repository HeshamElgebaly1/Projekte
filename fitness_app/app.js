/* ══════════════════════════════════════════════
   FitTrack – app.js
   Gesamte Logik der Fitness-Verwaltungs-App
   Datenspeicherung: localStorage (bleibt nach
   Browser-Neustart dauerhaft erhalten)
══════════════════════════════════════════════ */

// ══════════════════════════════════════════════
// DATENSPEICHERUNG (localStorage)
// ══════════════════════════════════════════════

const DB = {
  get: (key, defaultVal = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Speicherfehler:', e);
    }
  }
};

// ══════════════════════════════════════════════
// ANWENDUNGSZUSTAND
// ══════════════════════════════════════════════

let profile    = DB.get('ft_profile', {});
let weights    = DB.get('ft_weights', []);
let activities = DB.get('ft_activities', []);

let weightChartInstance = null;
let actChartInstance    = null;

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');

  if (id === 'weight')   renderWeight();
  if (id === 'activity') renderActivity();
}

// ══════════════════════════════════════════════
// TOAST BENACHRICHTIGUNG
// ══════════════════════════════════════════════

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// ══════════════════════════════════════════════
// NAVIGATIONSSTATISTIK
// ══════════════════════════════════════════════

function updateNavStats() {
  document.getElementById('navStats').textContent =
    `${weights.length} Eintr. · ${activities.length} Akt.`;
}

// ══════════════════════════════════════════════
// BMI-RECHNER
// ══════════════════════════════════════════════

// BMI-Kategorien mit Farben
const BMI_INFO = [
  { max: 18.5, label: 'Untergewicht',  color: '#60a5fa', bg: '#1e3a5f' },
  { max: 25,   label: 'Normalgewicht', color: '#4ade80', bg: '#14532d' },
  { max: 30,   label: 'Übergewicht',   color: '#facc15', bg: '#713f12' },
  { max: 35,   label: 'Adipositas I',  color: '#fb923c', bg: '#7c2d12' },
  { max: 40,   label: 'Adipositas II', color: '#f87171', bg: '#7f1d1d' },
  { max: 999,  label: 'Adipositas III',color: '#e11d48', bg: '#5f0013' },
];

function getBMIValue(height, weight) {
  return +(weight / ((height / 100) ** 2)).toFixed(1);
}

function getBMIInfo(bmi) {
  return BMI_INFO.find(r => bmi < r.max);
}

function calcBMI() {
  const h = parseFloat(document.getElementById('bmi-height').value);
  const w = parseFloat(document.getElementById('bmi-weight').value);

  const emptyEl  = document.getElementById('bmi-result-empty');
  const resultEl = document.getElementById('bmi-result');

  // Eingabe unvollständig → Ergebnis ausblenden
  if (!h || !w || h < 50 || w < 10) {
    emptyEl.style.display  = 'block';
    resultEl.style.display = 'none';
    return;
  }

  const bmi  = getBMIValue(h, w);
  const info = getBMIInfo(bmi);
  const pct  = Math.min(Math.max(((bmi - 14) / (45 - 14)) * 100, 2), 98);

  // Ergebnis anzeigen
  emptyEl.style.display  = 'none';
  resultEl.style.display = 'block';

  // BMI-Zahl & Farbe
  const numEl = document.getElementById('bmi-number');
  numEl.textContent = bmi;
  numEl.style.color = info.color;

  // Kategorie-Badge
  const catEl = document.getElementById('bmi-cat');
  catEl.textContent       = info.label;
  catEl.style.background  = info.bg;
  catEl.style.color       = info.color;

  // Zeiger auf dem Farbbalken
  document.getElementById('bmi-needle').style.left = pct + '%';

  // Idealgewicht berechnen (Näherungsformel: BMI 18.5–24.9)
  const idealMin = +(18.5 * ((h / 100) ** 2)).toFixed(1);
  const idealMax = +(24.9 * ((h / 100) ** 2)).toFixed(1);
  document.getElementById('bmi-ideal').textContent = `${idealMin} – ${idealMax} kg`;

  // Differenz zum Idealgewicht
  const diff   = +(w - idealMax).toFixed(1);
  const diffEl = document.getElementById('bmi-diff');

  if (diff <= 0) {
    diffEl.textContent = diff < 0 ? `${Math.abs(diff)} kg zu wenig` : 'Im Idealbereich ✓';
    diffEl.className   = 'mono pos';
  } else {
    diffEl.textContent = `+${diff} kg zum Ziel`;
    diffEl.className   = 'mono neg';
  }
}

function saveProfile() {
  profile = {
    height: document.getElementById('bmi-height').value,
    weight: document.getElementById('bmi-weight').value,
    age:    document.getElementById('bmi-age').value,
    gender: document.getElementById('bmi-gender').value,
  };
  DB.set('ft_profile', profile);
  toast('✓ Profil gespeichert!');
}

function loadProfile() {
  if (profile.height) document.getElementById('bmi-height').value = profile.height;
  if (profile.weight) document.getElementById('bmi-weight').value = profile.weight;
  if (profile.age)    document.getElementById('bmi-age').value    = profile.age;
  if (profile.gender) document.getElementById('bmi-gender').value = profile.gender;
  calcBMI();
}

// ══════════════════════════════════════════════
// GEWICHT-TRACKING
// ══════════════════════════════════════════════

function addWeight() {
  const val  = parseFloat(document.getElementById('w-val').value);
  const date = document.getElementById('w-date').value;
  const note = document.getElementById('w-note').value.trim();

  if (!val || isNaN(val)) { toast('⚠️ Bitte Gewicht eingeben!'); return; }
  if (!date)              { toast('⚠️ Bitte Datum eingeben!');  return; }

  weights.push({ id: Date.now(), date, weight: val, note });
  weights.sort((a, b) => new Date(a.date) - new Date(b.date));
  DB.set('ft_weights', weights);

  // Formular leeren
  document.getElementById('w-val').value  = '';
  document.getElementById('w-note').value = '';

  toast('✓ Gewichtseintrag gespeichert!');
  updateNavStats();
  renderWeight();
}

function deleteWeight(id) {
  weights = weights.filter(w => w.id !== id);
  DB.set('ft_weights', weights);
  updateNavStats();
  renderWeight();
  toast('🗑 Eintrag gelöscht');
}

function renderWeight() {
  const sorted = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
  const statsEl = document.getElementById('weight-stats');

  // ── Statistik-Boxen ──
  if (sorted.length > 0) {
    const last  = sorted.at(-1);
    const prev  = sorted.at(-2);
    const diff  = prev ? (last.weight - prev.weight).toFixed(1) : null;
    const minW  = Math.min(...sorted.map(x => x.weight));
    const avgW  = (sorted.reduce((s, x) => s + x.weight, 0) / sorted.length).toFixed(1);

    const diffHtml = diff !== null
      ? `<span class="${parseFloat(diff) <= 0 ? 'pos' : 'neg'}">${parseFloat(diff) > 0 ? '+' : ''}${diff} kg</span>`
      : '';

    statsEl.style.display = 'grid';
    statsEl.innerHTML = `
      <div class="stat">
        <div class="stat-val acc">${last.weight} <span>kg</span></div>
        <div class="stat-label">Aktuell ${diffHtml}</div>
      </div>
      <div class="stat">
        <div class="stat-val acc2">${minW} <span>kg</span></div>
        <div class="stat-label">Tiefstwert</div>
      </div>
      <div class="stat">
        <div class="stat-val">${avgW} <span>kg</span></div>
        <div class="stat-label">Durchschnitt · ${sorted.length} Eintr.</div>
      </div>`;
  } else {
    statsEl.style.display = 'none';
  }

  // ── Diagramm ──
  const chartEmpty = document.getElementById('weight-chart-empty');
  const chartWrap  = document.getElementById('weight-chart-wrap');

  if (sorted.length >= 2) {
    chartEmpty.style.display = 'none';
    chartWrap.style.display  = 'block';

    const labels = sorted.map(x => x.date.slice(5));
    const data   = sorted.map(x => x.weight);

    if (weightChartInstance) weightChartInstance.destroy();

    weightChartInstance = new Chart(document.getElementById('weightChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor:     '#c8ff00',
          backgroundColor: 'rgba(200,255,0,0.07)',
          borderWidth:     2.5,
          tension:         0.3,
          fill:            true,
          pointBackgroundColor: '#c8ff00',
          pointRadius:     4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0e1318',
            borderColor:     '#1c2630',
            borderWidth:     1,
            titleColor:      '#718096',
            bodyColor:       '#c8ff00',
            callbacks: { label: ctx => ` ${ctx.raw} kg` }
          }
        },
        scales: {
          x: { grid: { color: '#1c2630' }, ticks: { color: '#718096', font: { size: 10 } } },
          y: {
            grid:  { color: '#1c2630' },
            ticks: { color: '#718096', font: { size: 10 }, callback: v => v + ' kg' }
          }
        }
      }
    });
  } else {
    chartEmpty.style.display = 'block';
    chartWrap.style.display  = 'none';
  }

  // ── Tabelle ──
  const tableEmpty = document.getElementById('weight-table-empty');
  const table      = document.getElementById('weight-table');
  const tbody      = document.getElementById('weight-tbody');

  document.getElementById('weight-table-title').textContent =
    `Verlaufsprotokoll (${sorted.length} Einträge)`;

  if (sorted.length === 0) {
    tableEmpty.style.display = 'block';
    table.style.display      = 'none';
    return;
  }

  tableEmpty.style.display = 'none';
  table.style.display      = 'table';

  tbody.innerHTML = [...sorted].reverse().map((entry, i, arr) => {
    const prevEntry = arr[i + 1];
    const d = prevEntry ? (entry.weight - prevEntry.weight).toFixed(1) : null;
    const diffHtml = d !== null
      ? `<span class="${parseFloat(d) <= 0 ? 'pos' : 'neg'}">${parseFloat(d) > 0 ? '+' : ''}${d} kg</span>`
      : '—';

    return `
      <tr>
        <td class="mono dim">${entry.date}</td>
        <td class="mono" style="font-weight:600">${entry.weight} kg</td>
        <td>${diffHtml}</td>
        <td class="dim" style="font-size:.8rem">${entry.note || '—'}</td>
        <td><button class="btn btn-sm" onclick="deleteWeight(${entry.id})">✕</button></td>
      </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════
// AKTIVITÄTEN-TRACKING
// ══════════════════════════════════════════════

function addActivity() {
  const type = document.getElementById('a-type').value;
  const date = document.getElementById('a-date').value;
  const dur  = parseInt(document.getElementById('a-dur').value);
  const cal  = parseInt(document.getElementById('a-cal').value)   || null;
  const dist = parseFloat(document.getElementById('a-dist').value) || null;
  const note = document.getElementById('a-note').value.trim();

  if (!dur || isNaN(dur)) { toast('⚠️ Bitte Dauer eingeben!'); return; }
  if (!date)              { toast('⚠️ Bitte Datum eingeben!'); return; }

  activities.push({ id: Date.now(), type, date, duration: dur, calories: cal, distance: dist, note });
  DB.set('ft_activities', activities);

  // Formular leeren
  document.getElementById('a-dur').value  = '';
  document.getElementById('a-cal').value  = '';
  document.getElementById('a-dist').value = '';
  document.getElementById('a-note').value = '';

  toast('✓ Aktivität gespeichert!');
  updateNavStats();
  renderActivity();
}

function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  DB.set('ft_activities', activities);
  updateNavStats();
  renderActivity();
  toast('🗑 Aktivität gelöscht');
}

function renderActivity() {
  const sorted = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date));
  const statsEl = document.getElementById('act-stats');

  // ── Statistik-Boxen ──
  if (sorted.length > 0) {
    const totalMin = activities.reduce((s, a) => s + a.duration, 0);
    const totalCal = activities.reduce((s, a) => s + (a.calories || 0), 0);
    const now      = new Date();
    const thisWeek = activities.filter(a => (now - new Date(a.date)) / 86400000 <= 7).length;

    statsEl.style.display = 'grid';
    statsEl.innerHTML = `
      <div class="stat">
        <div class="stat-val acc">${activities.length}</div>
        <div class="stat-label">Einheiten gesamt · ${thisWeek} diese Woche</div>
      </div>
      <div class="stat">
        <div class="stat-val acc2">${Math.floor(totalMin / 60)}<span>h</span> ${totalMin % 60}<span>m</span></div>
        <div class="stat-label">Gesamttrainingszeit</div>
      </div>
      <div class="stat">
        <div class="stat-val">${totalCal.toLocaleString('de')}</div>
        <div class="stat-label">kcal verbrannt</div>
      </div>`;
  } else {
    statsEl.style.display = 'none';
  }

  // ── Typ-Verteilung (Fortschrittsbalken) ──
  const typeMap   = {};
  activities.forEach(a => { typeMap[a.type] = (typeMap[a.type] || 0) + 1; });

  const distEl    = document.getElementById('act-dist');
  const distEmpty = document.getElementById('act-dist-empty');

  if (Object.keys(typeMap).length > 0) {
    distEmpty.style.display = 'none';
    distEl.style.display    = 'block';
    distEl.innerHTML = Object.entries(typeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => {
        const pct = Math.round((count / activities.length) * 100);
        return `
          <div class="prog-row">
            <div class="prog-top">
              <span style="font-size:.84rem">${type}</span>
              <span class="mono dim" style="font-size:.75rem">${count}× · ${pct}%</span>
            </div>
            <div class="prog-bar">
              <div class="prog-fill" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join('');
  } else {
    distEmpty.style.display = 'block';
    distEl.style.display    = 'none';
  }

  // ── Wochendiagramm (Balkendiagramm) ──
  const actChartEmpty = document.getElementById('act-chart-empty');
  const actChartWrap  = document.getElementById('act-chart-wrap');

  if (sorted.length >= 1) {
    // Nach Kalenderwoche gruppieren
    const weekMap = {};
    sorted.forEach(a => {
      const d     = new Date(a.date);
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay() + 1);
      const key   = start.toISOString().slice(0, 10);
      weekMap[key] = (weekMap[key] || 0) + a.duration;
    });

    const weekLabels = Object.keys(weekMap).sort().slice(-8);
    const weekData   = weekLabels.map(k => weekMap[k]);

    actChartEmpty.style.display = 'none';
    actChartWrap.style.display  = 'block';

    if (actChartInstance) actChartInstance.destroy();

    actChartInstance = new Chart(document.getElementById('actChart'), {
      type: 'bar',
      data: {
        labels: weekLabels.map(l => l.slice(5)),
        datasets: [{
          data:            weekData,
          backgroundColor: 'rgba(0,229,255,0.2)',
          borderColor:     '#00e5ff',
          borderWidth:     2,
          borderRadius:    6,
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0e1318',
            borderColor:     '#1c2630',
            borderWidth:     1,
            titleColor:      '#718096',
            bodyColor:       '#00e5ff',
            callbacks: { label: ctx => ` ${ctx.raw} min` }
          }
        },
        scales: {
          x: { grid: { color: '#1c2630' }, ticks: { color: '#718096', font: { size: 10 } } },
          y: {
            grid:  { color: '#1c2630' },
            ticks: { color: '#718096', font: { size: 10 }, callback: v => v + ' min' }
          }
        }
      }
    });
  } else {
    actChartEmpty.style.display = 'block';
    actChartWrap.style.display  = 'none';
  }

  // ── Tabelle ──
  const tableEmpty = document.getElementById('act-table-empty');
  const table      = document.getElementById('act-table');
  const tbody      = document.getElementById('act-tbody');

  document.getElementById('act-table-title').textContent =
    `Trainingsprotokoll (${activities.length} Einträge)`;

  if (activities.length === 0) {
    tableEmpty.style.display = 'block';
    table.style.display      = 'none';
    return;
  }

  tableEmpty.style.display = 'none';
  table.style.display      = 'table';

  tbody.innerHTML = [...activities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(a => `
      <tr>
        <td class="mono dim">${a.date}</td>
        <td>${a.type}</td>
        <td class="mono">${a.duration} min</td>
        <td class="mono ${a.calories ? 'acc2' : 'dim'}">${a.calories ? a.calories + ' kcal' : '—'}</td>
        <td class="mono">${a.distance ? a.distance + ' km' : '—'}</td>
        <td class="dim" style="font-size:.8rem">${a.note || '—'}</td>
        <td><button class="btn btn-sm" onclick="deleteActivity(${a.id})">✕</button></td>
      </tr>`)
    .join('');
}

// ══════════════════════════════════════════════
// INITIALISIERUNG beim Laden der Seite
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Heutiges Datum als Standard setzen
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('w-date').value = today;
  document.getElementById('a-date').value = today;

  // Gespeichertes Profil laden & BMI berechnen
  loadProfile();

  // Navigationsstatistik aktualisieren
  updateNavStats();
});
