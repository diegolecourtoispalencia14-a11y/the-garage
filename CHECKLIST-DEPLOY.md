# Checklist de Despliegue a Producción — The Garage & BiciSaaS
> **Estándar de Seguridad**: OWASP Top 10:2025  
> **Plataforma Objetivo**: Cloudflare Pages + Astro 5 Static + Edge Functions

Este documento es la lista de verificación obligatoria antes y después de publicar The Garage & BiciSaaS en el dominio oficial de producción (`thegarage.mx` o su URL asignada en Cloudflare Pages).

---

## 1. Variables de Entorno en Cloudflare Pages

Antes de ejecutar el primer build de producción en la nube, debes configurar las variables en el panel de Cloudflare:
**Cloudflare Dashboard > Workers & Pages > Tu Proyecto > Settings > Environment variables > Production**

| Variable | Tipo | Descripción | Ejemplo / Valor |
| :--- | :--- | :--- | :--- |
| `PUBLIC_SITE_URL` | Plaintext | URL canónica pública del sitio con HTTPS | `https://thegarage.mx` (o `https://the-garage-dw4.pages.dev`) |
| `MP_ACCESS_TOKEN` | **Secret** (Encriptada) | Token de acceso de producción de MercadoPago | `APP_USR-xxxx-xxxx-xxxx` |
| `GEMINI_API_KEY` | **Secret** (Encriptada) | Llave de Google AI Studio para el Asistente | `AIzaSy...` |
| `SESSION_SECRET` | **Secret** (Encriptada) | Cadena aleatoria de 64 caracteres para firma de sesiones edge | Generada con `openssl rand -hex 32` |

> [!CAUTION]
> **Nunca pegues estas llaves en archivos de código fuente**. Todas las variables deben estar marcadas como **Secret** en Cloudflare para que queden cifradas en reposo y nadie con acceso al repositorio pueda leerlas.

---

## 2. Configuración de Red, SSL/TLS y Dominio

En el panel de tu dominio en Cloudflare:

- [ ] **Modo de Encriptación SSL/TLS**: Configurado en **Completo (Estricto) / Full (Strict)**.
- [ ] **Siempre usar HTTPS (Always Use HTTPS)**: **Activado**. Toda petición HTTP insegura debe ser redirigida automáticamente a HTTPS.
- [ ] **Versión Mínima de TLS**: Seleccionar **TLS 1.2** o superior (desactivar TLS 1.0 y 1.1).
- [ ] **HTTP/2 y HTTP/3 (QUIC)**: **Activados** para máximo rendimiento y seguridad en conexiones móviles.
- [ ] **HSTS (HTTP Strict Transport Security)**:
  - Activar HSTS en el dashboard de Cloudflare con `max-age=31536000` (1 año).
  - Incluir subdominios (`includeSubDomains`).
  - Habilitar Precarga (`preload`).

---

## 3. Reglas de Seguridad Perimetral y WAF en Cloudflare

En **Cloudflare Dashboard > Security**:

- [ ] **Bot Fight Mode**: **Activado**. Mitiga scrapers masivos, spiders no autorizados y bots de sondeo de contraseñas.
- [ ] **Protección contra Ataques DDoS**: Dejar en nivel estándar (activado por defecto en Cloudflare).
- [ ] **Reglas de Acceso por País (WAF Custom Rules)** *(Recomendado para el Panel)*:
  - Si tu operación es 100% en Quintana Roo / México, puedes restringir la ruta `/panel/*` para que solo admita IPs de México, bloqueando de raíz sondeos automáticos desde Europa del Este o Asia.
- [ ] **Rate Limiting Edge**:
  - Cloudflare Pages Functions ya incluye nuestro rate limiter interno en memoria (`functions/_ratelimit.ts`), pero si adquieres un plan de Cloudflare de pago, puedes activar una regla de Rate Limiting perimetral para `POST /api/*`.

---

## 4. Primer Inicio de Sesión y Rotación de Credenciales

Al desplegar por primera vez, el sistema cuenta con cuentas iniciales que deben ser personalizadas de inmediato:

1. **Ingreso Inicial**:
   - Entra a `https://tu-dominio.com/panel/login`.
   - Ingresa con el usuario de administración (`admin@thegarage.mx` o `admin`).
2. **Rotación Obligatoria del PIN Maestro**:
   - Ve a `/panel/empleados`.
   - Localiza la cuenta del Administrador / Propietario.
   - Asigna un nuevo PIN o contraseña alfanumérica robusta (mínimo 8 caracteres).
   - El sistema calculará en tiempo real el hash criptográfico SHA-256 asistido por un *salt* único y eliminará la credencial anterior.
