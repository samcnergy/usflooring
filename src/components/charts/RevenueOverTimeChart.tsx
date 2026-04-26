"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export function RevenueOverTimeChart({ data }: { data: { label: string; revenue: number }[] }) {
  if (data.length === 0) return <Empty />;
  const maxRev = Math.max(...data.map((d) => d.revenue));
  if (maxRev === 0) return <Empty />;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#4A4A45" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: "#4A4A45" }} tickFormatter={(v) => abbrevDollar(v)} />
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} contentStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="revenue" stroke="#1B6B1F" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Empty() {
  return (
    <div className="h-72 flex items-center justify-center bg-marble-100 border border-marble-200 rounded">
      <p className="text-sm text-marble-700">No orders yet in this date range.</p>
    </div>
  );
}

function abbrevDollar(v: number) {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}
