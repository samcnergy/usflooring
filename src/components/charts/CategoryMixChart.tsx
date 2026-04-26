"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { CHART_PALETTE } from "./palette";

type Row = { month: string } & Record<string, number | string>;

export function CategoryMixChart({
  data,
  categories,
}: {
  data: Row[];
  categories: string[];
}) {
  const total = data.reduce((s, row) => {
    return s + categories.reduce((s2, c) => s2 + (Number(row[c]) || 0), 0);
  }, 0);
  if (total === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-marble-100 border border-marble-200 rounded">
        <p className="text-sm text-marble-700">No orders yet in this date range.</p>
      </div>
    );
  }
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#4A4A45" }} />
          <YAxis tick={{ fontSize: 11, fill: "#4A4A45" }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {categories.map((c, i) => (
            <Bar key={c} dataKey={c} stackId="a" fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
