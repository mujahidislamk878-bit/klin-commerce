"use client";

import { forwardRef } from "react";
import { TrendingUp, ArrowUpRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

const RevenueCard = forwardRef<HTMLDivElement, { title?: string; value?: string; change?: string; trend?: "up" | "down"; className?: string }>(
  ({ title = "Total Revenue", value = "$45,231.89", change = "+20.1% from last month", trend = "up", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-2.5", className)}
        {...props}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F1020]/45">{title}</span>
          <div className={cn("p-1.5 rounded-lg text-xs font-bold flex items-center gap-1", trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600")}>
            <TrendingUp className="h-3.5 w-3.5" />
            {trend === "up" ? "+" : "-"}5%
          </div>
        </div>
        <div className="text-2xl font-bold text-[#0F1020]">{value}</div>
        <div className="text-xs text-[#0F1020]/50 font-semibold">{change}</div>
      </div>
    );
  }
);
RevenueCard.displayName = "RevenueCard";

const ActivityFeed = forwardRef<HTMLDivElement, { title?: string; activities?: { id: string | number; text: string; time: string }[]; className?: string }>(
  (
    {
      title = "Recent Activity",
      activities = [
        { id: 1, text: "Nupur completed payment configuration", time: "2 hours ago" },
        { id: 2, text: "Aka added a custom navigation layout", time: "5 hours ago" },
        { id: 3, text: "Server connection seeded successfully", time: "1 day ago" },
      ],
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-4", className)}
        {...props}
      >
        <h3 className="text-sm font-bold text-[#0F1020]">{title}</h3>
        <ul className="space-y-3">
          {activities.map((a) => (
            <li key={a.id} className="flex justify-between items-start gap-4 text-xs">
              <span className="font-semibold text-[#0F1020]/75 leading-relaxed">{a.text}</span>
              <span className="text-[#0F1020]/40 font-semibold shrink-0">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
ActivityFeed.displayName = "ActivityFeed";

const Timeline = forwardRef<HTMLDivElement, { title?: string; events?: { id: string | number; title: string; desc?: string; done?: boolean }[]; className?: string }>(
  (
    {
      title = "Milestone Tracker",
      events = [
        { id: 1, title: "Milestone 2A: Typography Completed", desc: "Added Text, Lists, Codes", done: true },
        { id: 2, title: "Milestone 2B: Navigation Completed", desc: "Added Header, Footers, Command palettes", done: true },
        { id: 3, title: "Milestone 2C: Builder Completed", desc: "Added Slot, Section overlay components", done: true },
        { id: 4, title: "Milestone 2D: Commerce Completed", desc: "Product listings, checkout panels", done: false },
      ],
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-4", className)}
        {...props}
      >
        <h3 className="text-sm font-bold text-[#0F1020]">{title}</h3>
        <div className="relative pl-6 space-y-5 border-l border-[#0F1020]/10 ml-2">
          {events.map((e) => (
            <div key={e.id} className="relative">
              <div className="absolute -left-[31px] top-0 bg-white rounded-full p-0.5 z-10">
                {e.done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-white" />
                ) : (
                  <Circle className="h-5 w-5 text-[#0F1020]/20 bg-white" />
                )}
              </div>
              <h4 className={cn("text-xs font-bold", e.done ? "text-[#0F1020]" : "text-[#0F1020]/45")}>{e.title}</h4>
              {e.desc && <p className="text-[10px] text-[#0F1020]/40 font-semibold mt-0.5">{e.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Timeline.displayName = "Timeline";

const CalendarWidget = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-4", className)}
        {...props}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-[#0F1020]">July 2026</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#0F1020]/40 uppercase mb-1">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div
              key={d}
              className={cn(
                "h-7 w-7 rounded-xl flex items-center justify-center text-xs font-semibold select-none transition cursor-pointer",
                d === 9
                  ? "bg-[#0F1020] text-white shadow-lg shadow-[#0F1020]/15"
                  : "hover:bg-[#0F1020]/5 text-[#0F1020]/80"
              )}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
CalendarWidget.displayName = "CalendarWidget";

const KanbanBoard = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const columns = [
      { title: "To Do", count: 2, items: ["Write docs", "Puck testing"] },
      { title: "In Progress", count: 1, items: ["Design system completion"] },
      { title: "Done", count: 3, items: ["Setup screen fix", "Logout workspace loading"] },
    ];
    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-3 gap-4 w-full overflow-x-auto", className)}
        {...props}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="bg-[#FAFBFC] border border-[#0F1020]/5 p-4 rounded-2xl flex flex-col gap-3 min-w-[200px]">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-[#0F1020]">{col.title}</span>
              <span className="text-[10px] bg-[#0F1020]/5 px-2 py-0.5 rounded-full font-bold text-[#0F1020]/40">{col.count}</span>
            </div>
            <div className="space-y-2 flex-1">
              {col.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-white p-3 rounded-xl border border-[#0F1020]/5 shadow-sm text-xs font-semibold text-[#0F1020]/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
KanbanBoard.displayName = "KanbanBoard";

const HeatmapGrid = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    // 7 rows x 15 columns grid values
    const grid = Array.from({ length: 7 * 15 }, () => Math.floor(Math.random() * 4));
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-4", className)}
        {...props}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-[#0F1020]">Activity Map</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-fit">
          {grid.map((val, idx) => (
            <div
              key={idx}
              className={cn(
                "h-3.5 w-3.5 rounded-md transition duration-300",
                val === 0 ? "bg-[#0F1020]/5" : val === 1 ? "bg-indigo-300" : val === 2 ? "bg-indigo-500" : "bg-[#0F1020]"
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);
HeatmapGrid.displayName = "HeatmapGrid";

const ProgressWidgets = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const goals = [
      { label: "Deployment Build", value: 85 },
      { label: "API Integrations", value: 60 },
      { label: "WCAG Compliance", value: 95 },
    ];
    return (
      <div
        ref={ref}
        className={cn("bg-white p-6 rounded-[28px] border border-[#0F1020]/5 shadow-sm space-y-4 w-full", className)}
        {...props}
      >
        <h3 className="text-sm font-bold text-[#0F1020]">Workspace Progress</h3>
        <div className="space-y-4">
          {goals.map((g) => (
            <div key={g.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#0F1020]">
                <span>{g.label}</span>
                <span>{g.value}%</span>
              </div>
              <div className="h-2 w-full bg-[#0F1020]/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F1020] rounded-full transition-all duration-500"
                  style={{ width: `${g.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ProgressWidgets.displayName = "ProgressWidgets";

export { RevenueCard, ActivityFeed, Timeline, CalendarWidget, KanbanBoard, HeatmapGrid, ProgressWidgets };
