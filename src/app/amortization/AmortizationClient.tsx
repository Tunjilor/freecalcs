"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { amortizationDef } from "./definition";

export default function AmortizationClient() {
  return <CalculatorShell def={amortizationDef} />;
}
