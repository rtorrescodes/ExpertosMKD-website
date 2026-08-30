import { use } from "react";

export default function TenantPage(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = use(props.params);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Tenant: {tenant}</h1>
      <p>Bienvenido al sitio del tenant.</p>
    </div>
  );
}
