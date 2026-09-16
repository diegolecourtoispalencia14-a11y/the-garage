#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador Maestro del PDF del Plan de Marketing de The Garage Bike Experts
Con diseño editorial de alta gama, carruseles completos, hipervínculos activos,
vitrina de Google Flow (Veo 3 Pro) y cero menciones de promociones no autorizadas.
"""

import os
import subprocess

BASE_DIR = "/Users/dlpo.c./Developer/the-garage"
CAMP_DIR = f"{BASE_DIR}/campana-lanzamiento"
ASSETS_DIR = f"{CAMP_DIR}/assets"
OUTPUT_HTML = f"{CAMP_DIR}/PLAN_MARKETING_THE_GARAGE.html"
OUTPUT_PDF = f"{CAMP_DIR}/PLAN_MARKETING_THE_GARAGE.pdf"
BRAIN_PDF = "/Users/dlpo.c./.gemini/antigravity/brain/5e4a061c-5db7-4d97-85ac-f128dcd041cf/PLAN_MARKETING_THE_GARAGE.pdf"

# Rutas locales
LOGO_SVG = f"file://{BASE_DIR}/public/img/the-garage-logo-hires-white.png"
VIDEO_MP4 = f"file://{ASSETS_DIR}/dia6_sabado_lanzamiento/video_teaser_19_septiembre.mp4"

# Flow generations
FLOW_01 = f"file://{ASSETS_DIR}/flow_generaciones/flow_plano01_taller.jpeg"
FLOW_02 = f"file://{ASSETS_DIR}/flow_generaciones/flow_plano02_mecanico.jpeg"
FLOW_03 = f"file://{ASSETS_DIR}/flow_generaciones/flow_plano03_rueda.jpeg"
FLOW_04 = f"file://{ASSETS_DIR}/flow_generaciones/flow_plano04_caribe.jpeg"
FLOW_05 = f"file://{ASSETS_DIR}/flow_generaciones/flow_plano05_reflejo.jpeg"

# Dia 1
D1_S1 = f"file://{ASSETS_DIR}/dia1_lunes/carrusel_slide1_portada.png"
D1_S2 = f"file://{ASSETS_DIR}/dia1_lunes/carrusel_slide2_baleros.png"
D1_S3 = f"file://{ASSETS_DIR}/dia1_lunes/carrusel_slide3_tornillos.png"
D1_S4 = f"file://{ASSETS_DIR}/dia1_lunes/carrusel_slide4_transmision.png"
D1_S5 = f"file://{ASSETS_DIR}/dia1_lunes/carrusel_slide5_solucion.png"
D1_STORY = f"file://{ASSETS_DIR}/dia1_lunes/story_encuesta_taller.png"
D1_COPY = f"file://{ASSETS_DIR}/dia1_lunes/copy_y_publicacion.txt"

# Dia 2
D2_S1 = f"file://{ASSETS_DIR}/dia2_martes/carrusel_slide1_portada.png"
D2_S2 = f"file://{ASSETS_DIR}/dia2_martes/carrusel_slide2_consecuencias.png"
D2_S3 = f"file://{ASSETS_DIR}/dia2_martes/carrusel_slide3_calculadora.png"
D2_S4 = f"file://{ASSETS_DIR}/dia2_martes/carrusel_slide4_resultado.png"
D2_STORY = f"file://{ASSETS_DIR}/dia2_martes/story_calculadora.png"
D2_COPY = f"file://{ASSETS_DIR}/dia2_martes/copy_y_publicacion.txt"

# Dia 3
D3_FEED = f"file://{ASSETS_DIR}/dia3_miercoles/feed_post_basso.png"
D3_STORY = f"file://{ASSETS_DIR}/dia3_miercoles/story_basso.png"
D3_COPY = f"file://{ASSETS_DIR}/dia3_miercoles/copy_y_publicacion.txt"

# Dia 4
D4_S1 = f"file://{ASSETS_DIR}/dia4_jueves/carrusel_slide1_portada.png"
D4_S2 = f"file://{ASSETS_DIR}/dia4_jueves/carrusel_slide2_flota.png"
D4_S3 = f"file://{ASSETS_DIR}/dia4_jueves/carrusel_slide3_entrega.png"
D4_S4 = f"file://{ASSETS_DIR}/dia4_jueves/carrusel_slide4_reserva.png"
D4_STORY = f"file://{ASSETS_DIR}/dia4_jueves/story_rentas.png"
D4_COPY = f"file://{ASSETS_DIR}/dia4_jueves/copy_y_publicacion.txt"

# Dia 5
D5_FEED = f"file://{ASSETS_DIR}/dia5_viernes/feed_post_comunidad.png"
D5_STORY = f"file://{ASSETS_DIR}/dia5_viernes/story_cuenta_regresiva.png"
D5_COPY = f"file://{ASSETS_DIR}/dia5_viernes/copy_y_publicacion.txt"

# Dia 6
D6_FEED = f"file://{ASSETS_DIR}/dia6_sabado_lanzamiento/feed_post_lanzamiento.png"
D6_POSTER = f"file://{ASSETS_DIR}/dia6_sabado_lanzamiento/logo_oficial_aniversario_9_16.png"
D6_STORY = f"file://{ASSETS_DIR}/dia6_sabado_lanzamiento/story_lanzamiento.png"
D6_COPY = f"file://{ASSETS_DIR}/dia6_sabado_lanzamiento/copy_y_publicacion.txt"

# Dia 7
D7_S1 = f"file://{ASSETS_DIR}/dia7_domingo/carrusel_slide1_portada.png"
D7_S2 = f"file://{ASSETS_DIR}/dia7_domingo/carrusel_slide2_basso.png"
D7_S3 = f"file://{ASSETS_DIR}/dia7_domingo/carrusel_slide3_trek.png"
D7_S4 = f"file://{ASSETS_DIR}/dia7_domingo/carrusel_slide4_specialized.png"
D7_STORY = f"file://{ASSETS_DIR}/dia7_domingo/story_social_proof.png"
D7_COPY = f"file://{ASSETS_DIR}/dia7_domingo/copy_y_publicacion.txt"

# Enlaces Web
URL_WEB = "https://the-garage-dw4.pages.dev"
URL_TALLAS = "https://the-garage-dw4.pages.dev/guia-tallas"
URL_INVENTARIO = "https://the-garage-dw4.pages.dev/inventario"
URL_RENTA = "https://the-garage-dw4.pages.dev/renta"
URL_INSTAGRAM = "https://www.instagram.com/thegarage.pdc/"
URL_WHATSAPP = "https://wa.me/529841381493"
URL_FLOW = "https://flow.google.com/project/922d0a4c-7140-4ee7-8573-87f0ac2152ca/edit/713a8856-0351-4da5-b9f1-2d1feb192b08"

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Plan de Marketing · Lanzamiento Web + Aniversario · The Garage</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  body {{
    margin: 0;
    padding: 0;
    background-color: #0d0f12;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
  }}
  .page {{
    width: 210mm;
    height: 297mm;
    padding: 16mm 16mm 12mm 16mm;
    page-break-after: always;
    break-after: page;
    position: relative;
    background: #0d0f12;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}
  
  /* Header & Footer */
  .page-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }}
  .page-header .brand {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .page-header .brand img {{
    height: 22px;
    width: auto;
  }}
  .page-header .badge-date {{
    background: #e11d48;
    color: #ffffff;
    font-size: 8.5pt;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 9999px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }}
  .page-footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 8px;
    font-size: 8pt;
    color: #64748b;
  }}
  .page-footer a {{
    color: #94a3b8;
    text-decoration: none;
  }}
  
  /* Typography */
  h1 {{
    font-size: 20pt;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin: 0 0 6px 0;
    color: #ffffff;
    line-height: 1.15;
  }}
  h2 {{
    font-size: 13pt;
    font-weight: 800;
    margin: 0 0 6px 0;
    color: #f1f5f9;
  }}
  h3 {{
    font-size: 10.5pt;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}
  p {{
    margin: 0 0 8px 0;
    color: #94a3b8;
    font-size: 9.5pt;
  }}
  
  /* Cards & Layout */
  .card {{
    background: #15181e;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 12px;
  }}
  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }}
  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }}
  .grid-4 {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }}
  .grid-5 {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }}
  
  /* Buttons & Hyperlinks */
  .btn {{
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(225, 29, 72, 0.15);
    color: #fda4af;
    border: 1px solid rgba(225, 29, 72, 0.35);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 8.5pt;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s ease;
  }}
  .btn-primary {{
    background: #e11d48;
    color: #ffffff;
    border: none;
  }}
  .btn-gold {{
    background: rgba(245, 158, 11, 0.15);
    color: #fcd34d;
    border: 1px solid rgba(245, 158, 11, 0.35);
  }}
  .btn-subtle {{
    background: rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }}
  
  /* Slide & Creative Thumbnails */
  .thumb-box {{
    background: #090a0d;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-align: center;
  }}
  .thumb-box img {{
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }}
  .thumb-box .caption {{
    padding: 5px 4px;
    font-size: 7.5pt;
    font-weight: 700;
    color: #cbd5e1;
    background: #11141a;
  }}
  .thumb-box a {{
    text-decoration: none;
  }}
  
  /* Copy Block */
  .copy-box {{
    background: #0a0c0f;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 8pt;
    color: #cbd5e1;
    white-space: pre-wrap;
    line-height: 1.35;
    max-height: 195px;
    overflow: hidden;
  }}
  
  /* Table styling */
  table.calendar-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    text-align: left;
  }}
  table.calendar-table th {{
    background: #1b1f28;
    color: #f8fafc;
    padding: 8px 6px;
    font-weight: 800;
    border-bottom: 2px solid #e11d48;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.03em;
  }}
  table.calendar-table td {{
    padding: 7px 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: #94a3b8;
  }}
  table.calendar-table tr.highlight {{
    background: rgba(225, 29, 72, 0.12);
  }}
  table.calendar-table tr.highlight td {{
    color: #ffffff;
    font-weight: 700;
  }}
</style>
</head>
<body>

<!-- ========================================================================== -->
<!-- PÁGINA 1: PORTADA EJECUTIVA & IDENTIDAD DE MARCA -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">LANZAMIENTO OFICIAL · SÁBADO 19 DE SEPTIEMBRE</div>
  </div>
  
  <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px;">
    <div style="border-left: 4px solid #e11d48; padding-left: 14px;">
      <p style="text-transform: uppercase; letter-spacing: 0.12em; color: #e11d48; font-weight: 800; font-size: 9pt; margin-bottom: 4px;">
        ESTRATEGIA INTEGRAL DE MARKETING & CREATIVOS DIGITALES
      </p>
      <h1 style="font-size: 26pt; line-height: 1.1; margin-bottom: 8px;">
        Lanzamiento Web Oficial<br>+ 2º Aniversario
      </h1>
      <p style="font-size: 11pt; color: #94a3b8; margin: 0;">
        Campaña de alto impacto para <strong>The Garage Bike Experts</strong> (Playa del Carmen, Quintana Roo).<br>
        7 días de secuencia estratégica: Lunes 14 al Domingo 20 de Septiembre.
      </p>
    </div>

    <!-- Quick Links Bar -->
    <div class="card" style="background: #11141a; border-color: rgba(225, 29, 72, 0.3);">
      <h3 style="color: #fda4af; margin-bottom: 8px;">⚡️ Accesos Directos & Enlaces Oficiales:</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <a class="btn btn-primary" href="{URL_WEB}" target="_blank">🌐 Web Oficial en Vivo</a>
        <a class="btn" href="{URL_TALLAS}" target="_blank">📏 Calculadora Biomecánica</a>
        <a class="btn" href="{URL_INVENTARIO}" target="_blank">🚲 Catálogo de Bicicletas</a>
        <a class="btn" href="{URL_RENTA}" target="_blank">🌴 Flota de Rentas</a>
        <a class="btn btn-gold" href="{URL_WHATSAPP}" target="_blank">📲 WhatsApp Concierge</a>
        <a class="btn btn-subtle" href="{URL_INSTAGRAM}" target="_blank">📸 Instagram @thegarage.pdc</a>
        <a class="btn btn-primary" href="{VIDEO_MP4}">▶ Video Teaser HD (.mp4)</a>
      </div>
    </div>

    <!-- 4 Strategic Pillars -->
    <div class="grid-2">
      <div class="card">
        <h3 style="color: #e11d48;">1. Curva de Anticipación (Brunson / Jobs)</h3>
        <p>No se anuncia una web en frío. Se genera una escalada de dolor local (salitre), se revela la herramienta de valor (calculadora de tallas), la exclusividad (Basso) y la comunidad (The Garage Ride), detonando el pico el <strong>Sábado 19 de Septiembre</strong>.</p>
      </div>
      <div class="card">
        <h3 style="color: #e11d48;">2. Cero Descuentos / 100% Rigor Técnico</h3>
        <p>La marca se posiciona en el pináculo de la mecánica de precisión: SRAM AXS, Shimano Di2, torquímetros certificados y fibra de carbono Torayca T700/T800. Cero rebajas que devalúen el prestigio del taller.</p>
      </div>
      <div class="card">
        <h3 style="color: #38bdf8;">3. Cinemática Google Flow (Veo 3 Pro)</h3>
        <p>Incorporación de 5 planos de video fotorrealistas generados con IA que capturan la atmósfera del taller de precisión y las carreteras caribeñas, compuestos con el logotipo vectorizado exacto.</p>
      </div>
      <div class="card">
        <h3 style="color: #38bdf8;">4. Automatización Meta Business Suite</h3>
        <p>Todo el contenido está diseñado, redactado y organizado para programarse en lote en 15 minutos: carruseles completos con todas sus diapositivas, stories y copies con un solo clic.</p>
      </div>
    </div>

    <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <span style="font-weight: 800; color: #fff; font-size: 9.5pt;">📁 Carpeta de Activos en tu Mac:</span><br>
        <span style="font-size: 8pt; color: #94a3b8; font-family: monospace;">/Users/dlpo.c./Developer/the-garage/campana-lanzamiento/</span>
      </div>
      <a class="btn btn-subtle" href="file://{CAMP_DIR}">↗ Abrir Carpeta</a>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 1 de 11 · Portada & Identidad</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 2: VITRINA GOOGLE FLOW (VEO 3 PRO) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">PRODUCCIÓN AUDIOVISUAL VEO 3 PRO</div>
  </div>

  <div>
    <h2>🎬 Integración Cinemática Google Flow (Veo 3)</h2>
    <p style="margin-bottom: 12px;">
      Para la campaña se generaron 30 tomas fotorrealistas en Google Flow ejecutadas mediante prompts de óptica anamórfica de 35mm y 85mm. Las mejores capturas fueron integradas en los creativos de la semana y en el <strong>Video Teaser Oficial del 19 de Septiembre</strong>:
    </p>

    <!-- Grid of 5 Flow Shots -->
    <div class="grid-3" style="margin-bottom: 12px;">
      <div class="thumb-box">
        <a href="{FLOW_01}"><img src="{FLOW_01}" alt="Plano 01"></a>
        <div class="caption">Plano 01: Taller & Desarme Quirúrgico<br><span style="color: #94a3b8; font-size: 6.5pt;">Uso: Carrusel Día 1 & Teaser</span></div>
      </div>
      <div class="thumb-box">
        <a href="{FLOW_02}"><img src="{FLOW_02}" alt="Plano 02"></a>
        <div class="caption">Plano 02: Mecánico & Torquímetro Digital<br><span style="color: #94a3b8; font-size: 6.5pt;">Uso: Carrusel Día 2 & Teaser</span></div>
      </div>
      <div class="thumb-box">
        <a href="{FLOW_03}"><img src="{FLOW_03}" alt="Plano 03"></a>
        <div class="caption">Plano 03: Rueda de Carbono Basso & AXS<br><span style="color: #94a3b8; font-size: 6.5pt;">Uso: Post Día 3 & Teaser</span></div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom: 12px;">
      <div class="thumb-box">
        <a href="{FLOW_04}"><img src="{FLOW_04}" alt="Plano 04" style="height: 120px;"></a>
        <div class="caption">Plano 04: Ciclista en Carretera Costera del Caribe · <span style="color: #94a3b8; font-size: 6.5pt;">Uso: Carrusel Rentas Día 4 & Teaser</span></div>
      </div>
      <div class="thumb-box">
        <a href="{FLOW_05}"><img src="{FLOW_05}" alt="Plano 05" style="height: 120px;"></a>
        <div class="caption">Plano 05: Pelotón The Garage Ride al Amanecer · <span style="color: #94a3b8; font-size: 6.5pt;">Uso: Post Comunidad Día 5 & Teaser</span></div>
      </div>
    </div>

    <!-- Methodology Card -->
    <div class="card" style="background: #101318;">
      <h3 style="color: #e11d48; margin-bottom: 4px;">🎯 ¿Cómo se resolvió la composición de marca?</h3>
      <p style="font-size: 8.5pt; margin-bottom: 6px;">
        Los modelos de video generativo (Veo 3) no pueden dibujar logos con precisión. La solución técnica fue extraer los fotogramas clave en máxima resolución y componer encima el <strong>logotipo oficial vectorizado exacto</strong> junto con la fecha de lanzamiento (<strong>19 DE SEPTIEMBRE</strong>) mediante scripts nativos en Swift y CoreGraphics, logrando un acabado comercial perfecto.
      </p>
      <div style="display: flex; gap: 8px;">
        <a class="btn btn-subtle" href="{URL_FLOW}" target="_blank">↗ Abrir Proyecto en Google Flow</a>
        <a class="btn btn-primary" href="{VIDEO_MP4}">▶ Ver Teaser Renderizado (.mp4)</a>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 2 de 11 · Vitrina Google Flow</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 3: CALENDARIO MAESTRO (7 DÍAS) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">CALENDARIO META BUSINESS SUITE</div>
  </div>

  <div>
    <h2>🗓️ Cronograma General de Publicaciones</h2>
    <p style="margin-bottom: 10px;">
      Estructura de 7 días configurada para programación directa en Meta Business Suite. Todos los horarios corresponden a la hora local de Playa del Carmen (UTC-5):
    </p>

    <table class="calendar-table">
      <thead>
        <tr>
          <th>Día / Fecha</th>
          <th>Hora (PDC)</th>
          <th>Canal / Formato</th>
          <th>Archivos en Carpeta</th>
          <th>Objetivo de Conversión</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Lunes 14</strong></td>
          <td>07:30 AM</td>
          <td>Feed / Carrusel</td>
          <td><a href="{D1_S1}" style="color: #cbd5e1; text-decoration: none;">5 Slides Salitre (HD)</a></td>
          <td>Concientización del salitre en baleros y Di2/AXS</td>
        </tr>
        <tr>
          <td>Lunes 14</td>
          <td>11:30 AM</td>
          <td>Stories</td>
          <td><a href="{D1_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Encuesta Torquímetro</a></td>
          <td>Cualificar audiencia sobre ajuste con torquímetro</td>
        </tr>
        <tr>
          <td><strong>Martes 15</strong></td>
          <td>01:15 PM</td>
          <td>Feed / Carrusel</td>
          <td><a href="{D2_S1}" style="color: #cbd5e1; text-decoration: none;">4 Slides Calculadora Tallas</a></td>
          <td>Curiosidad e interacción con la calculadora web</td>
        </tr>
        <tr>
          <td>Martes 15</td>
          <td>04:30 PM</td>
          <td>Stories</td>
          <td><a href="{D2_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Link Slider</a></td>
          <td>Tráfico directo a <code>/guia-tallas</code></td>
        </tr>
        <tr>
          <td><strong>Miércoles 16</strong></td>
          <td>07:45 PM</td>
          <td>Feed Post</td>
          <td><a href="{D3_FEED}" style="color: #cbd5e1; text-decoration: none;">Basso Bikes Italia (HD)</a></td>
          <td>Posicionamiento de distribución oficial de alta gama</td>
        </tr>
        <tr>
          <td>Miércoles 16</td>
          <td>12:30 PM</td>
          <td>Stories</td>
          <td><a href="{D3_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Ruta vs Gravel</a></td>
          <td>Pre-cualificación de compra para Basso Palta 2</td>
        </tr>
        <tr>
          <td><strong>Jueves 17</strong></td>
          <td>01:30 PM</td>
          <td>Feed / Carrusel</td>
          <td><a href="{D4_S1}" style="color: #cbd5e1; text-decoration: none;">4 Slides Flota de Rentas</a></td>
          <td>Captar turistas, expats y triatletas en Riviera Maya</td>
        </tr>
        <tr>
          <td>Jueves 17</td>
          <td>06:30 PM</td>
          <td>Stories</td>
          <td><a href="{D4_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Enlace WhatsApp</a></td>
          <td>Generar cotizaciones directas de renta concierge</td>
        </tr>
        <tr>
          <td><strong>Viernes 18</strong></td>
          <td>06:00 PM</td>
          <td>Feed Post</td>
          <td><a href="{D5_FEED}" style="color: #cbd5e1; text-decoration: none;">Convocatoria Rodada Sábado</a></td>
          <td>Anuncio cambio de rodada al sábado para máxima asistencia</td>
        </tr>
        <tr>
          <td>Viernes 18</td>
          <td>08:00 PM</td>
          <td>Stories</td>
          <td><a href="{D5_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Cuenta Regresiva Sábado</a></td>
          <td>Recordatorio: Rodada 06:30 AM & Estreno Web 09:00 AM</td>
        </tr>
        <tr class="highlight">
          <td><strong>SÁBADO 19</strong></td>
          <td>06:30 AM</td>
          <td><strong>GRAN RODADA</strong></td>
          <td><span style="color: #fde047; font-weight: 700;">Pelotón 2º Aniversario</span></td>
          <td><strong>Gran Rodada Comunitaria (Salida taller, barredora, café)</strong></td>
        </tr>
        <tr class="highlight">
          <td><strong>Sábado 19</strong></td>
          <td>09:00 AM</td>
          <td><strong>REEL TEASER</strong></td>
          <td><a href="{VIDEO_MP4}" style="color: #fff; text-decoration: underline;">video_teaser_19_septiembre.mp4</a></td>
          <td><strong>EL GRAN ESTRENO: Video oficial y apertura de web</strong></td>
        </tr>
        <tr class="highlight">
          <td>Sábado 19</td>
          <td>10:00 AM</td>
          <td>Stories</td>
          <td><a href="{D6_STORY}" style="color: #fff; text-decoration: underline;">Story Link Web Oficial</a></td>
          <td>Tráfico masivo a <code>the-garage-dw4.pages.dev</code></td>
        </tr>
        <tr class="highlight">
          <td>Sábado 19</td>
          <td>12:30 PM</td>
          <td>Feed Post</td>
          <td><a href="{D6_FEED}" style="color: #fff; text-decoration: underline;">Comunicado 2º Aniversario</a></td>
          <td>Celebración comunitaria e invitación al catálogo en vivo</td>
        </tr>
        <tr>
          <td><strong>Domingo 20</strong></td>
          <td>11:30 AM</td>
          <td>Feed / Carrusel</td>
          <td><a href="{D7_S1}" style="color: #cbd5e1; text-decoration: none;">4 Slides Las Más Cotizadas</a></td>
          <td>Prueba social de inventario real (Basso, Trek, Spec)</td>
        </tr>
        <tr>
          <td>Domingo 20</td>
          <td>05:00 PM</td>
          <td>Stories</td>
          <td><a href="{D7_STORY}" style="color: #cbd5e1; text-decoration: none;">Story Agenda Taller Abierta</a></td>
          <td>Llenar la capacidad operativa del taller para la semana</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 12px; display: flex; gap: 8px;">
      <a class="btn btn-primary" href="file://{CAMP_DIR}/CALENDARIO_META_BUSINESS_SUITE.csv">📊 Descargar Tabla en CSV</a>
      <a class="btn btn-subtle" href="file://{CAMP_DIR}/CALENDARIO_MAESTRO_META_SUITE.md">📄 Ver Guía Markdown</a>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 3 de 11 · Cronograma General</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 4: DÍA 1 (LUNES 14) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 1 · LUNES 14 DE SEPTIEMBRE · 07:30 AM</div>
  </div>

  <div>
    <h2>🌊 Carrusel: 5 Peligros del Salitre Caribeño</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: Concientización & Cirugía de Taller.</strong> Carrusel secuencial educativo de 5 diapositivas diseñado para retener lectura y posicionar el taller técnico antes del estreno del 19 de septiembre:
    </p>

    <!-- Carousel 5 slides grid -->
    <div class="grid-5" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D1_S1}"><img src="{D1_S1}" alt="Slide 1"></a>
        <div class="caption">Slide 1: Portada (Veo 3)</div>
      </div>
      <div class="thumb-box">
        <a href="{D1_S2}"><img src="{D1_S2}" alt="Slide 2"></a>
        <div class="caption">Slide 2: Baleros & Masas</div>
      </div>
      <div class="thumb-box">
        <a href="{D1_S3}"><img src="{D1_S3}" alt="Slide 3"></a>
        <div class="caption">Slide 3: Tornillos Titanio</div>
      </div>
      <div class="thumb-box">
        <a href="{D1_S4}"><img src="{D1_S4}" alt="Slide 4"></a>
        <div class="caption">Slide 4: AXS & Di2</div>
      </div>
      <div class="thumb-box">
        <a href="{D1_S5}"><img src="{D1_S5}" alt="Slide 5"></a>
        <div class="caption">Slide 5: Solución 19 Sept</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Story preview -->
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 80px; flex-shrink: 0;" class="thumb-box">
          <a href="{D1_STORY}"><img src="{D1_STORY}" alt="Story Dia 1"></a>
        </div>
        <div>
          <h3 style="color: #fda4af;">Story Interactiva (11:30 AM)</h3>
          <p style="font-size: 8pt; margin-bottom: 6px;">
            Encuesta de Instagram: "¿Cuándo revisaron el torque de tu tija por última vez?"<br>
            A: Con torquímetro · B: A ojo / tanteo
          </p>
          <a class="btn btn-subtle" href="{D1_STORY}">↗ Ver Story HD</a>
        </div>
      </div>

      <!-- Actions -->
      <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: 6px;">
        <h3 style="color: #e11d48;">Archivos Listos para Meta Suite</h3>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia1_lunes/">📁 Abrir Carpeta Día 1</a>
          <a class="btn btn-subtle" href="{D1_COPY}">📄 Abrir Copy TXT</a>
        </div>
        <p style="font-size: 7.5pt; margin: 0; color: #64748b;">Subir los 5 slides en orden de 1 a 5 y pegar el caption.</p>
      </div>
    </div>

    <div style="margin-top: 10px;">
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">El salitre de Playa del Carmen no perdona. Desliza para ver lo que le hace a tu bici en silencio. 🌊🚲👉

En la Riviera Maya, la humedad relativa supera el 85% casi todo el año. Cuando ruedas cerca de la costa, la combinación de vapor de agua y sales microscópicas desencadena corrosión galvánica y microabrasión que no se quitan lavando la bici con manguera.

En este carrusel te mostramos los 3 puntos críticos que inspeccionamos en nuestro protocolo de taller:
1️⃣ Baleros de centro y masas expuestos a cristales salinos.
2️⃣ Tornillería de titanio y aluminio fusionada a cuadros de carbono por falta de grasa antisize marina.
3️⃣ Terminales y componentes electrónicos de transmisiones SRAM AXS y Shimano Di2 descalibrados por sulfatación.

En The Garage aplicamos cirugía mecánica de precisión: mantenimiento especializado a puerta cerrada con cita previa, torquímetros certificados a especificación de fábrica y protección hidrofóbica marina.

⚡️ Este SÁBADO 19 DE SEPTIEMBRE celebramos nuestro 2º ANIVERSARIO con el estreno de nuestra nueva plataforma digital oficial. Podrás agendar tu servicio y monitorear el estado de tu bici en segundos. Activa notificaciones.

¿Cuándo fue la última vez que revisaron a fondo la tornillería y baleros de tu bicicleta? Cuéntanos en los comentarios. 👇

#TheGaragePDC #PlayaDelCarmen #CiclistasRivieraMaya #MecanicaCiclista #SRAMAXS #ShimanoDi2 #BassoBikes #TallerCiclista #19DeSeptiembre #SegundoAniversario</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 4 de 11 · Día 1: Salitre</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 5: DÍA 2 (MARTES 15) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 2 · MARTES 15 DE SEPTIEMBRE · 01:15 PM</div>
  </div>

  <div>
    <h2>📏 Carrusel: ¿M o L? Calculadora Biomecánica</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: La Herramienta Secreta & Prevención de Lesiones.</strong> Carrusel de 4 diapositivas para incentivar a la comunidad ciclista a probar la herramienta interactiva de tallas en la web:
    </p>

    <!-- Carousel 4 slides grid -->
    <div class="grid-4" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D2_S1}"><img src="{D2_S1}" alt="Slide 1"></a>
        <div class="caption">Slide 1: ¿M o L? (Veo 3)</div>
      </div>
      <div class="thumb-box">
        <a href="{D2_S2}"><img src="{D2_S2}" alt="Slide 2"></a>
        <div class="caption">Slide 2: Daño Lumbar</div>
      </div>
      <div class="thumb-box">
        <a href="{D2_S3}"><img src="{D2_S3}" alt="Slide 3"></a>
        <div class="caption">Slide 3: Calculadora Web</div>
      </div>
      <div class="thumb-box">
        <a href="{D2_S4}"><img src="{D2_S4}" alt="Slide 4"></a>
        <div class="caption">Slide 4: Ajuste 19 Sept</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 80px; flex-shrink: 0;" class="thumb-box">
          <a href="{D2_STORY}"><img src="{D2_STORY}" alt="Story Dia 2"></a>
        </div>
        <div>
          <h3 style="color: #fda4af;">Story Interactiva (04:30 PM)</h3>
          <p style="font-size: 8pt; margin-bottom: 6px;">
            Sticker de pregunta: "¿Cuánto mides? Te decimos tu talla ideal en ruta o gravel". Expectativa para el sábado 19.
          </p>
          <a class="btn btn-subtle" href="{D2_STORY}">↗ Ver Story HD</a>
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: 6px;">
        <h3 style="color: #e11d48;">Archivos Listos para Meta Suite</h3>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia2_martes/">📁 Abrir Carpeta Día 2</a>
          <a class="btn btn-subtle" href="{D2_COPY}">📄 Abrir Copy TXT</a>
          <a class="btn btn-subtle" href="{URL_TALLAS}" target="_blank">🌐 Probar Calculadora</a>
        </div>
      </div>
    </div>

    <div style="margin-top: 10px;">
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">¿M o L? El 70% de los ciclistas compran la talla equivocada por fiarse únicamente de la etiqueta. 📏📐 Desliza para saber por qué 👉

Un cuadro apenas 2 centímetros más largo de lo que te corresponde provoca hiperextensión lumbar, sobrecarga constante en isquiotibiales y adormecimiento en las manos antes de llegar al kilómetro 40.
Por el contrario, un cuadro demasiado chico comprime tu caja torácica y limita tu oxigenación bajo el calor y la humedad del Caribe.

Por eso, como parte de nuestro 2º ANIVERSARIO, desarrollamos la Calculadora Biomecánica Digital:
✅ Ingresas tu estatura exacta en centímetros.
✅ Seleccionas tu modalidad: Ruta, Gravel o MTB.
✅ Obtienes en tiempo real tu rango recomendado de cuadro, potencia y ajuste de tija.

🚀 ESTRENO GENERAL DE TODA LA PLATAFORMA: SÁBADO 19 DE SEPTIEMBRE.

Comenta "TALLA" en este post y nuestro equipo técnico te enviará por mensaje privado tu recomendación de geometría personalizada antes del estreno. 👇

#TheGaragePDC #CalculadoraBiomecanica #BikeFitting #TallaBicicleta #CiclismoDeRuta #GravelMexico #MTBPlayaDelCarmen #BassoBikes #RivieraMaya #PlayaDelCarmen #TriatlonMexico #19DeSeptiembre #SegundoAniversario</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 5 de 11 · Día 2: Calculadora Biomecánica</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 6: DÍA 3 (MIÉRCOLES 16) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 3 · MIÉRCOLES 16 DE SEPTIEMBRE · 07:45 PM</div>
  </div>

  <div>
    <h2>🇮🇹 Basso Bikes Italia en el Caribe</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: Ingeniería de Élite & Exclusividad.</strong> Publicación estelar para posicionar a The Garage como distribuidor oficial exclusivo de Basso Bikes en Quintana Roo:
    </p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D3_FEED}"><img src="{D3_FEED}" alt="Post Basso" style="max-height: 220px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Feed Post: Basso Palta 2 Carbon (Frame Veo 3) · 1080×1350 px</div>
      </div>
      <div class="thumb-box">
        <a href="{D3_STORY}"><img src="{D3_STORY}" alt="Story Basso" style="max-height: 220px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Story: Elección Ruta vs Gravel · 1080×1920 px</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h3 style="color: #e11d48; margin-bottom: 2px;">Modelos Insignia Destacados</h3>
        <p style="font-size: 8pt; margin: 0;">Basso Palta 2 (Gravel de competición) · Basso Astra & Diamante (Ruta pura aerodinámica).</p>
      </div>
      <div style="display: flex; gap: 6px;">
        <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia3_miercoles/">📁 Carpeta Día 3</a>
        <a class="btn btn-subtle" href="{D3_COPY}">📄 Abrir Copy TXT</a>
      </div>
    </div>

    <div>
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">Ingeniería italiana. Pasión en el Caribe. 🇮🇹🌴

Desde Bassano del Grappa, Italia, hasta las carreteras de la Riviera Maya. En The Garage somos distribuidores oficiales de Basso Bikes.

¿Por qué Basso?
Basso continúa elaborando cada cuadro 100% a mano en Italia:
• Fibra de carbono Torayca de alto módulo (T700/T800): máxima rigidez torsional en sprints sin sacrificar absorción en pavimentos caribeños.
• Cableado 100% interno e integrado: protección total contra la humedad y el salitre de la costa.
• ADN de competición llevado al terreno de Quintana Roo: asfalto plano de alta velocidad y senderos de gravel hacia cenotes.

Modelos insignia disponibles:
🏁 Basso Palta 2 Carbon — La referencia mundial en Gravel de alto rendimiento.
🏁 Basso Astra & Diamante — Aerodinámica y ligereza absoluta para ruta y triatlón.

🚀 ESTE SÁBADO 19 DE SEPTIEMBRE, en el marco de nuestro 2º ANIVERSARIO, abrimos el catálogo digital con especificaciones completas, disponibilidad en tiempo real y cotización directa.

Escribe "BASSO" en los comentarios si quieres recibir la ficha técnica antes del estreno. 👇

#BassoBikes #HandmadeInItaly #TheGaragePDC #BassoPalta #BassoAstra #GravelCaribe #RivieraMaya #PlayaDelCarmen #CiclismoItalia #19DeSeptiembre #SegundoAniversario</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 6 de 11 · Día 3: Basso Bikes Italia</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 7: DÍA 4 (JUEVES 17) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 4 · JUEVES 17 DE SEPTIEMBRE · 01:30 PM</div>
  </div>

  <div>
    <h2>🌴 Carrusel: Renta Premium de Bicicletas</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: Captura de Turismo & Triatletas.</strong> Carrusel de 4 diapositivas enfocado en viajeros, triatletas y residentes que reciben visitas en Riviera Maya:
    </p>

    <!-- Carousel 4 slides grid -->
    <div class="grid-4" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D4_S1}"><img src="{D4_S1}" alt="Slide 1"></a>
        <div class="caption">Slide 1: Portada (Veo 3)</div>
      </div>
      <div class="thumb-box">
        <a href="{D4_S2}"><img src="{D4_S2}" alt="Slide 2"></a>
        <div class="caption">Slide 2: Flota Disponible</div>
      </div>
      <div class="thumb-box">
        <a href="{D4_S3}"><img src="{D4_S3}" alt="Slide 3"></a>
        <div class="caption">Slide 3: Concierge Hotel</div>
      </div>
      <div class="thumb-box">
        <a href="{D4_S4}"><img src="{D4_S4}" alt="Slide 4"></a>
        <div class="caption">Slide 4: Reserva 19 Sept</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 80px; flex-shrink: 0;" class="thumb-box">
          <a href="{D4_STORY}"><img src="{D4_STORY}" alt="Story Dia 4"></a>
        </div>
        <div>
          <h3 style="color: #fda4af;">Story Concierge (06:30 PM)</h3>
          <p style="font-size: 8pt; margin-bottom: 6px;">
            Sticker directo a WhatsApp para cotizar renta de bicicletas con entrega en hotel o Airbnb.
          </p>
          <a class="btn btn-subtle" href="{D4_STORY}">↗ Ver Story HD</a>
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: 6px;">
        <h3 style="color: #e11d48;">Archivos Listos para Meta Suite</h3>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia4_jueves/">📁 Abrir Carpeta Día 4</a>
          <a class="btn btn-subtle" href="{D4_COPY}">📄 Abrir Copy TXT</a>
          <a class="btn btn-subtle" href="{URL_RENTA}" target="_blank">🌐 Ver Módulo de Renta</a>
        </div>
      </div>
    </div>

    <div style="margin-top: 10px;">
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">¿Vienes a Playa del Carmen o recibes visitas que quieren rodar en el paraíso? No empaques tu bicicleta. La tenemos lista para ti. 🚲☀️ Desliza para conocer la flota 👉

Viajar con maleta rígida en avión cuesta entre $150 y $300 USD por trayecto, sin contar el riesgo de daños en el cuadro.

En The Garage contamos con la flota más completa de Renta Premium en la Riviera Maya:
✅ Modalidades de Ruta, Gravel, MTB y Paseo Urbano.
✅ Calibradas y desinfectadas al milímetro por mecánicos certificados.
✅ Transmisiones lubricadas especialmente con polímeros marinos contra el salitre costero.
✅ Servicio Concierge: coordinamos la entrega y recogida directamente en la recepción de tu Hotel o Airbnb en Playa del Carmen y Playacar.
✅ Incluye casco higienizado de alta protección y candado de seguridad.

🚀 ESTE SÁBADO 19 DE SEPTIEMBRE, en nuestro 2º ANIVERSARIO, estrenamos el cotizador y sistema de reserva digital. Si necesitas una bicicleta para este fin de semana, envíanos un DM o escríbenos directamente a nuestro WhatsApp Concierge.

¿Conoces a alguien que viaje pronto al Caribe Mexicano? Etiquétalo en los comentarios. 👇

#BikeRentalPlayaDelCarmen #RentaDeBicicletas #PlayaDelCarmen #TulumBike #RivieraMayaRentals #Playacar #TheGaragePDC #19DeSeptiembre #SegundoAniversario</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 7 de 11 · Día 4: Rentas Premium</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 8: DÍA 5 (VIERNES 18) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 5 · VIERNES 18 DE SEPTIEMBRE · 06:00 PM</div>
  </div>

  <div>
    <h2>🚴‍♂️ Gran Convocatoria: La Rodada se Mueve al Sábado</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: Convocatoria Comunitaria & Víspera del Gran Día.</strong> Por motivo del 2º Aniversario y para que toda la comunidad pueda sumarse sin prisas de trabajo, la rodada oficial se celebra mañana SÁBADO 19 (06:30 AM), culminando con el estreno web (09:00 AM):
    </p>

    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D5_FEED}"><img src="{D5_FEED}" alt="Post Convocatoria" style="max-height: 220px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Feed Post: Convocatoria Rodada Sábado 19 · 1080×1350 px</div>
      </div>
      <div class="thumb-box">
        <a href="{D5_STORY}"><img src="{D5_STORY}" alt="Story Cuenta Regresiva" style="max-height: 220px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Story: Cuenta Regresiva Rodada 6:30 AM & Web 9:00 AM · 1080×1920 px</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h3 style="color: #e11d48; margin-bottom: 2px;">Sticker de Cuenta Regresiva de Instagram</h3>
        <p style="font-size: 8pt; margin: 0;">Configurado para el Sábado 19: 06:30 AM (Gran Rodada) y 09:00 AM (Estreno Web Oficial). Permite a los seguidores activar recordatorio automático.</p>
      </div>
      <div style="display: flex; gap: 6px;">
        <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia5_viernes/">📁 Carpeta Día 5</a>
        <a class="btn btn-subtle" href="{D5_COPY}">📄 Abrir Copy TXT</a>
      </div>
    </div>

    <div>
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">¡POR NUESTRO 2º ANIVERSARIO, LA RODADA SE MUEVE AL SÁBADO! 🚴‍♂️🔥🎉

Sabemos que los viernes laborales son complicados y queremos que NADIE de la comunidad ciclista se quede fuera. Para celebrar como se debe nuestros dos años de historia en Playa del Carmen, este fin de semana rodamos juntos mañana SÁBADO 19 DE SEPTIEMBRE.

Queremos ver al pelotón completo: ruta, gravel y MTB, pedaleando hombro a hombro por las carreteras y paisajes del Caribe.

📋 LOGÍSTICA DE LA GRAN RODADA DE ANIVERSARIO:
📍 Punto de reunión y meta: Taller The Garage Bike Experts (Playa del Carmen)
⏰ Cita: 06:30 AM | Ruedas rodando puntuales: 06:45 AM
🚴‍♂️ Pelotón guiado con ritmo controlado (nivel recreativo-intermedio, rodamos en grupo, nadie se queda atrás)
🚐 Barredora oficial con soporte mecánico en ruta
💧 Puntos de hidratación oficial por Wayfar Nutrition
☕️ Café de especialidad y convivencia al regresar al taller

Y al terminar de rodar, la fiesta continúa en grande:
🏁 A las 09:00 AM en punto: Gran corte de listón y apertura oficial de nuestra NUEVA PLATAFORMA WEB en las pantallas del showroom. 🌐✨
Conocerás la Calculadora Biomecánica interactiva de tallas, catálogo de bicicletas en tiempo real, agenda digital de taller y cotizador de renta concierge.

Dos años de pasión, kilómetros compartidos y precisión mecánica. Gracias por ser el motor de The Garage.

👉 ¿Contamos contigo mañana en el pelotón? Comenta "RUEDO" o levanta la mano en los comentarios para contemplar tu kit de hidratación. 👇

#TheGaragePDC #TheGarageRide #GranRodadaAniversario #SegundoAniversario #PlayaDelCarmen #CiclistasRivieraMaya #ComunidadCiclista #RivieraMaya #CiclismoMexico #BassoBikes #WayfarNutrition #PelotonCaribe #SabadoDeRodada #19DeSeptiembre</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 8 de 11 · Día 5: Comunidad & Víspera</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 9: DÍA 6 (SÁBADO 19 - EL DÍA D) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date" style="background: #f59e0b; color: #000;">🎉 SÁBADO 19 DE SEPTIEMBRE · DÍA DEL LANZAMIENTO</div>
  </div>

  <div>
    <h2>🚀 EL GRAN LANZAMIENTO & 2º ANIVERSARIO</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: El Gran Estreno & Conversión Digital.</strong> La culminación de la campaña con el estreno del Video Teaser oficial (7.5s Fast-Cut cinemático) en Reels, el Feed Post de mediodía y stories secuenciales de tráfico:
    </p>

    <!-- 3 Creatives: Video, Feed, Story -->
    <div class="grid-3" style="margin-bottom: 10px;">
      <div class="card" style="background: #11141a; border-color: rgba(245, 158, 11, 0.4); text-align: center; padding: 10px;">
        <span style="background: #e11d48; color: #fff; font-size: 7pt; font-weight: 800; padding: 2px 6px; border-radius: 4px;">REEL 09:00 AM</span>
        <div style="margin: 8px 0;">
          <a href="{VIDEO_MP4}"><img src="{D6_POSTER}" alt="Poster Video" style="max-height: 140px; width: auto; margin: 0 auto; border-radius: 6px;"></a>
        </div>
        <a class="btn btn-primary" href="{VIDEO_MP4}" style="font-size: 8pt; width: 100%; justify-content: center;">▶ Reproducir Teaser (.mp4)</a>
      </div>

      <div class="thumb-box">
        <a href="{D6_FEED}"><img src="{D6_FEED}" alt="Post Lanzamiento" style="max-height: 160px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Feed Post (12:30 PM): Comunicado 2º Aniversario</div>
      </div>

      <div class="thumb-box">
        <a href="{D6_STORY}"><img src="{D6_STORY}" alt="Story Lanzamiento" style="max-height: 160px; width: auto; margin: 0 auto;"></a>
        <div class="caption">Story (10:00 AM): Link a Web Oficial</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.25);">
      <div>
        <h3 style="color: #fcd34d; margin-bottom: 2px;">⚡️ Plataforma Oficial Oficialmente en Vivo</h3>
        <p style="font-size: 8pt; margin: 0; color: #e2e8f0;">La nueva web ya está recibiendo visitas, consultas de tallas y citas por WhatsApp.</p>
      </div>
      <div style="display: flex; gap: 6px;">
        <a class="btn btn-primary" href="{URL_WEB}" target="_blank">🌐 Ir a la Web</a>
        <a class="btn btn-subtle" href="{D6_COPY}">📄 Abrir Copy TXT</a>
      </div>
    </div>

    <div>
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY OFICIAL DEL REEL TEASER (09:00 AM):</h3>
      <div class="copy-box">OFICIALMENTE EN VIVO. 🏁⚡️

Hoy celebramos nuestro 2º ANIVERSARIO abriendo las puertas de la nueva casa digital de The Garage Bike Experts:
🌐 the-garage-dw4.pages.dev (Enlace directo en nuestra biografía).

La experiencia ciclista que Playa del Carmen y la Riviera Maya merecen, ahora disponible en cada pantalla:
🔧 Taller de Cirugía Mecánica especializada (SRAM AXS, Shimano Di2, calibración de torque y protección marina contra salitre).
🇮🇹 Distribución oficial exclusiva de Basso Bikes Italia en Quintana Roo.
📐 Calculadora Biomecánica interactiva de tallas para encontrar tu medida exacta en segundos.
🌴 Flota de Renta Premium con entrega concierge directa en tu Hotel o Airbnb.
🚴‍♂️ Comunidad The Garage Ride, rutas y nutrición deportiva oficial.

Dos años de pasión, kilómetros y precisión mecánica. Gracias por rodar a nuestro lado.

Toca el enlace en nuestro perfil y descubre todo lo que preparamos para ti.
@thegarage.pdc // Pasión en el Caribe.

#TheGaragePDC #LanzamientoOficial #19DeSeptiembre #BassoBikes #PlayaDelCarmen #RivieraMaya #CiclismoMexico #AniversarioTheGarage #SegundoAniversario</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 9 de 11 · Día 6: Gran Lanzamiento 19 de Septiembre</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 10: DÍA 7 (DOMINGO 20) -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">DÍA 7 · DOMINGO 20 DE SEPTIEMBRE · 11:30 AM</div>
  </div>

  <div>
    <h2>🏁 Carrusel: Las 3 Bicis Más Buscadas en 24h</h2>
    <p style="margin-bottom: 8px;">
      <strong>Fase: Prueba Social & Dinamismo de Catálogo.</strong> Carrusel de 4 diapositivas para demostrar inventario en tiempo real y llenar la agenda operativa del taller:
    </p>

    <!-- Carousel 4 slides grid -->
    <div class="grid-4" style="margin-bottom: 10px;">
      <div class="thumb-box">
        <a href="{D7_S1}"><img src="{D7_S1}" alt="Slide 1"></a>
        <div class="caption">Slide 1: Las Más Cotizadas</div>
      </div>
      <div class="thumb-box">
        <a href="{D7_S2}"><img src="{D7_S2}" alt="Slide 2"></a>
        <div class="caption">Slide 2: Basso Palta 2</div>
      </div>
      <div class="thumb-box">
        <a href="{D7_S3}"><img src="{D7_S3}" alt="Slide 3"></a>
        <div class="caption">Slide 3: Trek Marlin 5</div>
      </div>
      <div class="thumb-box">
        <a href="{D7_S4}"><img src="{D7_S4}" alt="Slide 4"></a>
        <div class="caption">Slide 4: Specialized Allez</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 80px; flex-shrink: 0;" class="thumb-box">
          <a href="{D7_STORY}"><img src="{D7_STORY}" alt="Story Dia 7"></a>
        </div>
        <div>
          <h3 style="color: #fda4af;">Story Agenda Taller (05:00 PM)</h3>
          <p style="font-size: 8pt; margin-bottom: 6px;">
            Agenda abierta para mantenimientos preventivos y torque de la semana entrante.
          </p>
          <a class="btn btn-subtle" href="{D7_STORY}">↗ Ver Story HD</a>
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: 6px;">
        <h3 style="color: #e11d48;">Archivos Listos para Meta Suite</h3>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a class="btn btn-primary" href="file://{ASSETS_DIR}/dia7_domingo/">📁 Abrir Carpeta Día 7</a>
          <a class="btn btn-subtle" href="{D7_COPY}">📄 Abrir Copy TXT</a>
          <a class="btn btn-subtle" href="{URL_INVENTARIO}" target="_blank">🌐 Ver Catálogo en Vivo</a>
        </div>
      </div>
    </div>

    <div style="margin-top: 10px;">
      <h3 style="color: #94a3b8; font-size: 8pt; margin-bottom: 4px;">COPY LISTO PARA COPIAR Y PEGAR:</h3>
      <div class="copy-box">Primeras 24 horas de la nueva plataforma oficial y estas son las bicicletas más cotizadas del fin de semana de aniversario: ⚡️🔥 Desliza para verlas 👉

1️⃣ Basso Palta 2 Carbon — El bólido de gravel italiano que se robó todas las miradas.
2️⃣ Trek Marlin 5 Gen 3 — Confiabilidad insuperable para senderos de montaña y cenotes.
3️⃣ Specialized Allez E5 Sport — Agilidad, ligereza y velocidad comprobada en carretera.

En The Garage nuestro inventario se sincroniza en tiempo real en la web: the-garage-dw4.pages.dev/inventario
Cuando un modelo se aparta, se actualiza al instante para que tengas certidumbre total antes de visitarnos.

¿Buscas una configuración especial, cambio de grupo electrónico o tu talla recomendada?
📲 Conéctate con nuestro WhatsApp Concierge desde la web y te asesoramos personalmente.

¡Gracias a toda la comunidad por hacer de este lanzamiento un éxito total!

#TheGaragePDC #BassoPalta #TrekMarlin #SpecializedAllez #CiclismoDeRuta #PlayaDelCarmen #LanzamientoWeb</div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 10 de 11 · Día 7: Dinamismo de Catálogo</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

<!-- ========================================================================== -->
<!-- PÁGINA 11: PROGRAMACIÓN META SUITE & DIRECTORIO DE RECURSOS -->
<!-- ========================================================================== -->
<div class="page">
  <div class="page-header">
    <div class="brand">
      <img src="{LOGO_SVG}" alt="The Garage Logo">
    </div>
    <div class="badge-date">GUÍA DE AUTOMATIZACIÓN & DIRECTORIO</div>
  </div>

  <div>
    <h2>⚡️ Cómo Programar la Campaña en Meta Business Suite</h2>
    <p style="margin-bottom: 10px;">
      Sigue estos 5 pasos para dejar programada toda la campaña en menos de 15 minutos sin diseñar ni redactar nada:
    </p>

    <div class="grid-2" style="margin-bottom: 12px;">
      <div class="card">
        <h3 style="color: #38bdf8; margin-bottom: 4px;">Paso 1: Abrir el Planificador</h3>
        <p style="font-size: 8.5pt; margin: 0;">
          Ingresa en tu navegador a <a href="https://business.facebook.com" target="_blank" style="color: #fda4af;">business.facebook.com</a> y ve a la pestaña <strong>Planificador</strong> (<em>Planner</em>). Haz clic en el botón azul <strong>Crear</strong> y selecciona tu cuenta de <strong>Instagram (@thegarage.pdc)</strong> y <strong>Facebook</strong>.
        </p>
      </div>
      <div class="card">
        <h3 style="color: #38bdf8; margin-bottom: 4px;">Paso 2: Arrastrar Creativos</h3>
        <p style="font-size: 8.5pt; margin: 0;">
          Abre la carpeta del día (ejemplo: <code>assets/dia1_lunes/</code>). Selecciona todos los archivos de imagen del carrusel en su orden numérico (slide 1 al 5) y arrástralos directamente a la ventana de Meta Business Suite.
        </p>
      </div>
      <div class="card">
        <h3 style="color: #38bdf8; margin-bottom: 4px;">Paso 3: Copiar y Pegar Textos</h3>
        <p style="font-size: 8.5pt; margin: 0;">
          Abre <code>copy_y_publicacion.txt</code> en la carpeta del día. Copia el bloque completo del <strong>COPY / CAPTION</strong> (incluyendo emojis y hashtags) y pégalo en el campo de texto de la publicación.
        </p>
      </div>
      <div class="card">
        <h3 style="color: #38bdf8; margin-bottom: 4px;">Paso 4: Fijar Fecha y Hora</h3>
        <p style="font-size: 8.5pt; margin: 0;">
          Elige la opción <strong>Programar</strong> (<em>Schedule</em>), selecciona la fecha correspondiente y fija la hora sugerida en la tabla de la Página 3. Haz clic en <strong>Programar</strong>. ¡Listo!
        </p>
      </div>
    </div>

    <!-- Direct Directory Links -->
    <div class="card" style="background: #11141a; border-color: rgba(255, 255, 255, 0.12);">
      <h3 style="color: #f1f5f9; margin-bottom: 8px;">📂 Directorio de Archivos Locales en tu Mac</h3>
      <div class="grid-2" style="font-size: 8pt; gap: 8px;">
        <div>
          <span style="color: #94a3b8;">• Carpeta Raíz de Campaña:</span><br>
          <a href="file://{CAMP_DIR}" style="color: #fda4af; font-family: monospace;">campana-lanzamiento/</a>
        </div>
        <div>
          <span style="color: #94a3b8;">• Video Teaser HD (.mp4):</span><br>
          <a href="{VIDEO_MP4}" style="color: #fda4af; font-family: monospace;">assets/dia6/video_teaser_19_septiembre.mp4</a>
        </div>
        <div>
          <span style="color: #94a3b8;">• Tabla de Programación (CSV):</span><br>
          <a href="file://{CAMP_DIR}/CALENDARIO_META_BUSINESS_SUITE.csv" style="color: #fda4af; font-family: monospace;">CALENDARIO_META_BUSINESS_SUITE.csv</a>
        </div>
        <div>
          <span style="color: #94a3b8;">• Logotipo Master HD Transparente:</span><br>
          <a href="{LOGO_SVG}" style="color: #fda4af; font-family: monospace;">public/img/the-garage-logo-hires-white.png</a>
        </div>
        <div>
          <span style="color: #94a3b8;">• Fotogramas Google Flow:</span><br>
          <a href="file://{ASSETS_DIR}/flow_generaciones/" style="color: #fda4af; font-family: monospace;">assets/flow_generaciones/</a>
        </div>
        <div>
          <span style="color: #94a3b8;">• Manual de Campaña (MD):</span><br>
          <a href="file://{CAMP_DIR}/CALENDARIO_MAESTRO_META_SUITE.md" style="color: #fda4af; font-family: monospace;">CALENDARIO_MAESTRO_META_SUITE.md</a>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>The Garage Bike Experts · Playa del Carmen, Q. Roo</span>
    <span>Página 11 de 11 · Guía Meta Suite & Directorio</span>
    <span>19 DE SEPTIEMBRE DE 2026</span>
  </div>
</div>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print(f"HTML generado en: {OUTPUT_HTML}")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--no-pdf-header-footer",
    f"--print-to-pdf={OUTPUT_PDF}",
    OUTPUT_HTML
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Chrome exit code: {res.returncode}")
if os.path.exists(OUTPUT_PDF):
    size = os.path.getsize(OUTPUT_PDF)
    print(f"PDF generado con éxito: {OUTPUT_PDF} ({size} bytes)")
    # Copiar a artifacts
    subprocess.run(["cp", OUTPUT_PDF, BRAIN_PDF])
    print(f"PDF copiado a brain: {BRAIN_PDF}")
else:
    print(f"Error generando PDF: {res.stderr}")
