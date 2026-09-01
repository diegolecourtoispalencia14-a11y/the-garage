# Manual de Uso y Administración — The Garage

Guía práctica y sencilla para administrar el catálogo e inventario de tu tienda física en Playa del Carmen desde tu teléfono celular o tu Mac.

---

## 🔒 1. ¿Cómo está protegida la tienda? (Seguridad Total)

* **Solo tú tienes acceso:** El panel de administración está vinculado exclusivamente a tu cuenta de GitHub (`diegolecourtoispalencia14-a11y`).
* **Nadie más puede editar:** Si un cliente o extraño entra a `/admin`, el sistema le exigirá iniciar sesión con tu cuenta de GitHub. Al no tener tus credenciales ni permisos de dueño en el repositorio, el sistema le bloqueará el acceso automáticamente.
* **Sin bases de datos vulnerables:** No hay contraseñas guardadas en servidores externos que puedan ser hackeadas.

---

## 📱 2. Marcar una Bici como VENDIDA o APARTADA en 30 Segundos (Desde el Celular)

Cuando un cliente llegue a tu tienda en Playa del Carmen y compre o aparte una bicicleta:

1. **Abre en tu celular:**  
   👉 `https://thegarageplaya.pages.dev/admin/`  
   *(Tip: Agrégalo a la pantalla de inicio de tu iPhone o Android como si fuera una aplicación).*
2. **Inicia sesión:** Toca el botón verde **"Iniciar sesión con GitHub"** (solo la primera vez).
3. **Selecciona la bicicleta:** Toca el modelo que se acaba de vender (ej. *Trek Marlin 5*).
4. **Cambia el estatus:**  
   En el menú desplegable **Disponibilidad**, selecciona:
   - ⚪ **Vendida** *(la bici se queda visible con badge gris como prueba social)*.
   - 🟡 **Apartada** *(muestra badge amarillo avisando que tiene anticipo)*.
   - 🟢 **Disponible** *(si se libera nuevamente)*.
5. **Guarda los cambios:** Toca el botón azul **"Guardar" (Save)** arriba a la derecha.

> ⏱️ **Resultado:** En menos de 40 segundos, Cloudflare actualizará el sitio web automáticamente sin que tengas que hacer nada más.

---

## 📸 3. Subir una Bicicleta Nueva desde el Celular

1. Entra a `https://thegarageplaya.pages.dev/admin/`.
2. Toca el botón **"+ Nueva Bicicleta"**.
3. Llena los campos básicos:
   - **ID único:** Nombre corto sin espacios (ej: `trek-marlin-7-azul`).
   - **Marca y Modelo:** (ej: *Trek*, *Marlin 7*).
   - **Categoría:** Selecciona *MTB, Ruta, Urbana, Eléctrica* o *Infantil*.
   - **Precio:** Solo números en pesos mexicanos (ej: `14500`).
   - **Talla y Color:** (ej: *Talla M*, *Azul Marino*).
   - **Mensaje WhatsApp:** Escribe la frase sugerida que recibirá tu WhatsApp (ej: *Hola, me interesa la Trek Marlin 7 azul en talla M. ¿Sigue disponible?*).
   - **Fotos:** Toca en "Subir imagen" y elije la foto directo de la galería de tu cámara (de preferencia foto cuadrada 1:1 con buena luz).
4. Toca **"Guardar / Publicar"**.

---

## 💻 4. Administrar desde tu Mac (Sin Conexión / Local)

Si estás en tu computadora y quieres hacer cambios rápidos:

1. Ve a la carpeta `the-garage`.
2. Haz **doble clic en `administrar-local.command`**.
3. Se abrirá el panel en tu navegador sin pedirte contraseñas de internet y podrás editar todo visualmente.

---

## 🛠️ 5. Conexión Inicial de Cloudflare y GitHub (Paso a Paso)

Para activar el inicio de sesión desde el celular por primera vez:

### Paso A: Crear tu Llave en GitHub (1 minuto)
1. Entra en tu navegador a: https://github.com/settings/developers
2. Haz clic en **"OAuth Apps"** y luego en el botón verde **"New OAuth App"**.
3. Llena estos 4 campos:
   - **Application name:** `The Garage CMS`
   - **Homepage URL:** `https://thegarageplaya.pages.dev`
   - **Application description:** `Panel administrativo The Garage`
   - **Authorization callback URL:** `https://the-garage-oauth.workers.dev/callback`
4. Haz clic en **"Register application"**.
5. Copia el **Client ID** y genera un **Client Secret** (cópialos en un bloc de notas seguro).

### Paso B: Activar el Worker en Cloudflare (Gratis)
1. Entra a https://dash.cloudflare.com y ve a **Workers & Pages** > **Create application** > **Create Worker**.
2. Nómbralo `the-garage-oauth` y dale clic en **Deploy**.
3. Haz clic en **Edit Code** y pega el contenido del archivo `cloudflare-worker/worker.js`.
4. En **Settings** > **Variables**, agrega dos variables secretas:
   - `GITHUB_CLIENT_ID` = *(el ID que copiaste de GitHub)*
   - `GITHUB_CLIENT_SECRET` = *(el Secret que copiaste de GitHub)*
5. ¡Listo! El acceso quedará blindado exclusivamente para ti.

---

## 🔄 6. ¿Qué hacer si en el futuro deja de funcionar el acceso?

El sistema no caduca por sí solo, pero si alguna vez cambiaste la contraseña de GitHub o revocaste accesos:
1. Entra a https://github.com/settings/applications.
2. Revisa que `The Garage CMS` esté autorizada.
3. Si generas un nuevo *Client Secret*, únicamente actualízalo en las variables de tu Cloudflare Worker.
