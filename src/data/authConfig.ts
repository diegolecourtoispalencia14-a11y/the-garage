/**
 * authConfig.ts
 * Sistema centralizado de Autenticación, Roles y Permisos (RBAC)
 * The Garage Bike Experts — BiciSaaS Enterprise
 */

export type UserRole = 'admin' | 'mecanico' | 'ventas' | 'personalizado';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  pinHash?: string; // Hash criptográfico SHA-256 (pin + salt)
  pinSalt?: string; // Salt criptográfico aleatorio único por usuario
  pin?: string;     // Compatibilidad de lectura si existe registro previo
  role: UserRole;
  roleLabel: string;
  avatar: string; // Monograma corporativo (ej: 'DL', 'MR') o identificador vectorial
  monogram?: string;
  color: string;
  title: string;
  status: 'active' | 'suspended';
  allowedModules?: string[]; // Módulos específicos autorizados
  lastLogin?: string;
  createdAt?: string;
}

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  monogram?: string;
  title: string;
  allowedModules?: string[];
  loggedAt: string;
  expiresAt?: number;      // Timestamp de caducidad de sesión (inactividad)
  lastActivity?: number;   // Timestamp de última interacción
  sessionId?: string;      // ID de sesión aleatorio contra fijación de sesión
  token?: string;
}

// Catálogo de todos los módulos disponibles en la plataforma BiciSaaS
export const SAAS_MODULES = [
  { id: 'Dashboard', path: '/panel', label: 'Dashboard Operativo', desc: 'Panel central de control y métricas del día' },
  { id: 'CRM', path: '/panel/crm', label: 'CRM & Clientes', desc: 'Base de datos de ciclistas, contactos y notas' },
  { id: 'Inventario', path: '/panel/inventario', label: 'Inventario Maestro & POS', desc: 'Control de refacciones, stock y cobro en mostrador' },
  { id: 'Rentas', path: '/panel/rentas', label: 'Flota & Rentas', desc: 'Control de bicicletas de alquiler, tarifas y contratos' },
  { id: 'Taller', path: '/panel/taller', label: 'Taller & Servicios', desc: 'Órdenes de servicio, cirugías mecánicas y diagnósticos' },
  { id: 'Contabilidad', path: '/panel/contabilidad', label: 'Contabilidad & Caja Z', desc: 'Cierres de caja, arqueos, ingresos y egresos' },
  { id: 'Analytics', path: '/panel/analytics', label: 'Analytics & Proyecciones', desc: 'Métricas avanzadas, GMROI y rentabilidad' },
  { id: 'Sitio Web', path: '/panel/sitio-web', label: 'Gestionar Sitio Web & Catálogo', desc: 'Publicación web de productos y pasarela digital' },
  { id: 'Empleados', path: '/panel/empleados', label: 'Gestión de Empleados & PINs', desc: 'Control de asistencia, sueldos y seguridad RBAC' },
  { id: 'Mi Perfil', path: '/panel/mi-perfil', label: 'Mi Perfil & Tareas', desc: 'Cockpit personal del colaborador y tareas asignadas' }
];

