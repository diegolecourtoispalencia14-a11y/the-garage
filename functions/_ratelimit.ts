/**
 * functions/_ratelimit.ts
 * Sistema de Control de Tasa (Rate Limiting) y Protección contra Abuso (OWASP A04 / A07)
 * The Garage & BiciSaaS
 */

export interface RateLimitConfig {
  maxRequests: number;   // Límite de peticiones permitidas en la ventana
  windowSeconds: number; // Duración de la ventana en segundos
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// Almacén en memoria por nodo Edge: IP -> { count: number, resetTime: number }
const ipBuckets = new Map<string, { count: number; resetTime: number }>();

function cleanupExpiredBuckets() {
  const now = Date.now();
  for (const [ip, entry] of ipBuckets.entries()) {
    if (now > entry.resetTime) {
      ipBuckets.delete(ip);
    }
  }
}

export function checkRateLimit(
  request: Request,
  config: RateLimitConfig = { maxRequests: 20, windowSeconds: 60 }
): RateLimitResult {
  if (ipBuckets.size > 500) {
    cleanupExpiredBuckets();
  }

  // Obtener IP del cliente provista por Cloudflare o proxy inverso
  const clientIp = request.headers.get('cf-connecting-ip') ||
                   request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   'unknown-client';

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const current = ipBuckets.get(clientIp);

  if (!current || now > current.resetTime) {
    ipBuckets.set(clientIp, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetSeconds: config.windowSeconds,
    };
  }

  current.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((current.resetTime - now) / 1000));
  const remaining = Math.max(0, config.maxRequests - current.count);

  if (current.count > config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSeconds,
    };
  }

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining,
    resetSeconds,
  };
}

export function rateLimitResponse(corsHeaders: Record<string, string>, resetSeconds: number, limit: number) {
  return new Response(
    JSON.stringify({
      error: 'Has superado el límite de solicitudes permitidas. Por favor intenta de nuevo en unos momentos.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfterSeconds: resetSeconds,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(resetSeconds),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(resetSeconds),
      },
    }
  );
}
