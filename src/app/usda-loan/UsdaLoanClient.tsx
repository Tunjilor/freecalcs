"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { usdaLoanDef } from "./definition";

export default function UsdaLoanClient() {
  return <CalculatorShell def={usdaLoanDef} />;
}
