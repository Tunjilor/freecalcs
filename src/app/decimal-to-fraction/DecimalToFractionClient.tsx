"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { decimalToFractionDef } from "./definition";

export default function DecimalToFractionClient() {
  return <CalculatorShell def={decimalToFractionDef} />;
}
