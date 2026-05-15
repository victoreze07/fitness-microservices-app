const page = document.body.dataset.page;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

function setError(id, label, error) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = `<p class="error">Could not load ${label}: ${escapeHtml(error.message)}</p>`;
  }
}

function renderMiniList(id, items, formatter) {
  const element = document.getElementById(id);
  if (!element) return;

  element.innerHTML = items.slice(0, 2).map(formatter).join("");
}

async function loadHome() {
  try {
    const [workouts, nutrition, progress] = await Promise.all([
      getJson("/api/workouts/workouts"),
      getJson("/api/nutrition/meals"),
      getJson("/api/progress/summary")
    ]);

    renderMiniList("workouts", workouts.items, (item) => `
      <div class="item"><strong>${escapeHtml(item.name)}</strong>${escapeHtml(item.focus)} | ${escapeHtml(item.duration)}</div>
    `);
    renderMiniList("nutrition", nutrition.items, (item) => `
      <div class="item"><strong>${escapeHtml(item.name)}</strong>${escapeHtml(item.calories)} calories | ${escapeHtml(item.protein)} protein</div>
    `);
    renderMiniList("progress", progress.items, (item) => `
      <div class="item metric"><span>${escapeHtml(item.label)}</span><span>${escapeHtml(item.value)}</span></div>
    `);
  } catch (error) {
    ["workouts", "nutrition", "progress"].forEach((id) => setError(id, id, error));
  }
}

async function loadWorkouts() {
  try {
    const data = await getJson("/api/workouts/workouts");
    const plan = data.featuredPlan;
    document.getElementById("workout-plan").innerHTML = `
      <h2>${escapeHtml(plan.title)}</h2>
      <p>${escapeHtml(plan.goal)}</p>
      <dl class="facts">
        <div><dt>Weekly target</dt><dd>${escapeHtml(plan.weeklyTarget)}</dd></div>
        <div><dt>Rest days</dt><dd>${escapeHtml(plan.restDays)}</dd></div>
      </dl>
    `;

    document.getElementById("workouts-detail").innerHTML = data.items.map((item) => `
      <article class="detail-card">
        <div class="tag-row">
          <span>${escapeHtml(item.level)}</span>
          <span>${escapeHtml(item.duration)}</span>
        </div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.focus)} training with ${escapeHtml(item.equipment)}.</p>
        <p class="muted">Schedule: ${escapeHtml(item.schedule)}</p>
        <ul>${item.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>
      </article>
    `).join("");
  } catch (error) {
    setError("workout-plan", "workout plan", error);
    setError("workouts-detail", "workouts", error);
  }
}

async function loadNutrition() {
  try {
    const data = await getJson("/api/nutrition/meals");
    const targets = data.targets;
    document.getElementById("nutrition-targets").innerHTML = `
      <div><strong>${escapeHtml(targets.calories)}</strong><span>calories</span></div>
      <div><strong>${escapeHtml(targets.protein)}</strong><span>protein</span></div>
      <div><strong>${escapeHtml(targets.hydration)}</strong><span>hydration</span></div>
      <div><strong>${escapeHtml(targets.focus)}</strong><span>daily focus</span></div>
    `;

    document.getElementById("nutrition-detail").innerHTML = data.items.map((item) => `
      <article class="detail-card">
        <div class="tag-row">
          <span>${escapeHtml(item.timing)}</span>
          <span>${escapeHtml(item.calories)} cal</span>
        </div>
        <h3>${escapeHtml(item.name)}</h3>
        <dl class="macro-row">
          <div><dt>Protein</dt><dd>${escapeHtml(item.protein)}</dd></div>
          <div><dt>Carbs</dt><dd>${escapeHtml(item.carbs)}</dd></div>
          <div><dt>Fat</dt><dd>${escapeHtml(item.fat)}</dd></div>
        </dl>
        <p class="muted">${item.ingredients.map(escapeHtml).join(", ")}</p>
      </article>
    `).join("");
  } catch (error) {
    setError("nutrition-targets", "nutrition targets", error);
    setError("nutrition-detail", "meals", error);
  }
}

async function loadProgress() {
  try {
    const data = await getJson("/api/progress/summary");
    document.getElementById("progress-detail").innerHTML = data.items.map((item) => `
      <article class="metric-card">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.change)}</small>
      </article>
    `).join("");

    document.getElementById("progress-trend").innerHTML = data.weeklyTrend.map((item) => `
      <div class="trend-item">
        <span>${escapeHtml(item.week)}</span>
        <div class="bar"><span style="width: ${Number(item.completion)}%"></span></div>
        <strong>${escapeHtml(item.completion)}%</strong>
      </div>
    `).join("");

    document.getElementById("progress-milestones").innerHTML = data.milestones.map((item) => `
      <div class="item metric"><span>${escapeHtml(item.name)}</span><span>${escapeHtml(item.status)}</span></div>
    `).join("");
  } catch (error) {
    setError("progress-detail", "progress", error);
    setError("progress-trend", "trend", error);
    setError("progress-milestones", "milestones", error);
  }
}

const loaders = {
  home: loadHome,
  workouts: loadWorkouts,
  nutrition: loadNutrition,
  progress: loadProgress
};

loaders[page]?.();
