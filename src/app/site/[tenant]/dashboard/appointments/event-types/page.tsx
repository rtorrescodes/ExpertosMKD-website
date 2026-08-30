import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { EventTypesClient } from "./EventTypesClient";

export default async function EventTypesPage({ params }: { params: { tenant: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const eventTypes = await prisma.apptEventType.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <EventTypesClient 
      tenantSubdomain={params.tenant} 
      eventTypes={JSON.parse(JSON.stringify(eventTypes))} 
    />
  );
}
