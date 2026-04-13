import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  requests: number;
}

export default function UsageChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="border border-outline-variant bg-surface-container p-5">
        <h3 className="mb-3 font-heading text-sm font-semibold text-on-surface">
          Requests Over Time
        </h3>
        <p className="text-sm text-outline">No data available</p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant bg-surface-container p-5">
      <h3 className="mb-3 font-heading text-sm font-semibold text-on-surface">
        Requests Over Time
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
          <XAxis dataKey="date" stroke="#767575" tick={{ fontSize: 12 }} />
          <YAxis stroke="#767575" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141414',
              border: '1px solid #444444',
              borderRadius: 0,
              color: '#c4c7c5',
              fontSize: 12,
            }}
          />
          <Line type="monotone" dataKey="requests" stroke="#c6c6c7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
