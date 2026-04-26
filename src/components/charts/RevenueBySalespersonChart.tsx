"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";

export function RevenueBySalespersonChart({
  data,
}: {
  data: { salesperson: string; revenue: number; orders: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-marble-100 border border-marble-200 rounded">
        <p className="text-sm text-marble-700">No orders yet in this date range.</p>
      </div>
    );
  }
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#4A4A45" }} tickFormatter={(v) => abbrevDollar(Number(v))} />
          <YAxis type="category" dataKey="salesperson" tick={{ fontSize: 12, fill: "#1A1A17" }} width={100} />
          <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" fill="#1B6B1F" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="revenue" position="right" formatter={(v) => `$${Number(v).toFixed(0)}`} style={{ fontSize: 11, fill: "#4A4A45" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function abbrevDollar(v: number) {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}
