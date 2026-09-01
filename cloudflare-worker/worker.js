/**
 * Cloudflare Worker: GitHub OAuth Proxy para Sveltia CMS (The Garage)
 * 
 * Permite que solo tú (con tu cuenta de GitHub) puedas iniciar sesión 
 * y administrar el inventario desde el celular de forma gratuita y segura.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Iniciar autenticación
    if (url.pathname === '/auth') {
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.set('scope', 'repo,user');
      githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);

      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    // 2. Retorno de GitHub con el código de autorización
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');

      if (!code) {
        return new Response('Error: No se recibió código de autorización de GitHub.', { status: 400 });
      }

      // Intercambiar código por Token de acceso con GitHub
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'TheGarage-OAuth-Worker'
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(`Error de autenticación: ${data.error_description || data.error}`, { status: 401 });
      }

      const token = data.access_token;
      const provider = 'github';

      // Enviar el token a la ventana de Sveltia CMS de forma segura
      const htmlContent = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Autenticación Exitosa - The Garage</title>
          </head>
          <body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #0F172A; color: #FFFFFF;">
            <h2 style="color: #22C55E;">✓ Sesión Iniciada</h2>
            <p>Conectando con el panel de administración...</p>
            <script>
              const receiveMessage = (message) => {
                window.opener.postMessage(
                  'authorization:${provider}:success:${JSON.stringify({ token, provider })}',
                  message.origin
                );
                window.removeEventListener("message", receiveMessage, false);
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:${provider}", "*");
            </script>
          </body>
        </html>
      `;

      return new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Ruta por defecto
    return new Response('The Garage OAuth Proxy activo y seguro.', { status: 200 });
  },
};
