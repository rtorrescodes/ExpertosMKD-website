import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { UsersView } from "@/components/dashboard/users/UsersView";

export default async function UsersPage(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  // Fetch only users for this tenant
  const users = await prisma.user.findMany({
    where: {
      tenantId: session.user.tenantId,
    }
  });

  return <UsersView initialUsers={JSON.parse(JSON.stringify(users))} tenantSubdomain={tenant} />;
}