3. **Configuración de Cuentas del Equipo**:
   - Actualiza los PINs del mecánico de Taller (`taller@thegarage.mx`) y la asesora comercial de Ventas (`ventas@thegarage.mx`).
   - Suspende o elimina cualquier colaborador que no pertenezca al equipo activo de la tienda.

---

## 5. Depuración y Purgado de Datos de Prueba (Go-Live)

Si vas a abrir la tienda al público real y no deseas conservar los datos de ejemplo:

- [ ] **Verificar Catálogo Real**: Revisa que los precios, existencias y especificaciones de las bicicletas en `/panel/inventario` y `/panel/sitio-web` correspondan al inventario físico de la tienda en Cataluña.
- [ ] **Reiniciar Libro Contable (Ledger)**:
  - Si el botón "Datos Demo" fue presionado durante pruebas, ve a `/panel/contabilidad` y verifica los registros. Si requieres empezar con caja en ceros, puedes reiniciar la caja del día.
- [ ] **Validar Números de WhatsApp**:
  - Verifica que el número en el checkout (`9841234567` o el configurado en la tienda) corresponda al WhatsApp Business oficial del taller.

---

## 6. Batería de Pruebas de Humo (Smoke Tests) Post-Despliegue

Ejecuta estas pruebas directamente en la URL de producción antes de compartir el enlace:

### Prueba A: Perímetro de Autenticación (Edge Guard)
1. Abre una ventana en modo incógnito.
2. Intenta ingresar directamente a `https://tu-dominio.com/panel/taller`.
3. **Resultado esperado**: El servidor de Cloudflare debe interceptar la petición y redirigirte inmediatamente a `/panel/login?redirect=%2Fpanel%2Ftaller`.

### Prueba B: Control de Acceso Basado en Roles (RBAC)
1. Inicia sesión con la cuenta de Taller (`taller@thegarage.mx`).
2. En la barra de navegación lateral sólo deben aparecer los módulos autorizados (Taller, Flota de Rentas, Inventario, Mi Perfil).
3. Intenta forzar la URL escribiendo manualmente en el navegador: `https://tu-dominio.com/panel/contabilidad`.
4. **Resultado esperado**: El sistema debe denegar el acceso con una alerta roja fija (*"Acceso restringido: Módulo reservado"*) y devolverte a tu pantalla de inicio segura.

### Prueba C: Bloqueo por Fuerza Bruta y Trampa Anti-Bot
1. En `/panel/login`, ingresa credenciales equivocadas 5 veces continuas.
2. **Resultado esperado**: Al 5° intento, el botón se bloquea mostrando una cuenta regresiva de 60 segundos (*"Acceso bloqueado (60s)"*). Recargar la página no elimina el bloqueo.

### Prueba D: Cabeceras de Seguridad HTTP
1. Abre una terminal y ejecuta:
   ```bash
   curl -I https://tu-dominio.com
   ```
2. **Verificar que estén presentes**:
   - `strict-transport-security: max-age=31536000; includeSubDomains; preload`
   - `x-content-type-options: nosniff`
   - `x-frame-options: SAMEORIGIN`
   - `content-security-policy: ...`
   - `referrer-policy: strict-origin-when-cross-origin`
   - *(Ningún encabezado debe revelar `x-powered-by` o versiones internas).*
3. Opcionalmente, analiza la URL en **https://securityheaders.com** para confirmar calificación **A o A+**.

### Prueba E: Validación Fail-Closed en Compras Web
1. En modo incógnito, intenta ingresar a: `https://tu-dominio.com/checkout/exito?status=approved`.
2. **Resultado esperado**: Como no existe ninguna orden en tránsito en la memoria del navegador, la página debe mostrar una pantalla de fallo cerrado: *"No se encontró información de la compra"*, impidiendo cualquier suplantación de orden pagada.

### Prueba F: Auditoría de Logs en Vivo
1. En el panel administrativo, abre la consola de desarrollador (`F12`) y ejecuta:
   ```javascript
   getSecurityAuditLogs()
   ```
2. **Resultado esperado**: Debe mostrarse la tabla con los eventos registrados de tus pruebas anteriores (`AUTH_SUCCESS`, `AUTH_FAILURE`, `RBAC_DENIED`, etc.).

---

## 7. Plan de Respaldo y Mantenimiento Periódico

- **Respaldos de Datos de Clientes y Caja**: Realizar una exportación mensual del estado de cuentas desde el módulo de Contabilidad.
- **Auditoría de Dependencias**: Ejecutar trimestralmente en el proyecto local:
  ```bash
  npm audit
  npm outdated
  ```
- **Rotación de Credenciales**: Renovar la llave `GEMINI_API_KEY` y el `MP_ACCESS_TOKEN` de MercadoPago cada 6 meses en el panel de Cloudflare.
