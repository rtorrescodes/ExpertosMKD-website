import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";

export default async function ProductDetailsPage(props: { params: Promise<{ tenant: string, handle: string }> }) {
  const { tenant, handle } = await props.params;
  const tenantData = await prisma.tenant.findUnique({ where: { subdomain: tenant } });
  if (!tenantData) notFound();

  const product = await prisma.ecomProduct.findUnique({
    where: { tenantId_handle: { tenantId: tenantData.id, handle: handle } },
    include: { variants: true }
  });

  if (!product || !product.isPublished) notFound();

  return (
    <ProductPageClient product={JSON.parse(JSON.stringify(product))} />
  );
}
