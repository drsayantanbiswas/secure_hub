"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Count",
  },
  lowercase: {
    label: "Lowercase",
    color: "hsl(var(--chart-1))",
  },
  uppercase: {
    label: "Uppercase",
    color: "hsl(var(--chart-2))",
  },
  numbers: {
    label: "Numbers",
    color: "hsl(var(--chart-3))",
  },
  special: {
    label: "Special",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

type ChartData = {
    name: string;
    lowercase: number;
    uppercase: number;
    numbers: number;
    special: number;
}[]

export default function CharacterDistributionChart({ data }: { data: ChartData }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="lowercase" fill="var(--color-lowercase)" radius={4} />
        <Bar dataKey="uppercase" fill="var(--color-uppercase)" radius={4} />
        <Bar dataKey="numbers" fill="var(--color-numbers)" radius={4} />
        <Bar dataKey="special" fill="var(--color-special)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
