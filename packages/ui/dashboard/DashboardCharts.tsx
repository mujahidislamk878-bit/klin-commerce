"use client";

import { forwardRef } from "react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  AreaChart as ReAreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface ChartProps extends EditableProps {
  data?: { name: string; value: number; value2?: number }[];
  title?: string;
  colors?: string[];
}

const DEFAULT_DATA = [
  { name: "Jan", value: 400, value2: 240 },
  { name: "Feb", value: 300, value2: 139 },
  { name: "Mar", value: 600, value2: 980 },
  { name: "Apr", value: 800, value2: 390 },
  { name: "May", value: 500, value2: 480 },
  { name: "Jun", value: 700, value2: 380 },
];

const DEFAULT_PIE_DATA = [
  { name: "Direct", value: 400 },
  { name: "Social", value: 300 },
  { name: "Email", value: 300 },
];

const COLORS = ["#0F1020", "#3E4155", "#6B6E85", "#9A9DAF", "#C9CCD9"];

const LineChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data = DEFAULT_DATA, title, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm", className)} {...props}>
        {title && <h3 className="text-sm font-bold text-[#0F1020] mb-4">{title}</h3>}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F4" />
              <XAxis dataKey="name" stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0F1020", borderRadius: "12px", border: "none", color: "#F6F7FB", fontSize: "12px" }} />
              <Line type="monotone" dataKey="value" stroke="#0F1020" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              {data[0]?.value2 !== undefined && (
                <Line type="monotone" dataKey="value2" stroke="#6B6E85" strokeWidth={2.0} dot={false} />
              )}
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);
LineChart.displayName = "LineChart";

const AreaChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data = DEFAULT_DATA, title, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm", className)} {...props}>
        {title && <h3 className="text-sm font-bold text-[#0F1020] mb-4">{title}</h3>}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F1020" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0F1020" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F4" />
              <XAxis dataKey="name" stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0F1020", borderRadius: "12px", border: "none", color: "#F6F7FB", fontSize: "12px" }} />
              <Area type="monotone" dataKey="value" stroke="#0F1020" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);
AreaChart.displayName = "AreaChart";

const BarChart = forwardRef<HTMLDivElement, ChartProps>(
  ({ data = DEFAULT_DATA, title, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm", className)} {...props}>
        {title && <h3 className="text-sm font-bold text-[#0F1020] mb-4">{title}</h3>}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F4" />
              <XAxis dataKey="name" stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#0F1020" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0F1020", borderRadius: "12px", border: "none", color: "#F6F7FB", fontSize: "12px" }} />
              <Bar dataKey="value" fill="#0F1020" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);
BarChart.displayName = "BarChart";

const PieChart = forwardRef<HTMLDivElement, Omit<ChartProps, "data"> & { data?: { name: string; value: number }[] }>(
  ({ data = DEFAULT_PIE_DATA, title, colors = COLORS, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm", className)} {...props}>
        {title && <h3 className="text-sm font-bold text-[#0F1020] mb-4">{title}</h3>}
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0F1020", borderRadius: "12px", border: "none", color: "#F6F7FB", fontSize: "12px" }} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);
PieChart.displayName = "PieChart";

export { LineChart, AreaChart, BarChart, PieChart };
