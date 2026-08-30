import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";

export default async function ProductDetailsPage({ params }: { params: { tenant: string, handle: string } }) {
  const tenant = await prisma.tenant.findUnique({ where: { subdomain: params.tenant } });
  if (!tenant) notFound();

  const product = await prisma.ecomProduct.findUnique({
    where: { tenantId_handle: { tenantId: tenant.id, handle: params.handle } },
    include: { variants: true }
  });

  if (!product || !product.isPublished) notFound();

  return (
    <ProductPageClient product={JSON.parse(JSON.stringify(product))} />
  );
}
