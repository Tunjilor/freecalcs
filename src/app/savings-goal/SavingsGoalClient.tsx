"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { savingsGoalDef } from "./definition";

export default function SavingsGoalClient() {
  return <CalculatorShell def={savingsGoalDef} />;
}
