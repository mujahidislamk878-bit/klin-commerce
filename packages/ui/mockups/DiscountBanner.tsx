import React from "react";

export interface DiscountBannerProps {
  code?: string;
  percentOff?: number;
  theme?: "dark" | "light";
}

export function DiscountBanner({
  code,
  percentOff = 30,
  theme = "dark",
}: DiscountBannerProps) {
  return (
    <div
      className={`py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4 m-8 rounded-3xl text-left ${
        theme === "dark" ? "bg-black text-white" : "bg-indigo-50 border border-indigo-100 text-indigo-900"
      }`}
    >
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider">Summer Season Event</h4>
        <p className="text-xs opacity-75 mt-0.5">
          Use discount promo code at checkout to claim your savings.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold font-mono">{percentOff}% OFF</span>
        <div
          className={`px-4 py-2 border rounded-xl font-mono text-xs font-bold uppercase ${
            theme === "dark"
              ? "border-white/20 bg-white/5 text-white"
              : "border-indigo-200 bg-white text-indigo-900"
          }`}
        >
          Code: {code}
        </div>
      </div>
    </div>
  );
}
export default DiscountBanner;
