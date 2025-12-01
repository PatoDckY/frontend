import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 🛡️ SEGURIDAD EN TRÁNSITO (HTTPS)
  // Strict-Transport-Security: Fuerza al navegador a usar HTTPS siempre por 1 año.
  // X-Content-Type-Options: Previene ataques de tipo MIME sniffing.
  // Referrer-Policy: Controla cuánta información se envía al navegar fuera.
  
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY'); // Previene Clickjacking (iframe)
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Configuración: Aplicar a todas las rutas
export const config = {
  matcher: '/:path*',
};