const QUOTE_DURATION = 60;

const quotes = [
  "Enseñar no es llenar una memoria: es despertar una pregunta.",
  "Una buena clase deja al estudiante pensando después de que termina.",
  "El error bien acompañado puede convertirse en una de las mejores herramientas de aprendizaje.",
  "Un docente no necesita tener todas las respuestas; necesita saber construir buenas preguntas.",
  "La tecnología vale en el aula cuando amplía lo que el estudiante puede pensar, crear o comprender.",
  "La curiosidad es una forma silenciosa de motivación que conviene proteger.",
  "Cada explicación debería acercar al estudiante a la autonomía, no a la dependencia.",
  "La evaluación también enseña cuando permite comprender qué mejorar y cómo hacerlo.",
  "Aprender algo difícil requiere tiempo, práctica y permiso para equivocarse.",
  "Una actividad memorable suele tener una decisión real que el estudiante debe tomar.",
  "Cuando el estudiante explica con sus propias palabras, el aprendizaje empieza a hacerse visible.",
  "La disciplina más útil es la que termina convirtiéndose en autorregulación.",
  "No toda innovación necesita una pantalla; a veces basta una pregunta mejor diseñada.",
  "Una clase activa no es una clase ruidosa: es una clase donde hay pensamiento en movimiento.",
  "El propósito debe ser más visible que la herramienta.",
  "Enseñar también es diseñar condiciones para que alguien descubra que sí puede aprender.",
  "Un recurso sencillo puede ser poderoso si obliga a observar, comparar, decidir y justificar.",
  "La retroalimentación útil señala el siguiente paso, no solo el error anterior.",
  "Lo que un estudiante crea revela mucho más que lo que simplemente repite.",
  "La paciencia docente también es una estrategia pedagógica.",
  "Una pregunta auténtica puede abrir más aprendizaje que diez instrucciones cerradas.",
  "El aula mejora cuando la participación deja de depender siempre de los mismos estudiantes.",
  "Comprender no es recordar una definición: es poder usar una idea en una situación nueva.",
  "La motivación aumenta cuando el estudiante entiende para qué está aprendiendo algo.",
  "El conocimiento se fortalece cuando se conecta con experiencias, problemas y decisiones reales.",
  "Una buena secuencia didáctica reduce la ayuda poco a poco.",
  "La creatividad necesita límites claros tanto como libertad.",
  "Antes de añadir una herramienta digital, conviene preguntar qué problema pedagógico resuelve.",
  "El silencio de un estudiante no siempre significa falta de ideas; a veces significa que necesita otra forma de participar.",
  "Una clase inclusiva ofrece más de una manera de comprender y demostrar lo aprendido.",
  "La mejor evidencia de aprendizaje suele ser algo que el estudiante puede explicar, construir o defender.",
  "No hay aprendizaje profundo sin algún grado de esfuerzo intelectual.",
  "El docente diseña experiencias; el estudiante construye significado.",
  "Una rúbrica útil hace visible la calidad antes de poner una nota.",
  "Preguntar '¿cómo lo sabes?' transforma una respuesta en razonamiento.",
  "La autonomía no aparece de golpe: se entrena con pequeñas decisiones frecuentes.",
  "El trabajo en equipo funciona mejor cuando cada estudiante tiene una responsabilidad reconocible.",
  "Una herramienta de IA debería aumentar el criterio del estudiante, no reemplazarlo.",
  "Leer críticamente también significa desconfiar de respuestas que parecen demasiado seguras.",
  "El aprendizaje mejora cuando el estudiante puede revisar una primera versión y producir una segunda mejor.",
  "Una clase puede ser exigente y, al mismo tiempo, ofrecer apoyos claros.",
  "La confianza académica se construye acumulando pequeñas experiencias de logro real.",
  "Los mejores ejemplos no solo muestran qué hacer; también explican por qué funciona.",
  "Una consigna clara libera energía mental para pensar en lo importante.",
  "Cuando una actividad tiene audiencia real, el cuidado por el trabajo suele aumentar.",
  "El pensamiento crítico comienza cuando aceptar una respuesta deja de ser automático.",
  "El estudiante aprende más de una corrección que comprende que de una respuesta correcta que copia.",
  "La tecnología educativa más valiosa suele desaparecer detrás de la experiencia de aprendizaje.",
  "Enseñar a crear implica enseñar también a revisar, probar y mejorar.",
  "Una clase bien diseñada tiene momentos para explorar, practicar, explicar y reflexionar.",
  "La pregunta '¿qué cambiarías?' convierte una tarea terminada en una oportunidad de iteración.",
  "El aprendizaje significativo necesita conexiones, no únicamente contenidos.",
  "Un estudiante que argumenta está mostrando más que una respuesta: está mostrando su pensamiento.",
  "La accesibilidad no es un añadido; es una condición para que más estudiantes puedan participar.",
  "Una buena actividad deja espacio para que aparezcan respuestas que el docente no había previsto.",
  "La memoria importa, pero cobra valor cuando alimenta comprensión, criterio y creación.",
  "El acompañamiento efectivo cambia según aumenta la competencia del estudiante.",
  "Las preguntas difíciles necesitan tiempo de espera, no respuestas inmediatas del docente.",
  "En educación, mejorar una pequeña rutina puede tener más impacto que añadir una gran novedad.",
  "El objetivo final no es que el estudiante siga instrucciones, sino que llegue a tomar buenas decisiones sin ellas."
];

const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const countdownEl = document.getElementById("countdown");
const progressBar = document.getElementById("progressBar");
const newQuoteBtn = document.getElementById("newQuote");
const copyQuoteBtn = document.getElementById("copyQuote");
const statusEl = document.getElementById("status");

let currentIndex = -1;
let secondsLeft = QUOTE_DURATION;
let timerId;

function getNextIndex() {
  if (quotes.length <= 1) return 0;
  let next;
  do {
    next = Math.floor(Math.random() * quotes.length);
  } while (next === currentIndex);
  return next;
}

function renderQuote() {
  currentIndex = getNextIndex();
  quoteEl.textContent = quotes[currentIndex];
  authorEl.textContent = "— Para quienes enseñan y siguen aprendiendo";
  secondsLeft = QUOTE_DURATION;
  updateTimerUI();
}

function updateTimerUI() {
  countdownEl.textContent = `${secondsLeft} s`;
  const percentage = (secondsLeft / QUOTE_DURATION) * 100;
  progressBar.style.width = `${percentage}%`;
}

function tick() {
  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    renderQuote();
  } else {
    updateTimerUI();
  }
}

function restartTimer() {
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
}

function showStatus(message) {
  statusEl.textContent = message;
  window.setTimeout(() => {
    if (statusEl.textContent === message) statusEl.textContent = "";
  }, 1800);
}

newQuoteBtn.addEventListener("click", () => {
  renderQuote();
  restartTimer();
  showStatus("Nueva frase cargada.");
});

copyQuoteBtn.addEventListener("click", async () => {
  const text = `${quotes[currentIndex]} — Para quienes enseñan y siguen aprendiendo`;
  try {
    await navigator.clipboard.writeText(text);
    showStatus("Frase copiada.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showStatus("Frase copiada.");
  }
});

renderQuote();
restartTimer();
