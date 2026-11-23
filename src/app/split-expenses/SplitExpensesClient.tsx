"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { splitExpensesDef } from "./definition";

export default function SplitExpensesClient() {
  return <CalculatorShell def={splitExpensesDef} />;
}
