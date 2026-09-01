# 🚲 MANUAL DE USO Y ADMINISTRACIÓN — THE GARAGE
**Tienda de Bicicletas • Playa del Carmen, Quintana Roo, México**

---

## 📌 1. TUS ENLACES Y ACCESOS RÁPIDOS

| Servicio | Enlace Directo | Descripción |
| :--- | :--- | :--- |
| **Vitrina Pública (Tienda)** | `https://the-garage-dw4.pages.dev` | La página web que ven tus clientes en toda la Riviera Maya. |
| **Panel de Administración** | `https://the-garage-dw4.pages.dev/admin/` | Tu panel privado para cambiar precios, estatus y subir bicis. |
| **WhatsApp de la Tienda** | `+52 984 138 1493` (`wa.me/529841381493`) | Donde te caen todas las preguntas y apartados de los clientes. |
| **Código y Respaldo** | `github.com/diegolecourtoispalencia14-a11y/the-garage` | Dónde está respaldada toda tu tienda de forma segura. |

---

## 📱 2. CÓMO INSTALAR EL PANEL EN LA PANTALLA DE TU CELULAR (COMO UNA APP)

Para que puedas entrar en 1 segundo desde la tienda sin escribir la dirección web cada vez:

### En iPhone (Safari):
1. Abre Safari y entra a: `https://the-garage-dw4.pages.dev/admin/`
2. Toca el botón de **Compartir** (el icono de un cuadrado con una flecha hacia arriba en la parte inferior).
3. Baja y toca en **"Agregar a pantalla de inicio"** (o *"Add to Home Screen"*).
4. Escribe de nombre: **The Garage Admin** y toca en **"Agregar"**.

### En Android (Google Chrome):
1. Abre Chrome y entra a: `https://the-garage-dw4.pages.dev/admin/`
2. Toca los **tres puntos verticales `⋮`** arriba a la derecha.
3. Toca en **"Agregar a la pantalla principal"** (o *"Instalar aplicación"*).
4. Confirma y listo: tendrás el icono directo en tu pantalla junto a tus otras apps.

---

## ⏱️ 3. MARCAR UNA BICI COMO "VENDIDA" O "APARTADA" (En 30 Segundos)

Cuando un cliente llegue al local en Cataluña y compre o aparte una bicicleta:

```
[Abrir Panel] ➔ [Tocar la Bici] ➔ [Cambiar Disponibilidad] ➔ [Guardar]
```

1. Abre el panel en tu celular: `https://the-garage-dw4.pages.dev/admin/`
2. Toca en la lista sobre la bicicleta vendida (ej. *Trek Marlin 5*).
3. Baja al campo **Disponibilidad** y cámbialo a:
   - ⚪ **Vendida**: La bicicleta se queda visible en la web con una etiqueta gris y opaca (sirve como *prueba social* de que en tu tienda se vende mucho).
   - 🟡 **Apartada**: Muestra una etiqueta amarilla avisando que ya dieron anticipo por ella.
   - 🟢 **Disponible**: Si un apartado se cancela y la bici regresa a piso de venta.
4. Toca el botón azul **"Guardar" (Save)** arriba a la derecha.

> ⏱️ **Tiempo de actualización:** En menos de 40 segundos, Cloudflare actualizará la página web automáticamente en internet sin que hagas nada más.

---

## 📸 4. SUBIR UNA BICICLETA NUEVA DESDE EL CELULAR

Cuando llegue una bicicleta nueva a la tienda:

1. Entra a tu panel: `https://the-garage-dw4.pages.dev/admin/`
2. Toca el botón **"+ Nueva Bicicleta"** (o *"New Bicicletas"*).
3. Completa los datos:
   - **ID único:** Un nombre corto sin espacios ni acentos (ejemplo: `giant-talon-1-negra`).
   - **Marca:** (ej: *Giant*, *Trek*, *Specialized*, *Scott*).
   - **Modelo:** (ej: *Talon 1 2025*).
   - **Categoría:** Elige entre *MTB*, *Ruta*, *Urbana*, *Eléctrica* o *Infantil*.
   - **Precio:** Solo números en pesos mexicanos (ej: `14800`).
   - **Estado:** *Nueva* o *Seminueva*.
   - **Disponibilidad:** *Disponible*.
   - **Talla y Color:** (ej: *Talla L (19")*, *Color Negro Mate con detalles rojos*).
   - **Mensaje WhatsApp:** La frase sugerida que te llegará a tu WhatsApp cuando un cliente dé clic (ej: *Hola, me interesa la Giant Talon 1 en talla L. ¿Sigue disponible en la tienda de Playa del Carmen?*).
   - **Fotos:** Toca en *"Elegir imagen"* > *"Seleccionar de la cámara"* o de tu galería (de preferencia fotos en formato cuadrado **1:1** con buena iluminación).
4. Toca el botón azul **"Guardar / Publicar"**.

---

## 💻 5. ADMINISTRAR DESDE TU MAC (EN TU CASA O LOCAL)

Si prefieres editar el catálogo cómodamente desde tu computadora:

1. Abre la carpeta **`the-garage`** en tu Escritorio.
2. Haz **doble clic en `administrar-local.command`**.
3. Se abrirá tu navegador en `http://localhost:4321/admin/` donde podrás editar todo con el teclado y mouse.
4. Al terminar, haz **doble clic en `publicar.command`** para enviar los cambios a la nube.

---

## 🔒 6. SEGURIDAD: ¿POR QUÉ NADIE MÁS PUEDE EDITAR?

* **Acceso Exclusivo:** El panel solo le permite la entrada a tu usuario de GitHub (`diegolecourtoispalencia14-a11y`).
* Si un cliente, visitante o persona extraña intenta entrar a `/admin`, el sistema le exigirá iniciar sesión con tu cuenta. Como no tienen tu usuario ni tus permisos, **el sistema los rechaza automáticamente**.
* No hay contraseñas guardadas en servidores vulnerables ni bases de datos de terceros.

---

## ❓ 7. PREGUNTAS FRECUENTES Y SOLUCIÓN DE DUDAS

* **¿Tengo que pagar algo mensual?**  
  No. Cloudflare Pages, GitHub, Astro y Sveltia CMS son 100% gratuitos y permiten uso comercial sin costo de por vida para este tamaño de catálogo.
* **¿Cuántas bicicletas puedo tener en catálogo?**  
  El sistema está optimizado para cargar a máxima velocidad con catálogos de entre **20 y 100 bicicletas**.
* **¿Qué hago si cambio de número de WhatsApp en el futuro?**  
  En tu Mac, abres el archivo `src/components/BotonWhatsApp.astro` o me pides cambiarlo y subes con `publicar.command`.
