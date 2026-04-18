export default function UsageMeter({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-on-surface-variant">{label}</span>
        <span className="font-mono text-xs text-outline">
          {current.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-1 bg-surface-bright">
        <div
          className={`h-full transition-all duration-150 ${isNearLimit ? 'bg-error' : 'bg-primary'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
