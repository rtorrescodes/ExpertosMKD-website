import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { PeopleClient } from "@/components/dashboard/crm/PeopleClient";

export default async function PeoplePage({
  props: {
  params: Promise<{ tenant: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const people = await prisma.crmPerson.findMany({
    where: { tenantId: session.user.tenantId },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  const companies = await prisma.crmCompany.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <PeopleClient 
      people={JSON.parse(JSON.stringify(people))} 
      companies={companies}
    />
  );
}
