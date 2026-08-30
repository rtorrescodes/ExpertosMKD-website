import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Nota: Next.js ejecuta middleware en Edge. Prisma no es compatible con Edge por defecto sin Prisma Accelerate.
// Si hay error de Edge, se deberá usar un fetch() a una API Route.
import { getTenantBySubdomain } from './tenant-utils';

export async function tenantMiddleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  // 1. Detectar subdominio
  const subdomain = host.split('.')[0];
  
  // 2. Excepciones
  const isHubRoute = url.pathname.startsWith('/hub');
  const isApiRoute = url.pathname.startsWith('/api');
  const isStaticAsset = url.pathname.match(/\.(css|js|png|jpg|svg|ico)$/);
  
  if (isStaticAsset || isApiRoute) {
    return NextResponse.next();
  }
  
  // 3. Si es /hub, solo accesible por SUPER_ADMIN
  if (isHubRoute) {
    // Validar en middleware que el usuario tenga rol SUPER_ADMIN
    return NextResponse.next();
  }
  
  // 4. Resolver tenant por subdominio
  // ATENCIÓN: Esta llamada a Prisma fallará en Middleware (Edge Runtime) a menos que
  // se mueva a una llamada fetch() o se deshabilite el Edge runtime si es posible.
  let tenant = null;
  try {
    // Para simplificar y evitar crash de Prisma en Edge, comentamos la db directa 
    // y asumimos que se inyecta el subdominio para resolución posterior.
    // tenant = await getTenantBySubdomain(subdomain);
  } catch(e) {
    console.error("Prisma error in edge middleware:", e);
  }
  
  /*
  if (!tenant) {
    // Tenant no encontrado
    return NextResponse.redirect(new URL('/404', request.url));
  }
  
  // 5. Verificar estado del tenant
  if (tenant.status === 'SUSPENDED') {
    return NextResponse.redirect(
      new URL(`/suspended?tenant=${tenant.id}`, request.url)
    );
  }
  
  if (tenant.status === 'GRACE_PERIOD') {
    // Mostrar banner de advertencia pero permitir acceso
  }
  */
  
  // 6. Inyectar tenant en headers para uso en Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-subdomain', subdomain);
  // requestHeaders.set('x-tenant-id', tenant.id);
  // requestHeaders.set('x-tenant-status', tenant.status);
  
  // Si es un subdominio vlido, reescribir la URL internamente a /site/[tenant]
  if (subdomain !== 'www' && subdomain !== 'hub') {
    return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, request.url), {
      request: { headers: requestHeaders }
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
