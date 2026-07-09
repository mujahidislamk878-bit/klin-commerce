"use client";

import { CountUp } from "../marketing/CountUp";
import type { CountUpProps } from "../../types";

// ── Counter re-exports CountUp as a standalone named export ──

export type CounterProps = CountUpProps;

const Counter = CountUp;

export { Counter };
export default Counter;
