"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  Settings, 
  Briefcase, 
  ShoppingCart, 
  Calendar, 
  CheckSquare,
  FileText,
  Wallet
} from "lucide-react";

export function TenantSidebar({ 
  tenantName, 
  tenantSubdomain,
  featureFlags 
}: { 
  tenantName: string; 
  tenantSubdomain: string;
  featureFlags: any 
}) {
  const pathname = usePathname();

  // Basic structure
  const links = [
    { name: "Inicio", href: `/site/${tenantSubdomain}/dashboard`, icon: Home },
    { name: "Usuarios", href: `/site/${tenantSubdomain}/dashboard/users`, icon: Users },
  ];

  // Dynamic modules
  if (featureFlags?.crm) {
    links.push(
      { name: "Empresas", href: `/site/${tenantSubdomain}/dashboard/crm/companies`, icon: Briefcase },
      { name: "Contactos", href: `/site/${tenantSubdomain}/dashboard/crm/people`, icon: Users },
      { name: "Oportunidades", href: `/site/${tenantSubdomain}/dashboard/crm/opportunities`, icon: CheckSquare }
    );
  }
  if (featureFlags?.quotes || featureFlags?.crm) {
    links.push({ name: "Cotizaciones", href: `/site/${tenantSubdomain}/dashboard/quotes`, icon: FileText }); 
  }
  if (featureFlags?.appointments || featureFlags?.crm) {
    links.push(
      { name: "Citas", href: `/site/${tenantSubdomain}/dashboard/appointments`, icon: Calendar }
    );
  }
  if (featureFlags?.projects || featureFlags?.crm) {
    links.push({ name: "Proyectos", href: `/site/${tenantSubdomain}/dashboard/projects`, icon: CheckSquare });
  }
  if (featureFlags?.ecommerce) {
    links.push({ name: "Tienda", href: `/site/${tenantSubdomain}/dashboard/ecommerce`, icon: ShoppingCart });
  }

  // Always show ERP for now, or flag it if preferred
  links.push({ name: "ERP y Finanzas", href: `/site/${tenantSubdomain}/dashboard/erp`, icon: Wallet });

  // Always at the bottom
  links.push({ name: "Configuración", href: `/site/${tenantSubdomain}/dashboard/settings`, icon: Settings });

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-card border-r border-white/5 h-full px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
          {tenantName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-bold text-white tracking-wide truncate">
          {tenantName}
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2">
              {links.map((item) => {
                const isActive = pathname.endsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-xl px-4 py-3 text-sm leading-6 font-medium transition-all duration-200
                        ${isActive 
                          ? "bg-cyan-500/10 text-cyan-400" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
