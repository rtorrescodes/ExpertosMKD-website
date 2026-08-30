import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { StoreCartProvider } from "./StoreCartProvider";

export default async function StoreLayout(props: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await props.params;
  const children = props.children;

  const tenantData = await prisma.tenant.findUnique({
    where: { subdomain: tenant }
  });

  if (!tenantData) notFound();

  return (
    <StoreCartProvider tenantSubdomain={tenant}>
      <div className="min-h-screen glass-card border-white/5 text-white font-sans">
        {/* Navigation Bar */}
        <header className="border-b border-gray-100 sticky top-0 glass-card border-white/5/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href={`/site/${tenant}/store`} className="font-bold text-xl tracking-tight">
              {tenantData.name} <span className="text-slate-500 font-normal">Store</span>
            </Link>
            <Link href={`/site/${tenant}/store/checkout`} className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-md transition-colors relative group">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Cart</span>
            </Link>
          </div>
        </header>
        
        {/* Main Store Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </div>
    </StoreCartProvider>
  );
}
