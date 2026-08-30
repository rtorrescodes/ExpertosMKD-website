export default function TenantPage({ params }: { params: { tenant: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Tenant: {params.tenant}</h1>
      <p>Bienvenido al sitio del tenant.</p>
    </div>
  );
}
