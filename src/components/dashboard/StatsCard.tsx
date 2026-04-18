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
      <p className="font-mono text-[11px] font-semibold tracking-[0.05em] text-outline uppercase">
        {label}
      </p>
      <p className="mt-2 font-heading text-[28px] font-bold text-on-surface">{value}</p>
      {subtext && <p className="mt-1 text-xs text-outline">{subtext}</p>}
    </div>
  );
}
