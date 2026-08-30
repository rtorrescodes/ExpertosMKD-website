import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma/client";
import { TenantSidebar } from "@/components/dashboard/TenantSidebar";
import { TenantHeader } from "@/components/dashboard/TenantHeader";

export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Verificar en Base de Datos el Tenant usando el subdominio de la ruta
  const tenantData = await prisma.tenant.findUnique({
    where: { subdomain: params.tenant },
  });

  if (!tenantData) {
    return <div>Tenant not found</div>;
  }

  // Zero Trust: El tenantId de la sesion DEBE coincidir con el tenant de la ruta
  if (session.user.tenantId !== tenantData.id) {
    // Si es un Super Admin que está viendo, podríamos permitirlo (para el futuro).
    // Por ahora, forzamos la identidad estricta.
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-600">
        <h1>403 - Acceso Denegado: No perteneces a esta organización.</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <TenantSidebar 
          tenantName={tenantData.name} 
          featureFlags={tenantData.featureFlags} 
        />
      </div>

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <TenantHeader userName={session.user.name || "Usuario"} userEmail={session.user.email} />
        
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
