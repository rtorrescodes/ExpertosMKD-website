import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { ErpDashboardClient } from "@/components/dashboard/erp/ErpDashboardClient";

export default async function ErpDashboard(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) redirect("/admin/login");

  // Fetch Accounts
  const accounts = await prisma.erpAccount.findMany({
    where: { tenantId: session.user.tenantId }
  });

  // If no accounts, we might still have transactions if they were generated via Ecom/Appt triggers
  // (which automatically create "Cuenta Principal" on the fly if it didn't exist).
  
  // Fetch Transactions
  const transactions = await prisma.erpTransaction.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { date: "desc" },
    include: {
      account: true,
      ecomOrder: true,
      apptBooking: true,
      crmQuote: true
    }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-6 text-white">ERP y Finanzas</h1>
        <p className="mt-2 text-sm text-slate-400">
          Supervisa el flujo de caja, registra gastos y controla tus cuentas por cobrar.
        </p>
      </div>

      <ErpDashboardClient 
        transactions={JSON.parse(JSON.stringify(transactions))} 
        accounts={JSON.parse(JSON.stringify(accounts))} 
      />
    </div>
  );
}
