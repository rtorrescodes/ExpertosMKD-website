export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: any;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        {title}
      </dt>
      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </dd>
      {description && (
        <dd className="mt-2 text-sm text-gray-500">
          {description}
        </dd>
      )}
    </div>
  );
}
