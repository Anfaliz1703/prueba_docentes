const OWNER = "Anfaliz1703";
const REPO = "prueba_docentes";
const AGENT_BRANCH = "copilot/frase-minuto-demo-asincrona";
const POLL_SECONDS = 30;

const latestQuoteEl = document.getElementById("latestQuote");
const latestMetaEl = document.getElementById("latestMeta");
const latestBadgeEl = document.getElementById("latestBadge");
const historyListEl = document.getElementById("historyList");
const entryCountEl = document.getElementById("entryCount");
const sourceStatusEl = document.getElementById("sourceStatus");
const syncStatusEl = document.getElementById("syncStatus");
const countdownEl = document.getElementById("countdown");
const lastSyncEl = document.getElementById("lastSync");
const refreshNowBtn = document.getElementById("refreshNow");

let secondsLeft = POLL_SECONDS;
let isLoading = false;

function localClock(date = new Date()) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function parseEntry(entry, index) {
  const text = entry?.text ?? entry?.texto ?? entry?.frase ?? entry?.quote ?? entry?.mensaje ?? "";
  const timestamp = entry?.timestamp ?? entry?.fecha ?? entry?.created_at ?? null;
  let time = entry?.localTime ?? entry?.horaLocal ?? entry?.hora ?? entry?.time ?? "";

  if (!time && timestamp) {
    const parsed = new Date(timestamp);
    if (!Number.isNaN(parsed.getTime())) time = localClock(parsed);
  }

  return {
    seq: Number(entry?.seq ?? entry?.secuencia ?? entry?.numero ?? entry?.id ?? index + 1),
    text: String(text).trim(),
    timestamp,
    time: String(time || "hora no registrada"),
    status: entry?.status ?? entry?.estado ?? "✓"
  };
}

function normalizePayload(payload) {
  const rawEntries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.entries)
      ? payload.entries
      : Array.isArray(payload?.frases)
        ? payload.frases
        : [];

  return rawEntries
    .map(parseEntry)
    .filter((entry) => entry.text)
    .sort((a, b) => {
      if (a.timestamp && b.timestamp) return new Date(a.timestamp) - new Date(b.timestamp);
      return a.seq - b.seq;
    });
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadAgentEntries() {
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${AGENT_BRANCH}/data/frases.json?t=${Date.now()}`;
  const payload = await fetchJson(rawUrl);
  return normalizePayload(payload);
}

async function loadMainEntries() {
  const payload = await fetchJson(`data/frases.json?t=${Date.now()}`);
  return normalizePayload(payload);
}

function render(entries, source) {
  const count = entries.length;
  entryCountEl.textContent = `${count} ${count === 1 ? "frase" : "frases"}`;
  sourceStatusEl.textContent = source;

  if (!count) {
    latestBadgeEl.textContent = "Esperando";
    latestQuoteEl.textContent = "Aún no hay frases registradas por el agente.";
    latestMetaEl.textContent = "Cuando Copilot agregue una entrada aparecerá aquí con su hora real.";
    historyListEl.innerHTML = '<li class="empty-state">Esperando actividad del agente.</li>';
    return;
  }

  const latest = entries[count - 1];
  latestBadgeEl.textContent = `${latest.status} ${latest.time}`;
  latestQuoteEl.textContent = latest.text;
  latestMetaEl.textContent = `Entrada #${latest.seq} · agregada a las ${latest.time} · fuente: ${source}`;

  historyListEl.innerHTML = "";
  [...entries].reverse().forEach((entry) => {
    const item = document.createElement("li");
    item.className = "history-item";

    const check = document.createElement("span");
    check.className = "check";
    check.textContent = entry.status || "✓";

    const body = document.createElement("div");
    body.className = "history-body";

    const meta = document.createElement("div");
    meta.className = "history-meta";
    meta.textContent = `${entry.time} · #${entry.seq}`;

    const text = document.createElement("p");
    text.textContent = entry.text;

    body.append(meta, text);
    item.append(check, body);
    historyListEl.append(item);
  });
}

async function sync() {
  if (isLoading) return;
  isLoading = true;
  refreshNowBtn.disabled = true;
  syncStatusEl.textContent = "Leyendo directamente la rama viva del agente…";

  try {
    let entries;
    try {
      entries = await loadAgentEntries();
      render(entries, "Copilot · rama activa");
      syncStatusEl.textContent = "Datos en vivo desde la rama de Copilot";
    } catch (agentError) {
      entries = await loadMainEntries();
      render(entries, "main · GitHub Pages");
      syncStatusEl.textContent = "Rama del agente no disponible; mostrando main";
      console.warn("No se pudo leer la rama del agente", agentError);
    }

    lastSyncEl.textContent = localClock();
  } catch (error) {
    sourceStatusEl.textContent = "No se pudo cargar la bitácora";
    syncStatusEl.textContent = "Se reintentará automáticamente";
    console.error(error);
  } finally {
    secondsLeft = POLL_SECONDS;
    countdownEl.textContent = `${secondsLeft} s`;
    refreshNowBtn.disabled = false;
    isLoading = false;
  }
}

function tick() {
  secondsLeft -= 1;
  if (secondsLeft <= 0) sync();
  else countdownEl.textContent = `${secondsLeft} s`;
}

refreshNowBtn.addEventListener("click", sync);

sync();
setInterval(tick, 1000);
