import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { PublicQuoteClient } from "@/components/dashboard/quotes/PublicQuoteClient";

export default async function PublicQuotePage(props: { params: Promise<{ tenant: string, token: string }> }) {
  const quote = await prisma.crmQuote.findUnique({
    where: { publicToken: token },
    include: {
      tenant: true,
      person: true,
      items: true,
    }
  });

  if (!quote) {
    notFound();
  }

  // Verificar que el tenant del token coincide con el subdomain de la URL por seguridad (opcional, pero buena práctica)
  if (quote.tenant.subdomain !== tenantSlug) {
    notFound();
  }

  return (
    <PublicQuoteClient quote={JSON.parse(JSON.stringify(quote))} />
  );
}
