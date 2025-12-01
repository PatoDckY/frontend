import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // --- 1. Content-Security-Policy (CSP) ---
  // Esta es la regla más estricta. Define qué puede cargar tu página.
  // 'unsafe-inline' es necesario para que los estilos de Next.js funcionen sin configuración extra.
  // img-src incluye 'https:' para permitir las imágenes externas que definiste en tu next.config.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
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

  // Limpiamos los saltos de línea para enviarlo correctamente
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // --- 2. Permissions-Policy ---
  // Bloquea el acceso a hardware sensible a menos que lo autorices explícitamente.
  // Esto sube mucho la calificación de seguridad.
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
  );

  // --- 3. Cabeceras Estándar (OWASP) ---
  // Previene que el navegador "adivine" tipos de archivo (MIME sniffing)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Evita que tu sitio sea incrustado en un iframe (protección contra Clickjacking)
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Controla cuánta información se envía al hacer clic en un enlace externo
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Fuerza HTTPS estricto por 1 año (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica estas reglas a todas las páginas, pero IGNORA:
     * - Rutas de API (/api/...)
     * - Archivos estáticos de Next.js (_next/static)
     * - Imágenes optimizadas (_next/image)
     * - El favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};