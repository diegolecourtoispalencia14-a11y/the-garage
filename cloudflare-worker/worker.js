export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Obtener Client ID y Secret desde las variables de Cloudflare o por defecto
    const clientId = (env && env.GITHUB_CLIENT_ID) || 'Ov23liVBr4GLST8wLo1l';
    const clientSecret = (env && env.GITHUB_CLIENT_SECRET) || '';

    // 1. Redirigir a GitHub para iniciar sesión
    if (url.pathname === '/auth') {
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      githubAuthUrl.searchParams.set('client_id', clientId);
      githubAuthUrl.searchParams.set('scope', 'repo,user');
      githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);

      return Response.redirect(githubAuthUrl.toString(), 302);
    }

    // 2. Retorno de GitHub con el código
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Error: No se recibió código de GitHub.', { status: 400 });
      }

      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'TheGarage-OAuth-Worker'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(`Error de autenticación: ${data.error_description || data.error}`, { status: 401 });
      }

      const token = data.access_token;
      const provider = 'github';

      const html = `<!doctype html>
        <html>
          <head><meta charset="utf-8"><title>The Garage</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 40px;">
            <p>Conectando con el panel...</p>
            <script>
              window.opener.postMessage('authorization:${provider}:success:${JSON.stringify({ token, provider })}', '*');
              window.close();
            </script>
          </body>
        </html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('The Garage OAuth Proxy activo.', { status: 200 });
  },
};
