"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days90Def } from "./definition";

export default function Days90Client() {
  return <CalculatorShell def={days90Def} />;
}
