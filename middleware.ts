import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Generar un Nonce criptográfico único para esta petición
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 2. Detectar si estamos en Desarrollo o Producción
  // 'unsafe-eval' es necesario solo en desarrollo para que Next.js funcione rápido
  const isDev = process.env.NODE_ENV !== 'production';
  
  // 3. Construir la Política CSP Estricta
  // - script-src: Reemplazamos 'unsafe-inline' por 'nonce-...'
  // - 'strict-dynamic': Permite que los scripts confiables carguen sus propias dependencias.
  const cspHeader = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Limpiamos los saltos de línea
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 4. Pasar el Nonce a Next.js (IMPORTANTE)
  // Añadimos el nonce y la CSP a los headers de la petición para que Next.js pueda leerlos
  // y ponerle el nonce a sus propios scripts automáticamente.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // Creamos la respuesta pasando los headers modificados
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Establecer cabeceras en la respuesta final para el navegador
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
  
  // Bloquear hardware sensible
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
  );

  // Cabeceras OWASP estándar
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todo excepto rutas internas de Next.js y estáticos
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};