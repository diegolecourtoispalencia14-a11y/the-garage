mkdir -p src/pages/panel

# 1. Update PanelLayout.astro for true Apple aesthetics and active route logic
cat << 'LAYOUT' > src/layouts/PanelLayout.astro
---
import { Icon } from 'astro-icon/components';
const { title = "BiciSaaS | Panel Maestro" } = Astro.props;

// Determine active route for sidebar
const currentPath = Astro.url.pathname;
---
<html lang="es" class="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <style is:global>
    /* --- BiciSaaS Apple-Style Design System --- */
    :root {
      /* Light Theme */
      --bg-base: #f5f5f7;
      --bg-surface: #ffffff;
      --bg-surface-hover: #f0f0f2;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --border-subtle: rgba(0, 0, 0, 0.08);
      
      --accent-blue: #0071e3;
      --accent-blue-hover: #0077ed;
      --accent-red: #ff3b30;
      --accent-green: #34c759;
      --accent-orange: #ff9500;
      
      --shadow-soft: 0 4px 14px rgba(0,0,0,0.04);
      --shadow-float: 0 10px 30px rgba(0,0,0,0.08);
      
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 24px;
      
      --sidebar-width: 250px;
    }
    
    html.dark {
      /* Dark Theme */
      --bg-base: #000000;
      --bg-surface: #1c1c1e;
      --bg-surface-hover: #2c2c2e;
      --text-primary: #f5f5f7;
      --text-secondary: #a1a1a6;
      --border-subtle: rgba(255, 255, 255, 0.1);
      
      --accent-blue: #2997ff;
      --accent-blue-hover: #3b9fff;
      
      --shadow-soft: 0 4px 14px rgba(0,0,0,0.4);
      --shadow-float: 0 10px 30px rgba(0,0,0,0.6);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-base);
      color: var(--text-primary);
      display: flex;
      height: 100vh;
      overflow: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
      -webkit-font-smoothing: antialiased;
    }

    /* Typography */
    h1, h2, h3 { font-weight: 600; letter-spacing: -0.02em; }
    .text-muted { color: var(--text-secondary); }

    /* Layout Shell */
    .app-sidebar {
      width: var(--sidebar-width);
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      transition: background-color 0.3s ease, border-color 0.3s ease;
      z-index: 10;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      padding: 0 0.5rem 2rem 0.5rem;
      letter-spacing: -0.03em;
    }

    .nav-menu { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    
    .nav-item:hover { background-color: var(--bg-surface-hover); }
    .nav-item.active { background-color: var(--accent-blue); color: #fff; font-weight: 600; }
    
    /* Active State SVG fill logic */
    .nav-item.active svg { stroke: #fff; fill: #fff; }

    .user-profile-section {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-blue), #5e5ce6);
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 1rem;
    }

    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .app-topbar {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 2rem;
      gap: 1rem;
    }

    /* Buttons */
    .btn-icon {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-icon:hover { background: var(--bg-surface); color: var(--text-primary); }
    
    .btn-primary {
      background-color: var(--accent-blue);
      color: white;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 100px; /* Pill shape */
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .btn-primary:hover { background-color: var(--accent-blue-hover); transform: scale(1.02); }
    .btn-primary:active { transform: scale(0.98); }

    /* Main Canvas */
    .app-content {
      flex: 1;
      padding: 1rem 2rem 2rem 2rem;
      overflow-y: auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    /* Bento Grid System */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .bento-card {
      background-color: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--border-subtle);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    
    .bento-card:hover {
      box-shadow: var(--shadow-float);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  
  <aside class="app-sidebar">
    <div class="brand-header">
      <Icon name="mdi:bicycle" width="28" height="28" style="color:var(--accent-blue)" />
      BiciSaaS
    </div>
    
    <nav class="nav-menu">
      <a href="/panel" class={`nav-item ${currentPath === '/panel' || currentPath === '/panel/' ? 'active' : ''}`}>
        <Icon name="mdi:view-dashboard-outline" width="20" height="20" /> Dashboard
      </a>
      <a href="/panel/crm" class={`nav-item ${currentPath.startsWith('/panel/crm') ? 'active' : ''}`}>
        <Icon name="mdi:account-group-outline" width="20" height="20" /> CRM & Equipo
      </a>
      <a href="/panel/inventario" class={`nav-item ${currentPath.startsWith('/panel/inventario') ? 'active' : ''}`}>
        <Icon name="mdi:package-variant-closed" width="20" height="20" /> Inventario Maestro
      </a>
      <a href="/panel/contabilidad" class={`nav-item ${currentPath.startsWith('/panel/contabilidad') ? 'active' : ''}`}>
        <Icon name="mdi:finance" width="20" height="20" /> Contabilidad
      </a>
    </nav>
    
    <div class="user-profile-section">
      <div class="avatar">D</div>
      <div style="flex: 1; overflow: hidden;">
        <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; text-overflow:ellipsis;">Diego L.</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">Administrador</div>
      </div>
      <button class="btn-icon" style="width:28px;height:28px;" title="Configuración">
        <Icon name="mdi:cog-outline" width="18" height="18" />
      </button>
    </div>
  </aside>

  <main class="app-main">
    <header class="app-topbar">
      <!-- Checador de Asistencia Global -->
      <button class="btn-primary" id="btn-clock-in">
        <Icon name="mdi:clock-check-outline" width="18" height="18" /> Registrar Entrada
      </button>
      
      <button class="btn-icon" id="theme-toggle" aria-label="Cambiar Tema" title="Cambiar Tema (Claro/Oscuro)">
        <Icon name="mdi:theme-light-dark" width="22" height="22" />
      </button>
      
      <button class="btn-icon" style="position:relative;" title="Notificaciones">
        <Icon name="mdi:bell-outline" width="22" height="22" />
        <span id="notif-badge" style="position:absolute; top:4px; right:6px; width:8px; height:8px; background:var(--accent-red); border-radius:50%;"></span>
      </button>
    </header>

    <div class="app-content">
      <slot />
    </div>
  </main>

  <script is:inline>
    // Theme Management per User Session
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Load preference
    if(localStorage.getItem('bicisaas_theme') === 'dark') {
      root.classList.add('dark');
    }
    
    themeBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('bicisaas_theme', root.classList.contains('dark') ? 'dark' : 'light');
    });

    // Mock Clock-In System
    document.getElementById('btn-clock-in').addEventListener('click', function() {
      const time = new Date().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'});
      alert(`Asistencia registrada a las ${time}. (Esto se guardará en la base de datos del Administrador)`);
      this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/></svg> Entrada Registrada';
      this.style.backgroundColor = 'var(--accent-green)';
    });
  </script>
</body>
</html>
LAYOUT

# 2. Re-create panel/index.astro
cat << 'DASHBOARD' > src/pages/panel/index.astro
---
import PanelLayout from '../../layouts/PanelLayout.astro';
import { Icon } from 'astro-icon/components';
---
<PanelLayout title="Dashboard | BiciSaaS">
  <div class="page-header">
    <h1 class="page-title">Resumen del Día.</h1>
    <p class="text-muted">Jueves, 24 de Octubre. Tienes 3 notificaciones nuevas.</p>
  </div>

  <div class="bento-grid">
    <!-- Tasks Bento -->
    <div class="bento-card" style="grid-column: span 2;">
      <h3 style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; color:var(--text-primary);">
        <Icon name="mdi:calendar-check" width="22" height="22" style="color:var(--accent-blue);" /> Tareas y Recordatorios
      </h3>
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <div style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-base); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600;">Cobro Restante - Trek Marlin 5</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Cliente: Carlos Ruiz • Vence hoy</div>
          </div>
          <button style="background:var(--accent-green); color:white; border:none; padding:0.5rem 1rem; border-radius:100px; font-weight:600; cursor:pointer;">Cobrar (WhatsApp)</button>
        </div>
        <div style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-base); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600;">Servicio de Ajuste Recomendado</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Cliente: Mariana G. • 30 días de compra</div>
          </div>
          <button style="background:var(--accent-blue); color:white; border:none; padding:0.5rem 1rem; border-radius:100px; font-weight:600; cursor:pointer;">Agendar (WhatsApp)</button>
        </div>
      </div>
    </div>

    <!-- Inventory Bento -->
    <div class="bento-card">
      <h3 style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
        <Icon name="mdi:package-variant" width="22" height="22" style="color:var(--accent-orange);" /> Resumen Inventario
      </h3>
      <div style="font-size: 3.5rem; font-weight: 700; line-height: 1; margin-bottom:0.25rem;">142</div>
      <p class="text-muted" style="margin-bottom:1.5rem; font-size:0.9rem;">Productos Activos</p>
      
      <div style="display:flex; flex-direction:column; gap:0.5rem; border-top:1px solid var(--border-subtle); padding-top:1rem;">
        <div style="display:flex; justify-content:space-between; font-size:0.95rem;">
          <span class="text-muted">Bicicletas Armadas</span> <strong>12</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.95rem;">
          <span class="text-muted">Accesorios & Refacciones</span> <strong>130</strong>
        </div>
      </div>
    </div>

    <!-- Financial Bento -->
    <div class="bento-card">
      <h3 style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
        <Icon name="mdi:finance" width="22" height="22" style="color:var(--accent-green);" /> Flujo Mensual
      </h3>
      
      <div style="margin-bottom:1.25rem;">
        <div class="text-muted" style="font-size:0.9rem; margin-bottom:0.25rem;">Ingresos (Ventas)</div>
        <div style="font-size:1.5rem; font-weight:700; color:var(--accent-green);">+$45,200.00</div>
      </div>
      
      <div style="margin-bottom:1.25rem;">
        <div class="text-muted" style="font-size:0.9rem; margin-bottom:0.25rem;">Gastos (Caja Chica / Proveedores)</div>
        <div style="font-size:1.5rem; font-weight:700; color:var(--accent-red);">-$12,450.00</div>
      </div>
      
      <div style="border-top:1px solid var(--border-subtle); padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:600;">Balance Libre</span>
        <span style="font-weight:700; font-size:1.1rem;">$32,750.00</span>
      </div>
    </div>
  </div>
</PanelLayout>
DASHBOARD

# 3. Create skeleton sub-pages
cat << 'CRM' > src/pages/panel/crm.astro
---
import PanelLayout from '../../layouts/PanelLayout.astro';
---
<PanelLayout title="CRM & Equipo | BiciSaaS">
  <div class="page-header">
    <h1 class="page-title">CRM y Recursos Humanos.</h1>
    <p class="text-muted">Gestiona el equipo de trabajo y los perfiles de tus clientes.</p>
  </div>
  <div class="bento-grid">
    <div class="bento-card" style="grid-column: span 3; min-height: 400px; display:flex; align-items:center; justify-content:center;">
      <p class="text-muted">El módulo de CRM está en construcción (Fase 3).</p>
    </div>
  </div>
</PanelLayout>
CRM

cat << 'INV' > src/pages/panel/inventario.astro
---
import PanelLayout from '../../layouts/PanelLayout.astro';
---
<PanelLayout title="Inventario Maestro | BiciSaaS">
  <div class="page-header">
    <h1 class="page-title">Inventario y Stock.</h1>
    <p class="text-muted">Catálogo maestro de accesorios, bicicletas y componentes.</p>
  </div>
  <div class="bento-grid">
    <div class="bento-card" style="grid-column: span 3; min-height: 400px; display:flex; align-items:center; justify-content:center;">
      <p class="text-muted">El módulo de Inventario está en construcción (Fase 4).</p>
    </div>
  </div>
</PanelLayout>
INV

cat << 'CONT' > src/pages/panel/contabilidad.astro
---
import PanelLayout from '../../layouts/PanelLayout.astro';
---
<PanelLayout title="Contabilidad | BiciSaaS">
  <div class="page-header">
    <h1 class="page-title">Flujo de Caja y Deudas.</h1>
    <p class="text-muted">Administra la caja chica, cuentas por pagar y cuentas por cobrar.</p>
  </div>
  <div class="bento-grid">
    <div class="bento-card" style="grid-column: span 3; min-height: 400px; display:flex; align-items:center; justify-content:center;">
      <p class="text-muted">El módulo Contable está en construcción (Fase 5).</p>
    </div>
  </div>
</PanelLayout>
CONT

chmod +x setup_panel_routes.sh
./setup_panel_routes.sh
