import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- CONTENT SECURITY POLICY (CSP) COMPATIBLE ---
  // Cambios realizados para arreglar el error:
  // 1. Agregamos 'unsafe-inline': Permite los scripts de hidratación de Next.js.
  // 2. Agregamos 'unsafe-eval': Necesario para algunas librerías en producción.
  // 3. Quitamos el 'nonce': Es lo que estaba causando el bloqueo.
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
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

  // Aplicamos la cabecera CSP
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // --- OTRAS CABECERAS DE SEGURIDAD (OWASP) ---
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS: Fuerza HTTPS por 1 año
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Permissions Policy: Bloquea hardware
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos e imágenes
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};