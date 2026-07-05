"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { taxRefundDef } from "./definition";

export default function TaxRefundClient() {
  return <CalculatorShell def={taxRefundDef} />;
}
