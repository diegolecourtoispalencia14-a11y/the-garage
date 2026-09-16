/**
 * functions/_cors.ts
 * Utilidad compartida de cabeceras seguras y CORS estricto (A02: Security Misconfiguration)
 * The Garage & BiciSaaS
 */

export function getSecureCorsHeaders(request: Request, env: any) {
  const origin = request.headers.get('Origin') || '';
  const configuredOrigin = env?.PUBLIC_SITE_URL || 'https://the-garage-dw4.pages.dev';
  
  // Lista blanca estricta de orígenes de confianza
  const trustedOrigins = [
    configuredOrigin,
    'https://the-garage-dw4.pages.dev',
    'https://thegarage.mx',
    'https://www.thegarage.mx',
    'http://localhost:4321',
    'http://localhost:3000',
    'http://127.0.0.1:4321'
  ];

  const isTrusted = trustedOrigins.includes(origin) || (origin && origin.endsWith('.pages.dev'));
  const allowedOrigin = isTrusted ? origin : configuredOrigin;

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  };
}

export function handleOptionsCors(request: Request, env: any) {
  return new Response(null, {
    status: 204,
    headers: getSecureCorsHeaders(request, env),
  });
}