// Cuentas oficiales de arranque para la tienda (PINs protegidos con hash SHA-256 + salt único)
export const DEFAULT_STAFF: UserAccount[] = [
  {
    id: 'e1',
    name: 'Diego Lecourtois',
    email: 'admin@thegarage.mx',
    phone: '9841234567',
    pinHash: 'e7ee39c89eae34d391d8de9cfe1bc46b1005d2cfe7832dad09a9b1abfcab5f2e', // SHA-256 (1984 + salt)
    pinSalt: 'thegarage_salt_e1_1984',
    role: 'admin',
    roleLabel: 'Administrador / Dueño',
    avatar: 'DL',
    monogram: 'DL',
    color: '#0071e3',
    title: 'Director General & Dueño',
    status: 'active',
    allowedModules: [
      'Dashboard', 'CRM', 'Inventario', 'Rentas', 'Taller', 
      'Contabilidad', 'Analytics', 'Sitio Web', 'Empleados', 'Mi Perfil'
    ],
    createdAt: '2026-01-01'
  },
  {
    id: 'e2',
    name: 'Marco Ramírez',
    email: 'taller@thegarage.mx',
    phone: '9847654321',
    pinHash: '9dc566e0a1cbd871a5365eb2aa414b3108c6019313eb47ce590318bc90d5050b', // SHA-256 (2024 + salt)
    pinSalt: 'thegarage_salt_e2_2024',
    role: 'mecanico',
    roleLabel: 'Mecánico Senior / Taller',
    avatar: 'MR',
    monogram: 'MR',
    color: '#34c759',
    title: 'Jefe de Cirugía Mecánica',
    status: 'active',
    allowedModules: [
      'Dashboard', 'CRM', 'Inventario', 'Taller', 'Mi Perfil'
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'e3',
    name: 'Laura Vásquez',
    email: 'ventas@thegarage.mx',
    phone: '9849876543',
    pinHash: 'e0a9681af29903a2d1a6bf921399559c2fe8e1ae04d139d95d323760b0b165a8', // SHA-256 (3030 + salt)
    pinSalt: 'thegarage_salt_e3_3030',
    role: 'ventas',
    roleLabel: 'Ventas & Mostrador',
    avatar: 'LV',
    monogram: 'LV',
    color: '#ff9500',
    title: 'Asesora Comercial & POS',
    status: 'active',
    allowedModules: [
      'Dashboard', 'CRM', 'Inventario', 'Rentas', 'Mi Perfil'
    ],
    createdAt: '2026-02-01'
  }
];

// Matriz de permisos predeterminados por Rol base
export const ROLE_PERMISSIONS: Record<UserRole, {
  allowedPaths: string[];
  deniedNotice: string;
  canViewSalaries: boolean;
  canManagePaymentGateways: boolean;
  canViewAccounting: boolean;
  canEditEmployees: boolean;
}> = {
  admin: {
    allowedPaths: [
      '/panel',
      '/panel/crm',
      '/panel/empleados',
      '/panel/inventario',
      '/panel/rentas',
      '/panel/taller',
      '/panel/contabilidad',
      '/panel/analytics',
      '/panel/sitio-web',
      '/panel/mi-perfil'
    ],
    deniedNotice: '',
    canViewSalaries: true,
    canManagePaymentGateways: true,
    canViewAccounting: true,
    canEditEmployees: true
  },
  mecanico: {
    allowedPaths: [
      '/panel',
      '/panel/crm',
      '/panel/inventario',
      '/panel/taller',
      '/panel/mi-perfil'
    ],
    deniedNotice: 'Módulo reservado para la Dirección General y Administración.',
    canViewSalaries: false,
    canManagePaymentGateways: false,
    canViewAccounting: false,
    canEditEmployees: false
  },
  ventas: {
    allowedPaths: [
      '/panel',
      '/panel/crm',
      '/panel/inventario',
      '/panel/rentas',
      '/panel/mi-perfil'
    ],
    deniedNotice: 'Módulo reservado para la Dirección General y Administración.',
    canViewSalaries: false,
    canManagePaymentGateways: false,
    canViewAccounting: false,
    canEditEmployees: false
  },
  personalizado: {
    allowedPaths: [
      '/panel',
      '/panel/mi-perfil'
    ],
    deniedNotice: 'Tu perfil cuenta con permisos restringidos. Contacta a tu Administrador.',
    canViewSalaries: false,
    canManagePaymentGateways: false,
    canViewAccounting: false,
    canEditEmployees: false
  }
};

/**
 * Valida si una ruta específica está autorizada para un rol o lista de módulos
 */
export function isRouteAuthorized(role: UserRole, pathname: string, allowedModules?: string[]): boolean {
  const cleanPath = pathname.replace(/\/$/, '') || '/panel';
  if (role === 'admin') return true;

  // Si tiene módulos permitidos explícitamente configurados:
  if (Array.isArray(allowedModules) && allowedModules.length > 0) {
    const isModuleAllowed = SAAS_MODULES.some(mod => {
      if (!allowedModules.includes(mod.id)) return false;
      return cleanPath === mod.path || cleanPath.startsWith(mod.path + '/');
    });
    if (isModuleAllowed) return true;
  }

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.allowedPaths.some(p => cleanPath === p || cleanPath.startsWith(p + '/'));
}

