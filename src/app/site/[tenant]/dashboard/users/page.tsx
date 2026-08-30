import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { UsersView } from "@/components/dashboard/users/UsersView";
import { redirect } from "next/navigation";

export default async function UsersPage({
  params,
}: {
  props: { params: Promise<{ tenant: string }> };
}) {
  const { tenant } = await props.params;
 session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({
    where: { tenantId: session.user.tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true
    }
  });

  return (
    <UsersView 
      users={users} 
      currentUserRole={session.user.role} 
    />
  );
}
