"use client"

import * as React from "react"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

import {
  ChartConfig,
} from "@/components/ui/chart"

type ChartData = {
    name: string;
    value: number;
    fill: string;
}[]

export default function CharacterDistributionChart({ data }: { data: ChartData }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                <p>Chart will appear here.</p>
            </div>
        )
    }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip
            contentStyle={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
            }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
