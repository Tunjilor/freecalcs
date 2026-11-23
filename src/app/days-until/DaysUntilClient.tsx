"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { daysUntilDef } from "./definition";

export default function DaysUntilClient() {
  return <CalculatorShell def={daysUntilDef} />;
}
