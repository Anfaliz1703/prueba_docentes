const OWNER = "Anfaliz1703";
const REPO = "prueba_docentes";
const POLL_SECONDS = 60;

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
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return a.seq - b.seq;
    });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/vnd.github+json" }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadMainEntries() {
  const url = `data/frases.json?t=${Date.now()}`;
  const payload = await fetchJson(url);
  return normalizePayload(payload);
}

async function findAgentBranchEntries() {
  const pullsUrl = `https://api.github.com/repos/${OWNER}/${REPO}/pulls?state=open&sort=updated&direction=desc&per_page=10&t=${Date.now()}`;
  const pulls = await fetchJson(pullsUrl);

  const candidates = pulls
    .filter((pr) => pr?.head?.sha)
    .sort((a, b) => {
      const score = (pr) => {
        const login = String(pr?.user?.login || "").toLowerCase();
        const ref = String(pr?.head?.ref || "").toLowerCase();
        const title = String(pr?.title || "").toLowerCase();
        return (login.includes("copilot") ? 4 : 0) +
          (ref.includes("copilot") ? 3 : 0) +
          (title.includes("frase") ? 2 : 0) +
          (title.includes("asincron") ? 1 : 0);
      };
      return score(b) - score(a);
    });

  for (const pr of candidates) {
    const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${pr.head.sha}/data/frases.json?t=${Date.now()}`;
    try {
      const payload = await fetchJson(rawUrl);
      const entries = normalizePayload(payload);
      if (entries.length > 0) {
        return {
          entries,
          source: `PR #${pr.number} · rama del agente`,
          prNumber: pr.number
        };
      }
    } catch {
      // El PR puede existir antes de que el agente cree la bitácora.
    }
  }

  return null;
}

function render(entries, source) {
  const count = entries.length;
  entryCountEl.textContent = `${count} ${count === 1 ? "frase" : "frases"}`;
  sourceStatusEl.textContent = source;

  if (!count) {
    latestBadgeEl.textContent = "Esperando";
    latestQuoteEl.textContent = "Aún no hay frases registradas por el agente.";
    latestMetaEl.textContent = "Cuando Copilot agregue la primera entrada aparecerá aquí con su hora real.";
    historyListEl.innerHTML = '<li class="empty-state">Esperando la primera acción del agente.</li>';
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
  syncStatusEl.textContent = "Consultando actividad real en GitHub…";

  try {
    const mainEntries = await loadMainEntries().catch(() => []);
    const agentResult = await findAgentBranchEntries().catch(() => null);

    if (agentResult && agentResult.entries.length >= mainEntries.length) {
      render(agentResult.entries, agentResult.source);
      syncStatusEl.textContent = "Leyendo directamente la rama activa del agente";
    } else {
      render(mainEntries, "main · GitHub Pages");
      syncStatusEl.textContent = mainEntries.length
        ? "Mostrando datos ya integrados en main"
        : "Agente asignado; esperando su primera entrada";
    }

    lastSyncEl.textContent = localClock();
  } catch (error) {
    sourceStatusEl.textContent = "No se pudo consultar GitHub";
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
  if (secondsLeft <= 0) {
    sync();
  } else {
    countdownEl.textContent = `${secondsLeft} s`;
  }
}

refreshNowBtn.addEventListener("click", sync);

sync();
setInterval(tick, 1000);
