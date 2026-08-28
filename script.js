const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const latestEntryEl = document.getElementById("latestEntry");
const historyCountEl = document.getElementById("historyCount");
const historyListEl = document.getElementById("historyList");

function buildVisualLine(entry) {
  return `${entry.estado} ${entry.horaLocal} · ${entry.issue} · ${entry.texto}`;
}

function renderEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    quoteEl.textContent = "Todavía no hay frases registradas.";
    authorEl.textContent = "— Esperando la primera inserción verificable";
    latestEntryEl.textContent = "";
    historyCountEl.textContent = "0 frases";
    historyListEl.innerHTML = '<li class="history-item history-empty">Sin registros aún.</li>';
    return;
  }

  const latest = entries[entries.length - 1];
  quoteEl.textContent = latest.texto;
  authorEl.textContent = `— Frase #${latest.secuencia}`;
  latestEntryEl.textContent = buildVisualLine(latest);
  historyCountEl.textContent = `${entries.length} frase${entries.length === 1 ? "" : "s"}`;

  historyListEl.innerHTML = "";

  [...entries].reverse().slice(0, 5).forEach((entry) => {
    const item = document.createElement("li");
    item.className = "history-item";
    item.innerHTML = `
      <p class="history-line">${buildVisualLine(entry)}</p>
      <p class="history-meta">${entry.timestamp} · secuencia ${entry.secuencia}</p>
    `;
    historyListEl.appendChild(item);
  });
}

async function loadEntries() {
  try {
    const response = await fetch(`data/frases.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo leer la bitácora.");
    const entries = await response.json();
    renderEntries(entries);
  } catch (error) {
    quoteEl.textContent = "No fue posible cargar la bitácora.";
    authorEl.textContent = "— Revisa data/frases.json";
    latestEntryEl.textContent = error.message;
    historyCountEl.textContent = "";
    historyListEl.innerHTML = '<li class="history-item history-empty">Carga fallida.</li>';
  }
}

loadEntries();
