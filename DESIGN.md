# THE GARAGE • BIKE EXPERTS | Design System Specification (v2.0)

> **Inspiración y Benchmark:** S-Works Specialized, Basso Bikes Italia, Rapha Racing, Canyon Bicycles.
> **Estética:** Boutique ciclista de alto rendimiento en el Caribe. Minimalista, editorial, espacioso y con física de movimiento natural.

---

## 1. Tokens de Color & Superficies

```css
:root {
  /* Marca Principal */
  --brand-red: #E11D48;         /* Racing Coral / The Garage Accent */
  --brand-red-hover: #BE123C;
  --brand-red-glow: rgba(225, 29, 72, 0.16);

  /* Fondos y Superficies */
  --surface-base: #FFFFFF;      /* Blanco Puro Óptico */
  --surface-subtle: #F8FAFC;    /* Gris Suave para Contraste */
  --surface-card: #FFFFFF;
  --surface-dark: #0A0A0C;      /* Negro Carbón Onyx */
  --surface-dark-card: #141418;

  /* Tipografía */
  --text-primary: #0F172A;      /* Slate 900 */
  --text-secondary: #475569;    /* Slate 600 */
  --text-muted: #94A3B8;        /* Slate 400 */
  --text-on-dark: #F8FAFC;

  /* Bordes & Separadores */
  --border-subtle: rgba(15, 23, 42, 0.07);
  --border-hover: rgba(15, 23, 42, 0.16);
  --border-dark: rgba(255, 255, 255, 0.1);

  /* Conversión */
  --whatsapp: #25D366;
  --whatsapp-hover: #1EBE5D;
  --whatsapp-glow: rgba(37, 211, 102, 0.22);
}
```

---

## 2. Jerarquía Tipográfica Editorial

* **Tipografía Primaria:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`.
* **Titulares (`title-xl`):** `clamp(2.5rem, 5vw, 4rem)`, `font-weight: 800`, `letter-spacing: -0.035em`, `line-height: 1.08`.
* **Subtítulos (`subtitle`):** `clamp(1.05rem, 1.5vw, 1.2rem)`, `font-weight: 400`, `line-height: 1.7`, `color: var(--text-secondary)`.
* **Etiquetas & Badges:** `font-size: 0.72rem`, `font-weight: 700`, `letter-spacing: 0.08em`, `text-transform: uppercase`.

---

## 3. Sistema de Espaciado y Respiración Visual

* **Secciones Principales:** `padding: 5rem 0 6rem 0;` (Evitar amontonamiento).
* **Grid de Productos / Social:** `gap: 2.5rem;` con columnas mínimas de `340px`.
* **Contenedor Máximo:** `max-width: 1200px; padding: 0 2rem;`.

---

## 4. Física de Movimiento & Micro-Interacciones

* **Curva de Aceleración Principal:** `cubic-bezier(0.16, 1, 0.3, 1)` (Movimiento tipo resorte natural).
* **Hover de Tarjetas:** `transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08);`.
* **Zoom de Imagen:** `transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);` -> `transform: scale(1.035);`.
* **Botones:** Transición táctil rápida `0.18s` con micro-elevación de `2px`.

---

## 5. Reglas de Composición (Anti-IA Genérica)

1. **Cero saturación de badges:** Máximo 1 badge por tarjeta.
2. **Fotografía dominante:** Las fotos deben ocupar el 60-70% del peso visual de cada tarjeta.
3. **Copy conciso y directo:** Sin frases cliché ni explicaciones redundantes.
4. **Enlaces directos:** Cada elemento que mencione Instagram o producto debe llevar exactamente al recurso original.
