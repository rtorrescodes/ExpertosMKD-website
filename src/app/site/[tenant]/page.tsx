export default function TenantPage(props: {
  const { tenant } = require("react").use(props.params); params: Promise<{ tenant: string }> }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Tenant: {tenant}</h1>
      <p>Bienvenido al sitio del tenant.</p>
    </div>
  );
}
