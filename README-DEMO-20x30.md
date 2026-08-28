# Demo asíncrona 20 × 30 s

Esta prueba continúa desde las 5 inserciones existentes en `data/frases.json`.

Objetivo: el agente de GitHub Copilot debe agregar 20 frases docentes nuevas, comenzando en la secuencia #6 y terminando en la #25, con aproximadamente 30 segundos reales entre inserciones y un commit separado por frase.

La página pública consulta la rama activa del agente cada 30 segundos y muestra el historial acumulado con `✓`, hora local de Colombia y número de secuencia.
