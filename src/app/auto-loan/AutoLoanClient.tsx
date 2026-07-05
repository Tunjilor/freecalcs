"use client";
// Client boundary: imports the definition (with its compute + insight functions)
// directly, avoiding serializing functions across the RSC boundary. See /va-loan.
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { autoLoanDef } from "./definition";

export default function AutoLoanClient() {
  return <CalculatorShell def={autoLoanDef} />;
}
