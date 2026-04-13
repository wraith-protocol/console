export default function StatsCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="border border-outline-variant bg-surface-container p-5">
      <p className="text-sm text-outline">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-on-surface">{value}</p>
      {subtext && <p className="mt-1 text-xs text-outline">{subtext}</p>}
    </div>
  );
}
