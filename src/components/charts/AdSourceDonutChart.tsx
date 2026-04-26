"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CHART_PALETTE } from "./palette";

export function AdSourceDonutChart({
  data,
}: {
  data: { source: string; orders: number; revenue: number }[];
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
        <PieChart>
          <Pie
            data={data}
            dataKey="orders"
            nameKey="source"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            label={(p: { payload?: { source?: string } }) => p.payload?.source ?? ""}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const d = props.payload as { source: string; orders: number; revenue: number };
              return [`${d.orders} orders · $${d.revenue.toFixed(2)}`, d.source];
            }}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
