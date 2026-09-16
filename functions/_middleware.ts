/**
 * functions/_middleware.ts
 * Cloudflare Pages Edge Middleware — Perímetro de Control de Acceso & Cabeceras de Seguridad (A01 & A02)
 * The Garage & BiciSaaS
 */

interface Env {
  // Cloudflare environment bindings
  [key: string]: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 1. Interceptar rutas del panel administrativo (/panel/*)
  // Excluir /panel/login y cualquier recurso estático
  const isPanelRoute = pathname === '/panel' || pathname.startsWith('/panel/');
  const isLoginRoute = pathname === '/panel/login' || pathname.startsWith('/panel/login/');

  if (isPanelRoute && !isLoginRoute) {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    
    // Parsear cookies de manera segura
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const authCookie = cookies.find(c => c.startsWith('bicisaas_auth='));
    const tokenVal = authCookie ? authCookie.split('=')[1] : null;

    // Si no cuenta con cookie de sesión activa, redirigir al login en el edge
    if (!tokenVal || tokenVal.length < 8) {
      const loginUrl = new URL('/panel/login', context.request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return Response.redirect(loginUrl.toString(), 302);
    }
  }

  // 2. Continuar con la petición y adjuntar cabeceras de seguridad
  const response = await context.next();
  const headers = new Headers(response.headers);

  // Cabeceras de protección activa
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self "https://sdk.mercadopago.com" "https://www.mercadopago.com.mx")');

  if (isPanelRoute) {
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // Erradicar huellas de servidor
  headers.delete('x-powered-by');
  headers.delete('server');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
