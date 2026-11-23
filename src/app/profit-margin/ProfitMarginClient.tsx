"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { profitMarginDef } from "./definition";

export default function ProfitMarginClient() {
  return <CalculatorShell def={profitMarginDef} />;
}
