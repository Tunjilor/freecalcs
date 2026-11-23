"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { closingCostsDef } from "./definition";

export default function ClosingCostsClient() {
  return <CalculatorShell def={closingCostsDef} />;
}
