"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { incomeTaxDef } from "./definition";

export default function TaxClient() {
  return <CalculatorShell def={incomeTaxDef} />;
}
