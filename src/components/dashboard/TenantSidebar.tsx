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
  FileText
} from "lucide-react";

export function TenantSidebar({ 
  tenantName, 
  featureFlags 
}: { 
  tenantName: string; 
  featureFlags: any 
}) {
  const pathname = usePathname();

  // Basic structure
  const links = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Usuarios", href: "/dashboard/users", icon: Users },
  ];

  // Dynamic modules
  if (featureFlags?.crm) {
    links.push(
      { name: "Empresas", href: "/dashboard/crm/companies", icon: Briefcase },
      { name: "Contactos", href: "/dashboard/crm/people", icon: Users },
      { name: "Oportunidades", href: "/dashboard/crm/opportunities", icon: CheckSquare }
    );
  }
  if (featureFlags?.quotes || featureFlags?.crm) {
    links.push({ name: "Cotizaciones", href: "/dashboard/quotes", icon: FileText }); 
  }
  if (featureFlags?.appointments || featureFlags?.crm) {
    links.push(
      { name: "Citas", href: "/dashboard/appointments", icon: Calendar }
    );
  }
  if (featureFlags?.projects || featureFlags?.crm) {
    links.push({ name: "Proyectos", href: "/dashboard/projects", icon: CheckSquare });
  }
  if (featureFlags?.ecommerce) {
    links.push({ name: "Tienda", href: "/dashboard/ecommerce", icon: ShoppingCart });
  }

  // Always at the bottom
  links.push({ name: "Configuración", href: "/dashboard/settings", icon: Settings });

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-bold text-white tracking-tight truncate">
          {tenantName}
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {links.map((item) => {
                const isActive = pathname.endsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }
                      `}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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
