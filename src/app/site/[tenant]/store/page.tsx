import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function StoreHomepage({ params }: { params: { tenant: string } }) {
  const tenant = await prisma.tenant.findUnique({ where: { subdomain: params.tenant } });
  
  const products = await prisma.ecomProduct.findMany({
    where: { tenantId: tenant?.id, isPublished: true },
    include: { variants: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Recién Llegados</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(p => (
          <Link key={p.id} href={`/site/${params.tenant}/store/p/${p.handle}`} className="group cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative group-hover:shadow-md transition-all">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Package className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-black">{p.title}</h3>
            <p className="text-gray-500 font-medium">${Number(p.variants[0]?.price || 0).toFixed(2)}</p>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="text-gray-500 col-span-4">Esta tienda aún no tiene productos disponibles.</p>
        )}
      </div>
    </div>
  );
}
