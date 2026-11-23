"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { budgetDef } from "./definition";

export default function BudgetClient() {
  return <CalculatorShell def={budgetDef} />;
}
