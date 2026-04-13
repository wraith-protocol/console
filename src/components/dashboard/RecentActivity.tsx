export interface ActivityItem {
  id: string;
  method: string;
  path: string;
  status: number;
  timestamp: string;
}

export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-outline-variant bg-surface-container p-5">
        <h3 className="mb-3 font-heading text-sm font-semibold text-on-surface">Recent Activity</h3>
        <p className="text-sm text-outline">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant bg-surface-container p-5">
      <h3 className="mb-3 font-heading text-sm font-semibold text-on-surface">Recent Activity</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-outline-variant py-2 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-outline">{item.method}</span>
              <span className="text-sm text-on-surface-variant">{item.path}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${item.status < 400 ? 'text-tertiary' : 'text-error'}`}>
                {item.status}
              </span>
              <span className="text-xs text-outline">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
