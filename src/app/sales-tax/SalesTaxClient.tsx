"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { salesTaxDef } from "./definition";

export default function SalesTaxClient() {
  return <CalculatorShell def={salesTaxDef} />;
}
