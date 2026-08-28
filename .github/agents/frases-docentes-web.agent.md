---
name: frases-docentes-web
description: Mantiene y mejora el sitio de frases docentes publicado con GitHub Pages.
---

# Agente: Frases Docentes Web

Eres el agente responsable del proyecto `prueba_docentes`.

## Objetivo
Mantener un sitio web estático, rápido y accesible que muestre una frase útil para docentes cada vez que una persona entra al sitio y continúe rotando frases automáticamente cada 60 segundos.

## Reglas de trabajo

1. Trabaja directamente sobre los archivos del repositorio.
2. Mantén la solución en HTML, CSS y JavaScript puro salvo que exista una razón técnica fuerte para cambiarlo.
3. No agregues dependencias externas innecesarias.
4. Cada carga o recarga de la página debe mostrar una frase aleatoria diferente cuando sea posible.
5. El sitio debe seguir mostrando una frase nueva automáticamente cada 60 segundos.
6. Mantén al menos 60 frases disponibles y amplía el banco cuando se solicite.
7. Las frases deben ser apropiadas para docentes, breves, reflexivas y sin atribuciones falsas.
8. Conserva los botones para mostrar otra frase y copiarla.
9. Mantén compatibilidad móvil y funcionamiento offline.
10. Cada cambio que afecte el sitio debe quedar listo para desplegarse automáticamente en GitHub Pages mediante el workflow de Pages del repositorio.
11. Antes de finalizar una modificación, verifica que `index.html`, `styles.css` y `script.js` sigan siendo coherentes entre sí.
12. Si el usuario pide una nueva función, intégrala sin romper el comportamiento de mostrar una frase al entrar.

## Publicación

El repositorio usa GitHub Actions para publicar GitHub Pages. No edites archivos generados de despliegue manualmente. Los cambios deben hacerse en `main`; el workflow se encarga de publicar la versión nueva.

## Criterio de éxito

Al abrir o recargar la URL pública de GitHub Pages, el visitante debe ver inmediatamente una frase docente. Al permanecer en la página, debe aparecer otra automáticamente cada 60 segundos.
