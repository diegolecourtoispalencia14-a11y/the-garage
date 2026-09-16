/**
 * src/utils/securityLogger.ts
 * Sistema centralizado de Logging y Auditoría de Seguridad en Cliente (OWASP A09:2025)
 * The Garage & BiciSaaS
 */

export type ClientSecurityEventType =
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'BRUTE_FORCE_LOCKOUT'
  | 'HONEYPOT_TRIGGERED'
  | 'RBAC_DENIED'
  | 'SESSION_EXPIRED'
  | 'ORDER_UNVERIFIED_BYPASS_ATTEMPT';

export interface ClientSecurityLogEntry {
  timestamp: string;
  type: ClientSecurityEventType;
  level: 'INFO' | 'WARN' | 'SECURITY_ALERT';
  user?: string;
  role?: string;
  path: string;
  details?: Record<string, any>;
}

const STORAGE_KEY = 'bicisaas_audit_log';
const MAX_LOG_ENTRIES = 50;

function sanitizeClientDetails(details: Record<string, any>): Record<string, any> {
  const clean = { ...details };
  const forbiddenKeys = ['pin', 'password', 'pinhash', 'pinsalt', 'token', 'secret', 'card', 'cvv'];
  for (const k of Object.keys(clean)) {
    if (forbiddenKeys.some(fk => k.toLowerCase().includes(fk.toLowerCase()))) {
      clean[k] = '[REDACTED]';
    }
  }
  return clean;
}

export function recordSecurityLog(
  type: ClientSecurityEventType,
  level: 'INFO' | 'WARN' | 'SECURITY_ALERT',
  details?: Record<string, any>,
  userContext?: { user?: string; role?: string }
) {
  if (typeof window === 'undefined') return;

  const entry: ClientSecurityLogEntry = {
    timestamp: new Date().toISOString(),
    type,
    level,
    user: userContext?.user || 'anon',
    role: userContext?.role || 'guest',
    path: window.location.pathname,
    details: details ? sanitizeClientDetails(details) : undefined,
  };

  const prefix = `[SECURITY AUDIT - ${entry.level}]`;
  if (level === 'SECURITY_ALERT') {
    console.error(prefix, entry.type, entry.details || '');
  } else if (level === 'WARN') {
    console.warn(prefix, entry.type, entry.details || '');
  } else {
    console.info(prefix, entry.type, entry.details || '');
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const logs: ClientSecurityLogEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(entry);
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.length = MAX_LOG_ENTRIES;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch(_) {}
}

// Global viewer helper for admin console
if (typeof window !== 'undefined') {
  (window as any).recordSecurityLog = recordSecurityLog;
  (window as any).getSecurityAuditLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      console.table(logs);
      return logs;
    } catch(_) {
      return [];
    }
  };
}
