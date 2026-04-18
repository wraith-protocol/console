export interface ActivityItem {
  id: string;
  method: string;
  path: string;
  status: number;
  timestamp: string;
}

function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'text-tertiary bg-tertiary/10';
    case 'DELETE':
      return 'text-error bg-error/10';
    case 'PUT':
    case 'PATCH':
      return 'text-blue bg-blue/10';
    default:
      return 'text-outline bg-surface-bright';
  }
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
      <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">Recent Activity</h3>
      <div className="space-y-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-outline-variant/30 py-3 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase ${getMethodColor(item.method)}`}
              >
                {item.method}
              </span>
              <span className="font-mono text-sm text-on-surface-variant">{item.path}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-xs ${item.status < 400 ? 'text-tertiary' : 'text-error'}`}
              >
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
