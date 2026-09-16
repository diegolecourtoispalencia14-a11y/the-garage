/**
 * functions/_logger.ts
 * Logger de seguridad estructurado para Cloudflare Pages Functions (OWASP A09:2025)
 * The Garage & BiciSaaS
 */

export type SecurityLogLevel = 'INFO' | 'WARN' | 'SECURITY_ALERT';

export type SecurityEventType =
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_INPUT_DETECTED'
  | 'PAYMENT_GATEWAY_UNAVAILABLE'
  | 'PAYMENT_PREFERENCE_CREATED'
  | 'PAYMENT_GATEWAY_ERROR'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

// Sanitizar datos sensibles recursivamente para que nunca se filtren secretos ni PII
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const sanitized = { ...data };
  const sensitiveKeys = ['pin', 'password', 'token', 'access_token', 'secret', 'key', 'card', 'cvv', 'cvc'];

  for (const [key, value] of Object.entries(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogData(value);
    }
  }

  return sanitized;
}

export function logSecurityEvent(
  request: Request,
  event: SecurityEventType,
  level: SecurityLogLevel = 'INFO',
  extraDetails?: Record<string, any>
) {
  const clientIp = request.headers.get('cf-connecting-ip') ||
                   request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   'unknown-client';
  const url = new URL(request.url);

  const entry = {
    timestamp: new Date().toISOString(),
    service: 'thegarage-edge',
    level,
    event,
    ip: clientIp,
    method: request.method,
    path: url.pathname,
    details: extraDetails ? sanitizeLogData(extraDetails) : {},
  };

  const output = `[SECURITY AUDIT] ${JSON.stringify(entry)}`;
  if (level === 'SECURITY_ALERT') {
    console.error(output);
  } else if (level === 'WARN') {
    console.warn(output);
  } else {
    console.info(output);
  }
}
