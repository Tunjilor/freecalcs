"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { debtConsolidationDef } from "./definition";

export default function DebtConsolidationClient() {
  return <CalculatorShell def={debtConsolidationDef} />;
}
