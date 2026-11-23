"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { breakEvenDef } from "./definition";

export default function BreakEvenClient() {
  return <CalculatorShell def={breakEvenDef} />;
}
