# Guía de Producción & Ensamblaje: Teaser "The Garage"
**Lanzamiento Web + Aniversario · 19 de Septiembre**

---

## 1. Estado de Generación en Google Flow (Veo 3 Pro)

Se ha configurado y ejecutado la generación completa de los planos cinematográficos (Capa A) directamente en tu proyecto activo de **Google Flow** en Safari (`Nano Banana Pro / Veo 3 Pro`):

| Plano | Nombre / Descripción | Variantes 9:16 (Reels/Stories) | Variantes 16:9 (Web/YT) | Estado en Flow |
| :--- | :--- | :---: | :---: | :---: |
| **01** | **"Se enciende el taller"** (Lámpara cenital parpadea, polvo, silueta cuadro) | 4 variantes | 2 variantes | ✅ Generado |
| **02** | **"Precisión"** (Macro torquímetro, tejido de carbono, 120fps) | 4 variantes | 2 variantes | ✅ Generado |
| **03** | **"La rueda"** (Rueda girando en soporte, haz rojo estroboscópico) | 4 variantes | 2 variantes | ✅ Generado |
| **04** | **"El Caribe"** (Ciclista silueta en carretera costera al amanecer) | 4 variantes | 2 variantes | ✅ Generado |
| **05** | **"El reflejo"** (Luz fría de pantalla deslizándose sobre el cuadro) | 4 variantes | 2 variantes | ✅ Generado |

> **Total generado:** **30 clips de alta definición** (20 en formato vertical 9:16 y 10 en horizontal 16:9).
> Todos los clips están en la biblioteca de tu proyecto en Google Flow listos para previsualizar y descargar (icono de tres puntos / botón Descargar en cada tarjeta).

---

## 2. Assets del Logo Listos para Plano 06 (Capa C)

Para evitar que la IA deforme la tipografía o el isotipo de la marca ("G" hexagonal), se generaron los assets de alta resolución a partir del vector SVG oficial de `/the-garage`:

1. **Formato Reels / Stories (9:16):**
   - Archivo: `thegarage_logo_9_16_black.png` (1080 × 1920 px)
   - Fondo: `#000000` negro puro. Logo blanco centrado con el acento en punto naranja/rojo.
2. **Formato Web / YouTube (16:9):**
   - Archivo: `thegarage_logo_16_9_black.png` (1920 × 1080 px)
   - Fondo: `#000000` negro puro. Logo blanco centrado.
3. **Master Transparente Ultra HD (4K):**
   - Archivo: `thegarage_logo_white_4k_transparent.png` (2160 × 560 px)
   - Canal alfa transparente para sobreimpresión y efectos de luz en edición.

*Ubicación local en tu proyecto:* `Developer/the-garage/public/img/teaser/`

---

## 3. Estructura de Edición en 3 Capas

```mermaid
timeline
    title Timeline del Teaser (24 segundos)
    00:00 - 00:03 : Plano 01 (Taller se enciende) : Drone sub-bass
    00:03 - 00:06 : Plano 02 (Torquímetro carbono) : Click mecánico + [01 // TALLER]
    00:06 - 00:09 : Plano 03 (Rueda girando) : Whoosh rotación
    00:09 - 00:10 : FLASH B (Hero Basso + Catálogo) : 4 frames ultra rápidos
    00:10 - 00:13 : Plano 04 (Caribe al amanecer) : Viento + "Ingeniería italiana. Pasión en el Caribe."
    00:13 - 00:17 : Plano 05 (Reflejo pantalla en cuadro) : Interface chime
    00:17 - 00:18 : FLASH B (Calculadora de Tallas + Rentas) : 4 frames ultra rápidos
    00:18 - 00:24 : Plano 06 (Logo Oficial + 19.09) : Golpe sub-bass + Silencio previo
```

### Capa B: Flashes del Sitio Real (`localhost:4321`)
Los 4 elementos clave que debes capturar con QuickTime (`Cmd + Shift + 5` a 60 fps) y acelerar a 4× para intercalar en cortes rápidos (4 a 6 frames cada uno):
1. **Hero principal:** *"Ingeniería italiana. Pasión en el Caribe."*
2. **Catálogo:** Scroll rápido pasando las cards de bicicletas (Basso Palta, Giant, Trek).
3. **Calculadora Biomecánica:** El slider de estatura moviéndose de 145 a 175 cm.
4. **Flota de Rentas:** *"Renta Bicicletas Calibradas por Mecánicos para el Caribe"*.

### Capa C: Textos y Tipografía
- **0:06:** `[ 01 // TALLER ]` (mono, pequeño, esquina inferior izquierda).
- **0:11:** `Ingeniería italiana.` (display, blanco centrado).
- **0:13:** `Pasión en el Caribe.` (display, blanco centrado).
- **0:17:** Logo oficial (`thegarage_logo_9_16_black.png`).
- **0:20:** `19.09 — aniversario` (mono, centrado bajo el logo).
- **0:22:** `SITIO OFICIAL // PRÓXIMAMENTE + @thegarage.pdc` (mono, pequeño inferior).

---

## 4. Diseño Sonoro

1. **Base:** Sonido drone grave continuo en negro, subiendo gradualmente de volumen.
2. **0:02:** Sonido de chispa/click eléctrico cuando enciende la lámpara.
3. **0:04:** Sonido de matraca mecánica (*ratchet click*) del torquímetro apretando el carbón.
4. **0:07:** Efecto *whoosh* metálico de rotación rápida de la rueda.
5. **0:10:** Brisa suave y rodamiento de llanta en pavimento.
6. **0:15:** Chime sutil y minimalista de interfaz digital.
7. **0:17.0 – 0:17.4:** **Silencio absoluto (0.4s)**.
8. **0:17.5:** Impacto grave cinematográfico (*sub-bass boom*) simultáneo a la aparición del logo.

---

## 5. Calendario de Entrega (14 al 19 de Septiembre)

- **Lunes 14:** Descargar y seleccionar los mejores clips de Google Flow (selecciona el 40% con mejor movimiento y grano).
- **Martes 15:** Grabar los screen recordings de `http://localhost:4321`.
- **Miércoles 16:** Montaje base del timeline en CapCut / Premiere / DaVinci Resolve.
- **Jueves 17:** Incorporación de diseño sonoro y exportación en 9:16 (1080×1920) y 16:9 (1920×1080).
- **Viernes 18:** Revisión final y programación en Meta Business Suite (@thegarage.pdc).
- **Sábado 19 (Día D):**
  - **Mañana:** Publicación del Teaser en Instagram Reels & Stories.
  - **Tarde:** Apertura oficial del sitio web.
